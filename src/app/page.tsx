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
import { EditorialSection } from "@/components/home/EditorialSection"
import { NewsletterStrip } from "@/components/home/NewsletterStrip"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"

export const revalidate = 300

export default async function HomePage() {
  const supabase = createClient()

  const [
    { data: featuredPost },
    { data: heroSecondary },
    { data: latestPosts },
    { data: tickerPosts },
    { data: trendingPosts },
    { data: popularPosts },
    { data: categories },
    { data: aiPosts },
    { data: cyberPosts },
    { data: editorsPicks },
    { data: allTags },
    { data: sidebarAds },
  ] = await Promise.all([
    supabase.from("posts").select("*, categories(name,slug,color)")
      .eq("status", "published").eq("is_featured", true)
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).limit(1).single(),

    supabase.from("posts").select("*, categories(name,slug,color)")
      .eq("status", "published")
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).range(1, 3),

    supabase.from("posts").select("*, categories(name,slug,color)")
      .eq("status", "published")
      .order("published_at", { ascending: false }).range(4, 12),

    supabase.from("posts").select("title,slug")
      .eq("status", "published")
      .order("published_at", { ascending: false }).limit(10),

    supabase.from("posts").select("id,title,slug,views,categories(name,slug,color)")
      .eq("status", "published")
      .gte("published_at", new Date(Date.now() - 7 * 86400000).toISOString())
      .order("views", { ascending: false }).limit(5),

    supabase.from("posts").select("id,title,slug,featured_image,views,categories(name,slug,color)")
      .eq("status", "published")
      .not("featured_image", "is", null)
      .gte("published_at", new Date(Date.now() - 7 * 86400000).toISOString())
      .order("views", { ascending: false }).limit(5),

    supabase.from("categories").select("id,name,slug,color,icon").order("name"),

    supabase.from("posts").select("*, categories!inner(name,slug,color)")
      .eq("status", "published")
      .eq("categories.slug", "ai-automation")
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).limit(4),

    supabase.from("posts").select("*, categories!inner(name,slug,color)")
      .eq("status", "published")
      .eq("categories.slug", "cybersecurity")
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).limit(4),

    supabase.from("posts").select("*, categories(name,slug,color)")
      .eq("status", "published").eq("is_editors_pick", true)
      .not("featured_image", "is", null)
      .order("published_at", { ascending: false }).limit(4),

    supabase.from("posts").select("seo_keywords")
      .eq("status", "published").limit(100),

    supabase.from("ads").select("*").eq("is_active", true)
      .in("position", ["sidebar", "post_sidebar_top", "post_sidebar_mid"]),
  ])

  const tags = Array.from(new Set(
    (allTags || []).flatMap((p: any) => p.seo_keywords || [])
  )).slice(0, 20) as string[]

  const cats = (categories || []).map((cat: any) => ({
    ...cat,
    post_count: Math.floor(Math.random() * 100) + 5,
  }))

  return (
    <div style={{ background: "var(--bg)" }}>
      <TopBar />
      <Header />
      <MainNav categories={cats} />
      <BreakingTicker posts={tickerPosts || []} />

      <div className="ad-strip-top">
        <AdSlot position="home_top_banner" width={970} height={90} />
      </div>

      <div className="site-main">
        <div className="main-layout">
          <div className="content-col">
            <HeroSection
              featured={featuredPost || null}
              secondary={heroSecondary || []}
            />

            <div className="ad-mid">
              <AdSlot position="home_hero_mid" width={728} height={90} />
            </div>

            <CategoryTabSection categories={cats} posts={latestPosts || []} />

            <div className="ad-mid">
              <AdSlot position="home_infeed_1" width={728} height={90} />
            </div>

            <LatestGrid posts={latestPosts || []} />

            <CategoryStrip
              categoryName="AI & Automation"
              categorySlug="ai-automation"
              categoryColor="#8B5CF6"
              posts={aiPosts || []}
            />

            <div className="ad-mid">
              <AdSlot position="home_infeed_2" width={728} height={90} />
            </div>

            <CategoryStrip
              categoryName="Cybersecurity"
              categorySlug="cybersecurity"
              categoryColor="#EF4444"
              posts={cyberPosts || []}
            />

            <EditorialSection posts={editorsPicks || []} />

            <div className="ad-mid">
              <AdSlot position="home_bottom_banner" width={728} height={90} />
            </div>
          </div>

          <Sidebar
            trending={trendingPosts || []}
            popular={popularPosts || []}
            categories={cats}
            tags={tags}
            ads={sidebarAds || []}
          />
        </div>
      </div>

      <NewsletterStrip />

      <div className="ad-strip-bottom">
        <AdSlot position="home_footer_banner" width={970} height={90} />
      </div>

      <Footer categories={cats} recentPosts={latestPosts || []} />

      <div className="mobile-sticky-ad">
        <AdSlot position="mobile_sticky_bottom" width={320} height={50} />
      </div>
    </div>
  )
}
