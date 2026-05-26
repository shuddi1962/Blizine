import { createClient } from "@/lib/supabase/server"
import { TopBar } from "@/components/layout/TopBar"
import { Header } from "@/components/layout/Header"
import { MainNav } from "@/components/layout/MainNav"
import { BreakingTicker } from "@/components/home/BreakingTicker"
import { AdSlot } from "@/components/ads/AdSlot"
import { HeroSection } from "@/components/home/HeroSection"
import { CategoryTabSection } from "@/components/home/CategoryTabSection"
import { LatestGrid } from "@/components/home/LatestGrid"
import { CategoryStrip } from "@/components/home/CategoryStrip"
import { NewsletterStrip } from "@/components/home/NewsletterStrip"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"

export const revalidate = 300

export default async function HomePage() {
  const supabase = createClient()

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  const [
    { data: heroPosts },
    { data: latestPosts },
    { data: tickerPosts },
    { data: trendingPosts },
    { data: popularPosts },
    { data: categories },
    { data: aiPosts },
    { data: cyberPosts },
    { data: gadgetPosts },
    { data: techNewsPosts },
    { data: subcategories },
    { data: allTags },
  ] = await Promise.all([
    supabase.from("posts").select("*, categories(name,slug,color)")
      .eq("status", "published")
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).limit(3),

    supabase.from("posts").select("*, categories(name,slug,color)")
      .eq("status", "published")
      .order("published_at", { ascending: false }).range(3, 12),

    supabase.from("posts").select("title,slug")
      .eq("status", "published")
      .order("published_at", { ascending: false }).limit(10),

    supabase.from("posts").select("id,title,slug,views,categories(name,slug,color)")
      .eq("status", "published")
      .gte("published_at", sevenDaysAgo)
      .order("views", { ascending: false }).limit(5),

    supabase.from("posts").select("id,title,slug,featured_image,views,categories(name,slug,color)")
      .eq("status", "published")
      .not("featured_image", "is", null)
      .order("views", { ascending: false }).limit(5),

    supabase.from("categories").select("id,name,slug,color,icon").order("name"),

    supabase.from("posts").select("*, categories!inner(name,slug,color)")
      .eq("status", "published").eq("categories.slug", "ai-automation")
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).limit(4),

    supabase.from("posts").select("*, categories!inner(name,slug,color)")
      .eq("status", "published").eq("categories.slug", "cybersecurity")
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).limit(4),

    supabase.from("posts").select("*, categories!inner(name,slug,color)")
      .eq("status", "published").eq("categories.slug", "gadgets")
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).limit(4),

    supabase.from("posts").select("*, categories!inner(name,slug,color)")
      .eq("status", "published").eq("categories.slug", "tech-news")
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).limit(4),

    supabase.from("subcategories").select("*, categories(name,slug,color)")
      .order("name"),

    supabase.from("posts").select("seo_keywords")
      .eq("status", "published").limit(100),
  ])

  const tags = Array.from(new Set(
    (allTags || []).flatMap((p: any) => p.seo_keywords || [])
  )).slice(0, 20) as string[]

  const cats = (categories || []).map((cat: any) => ({
    ...cat,
    post_count: 0,
  }))

  const featuredPost = (heroPosts || [])[0] || null
  const heroSecondary = (heroPosts || []).slice(1, 3)

  const subcatsByCat: Record<string, any[]> = {}
  for (const sub of (subcategories || [])) {
    const catSlug = sub.categories?.slug
    if (!subcatsByCat[catSlug]) subcatsByCat[catSlug] = []
    subcatsByCat[catSlug].push(sub)
  }

  return (
    <div>
      <TopBar />
      <Header />
      <MainNav categories={cats} subcategories={subcategories || []} />
      <BreakingTicker posts={tickerPosts || []} />

      <div className="site-main">
        <div className="main-layout">
          <div className="content-col">
            <HeroSection
              featured={featuredPost}
              secondary={heroSecondary}
            />

            <CategoryTabSection categories={cats} posts={latestPosts || []} />

            <LatestGrid posts={latestPosts || []} />

            <CategoryStrip
              categoryName="AI & Automation"
              categorySlug="ai-automation"
              categoryColor="#8B5CF6"
              posts={aiPosts || []}
              subcategories={subcatsByCat["ai-automation"] || []}
            />

            <CategoryStrip
              categoryName="Cybersecurity"
              categorySlug="cybersecurity"
              categoryColor="#EF4444"
              posts={cyberPosts || []}
              subcategories={subcatsByCat["cybersecurity"] || []}
            />

            <CategoryStrip
              categoryName="Gadgets"
              categorySlug="gadgets"
              categoryColor="#EC4899"
              posts={gadgetPosts || []}
              subcategories={subcatsByCat["gadgets"] || []}
            />

            <CategoryStrip
              categoryName="Tech News"
              categorySlug="tech-news"
              categoryColor="#3B82F6"
              posts={techNewsPosts || []}
              subcategories={subcatsByCat["tech-news"] || []}
            />
          </div>

          <Sidebar
            trending={trendingPosts || []}
            popular={popularPosts || []}
            categories={cats}
            tags={tags}
          />
        </div>
      </div>

      <NewsletterStrip />

      <Footer categories={cats} recentPosts={latestPosts || []} />
    </div>
  )
}
