"use client"

import Link from "next/link"

export function BreakingTicker({ posts }: { posts: { title: string; slug: string }[] }) {
  const items = posts.length ? posts.map(p => p.title) : ["Loading latest news..."]

  return (
    <div className="breaking-ticker">
      <span className="ticker-badge">BREAKING</span>
      <div className="ticker-track">
        <div className="ticker-scroll">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              <span className="ticker-sep">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
