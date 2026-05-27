import { AdSlot } from "@/components/ads/AdSlot"
import { TrendingWidget } from "@/components/sidebar/TrendingWidget"
import { SocialWidget } from "@/components/sidebar/SocialWidget"
import { NewsletterWidget } from "@/components/sidebar/NewsletterWidget"
import { PopularWidget } from "@/components/sidebar/PopularWidget"
import { TagsWidget } from "@/components/sidebar/TagsWidget"
import { QuickLinksWidget } from "@/components/sidebar/QuickLinksWidget"

interface SidebarProps {
  trending: any[]
  popular: any[]
  categories: any[]
  tags: string[]
}

export function Sidebar({ trending, popular, categories, tags }: SidebarProps) {
  return (
    <aside className="sidebar">
      <TrendingWidget posts={trending} />
      <AdSlot position="Sidebar Top" width={300} height={250} />
      <SocialWidget />
      <NewsletterWidget />
      <PopularWidget posts={popular} />
      <AdSlot position="Sidebar Mid" width={300} height={250} />
      <QuickLinksWidget />
      <TagsWidget tags={tags} />
    </aside>
  )
}
