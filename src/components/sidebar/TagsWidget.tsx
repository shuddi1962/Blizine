import Link from "next/link"

export function TagsWidget({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <span className="sidebar-card-icon">◈</span>
        <span className="sidebar-card-title">Tags</span>
      </div>
      <div className="tags-cloud">
        {tags.map((tag) => (
          <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="tag-pill">
            {tag}
          </Link>
        ))}
      </div>
    </div>
  )
}
