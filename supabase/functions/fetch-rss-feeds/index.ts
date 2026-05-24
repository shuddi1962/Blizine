import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const openRouterKey = Deno.env.get("OPENROUTER_API_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200) || `post-${Date.now()}`;
}

function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function extractExcerpt(html: string, maxLength = 300): string {
  const text = html.replace(/<[^>]*>/g, "").trim();
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

function extractFeaturedImage(item: any): string | null {
  if (item["media:content"]?.$?.url) return item["media:content"].$.url;
  if (item.enclosure?.url) return item.enclosure.url;
  if (item["media:thumbnail"]?.$?.url) return item["media:thumbnail"].$.url;
  return null;
}

async function rewriteWithOpenRouter(title: string, content: string): Promise<string> {
  const prompt = `Rewrite the following tech article in an engaging, SEO-optimized style for the blog Blizine. Keep facts accurate. Add a compelling intro, structured H2/H3 subheadings, and a conclusion. Output HTML only, no markdown. Article title: ${title}. Original content: ${content}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openRouterKey}`,
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || content;
}

Deno.serve(async (req) => {
  try {
    const { data: feeds, error: fetchError } = await supabase
      .from("rss_feeds")
      .select("id, category_id, feed_url, feed_name, auto_rewrite, is_active, last_fetched_at, posts_fetched")
      .eq("is_active", true);

    if (fetchError) {
      throw new Error(`Failed to fetch feeds: ${fetchError.message}`);
    }

    if (!feeds?.length) {
      return new Response(JSON.stringify({ message: "No active feeds" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get default admin profile for author_id
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    const defaultAuthorId = profiles?.[0]?.id;
    if (!defaultAuthorId) {
      throw new Error("No author profile found. Create an admin user first.");
    }

    const parser = new (await import("npm:rss-parser")).default();
    let totalNewPosts = 0;

    for (const feed of feeds) {
      try {
        const parsed = await parser.parseURL(feed.feed_url);
        if (!parsed.items?.length) continue;

        const feedItemUrls = parsed.items
          .map((item: any) => item.link || item.guid)
          .filter(Boolean) as string[];

        const { data: existingPosts } = await supabase
          .from("posts")
          .select("original_source_url")
          .in("original_source_url", feedItemUrls);

        const existingUrls = new Set(
          (existingPosts || []).map((p: any) => p.original_source_url)
        );

        const newItems = parsed.items.filter(
          (item: any) => !existingUrls.has(item.link || item.guid)
        );

        if (!newItems.length) {
          await supabase
            .from("rss_feeds")
            .update({ last_fetched_at: new Date().toISOString() })
            .eq("id", feed.id);
          continue;
        }

        for (const item of newItems) {
          const title = item.title || "Untitled";
          const content = item.content || item.contentSnippet || "";
          const featuredImage = extractFeaturedImage(item);
          let finalContent = content;

          if (feed.auto_rewrite && content.length > 50 && openRouterKey) {
            try {
              finalContent = await rewriteWithOpenRouter(title, content);
            } catch (err: any) {
              console.error(`[${feed.feed_name}] Rewrite failed: ${err.message}`);
            }
          }

          const slug = generateSlug(title);

          const post = {
            title,
            slug,
            content: finalContent,
            excerpt: extractExcerpt(finalContent),
            featured_image: featuredImage,
            category_id: feed.category_id,
            author_id: defaultAuthorId,
            status: "published",
            rss_source_url: feed.feed_url,
            original_source_url: item.link || item.guid || "",
            ai_rewritten: feed.auto_rewrite,
            reading_time: calculateReadingTime(finalContent),
            tags: item.categories?.slice(0, 5) || [],
            published_at: item.isoDate
              ? new Date(item.isoDate).toISOString()
              : new Date().toISOString(),
          };

          const { error: insertError } = await supabase
            .from("posts")
            .insert(post);

          if (insertError) {
            console.error(`[${feed.feed_name}] Insert failed: ${insertError.message}`);
            continue;
          }

          totalNewPosts++;

          await supabase
            .from("rss_feeds")
            .update({ posts_fetched: (feed.posts_fetched || 0) + 1 })
            .eq("id", feed.id);
        }

        await supabase
          .from("rss_feeds")
          .update({ last_fetched_at: new Date().toISOString(), last_error: null })
          .eq("id", feed.id);
      } catch (err: any) {
        await supabase
          .from("rss_feeds")
          .update({ last_error: err.message?.slice(0, 500), last_fetched_at: new Date().toISOString() })
          .eq("id", feed.id);
        console.error(`[${feed.feed_name}] Error: ${err.message}`);
      }
    }

    return new Response(
      JSON.stringify({ message: `Processed ${feeds.length} feeds, imported ${totalNewPosts} new posts` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error(`Fatal: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
