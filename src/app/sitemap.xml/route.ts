import { createClient } from "@/lib/supabase/server"
import { SITE_URL } from "@/lib/constants"

export async function GET() {
  const supabase = createClient()

  const [postsRes, catsRes, profilesRes, seriesRes, kwArticlesRes] = await Promise.all([
    supabase.from("posts").select("slug, updated_at").eq("status", "published").order("updated_at", { ascending: false }),
    supabase.from("categories").select("slug"),
    supabase.from("profiles").select("username"),
    supabase.from("series").select("slug"),
    supabase.from("keyword_articles").select("slug, updated_at").eq("status", "published").order("published_at", { ascending: false }),
  ])

  const posts = postsRes.data || []
  const categories = catsRes.data || []
  const profiles = profilesRes.data || []
  const series = seriesRes.data || []
  const kwArticles = kwArticlesRes.data || []

  const staticPages = [
    { path: "", priority: "1.0", freq: "hourly" },
    { path: "/about", priority: "0.5", freq: "monthly" },
    { path: "/contact", priority: "0.3", freq: "monthly" },
    { path: "/privacy-policy", priority: "0.3", freq: "monthly" },
    { path: "/terms-of-use", priority: "0.3", freq: "monthly" },
    { path: "/cookies-policy", priority: "0.3", freq: "monthly" },
    { path: "/disclaimer", priority: "0.3", freq: "monthly" },
    { path: "/advertise", priority: "0.4", freq: "monthly" },
    { path: "/write-for-us", priority: "0.5", freq: "monthly" },
    { path: "/newsletter", priority: "0.4", freq: "weekly" },
    { path: "/subscribe", priority: "0.4", freq: "weekly" },
  ]

  const postSlugs = new Set(posts.map(p => p.slug))

  const urls: string[] = []
  for (const p of staticPages) {
    urls.push(`<url><loc>${SITE_URL}${p.path}</loc><changefreq>${p.freq}</changefreq><priority>${p.priority}</priority></url>`)
  }
  for (const post of posts) {
    urls.push(`<url><loc>${SITE_URL}/${post.slug}</loc><lastmod>${post.updated_at}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
  }
  for (const cat of categories) {
    urls.push(`<url><loc>${SITE_URL}/category/${cat.slug}</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`)
  }
  for (const kw of kwArticles) {
    if (postSlugs.has(kw.slug)) continue
    urls.push(`<url><loc>${SITE_URL}/${kw.slug}</loc><lastmod>${kw.updated_at}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
  }
  for (const profile of profiles) {
    urls.push(`<url><loc>${SITE_URL}/author/${profile.username}</loc><changefreq>weekly</changefreq><priority>0.4</priority></url>`)
  }
  for (const s of series) {
    urls.push(`<url><loc>${SITE_URL}/series/${s.slug}</loc><changefreq>daily</changefreq><priority>0.6</priority></url>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
