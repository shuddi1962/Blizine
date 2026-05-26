import Link from "next/link"
import Image from "next/image"
import { CategoryBadge } from "@/components/ui/CategoryBadge"

interface CategoryStripProps {
  categoryName: string
  categorySlug: string
  categoryColor: string
  posts: any[]
}

export function CategoryStrip({ categoryName, categorySlug, categoryColor, posts }: CategoryStripProps) {
  if (!posts.length) return null
  return (
    <section className="cat-strip">
      <div className="section-head">
        <h2 className="section-title">
          <span className="sec-gem">◈</span>
          {categoryName}
        </h2>
        <Link href={`/category/${categorySlug}`} className="view-all-link">All {categoryName}</Link>
      </div>

      <div className="cat-strip-grid" style={{ "--cat-color": categoryColor || "var(--accent)" } as React.CSSProperties}>
        {posts.slice(0, 4).map((post) => (
          <Link key={post.id} href={`/${post.slug}`} className="cat-strip-card">
            <div className="cat-strip-img-wrap">
              <Image
                src={post.featured_image || "/placeholder.jpg"}
                alt={post.title}
                fill
                className="cat-strip-img"
                sizes="25vw"
              />
              <div className="cat-strip-grad" />
            </div>
            <div className="cat-strip-body">
              <CategoryBadge name={post.categories?.name} color={post.categories?.color} size="xs" />
              <h3 className="cat-strip-title">{post.title}</h3>
              <div className="cat-strip-meta">
                <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                <span className="sep">·</span>
                <span>{post.reading_time} min</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
