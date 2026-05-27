"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { CategoryBadge } from "@/components/ui/CategoryBadge"

export function PopularWidget({ posts: initialPosts }: { posts: any[] }) {
  const [posts, setPosts] = useState(initialPosts)

  useEffect(() => {
    if (!initialPosts?.length) {
      fetch("/api/posts?limit=5&sort=popular")
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
        <span className="sidebar-card-title">Popular This Week</span>
      </div>
      <ul className="popular-list">
        {posts.slice(0, 5).map((post: any) => (
          <li key={post.id} className="popular-item">
            <Image
              src={post.featured_image || "/placeholder.jpg"}
              alt={post.title}
              width={64}
              height={48}
              className="popular-thumb"
            />
            <div className="popular-info">
              <Link href={`/${post.slug}`} className="popular-title">{post.title}</Link>
              <div className="popular-meta">
                <CategoryBadge name={post.categories?.name} color={post.categories?.color} size="xs" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
