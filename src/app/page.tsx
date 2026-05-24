import { HeroSection } from "@/components/home/hero-section"
import { CategoryTabs } from "@/components/home/category-tabs"
import { SecondaryRow } from "@/components/home/secondary-row"
import { TrendingGrid } from "@/components/home/trending-grid"
import { Sidebar } from "@/components/layout/sidebar"

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryTabs />
      </div>

      <div className="bg-muted/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SecondaryRow />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <TrendingGrid />
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
