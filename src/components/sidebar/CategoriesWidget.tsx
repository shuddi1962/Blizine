import Link from "next/link"

export function CategoriesWidget({ categories }: { categories: any[] }) {
  if (!categories.length) return null
  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <span className="sidebar-card-icon">◈</span>
        <span className="sidebar-card-title">Categories</span>
      </div>
      <ul className="cat-list">
        {categories.slice(0, 10).map((cat) => (
          <li key={cat.id} className="cat-row">
            <Link href={`/category/${cat.slug}`} className="cat-row-left">
              <span className="cat-dot" style={{ background: cat.color || "var(--accent)" }} />
              <span className="cat-row-name">{cat.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
