"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search, RefreshCw, TrendingUp, TrendingDown, Clock, CheckCircle,
  Loader2, Sparkles, ExternalLink, X, Hash, DollarSign, BarChart3,
  Target, Filter, Globe, Layers, Zap, Eye
} from "lucide-react"
import Link from "next/link"

interface KeywordArticle {
  id: string
  keyword: string
  title: string | null
  slug: string | null
  status: string
  source: string
  search_volume: number
  trend_direction: string | null
  cpc: number
  competition: number
  competition_level: string
  impressions: number
  ranking_probability: number
  cluster: string | null
  category: { name: string; slug: string } | null
  created_at: string
  published_at: string | null
  views: number
}

function computeRankingProbability(kw: KeywordArticle): number {
  const volScore = Math.min((kw.search_volume || 0) / 5000, 1) * 35
  const compScore = (1 - (kw.competition || 0)) * 30
  const wordCount = kw.keyword.split(/\s+/).length
  const lenScore = wordCount >= 2 && wordCount <= 5 ? 20 : wordCount > 5 ? 15 : 10
  const clusterScore = kw.cluster ? 10 : 0
  const trendScore = kw.trend_direction === "up" ? 5 : kw.trend_direction === "stable" ? 2 : 0
  return Math.round(Math.min(volScore + compScore + lenScore + clusterScore + trendScore, 99))
}

function rankColor(prob: number): string {
  if (prob >= 70) return "text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400"
  if (prob >= 40) return "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400"
  return "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400"
}

function rankBarColor(prob: number): string {
  if (prob >= 70) return "bg-green-500"
  if (prob >= 40) return "bg-amber-500"
  return "bg-red-500"
}

function compColor(level: string): string {
  const map: Record<string, string> = {
    low: "text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400",
    medium: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400",
    high: "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400",
  }
  return map[level] || "text-muted-foreground bg-muted"
}

function sourceLabel(s: string): string {
  const labels: Record<string, string> = {
    google_trends: "Google Trends", google_autocomplete: "Autocomplete",
    gsc: "GSC", reddit: "Reddit", manual: "Manual",
  }
  return labels[s] || s
}

