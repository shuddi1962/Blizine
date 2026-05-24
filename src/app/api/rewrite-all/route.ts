import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function callOpenRouter(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(60000),
  })
  if (!response.ok) throw new Error("OpenRouter error: " + response.status)
  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || ""
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export async function GET() {
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY || ""
    if (!openRouterKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY not set" }, { status: 500 })
    }

    const { data: posts, error: fetchError } = await supabase
      .from("posts")
      .select("id, title, content, quick_brief")
      .or("quick_brief.eq.[],quick_brief.is.null")
      .limit(10)

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })
    if (!posts?.length) return NextResponse.json({ rewritten: 0, total: 0 })

    let rewritten = 0
    for (const post of posts) {
      try {
        const textContent = stripHtml(post.content || "")
        if (textContent.length < 50) { rewritten++; continue }

        let blizineScore: number | null = null
        let quickBrief: { text: string }[] = []

        // Full rewrite for short content
        if (textContent.length < 500) {
          const rewritePrompt =
            "Rewrite the following tech article in an engaging, SEO-optimized style for the blog Blizine. " +
            "Write a FULL, complete article - at least 500 words. Keep facts accurate. " +
            "Add a compelling intro, structured H2/H3 subheadings, and a conclusion. " +
            "The rewrite must be complete so readers don't need to visit the original source. " +
            "Output HTML only, no markdown. Article title: " + post.title + ". Original content: " + textContent

          const result = await callOpenRouter(rewritePrompt, openRouterKey)
          if (result && result.length > textContent.length) {
            await supabase.from("posts").update({ content: result }).eq("id", post.id)
          }
        }

        // Quick brief
        try {
          const briefPrompt =
            "Summarize the following article into exactly 3 bullet points that capture the key information. " +
            'Return a JSON array of objects with a "text" property for each bullet. No markdown, no backticks, just JSON. ' +
            'Example: [{"text": "First bullet"}, {"text": "Second bullet"}, {"text": "Third bullet"}] ' +
            "Article: " + post.title + ". " + textContent

          const briefResult = await callOpenRouter(briefPrompt, openRouterKey)
          if (briefResult) {
            const cleaned = briefResult.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()
            quickBrief = JSON.parse(cleaned)
            if (!Array.isArray(quickBrief)) quickBrief = []
          }
        } catch { /* skip */ }

        // Blizine score
        try {
          const scorePrompt =
            "Rate the following article's relevance to technology on a scale of 1 to 100. " +
            "Return ONLY a number. Article: " + post.title + ". " + textContent.slice(0, 1000)
          const scoreResult = await callOpenRouter(scorePrompt, openRouterKey)
          const parsed = parseInt(scoreResult.replace(/\D/g, ""), 10)
          if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) blizineScore = parsed
        } catch { /* skip */ }

        // Update post
        const updateData: Record<string, unknown> = { ai_rewritten: true }
        if (quickBrief.length > 0) updateData.quick_brief = quickBrief
        if (blizineScore !== null) updateData.blizine_score = blizineScore

        const { error: updateError } = await supabase.from("posts").update(updateData).eq("id", post.id)
        if (updateError) {
          console.error("Update error for", post.id, updateError.message)
        } else {
          rewritten++
        }
      } catch (e: any) {
        console.error("Failed for", post.id, e.message)
      }
    }

    return NextResponse.json({ rewritten, total: posts.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
