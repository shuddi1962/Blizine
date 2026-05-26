import Link from "next/link"
import Image from "next/image"
import { CategoryBadge } from "@/components/ui/CategoryBadge"

interface HeroSectionProps {
  featured: any
  secondary: any[]
}

export function HeroSection({ featured, secondary }: HeroSectionProps) {
  if (!featured && !secondary.length) return null

  return (
    <section className="hero-section">
      <div className="hero-grid">
        {featured && (
          <Link href={`/${featured.slug}`} className="hero-main">
            <div className="hero-main-img">
              <Image
                src={featured.featured_image || "/placeholder.jpg"}
                alt={featured.title}
                fill
                className="hero-img"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
              <div className="hero-main-overlay" />
            </div>
            {featured.is_breaking && (
              <span className="hero-badge-breaking">BREAKING</span>
            )}
            <div className="hero-main-content">
              <CategoryBadge name={featured.categories?.name} color={featured.categories?.color} size="sm" />
              <h1 className="hero-main-title">{featured.title}</h1>
              <p className="hero-main-excerpt">{featured.excerpt}</p>
            </div>
          </Link>
        )}

        <div className="hero-secondary">
          {secondary.map((post) => (
            <Link key={post.id} href={`/${post.slug}`} className="hero-sec-card">
              <div className="hero-sec-img-wrap">
                <Image
                  src={post.featured_image || "/placeholder.jpg"}
                  alt={post.title}
                  fill
                  className="hero-sec-img"
                  sizes="120px"
                />
              </div>
              <div className="hero-sec-body">
                <CategoryBadge name={post.categories?.name} color={post.categories?.color} size="xs" />
                <h3 className="hero-sec-title">{post.title}</h3>
                <div style={{ fontSize: 11, color: "var(--muted2)", display: "flex", gap: 4 }}>
                  <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                  <span className="opacity-40">·</span>
                  <span>{post.reading_time} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
