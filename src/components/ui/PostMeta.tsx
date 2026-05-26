export function PostMeta({ author, date, readTime, views, variant = "default" }: {
  author?: string; date?: string; readTime?: number; views?: number; variant?: "default" | "light" | "muted"
}) {
  const color = variant === "light" ? "rgba(255,255,255,.65)" : variant === "muted" ? "var(--muted2)" : "var(--muted)"
  const formatted = date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""
  return (
    <div className="flex items-center gap-1.5 flex-wrap" style={{ color, fontSize: 12 }}>
      {author && <span>{author}</span>}
      {author && formatted ? <span className="opacity-40">·</span> : null}
      {formatted && <span>{formatted}</span>}
      {formatted && (readTime || views !== undefined) ? <span className="opacity-40">·</span> : null}
      {readTime ? <span>{readTime} min read</span> : null}
      {views !== undefined ? <span>{views.toLocaleString()} views</span> : null}
    </div>
  )
}
