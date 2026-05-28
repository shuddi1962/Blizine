import { GoogleGenAI } from "@google/genai"

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" })

export interface BlizineArticle {
  headline: string
  content: string
  excerpt: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  tags: string[]
  quickBrief: string[]
  faq: Array<{ question: string; answer: string }>
  blizineScore: number
  isBreaking: boolean
  suggestedCategory: string
}

function buildBlizinePrompt(input: string, inputType: "topic" | "url" | "content", sourceName?: string): string {
  const sourceSection = inputType === "topic"
    ? `TOPIC TO RESEARCH AND WRITE ABOUT:\n${input}`
    : inputType === "url"
    ? `SOURCE URL TO RESEARCH:\n${input}\n\nUse Google Search to find everything about this story.`
    : `SOURCE CONTENT FROM ${sourceName || "a tech publication"}:\n${input.slice(0, 4000)}`

  return `You are a senior tech journalist writing for Blizine (www.blizine.com), a premium technology news blog.

${sourceSection}

INSTRUCTIONS:
1. Research this topic thoroughly using Google Search — find latest facts, quotes, context
2. Write a complete, factual, engaging tech article
3. Write a compelling NEW headline
4. Write exactly 6 paragraphs totalling 600-800 words
5. Use inverted pyramid: most important facts first
6. Include real names, dates, numbers, and quotes from your research
7. Explain WHY this story matters to tech readers
8. Include a "What This Means" analysis paragraph
9. End with a forward-looking "What's Next" paragraph
10. Format content as HTML: use <p> tags for paragraphs, <h3> for subheadings, <strong> for key terms
11. Do NOT mention Blizine in the article body
12. Do NOT write "In conclusion" or "To summarize"
13. Do NOT use phrases like "In today's fast-paced tech world"
14. Be specific — avoid vague generalisations

Suggest the best category from: Tech News, AI & Automation, Cybersecurity, Gadgets, Programming, Web Development, Tutorials, Digital Business, Networking & IT, Reviews

Return ONLY valid JSON — no markdown, no code blocks, no explanation:
{
  "headline": "Compelling headline here",
  "content": "<p>Para 1</p><h3>Subheading</h3><p>Para 2</p><p>Para 3</p><h3>What This Means</h3><p>Para 4</p><h3>What's Next</h3><p>Para 5</p>",
  "excerpt": "160 char max excerpt for SEO and post cards",
  "seoTitle": "60 char max SEO title",
  "seoDescription": "155 char max meta description with focus keyword",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "quickBrief": [
    "First key takeaway in max 20 words",
    "Second key takeaway in max 20 words",
    "Third key takeaway in max 20 words"
  ],
  "faq": [
    {"question": "Specific reader question?", "answer": "Direct factual answer."},
    {"question": "Another specific question?", "answer": "Direct factual answer."},
    {"question": "Third question?", "answer": "Direct factual answer."}
  ],
  "blizineScore": 85,
  "isBreaking": false,
  "suggestedCategory": "Tech News"
}`
}

