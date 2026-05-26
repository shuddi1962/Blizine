export function CategoryBadge({ name, color, size = "md" }: { name?: string; color?: string; size?: "xs" | "sm" | "md" }) {
  if (!name) return null
  const sizes = { xs: "9px", sm: "10px", md: "11px" }
  return (
    <span
      className="font-semibold uppercase tracking-wider inline-block"
      style={{
        fontSize: sizes[size],
        color: color || "var(--accent)",
      }}
    >
      {name}
    </span>
  )
}
