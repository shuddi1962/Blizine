import { TrendingWidget } from "@/components/sidebar/TrendingWidget"
import { SocialWidget } from "@/components/sidebar/SocialWidget"
import { NewsletterWidget } from "@/components/sidebar/NewsletterWidget"
import { PopularWidget } from "@/components/sidebar/PopularWidget"
import { CategoriesWidget } from "@/components/sidebar/CategoriesWidget"
import { TagsWidget } from "@/components/sidebar/TagsWidget"
import { AdSlot } from "@/components/ads/AdSlot"

interface SidebarProps {
  trending: any[]
  popular: any[]
  categories: any[]
  tags: string[]
  ads: any[]
}

export function Sidebar({ trending, popular, categories, tags, ads }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-ad">
        <AdSlot position="sidebar_top" width={300} height={250} />
      </div>

      <TrendingWidget posts={trending} />

      <div className="sidebar-ad">
        <AdSlot position="sidebar_mid1" width={300} height={250} />
      </div>

      <SocialWidget />

      <NewsletterWidget />

      <PopularWidget posts={popular} />

      <div className="sidebar-ad-tall">
        <AdSlot position="sidebar_mid2" width={300} height={600} />
      </div>

      <CategoriesWidget categories={categories} />

      <TagsWidget tags={tags} />

      <div className="sidebar-ad">
        <AdSlot position="sidebar_mid3" width={300} height={250} />
      </div>
    </aside>
  )
}
