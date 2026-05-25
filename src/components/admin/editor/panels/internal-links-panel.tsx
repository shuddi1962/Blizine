"use client"

import { useState, useEffect } from "react"
import { usePostEditor } from "../post-editor-provider"
import { CollapsibleSection } from "../collapsible-section"
import { Link2, ExternalLink, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SuggestedLink {
  id: string
  title: string
  slug: string
  relevance: number
}

export function InternalLinksPanel() {
  const { post } = usePostEditor()
  const [suggestions, setSuggestions] = useState<SuggestedLink[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!post.title && !post.content) return

    const fetchSuggestions = async () => {
      setLoading(true)
      const supabase = createClient()
      const keywords = [post.title, ...post.tags, post.focus_keyword]
        .filter(Boolean)
        .flatMap(k => (k || "").split(/\s+/).filter(w => w.length > 3))
        .slice(0, 5)

      if (keywords.length === 0) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("posts")
        .select("id, title, slug")
        .neq("id", post.id || "")
        .neq("status", "draft")
        .limit(10)

      if (data) {
        const scored = data.map((p) => {
          const titleWords = p.title.toLowerCase()
          const score = keywords.filter(k => titleWords.includes(k.toLowerCase())).length
          return { id: p.id, title: p.title, slug: p.slug, relevance: score }
        })
          .filter(s => s.relevance > 0)
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 5)
        setSuggestions(scored)
      }
      setLoading(false)
    }

    const timer = setTimeout(fetchSuggestions, 1000)
    return () => clearTimeout(timer)
  }, [post.title, post.tags, post.focus_keyword, post.id, post.content])

  return (
    <CollapsibleSection title="Internal Links" icon={<Link2 className="h-4 w-4" />} defaultOpen={false}>
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-[#6366F1]" />
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-2">
          {suggestions.map((link) => (
            <div key={link.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#0A0F1E] rounded-xl p-3 ring-1 ring-gray-200 dark:ring-[#1F2937]">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-[#F9FAFB] truncate">{link.title}</p>
                <p className="text-xs text-gray-400 dark:text-[#6B7280] font-mono">/{link.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-[#6B7280] bg-white dark:bg-[#1F2937] px-2 py-1 rounded-md">{link.relevance * 20}% match</span>
                <a
                  href={`/admin/posts/${link.id}/edit`}
                  target="_blank"
                  className="text-[#6366F1] hover:text-[#4F46E5] p-1.5 hover:bg-[#6366F1]/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center">
          <Link2 className="h-8 w-8 text-gray-300 dark:text-[#4B5563] mx-auto mb-2" />
          <p className="text-xs text-gray-400 dark:text-[#6B7280]">No related posts found.</p>
          <p className="text-[10px] text-gray-400 dark:text-[#6B7280] mt-1">Add more content to get suggestions</p>
        </div>
      )}
    </CollapsibleSection>
  )
}
