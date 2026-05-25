"use client"

import { useState, useMemo } from "react"
import { usePostEditor } from "../post-editor-provider"
import { CollapsibleSection } from "../collapsible-section"
import { calculateSeoScore, generateSerpPreview } from "@/lib/seo-utils"
import { Search, CheckCircle2, XCircle, Globe, MessageCircle, Image } from "lucide-react"

const schemaTypes = [
  "Article", "NewsArticle", "BlogPosting", "TechArticle",
  "HowTo", "FAQPage", "Recipe", "Review", "Product",
]

const tabs = [
  { id: "general", label: "General" },
  { id: "social", label: "Social" },
  { id: "schema", label: "Schema" },
  { id: "advanced", label: "Advanced" },
]

export function SeoPanel() {
  const { post, updatePost, seoKeyword, setSeoKeyword } = usePostEditor()
  const [activeTab, setActiveTab] = useState("general")

  const { score, items } = useMemo(() => calculateSeoScore(seoKeyword, post), [seoKeyword, post])
  const serpPreview = useMemo(() => generateSerpPreview(post), [post])

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-600 dark:text-green-400"
    if (s >= 50) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBg = (s: number) => {
    if (s >= 80) return "bg-green-500"
    if (s >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <CollapsibleSection
      title={`SEO${seoKeyword ? ` (${score})` : ""}`}
      icon={<Search className="h-4 w-4" />}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-[#9CA3AF] mb-1">Focus Keyword</label>
          <div className="relative">
            <input
              value={seoKeyword}
              onChange={(e) => setSeoKeyword(e.target.value)}
              placeholder="Enter focus keyword..."
              className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent pr-14"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-[10px] text-gray-400 dark:text-[#6B7280] font-medium">/100</span>
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-100 dark:bg-[#1F2937] rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getScoreBg(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="bg-gray-50 dark:bg-[#0A0F1E] rounded-xl p-4 space-y-2 ring-1 ring-gray-200 dark:ring-[#1F2937]">
          <label className="block text-xs font-medium text-gray-500 dark:text-[#9CA3AF]">Google SERP Preview</label>
          <div className="bg-white rounded-lg p-3 shadow-sm ring-1 ring-gray-100">
            <p className="text-[#1A0DAB] text-sm font-medium leading-5 truncate hover:underline cursor-pointer">
              {serpPreview.title}
            </p>
            <p className="text-[#006621] text-xs leading-4 truncate">{serpPreview.url}</p>
            <p className="text-[#545454] text-xs leading-4 mt-0.5 line-clamp-2">{serpPreview.description}</p>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-[#1F2937] gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-[#6366F1] border-[#6366F1]"
                  : "text-gray-400 dark:text-[#6B7280] border-transparent hover:text-gray-600 dark:hover:text-[#9CA3AF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "general" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-[#9CA3AF]">SEO Title</label>
                <span className="text-[10px] font-medium text-gray-400 dark:text-[#6B7280]">{(post.seo_title || post.title || "").length} / 60</span>
              </div>
              <input
                value={post.seo_title || ""}
                onChange={(e) => updatePost({ seo_title: e.target.value })}
                placeholder={post.title || "SEO title..."}
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
              <div className="w-full bg-gray-100 dark:bg-[#1F2937] rounded-full h-1 mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    (post.seo_title || post.title).length > 60 ? "bg-red-500" :
                    (post.seo_title || post.title).length >= 40 ? "bg-green-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.min(100, ((post.seo_title || post.title).length / 60) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-[#9CA3AF]">Meta Description</label>
                <span className="text-[10px] font-medium text-gray-400 dark:text-[#6B7280]">{(post.seo_description || post.excerpt || "").length} / 160</span>
              </div>
              <textarea
                value={post.seo_description || ""}
                onChange={(e) => updatePost({ seo_description: e.target.value })}
                placeholder={post.excerpt || "Meta description..."}
                rows={3}
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
              />
              <div className="w-full bg-gray-100 dark:bg-[#1F2937] rounded-full h-1 mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    (post.seo_description || post.excerpt).length > 160 ? "bg-red-500" :
                    (post.seo_description || post.excerpt).length >= 120 ? "bg-green-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.min(100, ((post.seo_description || post.excerpt).length / 160) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-[#9CA3AF] mb-1.5">Secondary Keywords</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {post.secondary_keywords.map((kw, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-[#1F2937] text-gray-700 dark:text-[#E5E7EB] text-xs font-medium rounded-lg px-2.5 py-1 border border-gray-200 dark:border-transparent">
                    {kw}
                    <button onClick={() => updatePost({ secondary_keywords: post.secondary_keywords.filter((_, j) => j !== i) })} className="text-gray-400 hover:text-red-500 transition-colors ml-0.5">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                placeholder="Type keyword and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value.trim()
                    if (value && !post.secondary_keywords.includes(value)) {
                      updatePost({ secondary_keywords: [...post.secondary_keywords, value] })
                    }
                    (e.target as HTMLInputElement).value = ""
                  }
                }}
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>

            <div className="border-t border-gray-100 dark:border-[#1F2937] pt-4">
              <label className="block text-xs font-semibold text-gray-500 dark:text-[#9CA3AF] mb-3 uppercase tracking-wider">
                SEO Checklist ({items.filter(i => i.check(post)).length}/{items.length})
              </label>
              <div className="space-y-2">
                {items.map((item) => {
                  const passed = item.check(post)
                  return (
                    <div key={item.id} className="flex items-start gap-2.5">
                      {passed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300 dark:text-[#4B5563] mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${passed ? "text-green-700 dark:text-green-400" : "text-gray-500 dark:text-[#9CA3AF]"}`}>
                          {item.label}
                        </p>
                      </div>
                      <span className={`text-[10px] font-semibold shrink-0 px-1.5 py-0.5 rounded ${
                        passed 
                          ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-50 text-gray-400 dark:bg-[#1a2235] dark:text-[#6B7280]"
                      }`}>
                        {item.weight}pts
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-[#1877F2]" />
                <span className="text-xs font-semibold text-gray-700 dark:text-[#F9FAFB]">Facebook (OG)</span>
              </div>
              <input
                value={post.og_title || ""}
                onChange={(e) => updatePost({ og_title: e.target.value })}
                placeholder="OG Title"
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent mb-2"
              />
              <textarea
                value={post.og_description || ""}
                onChange={(e) => updatePost({ og_description: e.target.value })}
                placeholder="OG Description"
                rows={2}
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent mb-2 resize-none"
              />
              <div className="bg-gray-50 dark:bg-[#1a1f2e] rounded-xl p-3 flex items-center gap-3 ring-1 ring-gray-200 dark:ring-[#1F2937]">
                {post.og_image || post.featured_image ? (
                  <img src={post.og_image || post.featured_image} alt="" className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-200" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-[#1F2937] flex items-center justify-center ring-1 ring-gray-300 dark:ring-[#374151]">
                    <Image className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-[#F9FAFB] truncate">{post.og_title || post.seo_title || post.title}</p>
                  <p className="text-xs text-gray-500 dark:text-[#6B7280] truncate">{process.env.NEXT_PUBLIC_SITE_URL || "blizine.com"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-[#1F2937] pt-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-4 w-4 text-[#1DA1F2]" />
                <span className="text-xs font-semibold text-gray-700 dark:text-[#F9FAFB]">Twitter (X)</span>
              </div>
              <input
                value={post.twitter_title || ""}
                onChange={(e) => updatePost({ twitter_title: e.target.value })}
                placeholder="Twitter Title"
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent mb-2"
              />
              <textarea
                value={post.twitter_description || ""}
                onChange={(e) => updatePost({ twitter_description: e.target.value })}
                placeholder="Twitter Description"
                rows={2}
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === "schema" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-[#9CA3AF] mb-1.5">Schema Type</label>
              <select
                value={post.schema_type}
                onChange={(e) => updatePost({ schema_type: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                {schemaTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {post.schema_type && (
              <div className="bg-gray-50 dark:bg-[#0A0F1E] rounded-xl p-3 ring-1 ring-gray-200 dark:ring-[#1F2937]">
                <p className="text-[10px] text-gray-500 dark:text-[#6B7280] font-mono leading-relaxed whitespace-pre">
{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${post.schema_type}",
  "headline": "${post.title}",
  ...
}
</script>`}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-[#9CA3AF] mb-1.5">Canonical URL</label>
              <input
                value={post.canonical_url || ""}
                onChange={(e) => updatePost({ canonical_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-[#9CA3AF] mb-1.5">Breadcrumb Title</label>
              <input
                value={post.breadcrumb_title || ""}
                onChange={(e) => updatePost({ breadcrumb_title: e.target.value })}
                placeholder={post.title || "Breadcrumb title..."}
                className="w-full bg-gray-50 dark:bg-[#0A0F1E] border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>

            <div className="space-y-3 py-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={post.robots_noindex}
                  onChange={(e) => updatePost({ robots_noindex: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-[#374151] text-[#6366F1] focus:ring-[#6366F1] bg-gray-50 dark:bg-[#0A0F1E]"
                />
                <span className="text-xs font-medium text-gray-600 dark:text-[#9CA3AF] group-hover:text-gray-900 dark:group-hover:text-[#F9FAFB] transition-colors">No Index (robots noindex)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={post.robots_nofollow}
                  onChange={(e) => updatePost({ robots_nofollow: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-[#374151] text-[#6366F1] focus:ring-[#6366F1] bg-gray-50 dark:bg-[#0A0F1E]"
                />
                <span className="text-xs font-medium text-gray-600 dark:text-[#9CA3AF] group-hover:text-gray-900 dark:group-hover:text-[#F9FAFB] transition-colors">No Follow (robots nofollow)</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  )
}
