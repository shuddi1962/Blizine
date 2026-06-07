import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

const TRENDS_URLS = [
  "https://trends.google.com/trending/rss?geo=US",
  "https://trends.google.com/trending/rss?geo=US&category=tech",
  "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US",
]

function parseTrendsRSS(xml: string): Array<{ keyword: string; traffic: string }> {
  const items: Array<{ keyword: string; traffic: string }> = []
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)

  for (const match of itemMatches) {
    const xml = match[1]
    const get = (tag: string) =>
      xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>`, "i"))?.[1]?.trim()
      || xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, "i"))?.[1]?.trim()
      || ""

    const title = get("title")
    const traffic = get("ht:approx_traffic") || "0"

    if (title) {
      items.push({ keyword: title, traffic })
    }
  }

  return items
}

function parseAutocompleteJSON(json: any[]): string[] {
  if (!Array.isArray(json)) return []
  const suggestions = json[1]
  if (!Array.isArray(suggestions)) return []
  return suggestions.map((s: any) => typeof s === "string" ? s : s[0] || "").filter(Boolean)
}

async function fetchGoogleAutocomplete(query: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return []
    const json = await res.json()
    return parseAutocompleteJSON(json)
  } catch {
    return []
  }
}

const AUTOCOMPLETE_SEEDS = [
  "how to", "what is", "best", "why is", "vs", "review",
  "AI", "technology", "cybersecurity", "programming",
  "web development", "gadgets", "tutorial",
]

function extractTrafficNumber(traffic: string): number {
  const cleaned = traffic.replace(/[+\s,]/g, "")
  const num = parseInt(cleaned, 10)
  return isNaN(num) ? 0 : num
}

function isTechRelated(keyword: string): boolean {
  const techTerms = [
    "ai", "artificial intelligence", "machine learning", "chatgpt", "openai",
    "gemini", "claude", "copilot", "llm", "gpt", "deep learning",
    "cyber", "hack", "vulnerability", "malware", "ransomware", "breach",
    "python", "javascript", "typescript", "react", "node", "rust",
    "programming", "coding", "developer", "software",
    "web", "app", "mobile", "iphone", "android", "mac", "windows",
    "cloud", "aws", "azure", "google cloud", "kubernetes", "docker",
    "crypto", "blockchain", "nft", "bitcoin", "ethereum",
    "gadget", "smartphone", "laptop", "tablet", "wearable",
    "tutorial", "how to", "guide", "learn", "beginner",
    "security", "privacy", "vpn", "encryption",
    "data", "database", "sql", "nosql",
    "startup", "tech", "digital", "saas", "api",
    "linux", "git", "github", "devops", "ci/cd",
    "review", "best", "vs", "comparison", "top",
    "electric vehicle", "ev", "tesla", "spacex", "robot",
  ]
  const lower = keyword.toLowerCase()
  return techTerms.some(term => lower.includes(term))
}

serve(async () => {
  try {
    const keywords: Array<{ keyword: string; source: string; search_volume: number }> = []
    const seen = new Set<string>()

    for (const url of TRENDS_URLS) {
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Blizine/1.0; +https://www.blizine.com/bot)",
          },
          signal: AbortSignal.timeout(10000),
        })
        if (!res.ok) continue
        const xml = await res.text()
        const trends = parseTrendsRSS(xml)

        for (const t of trends) {
          const lower = t.keyword.toLowerCase()
          if (!seen.has(lower) && isTechRelated(t.keyword)) {
            seen.add(lower)
            keywords.push({
              keyword: t.keyword,
              source: "google_trends",
              search_volume: extractTrafficNumber(t.traffic),
            })
          }
        }
      } catch {
        continue
      }
    }

    for (const seed of AUTOCOMPLETE_SEEDS) {
      try {
        const suggestions = await fetchGoogleAutocomplete(seed)
        for (const s of suggestions) {
          const lower = s.toLowerCase()
          if (!seen.has(lower) && isTechRelated(s)) {
            seen.add(lower)
            keywords.push({
              keyword: s,
              source: "google_autocomplete",
              search_volume: 0,
            })
          }
        }
      } catch {
        continue
      }
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)

    const authorId = profiles?.[0]?.id
    if (!authorId) {
      return new Response(
        JSON.stringify({ error: "No author profile found" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    function autoCluster(keyword: string): string | null {
      const t = keyword.toLowerCase()
      const clusters: Array<{ words: string[]; name: string }> = [
        { words: ["ai", "artificial intelligence", "machine learning", "chatgpt", "openai", "gemini", "claude", "copilot", "llm", "gpt", "deep learning", "neural"], name: "AI & ML" },
        { words: ["hack", "cyber", "vulnerability", "malware", "ransomware", "breach", "phishing", "zero-day", "security", "privacy", "vpn", "encryption", "firewall"], name: "Cybersecurity" },
        { words: ["python", "javascript", "typescript", "react", "node", "rust", "programming", "coding", "developer", "software", "git", "github", "api"], name: "Programming" },
        { words: ["web", "css", "html", "frontend", "backend", "next.js", "tailwind", "react", "vue", "angular", "design", "responsive", "ux", "ui"], name: "Web Development" },
        { words: ["iphone", "android", "smartphone", "mac", "laptop", "tablet", "wearable", "gadget", "airpods", "smartwatch", "phone", "device"], name: "Gadgets & Devices" },
        { words: ["cloud", "aws", "azure", "google cloud", "kubernetes", "docker", "devops", "server", "infrastructure", "deploy"], name: "Cloud & DevOps" },
        { words: ["crypto", "blockchain", "bitcoin", "ethereum", "nft", "web3", "defi"], name: "Crypto & Web3" },
        { words: ["tutorial", "how to", "guide", "learn", "beginner", "step by step", "getting started"], name: "Tutorials" },
        { words: ["review", "best", "vs", "comparison", "top", "rated", "buying guide"], name: "Reviews & Comparisons" },
        { words: ["startup", "funding", "saas", "venture", "series a", "ipo", "valuation", "revenue"], name: "Startups & Business" },
        { words: ["data", "database", "sql", "analytics", "big data", "data science"], name: "Data & Analytics" },
      ]
      for (const c of clusters) {
        if (c.words.some(w => t.includes(w))) return c.name
      }
      return null
    }

    function estimateCPC(cluster: string | null, searchVolume: number): number {
      const cpcByCluster: Record<string, [number, number]> = {
        "Cybersecurity": [3.50, 8.00],
        "AI & ML": [2.50, 6.00],
        "Cloud & DevOps": [3.00, 7.00],
        "Programming": [2.00, 5.00],
        "Startups & Business": [4.00, 9.00],
        "Data & Analytics": [2.50, 5.50],
        "Reviews & Comparisons": [1.50, 4.00],
        "Web Development": [2.00, 4.50],
        "Gadgets & Devices": [1.50, 3.50],
        "Crypto & Web3": [3.00, 7.00],
        "Tutorials": [1.00, 3.00],
      }
      if (cluster && cpcByCluster[cluster]) {
        const [min, max] = cpcByCluster[cluster]
        const volFactor = Math.min(searchVolume / 10000, 1)
        return parseFloat((min + (max - min) * volFactor).toFixed(2))
      }
      return parseFloat((1.00 + Math.random() * 2.00).toFixed(2))
    }

    function estimateCompetition(searchVolume: number): { competition: number; level: string } {
      if (searchVolume > 10000) return { competition: 0.85, level: "high" }
      if (searchVolume > 5000) return { competition: 0.70, level: "high" }
      if (searchVolume > 1000) return { competition: 0.50, level: "medium" }
      if (searchVolume > 100) return { competition: 0.30, level: "low" }
      return { competition: 0.15, level: "low" }
    }

    function estimateImpressions(searchVolume: number): number {
      return Math.round(searchVolume * (50 + Math.random() * 100))
    }

    function computeRankingProb(searchVolume: number, competition: number, hasCluster: boolean): number {
      const volScore = Math.min(searchVolume / 5000, 1) * 35
      const compScore = (1 - competition) * 30
      const wordCount = 0
      const lenScore = 15
      const clusterScore = hasCluster ? 10 : 0
      return Math.round(Math.min(volScore + compScore + lenScore + clusterScore, 99))
    }

    let inserted = 0
    let skipped = 0

    for (const kw of keywords) {
      const today = new Date().toISOString().slice(0, 10)

      const { data: existing } = await supabase
        .from("keyword_articles")
        .select("id")
        .eq("keyword", kw.keyword)
        .gte("created_at", today)
        .limit(1)

      if (existing && existing.length > 0) {
        skipped++
        continue
      }

      const cluster = autoCluster(kw.keyword)
      const cpc = estimateCPC(cluster, kw.search_volume)
      const { competition, level } = estimateCompetition(kw.search_volume)
      const impressions = estimateImpressions(kw.search_volume)
      const rankProb = computeRankingProb(kw.search_volume, competition, !!cluster)

      const { error } = await supabase
        .from("keyword_articles")
        .insert({
          keyword: kw.keyword,
          source: kw.source,
          search_volume: kw.search_volume,
          author_id: authorId,
          status: "draft",
          cpc,
          competition,
          competition_level: level,
          impressions,
          ranking_probability: rankProb,
          cluster,
        })

      if (!error) inserted++
    }

    return new Response(
      JSON.stringify({
        keywords_found: keywords.length,
        inserted,
        skipped,
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
