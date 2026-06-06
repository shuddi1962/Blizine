import { SITE_URL } from "@/lib/constants"

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /search
Disallow: /preview

User-agent: GPTBot
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /search
Disallow: /preview

User-agent: PerplexityBot
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /search
Disallow: /preview

User-agent: ClaudeBot
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /search
Disallow: /preview

User-agent: Google-Extended
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /search
Disallow: /preview

Sitemap: ${SITE_URL}/sitemap.xml`

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
