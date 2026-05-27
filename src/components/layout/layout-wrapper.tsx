"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TopBar } from "@/components/layout/TopBar"
import { Header } from "@/components/layout/Header"
import { MainNav } from "@/components/layout/MainNav"
import { BreakingTicker } from "@/components/home/BreakingTicker"
import { Footer } from "@/components/layout/Footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  const isHome = pathname === "/"
  const [categories, setCategories] = useState<any[]>([])

  const [recentPosts, setRecentPosts] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from("categories").select("*, subcategories(*)").order("name").then(({ data }) => {
      if (data) setCategories(data)
    })
    supabase.from("posts").select("id,title,slug,featured_image").eq("status","published").order("published_at",{ascending:false}).limit(6).then(({ data }) => {
      if (data) setRecentPosts(data)
    })
  }, [])

  if (isAdmin) {
    return <>{children}</>
  }

  if (isHome) {
    return <>{children}</>
  }

  return (
    <>
      <TopBar />
      <Header />
      <MainNav categories={categories} />
      <main>{children}</main>
      <Footer categories={categories} recentPosts={recentPosts} />
    </>
  )
}
