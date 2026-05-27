"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CategoryBadge } from "@/components/ui/CategoryBadge"

export function TrendingWidget({ posts: initialPosts }: { posts: any[] }) {
  const [posts, setPosts] = useState(initialPosts)

  useEffect(() => {
    if (!initialPosts?.length) {
      fetch("/api/posts?limit=5&sort=views")
        .then((r) => r.ok ? r.json() : [])
        .then((data) => {
          if (Array.isArray(data) && data.length) setPosts(data)
        })
        .catch(() => {})
    }
  }, [initialPosts])

  if (!posts?.length) return null
  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <span className="sidebar-card-icon">◈</span>
        <span className="sidebar-card-title">Trending Now</span>
      </div>
      <ul className="trending-list">
        {posts.map((post: any, i: number) => (
          <li key={post.id} className="trending-item">
            <span className={`trending-rank${i < 3 ? [" gold", " silver", " bronze"][i] : ""}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="trending-content">
              <Link href={`/${post.slug}`} className="trending-title">{post.title}</Link>
              <div className="trending-meta">
                <CategoryBadge name={post.categories?.name} color={post.categories?.color} size="xs" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