function parseBlizineArticle(raw: string): BlizineArticle | null {
  if (!raw) return null
  const clean = raw
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```\s*$/im, "")
    .trim()
  try {
    const p = JSON.parse(clean)
    if (!p.headline || !p.content) return null
    if (p.content.length < 200) return null

    const lower = (p.content + p.headline).toLowerCase()
    const BAD = [
      "in today's fast-paced",
      "blizine brings you",
      "check back for updates",
      "this story is developing",
      "our team of journalists",
    ]
    if (BAD.some(b => lower.includes(b))) return null

    return {
      headline:        String(p.headline).trim().slice(0, 150),
      content:         String(p.content).trim(),
      excerpt:         String(p.excerpt || p.content.replace(/<[^>]+>/g, "")).slice(0, 160),
      seoTitle:        String(p.seoTitle || p.headline).slice(0, 60),
      seoDescription:  String(p.seoDescription || p.excerpt).slice(0, 155),
      seoKeywords:     Array.isArray(p.seoKeywords) ? p.seoKeywords.slice(0, 5).map(String) : [],
      tags:            Array.isArray(p.tags) ? p.tags.slice(0, 5).map(String) : [],
      quickBrief:      Array.isArray(p.quickBrief) ? p.quickBrief.slice(0, 3).map(String) : [],
      faq:             Array.isArray(p.faq)
                         ? p.faq.slice(0, 3).map((f: any) => ({
                             question: String(f?.question || "").trim(),
                             answer:   String(f?.answer   || "").trim(),
                           })).filter((f: any) => f.question && f.answer)
                         : [],
      blizineScore:    Math.min(100, Math.max(1, Number(p.blizineScore) || 75)),
      isBreaking:      Boolean(p.isBreaking),
      suggestedCategory: String(p.suggestedCategory || "Tech News"),
    }
  } catch {
    return null
  }
}

async function geminiGroundedBlizine(prompt: string): Promise<BlizineArticle | null> {
  if (!process.env.GEMINI_API_KEY) return null
  try {
    const res = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.55, maxOutputTokens: 2000, tools: [{ googleSearch: {} }] },
    })
    const raw = res.candidates?.[0]?.content?.parts?.[0]?.text || ""
    return parseBlizineArticle(raw)
  } catch (e) {
    console.warn("[Blizine AI] Gemini Grounded failed:", e)
    return null
  }
}

async function geminiFlashBlizine(prompt: string): Promise<BlizineArticle | null> {
  if (!process.env.GEMINI_API_KEY) return null
  try {
    const res = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.6, maxOutputTokens: 2000 },
    })
    const raw = res.candidates?.[0]?.content?.parts?.[0]?.text || ""
    return parseBlizineArticle(raw)
  } catch (e) {
    console.warn("[Blizine AI] Gemini Flash failed:", e)
    return null
  }
}

async function openrouterBlizine(prompt: string): Promise<BlizineArticle | null> {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) return null
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://www.blizine.com",
        "X-Title": "Blizine",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          { role: "system", content: "Output ONLY valid JSON. No markdown. No code blocks." },
          { role: "user",   content: prompt },
        ],
        temperature: 0.55,
        max_tokens: 2000,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content || ""
    return parseBlizineArticle(raw)
  } catch (e) {
    console.warn("[Blizine AI] OpenRouter failed:", e)
    return null
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export async function geminiRewriteContent(title: string, content: string): Promise<string> {
  const textContent = stripHtml(content)
  if (!textContent || textContent.length < 50) return content

  const rewritePrompt =
    "You are a senior tech journalist writing for Blizine (www.blizine.com), a premium technology news blog.\n\n" +
    "Rewrite the following tech article in an engaging, SEO-optimized style. " +
    "Use Google Search to research and verify facts, dates, names, and numbers — enrich the article with real data.\n\n" +
    "INSTRUCTIONS:\n" +
    "- Write a complete, self-contained article (minimum 600 words)\n" +
    "- Start with a compelling hook that grabs attention\n" +
    "- Use inverted pyramid: most important facts first\n" +
    "- Use H2/H3 subheadings to structure the piece\n" +
    "- Include specific details, dates, numbers, and quotes where possible\n" +
    "- Explain WHY this matters and include a forward-looking perspective\n" +
    "- Output ONLY valid HTML — no markdown, no code fences\n" +
    "- Use <p> for paragraphs, <h2>/<h3> for subheadings, <strong> for emphasis\n" +
    "- Do NOT mention Blizine in the article body\n" +
    "- Do NOT use phrases like 'In conclusion', 'To summarize', or 'In today's fast-paced world'\n\n" +
    "Article title: " + title + "\n\nOriginal content:\n" + textContent

  // Tier 1: Gemini Grounded
  if (process.env.GEMINI_API_KEY) {
    try {
      const res = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: rewritePrompt }] }],
        config: { temperature: 0.5, maxOutputTokens: 4096, tools: [{ googleSearch: {} }] },
      })
      const text = res.candidates?.[0]?.content?.parts?.[0]?.text || ""
      if (text.length > 300) {
        console.log(`[✓ Gemini Grounded Rewrite] ${title.slice(0, 40)}`)
        return text
      }
    } catch (e) {
      console.warn("[Blizine] Gemini Grounded rewrite failed:", e)
    }
    await new Promise(r => setTimeout(r, 600))
  }

  // Tier 2: Gemini Flash
  if (process.env.GEMINI_API_KEY) {
    try {
      const res = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: rewritePrompt }] }],
        config: { temperature: 0.55, maxOutputTokens: 4096 },
      })
      const text = res.candidates?.[0]?.content?.parts?.[0]?.text || ""
      if (text.length > 300) {
        console.log(`[✓ Gemini Flash Rewrite] ${title.slice(0, 40)}`)
        return text
      }
    } catch (e) {
      console.warn("[Blizine] Gemini Flash rewrite failed:", e)
    }
    await new Promise(r => setTimeout(r, 500))
  }

  // Tier 3: OpenRouter fallback
  const openRouterKey = process.env.OPENROUTER_API_KEY
  if (openRouterKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://www.blizine.com",
          "X-Title": "Blizine",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [
            { role: "system", content: "Output ONLY valid HTML. No markdown. No code blocks." },
            { role: "user", content: rewritePrompt },
          ],
          temperature: 0.55,
          max_tokens: 4096,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const text = data?.choices?.[0]?.message?.content?.trim() || ""
        if (text.length > 300) {
          console.log(`[✓ OpenRouter Rewrite] ${title.slice(0, 40)}`)
          return text
        }
      }
    } catch (e) {
      console.warn("[Blizine] OpenRouter rewrite failed:", e)
    }
  }

  console.warn(`[✗ Rewrite ALL FAILED] ${title.slice(0, 40)} — returning original`)
  return content
}

export async function manualWriteFromTopic(topic: string): Promise<BlizineArticle | null> {
  if (!topic || topic.length < 5) return null
  console.log(`[Blizine Manual] Writing from topic: ${topic.slice(0, 60)}`)

  const prompt = buildBlizinePrompt(topic, "topic")

  const r1 = await geminiGroundedBlizine(prompt)
  if (r1) { console.log(`[✓ Gemini+Search] ${r1.headline.slice(0, 55)}`); return r1 }

  await new Promise(r => setTimeout(r, 600))

  const r2 = await geminiFlashBlizine(prompt)
  if (r2) { console.log(`[✓ Gemini Flash] ${r2.headline.slice(0, 55)}`); return r2 }

  await new Promise(r => setTimeout(r, 500))

  const r3 = await openrouterBlizine(prompt)
  if (r3) { console.log(`[✓ OpenRouter] ${r3.headline.slice(0, 55)}`); return r3 }

  console.error(`[✗ ALL FAILED] Topic: ${topic.slice(0, 50)}`)
  return null
}

export async function manualWriteFromUrl(url: string): Promise<BlizineArticle | null> {
  if (!url || !url.startsWith("http")) return null
  console.log(`[Blizine Manual] Writing from URL: ${url.slice(0, 80)}`)

  let sourceContent = ""
  let sourceName = new URL(url).hostname.replace("www.", "")
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Blizine/1.0; +https://www.blizine.com/bot)" },
      signal: AbortSignal.timeout(10000),
    })
    const html = await res.text()
    for (const pattern of [
      /<article[\s>]([\s\S]*?)<\/article>/i,
      /<div[^>]+class=["'][^"']*(?:article-body|post-content|entry-content|story-body)[^"']*["'][^>]*>([\s\S]{400,}?)<\/div>/i,
      /<main[\s>]([\s\S]*?)<\/main>/i,
    ]) {
      const m = html.match(pattern)
      if (m?.[1]) {
        sourceContent = m[1]
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 4000)
        if (sourceContent.length > 200) break
      }
    }

    const siteNameMatch = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)
    if (siteNameMatch?.[1]) sourceName = siteNameMatch[1]
  } catch {
    console.warn(`[Blizine Manual] Could not pre-fetch ${url}, relying on Gemini grounding`)
  }

  const input = sourceContent.length > 200 ? sourceContent : url
  const inputType = sourceContent.length > 200 ? "content" : "url"

  const prompt = buildBlizinePrompt(input, inputType, sourceName)

  const r1 = await geminiGroundedBlizine(prompt)
  if (r1) { console.log(`[✓ Gemini+Search] ${r1.headline.slice(0, 55)}`); return r1 }

  await new Promise(r => setTimeout(r, 600))

  const r2 = await geminiFlashBlizine(prompt)
  if (r2) { console.log(`[✓ Gemini Flash] ${r2.headline.slice(0, 55)}`); return r2 }

  await new Promise(r => setTimeout(r, 500))

  const r3 = await openrouterBlizine(prompt)
  if (r3) { console.log(`[✓ OpenRouter] ${r3.headline.slice(0, 55)}`); return r3 }

  console.error(`[✗ ALL FAILED] URL: ${url.slice(0, 60)}`)
  return null
}
