"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import type { Post, Category, Profile, Subcategory } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

type PostWithRelations = Post & { category?: Category; author?: Profile; subcategory?: Subcategory }

interface HomeHeroProps {
  posts: PostWithRelations[]
  categories: Category[]
  subcategories: Subcategory[]
}

interface Slide {
  label: string
  main: PostWithRelations
  side: PostWithRelations[]
}

function buildSlides(posts: PostWithRelations[], categories: Category[], subcategories: Subcategory[]): Slide[] {
  const catMap = new Map(categories.map((c) => [c.id, c]))
  const subMap = new Map(subcategories.map((s) => [s.id, s]))

  const grouped = new Map<string, PostWithRelations[]>()
  for (const post of posts) {
    const catId = post.category_id || "uncategorized"
    if (!grouped.has(catId)) grouped.set(catId, [])
    grouped.get(catId)!.push(post)
  }

  const slides: Slide[] = []

  for (const [catId, catPosts] of Array.from(grouped)) {
    const cat = catMap.get(catId)
    const label = cat?.name || "Uncategorized"

    if (catPosts.length >= 2) {
      const subGrouped = new Map<string, PostWithRelations[]>()
      for (const p of catPosts) {
        const subId = p.subcategory_id || "none"
        if (!subGrouped.has(subId)) subGrouped.set(subId, [])
        subGrouped.get(subId)!.push(p)
      }

      const subSlides = subGrouped.size > 1
        ? Array.from(subGrouped).map(([subId, subPosts]) => ({
            label: `${label} — ${subMap.get(subId)?.name || label}`,
            main: subPosts[0],
            side: subPosts.slice(1, 3),
          }))
        : [{ label, main: catPosts[0], side: catPosts.slice(1, 3) }]

      slides.push(...subSlides)
    }
  }

  if (slides.length === 0) {
    for (const post of posts) {
      slides.push({
        label: catMap.get(post.category_id)?.name || "Latest",
        main: post,
        side: [],
      })
    }
  }

  return slides
}

export function HomeHero({ posts, categories, subcategories }: HomeHeroProps) {
  const slides = useRef(buildSlides(posts, categories, subcategories)).current
  const [current, setCurrent] = useState(0)
  const transitioning = useRef(false)
  const slide = slides[current]
  const hasMultiple = slides.length > 1

  const goTo = useCallback((i: number) => {
    if (transitioning.current) return
    transitioning.current = true
    setCurrent(i)
    setTimeout(() => { transitioning.current = false }, 500)
  }, [])

  useEffect(() => {
    if (!hasMultiple) return
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % slides.length
        return next
      })
    }, 6000)
    return () => clearInterval(timer)
  }, [hasMultiple, slides.length])

  if (!slide) return null

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-6 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        <Link
          href={`/${slide.main.slug}`}
          className="lg:col-span-3 relative group rounded-xl overflow-hidden min-h-[300px] lg:min-h-[420px]"
          style={{ transition: "opacity 0.4s" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: slide.main.featured_image ? `url(${slide.main.featured_image})` : undefined }}
          />
          {!slide.main.featured_image && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
            <Badge variant="indigo" className="mb-2 lg:mb-3">
              {slide.label}
            </Badge>
            <h2 className="text-xl lg:text-3xl font-bold text-white mb-2 line-clamp-3">
              {slide.main.title}
            </h2>
            <p className="text-xs lg:text-sm text-gray-300 line-clamp-2 mb-2 lg:mb-3">{slide.main.excerpt}</p>
            <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm text-gray-400">
              <Avatar className="h-6 w-6 lg:h-8 lg:w-8">
                <AvatarImage src={slide.main.author?.avatar_url || undefined} />
                <AvatarFallback>{slide.main.author?.full_name?.[0] || "A"}</AvatarFallback>
              </Avatar>
              <span>{slide.main.author?.full_name || "Blizine"}</span>
              <span>·</span>
              <span>{slide.main.published_at ? formatDate(slide.main.published_at) : ""}</span>
              <span>·</span>
              <span>{slide.main.reading_time} min read</span>
            </div>
          </div>
        </Link>

        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
          {slide.side.slice(0, 2).map((post) => (
            <Link
              key={post.id}
              href={`/${post.slug}`}
              className="relative group rounded-xl overflow-hidden min-h-[180px] lg:min-h-[195px] block"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: post.featured_image ? `url(${post.featured_image})` : undefined }}
              />
              {!post.featured_image && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Badge variant="indigo" className="mb-2 text-[10px]">
                  {post.category?.name || (catName(post.category_id, categories) || "Tech")}
                </Badge>
                <h3 className="text-lg font-bold text-white line-clamp-2">{post.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span>{post.published_at ? formatDate(post.published_at) : ""}</span>
                  <span>·</span>
                  <span>{post.reading_time} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {hasMultiple && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-indigo-500" : "w-2 bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Slide ${i + 1}: ${s.label}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function catName(id: string, categories: Category[]) {
  return categories.find((c) => c.id === id)?.name
}