export default function AdminKeywordsPage() {
  const [articles, setArticles] = useState<KeywordArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [stats, setStats] = useState({ total: 0, draft: 0, published: 0, volume: 0 })

  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [researching, setResearching] = useState(false)
  const [researchResult, setResearchResult] = useState<{ success: boolean; headline?: string; url?: string; error?: string } | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [clusterFilter, setClusterFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [generationMsg, setGenerationMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)

  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const [allRes, draftRes, pubRes] = await Promise.all([
      supabase.from("keyword_articles")
        .select("*, category:categories(name, slug)")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("keyword_articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("keyword_articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    ])
    if (allRes.data) setArticles(allRes.data as unknown as KeywordArticle[])
    setStats({
      total: allRes.data?.length || 0,
      draft: draftRes.count || 0,
      published: pubRes.count || 0,
      volume: (allRes.data || []).reduce((s: number, a: any) => s + (a.search_volume || 0), 0),
    })
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const fetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.length < 2) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/google-autocomplete?q=${encodeURIComponent(query)}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.suggestions?.length) { setSuggestions(data.suggestions); setShowSuggestions(true) }
      } catch {}
    }, 300)
  }, [])

  const doResearch = async () => {
    const kw = searchInput.trim()
    if (!kw || kw.length < 3) return
    setResearching(true); setResearchResult(null)
    try {
      const res = await fetch("/api/admin/research-keyword", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw }),
      })
      const data = await res.json()
      setResearchResult(data)
      if (data.success) fetchData()
    } catch (err: any) {
      setResearchResult({ success: false, error: err.message })
    }
    setResearching(false)
  }

  const generateArticle = async (id: string) => {
    setGeneratingId(id); setGenerationMsg(null)
    try {
      const res = await fetch("/api/admin/keywords/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      setGenerationMsg({ id, text: data.success ? "Article published!" : data.error || "Failed", ok: data.success })
      if (data.success) fetchData()
    } catch (err: any) {
      setGenerationMsg({ id, text: err.message, ok: false })
    }
    setGeneratingId(null)
    setTimeout(() => setGenerationMsg(null), 5000)
  }

  const writeAllDrafts = async () => {
    setGeneratingAll(true)
    try {
      const res = await fetch("/api/admin/trigger-keyword-write")
      const data = await res.json()
      fetchData()
    } catch {}
    setGeneratingAll(false)
  }

  const clusters = Array.from(new Set(articles.map(a => a.cluster).filter(Boolean))) as string[]
  const sources = Array.from(new Set(articles.map(a => a.source).filter(Boolean))) as string[]

  const filtered = articles.filter(a => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false
    if (sourceFilter !== "all" && a.source !== sourceFilter) return false
    if (clusterFilter !== "all" && a.cluster !== clusterFilter) return false
    if (searchInput.trim()) {
      const q = searchInput.toLowerCase()
      const matches = (a.keyword?.toLowerCase().includes(q)) ||
        (a.title?.toLowerCase().includes(q)) ||
        (a.cluster?.toLowerCase().includes(q))
      if (!matches) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "volume") return (b.search_volume || 0) - (a.search_volume || 0)
    if (sortBy === "cpc") return (b.cpc || 0) - (a.cpc || 0)
    if (sortBy === "competition") return (b.competition || 0) - (a.competition || 0)
    if (sortBy === "ranking") return computeRankingProbability(b) - computeRankingProbability(a)
    if (sortBy === "impressions") return (b.impressions || 0) - (a.impressions || 0)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const avgCpc = articles.length > 0
    ? articles.reduce((s, a) => s + (a.cpc || 0), 0) / articles.length : 0
  const avgComp = articles.length > 0
    ? articles.reduce((s, a) => s + (a.competition || 0), 0) / articles.length : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Keyword Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            SEO/GEO/AEO keyword pipeline &mdash; {stats.draft} drafts awaiting generation
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={writeAllDrafts} disabled={generatingAll || stats.draft === 0} variant="outline">
            {generatingAll ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Writing...</>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" /> Write All Drafts ({stats.draft})</>
            )}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="relative" ref={searchRef}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text" value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); fetchSuggestions(e.target.value) }}
                  onKeyDown={(e) => { if (e.key === "Enter") { setShowSuggestions(false); doResearch() } }}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search keywords, add new keyword to research & write..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <Button onClick={doResearch} disabled={researching || searchInput.trim().length < 3}>
                {researching ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Researching...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Research & Write</>
                )}
              </Button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setSearchInput(s); setSuggestions([]); setShowSuggestions(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2 transition-colors">
                    <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {researching && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Gemini researching &quot;{searchInput.trim()}&quot; with Google Search Grounding...</span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Writing article, generating SEO metadata, answer capsule, key points, FAQ, sourcing images</p>
            </div>
          )}

          {researchResult && !researching && (
            <div className={`mt-4 p-4 rounded-lg border ${researchResult.success ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"}`}>
              {researchResult.success ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700 dark:text-green-300">Published: {researchResult.headline}</span>
                  </div>
                  {researchResult.url && (
                    <Link href={researchResult.url} target="_blank" className="flex items-center gap-1 text-sm text-primary hover:underline">
                      View <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <X className="h-5 w-5" />
                  <span className="text-sm">{researchResult.error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Hash className="h-8 w-8 text-blue-500 shrink-0" />
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-amber-500 shrink-0" />
            <div><p className="text-2xl font-bold">{stats.draft}</p><p className="text-xs text-muted-foreground">Drafts</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
            <div><p className="text-2xl font-bold">{stats.published}</p><p className="text-xs text-muted-foreground">Published</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-purple-500 shrink-0" />
            <div><p className="text-2xl font-bold">{stats.volume.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Vol.</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-emerald-500 shrink-0" />
            <div><p className="text-2xl font-bold">${avgCpc.toFixed(2)}</p><p className="text-xs text-muted-foreground">Avg CPC</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-rose-500 shrink-0" />
            <div><p className="text-2xl font-bold">{(avgComp * 100).toFixed(0)}%</p><p className="text-xs text-muted-foreground">Avg Competition</p></div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="all">All Sources</option>
              {sources.map(s => <option key={s} value={s}>{sourceLabel(s)}</option>)}
            </select>
            {clusters.length > 0 && (
              <select value={clusterFilter} onChange={(e) => setClusterFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="all">All Clusters</option>
                {clusters.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <div className="h-6 w-px bg-border" />
            <span className="text-xs text-muted-foreground">Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="created_at">Newest</option>
              <option value="volume">Search Volume</option>
              <option value="cpc">CPC</option>
              <option value="competition">Competition</option>
              <option value="ranking">Ranking Prob.</option>
              <option value="impressions">Impressions</option>
            </select>
            <span className="text-xs text-muted-foreground ml-auto">{sorted.length} of {articles.length}</span>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : sorted.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No keywords found</p>
            <p className="text-sm mt-1">Search a topic above to research, or wait for the daily keyword fetch at 03:45 UTC</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sorted.map((a) => {
            const rankProb = a.ranking_probability || computeRankingProbability(a)
            return (
              <Card key={a.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate max-w-md">{a.title || a.keyword}</p>
                        {a.status === "published" ? (
                          <Badge variant="default" className="bg-green-500 shrink-0">Published</Badge>
                        ) : (
                          <Badge variant="secondary" className="shrink-0">Draft</Badge>
                        )}
                        {a.cluster && (
                          <Badge variant="outline" className="text-xs shrink-0 flex items-center gap-1">
                            <Layers className="h-3 w-3" /> {a.cluster}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        <Badge variant="outline" className="text-xs">{sourceLabel(a.source)}</Badge>
                        {a.category && <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {a.category.name}</span>}

                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <TrendingUp className="h-3 w-3 text-purple-500" />
                          {a.search_volume > 0 ? a.search_volume.toLocaleString() : "—"}
                          {a.trend_direction === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                          {a.trend_direction === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                        </span>

                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-emerald-500" />
                          {a.cpc > 0 ? `$${a.cpc.toFixed(2)}` : "—"}
                        </span>

                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${compColor(a.competition_level || (a.competition > 0.7 ? "high" : a.competition > 0.3 ? "medium" : "low"))}`}>
                          Comp: {a.competition > 0 ? (a.competition * 100).toFixed(0) : "—"}%
                        </span>

                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-blue-500" />
                          {a.impressions > 0 ? a.impressions.toLocaleString() : "—"}
                        </span>

                        <span>{new Date(a.created_at).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${rankColor(rankProb)}`}>
                            Rank: {rankProb}%
                          </span>
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${rankBarColor(rankProb)}`} style={{ width: `${rankProb}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 mt-1">
                      {a.status === "draft" && (
                        <>
                          <Button size="sm" onClick={() => generateArticle(a.id)} disabled={generatingId === a.id}
                            variant="default" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white">
                            {generatingId === a.id ? (
                              <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Writing</>
                            ) : (
                              <><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Generate</>
                            )}
                          </Button>
                          {generationMsg && generationMsg.id === a.id && (
                            <span className={`text-xs ${generationMsg.ok ? "text-green-500" : "text-red-500"}`}>
                              {generationMsg.text}
                            </span>
                          )}
                        </>
                      )}
                      {a.slug && (
                        <a href={`/${a.slug}`} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> View
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
