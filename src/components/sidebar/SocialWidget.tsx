import Link from "next/link"

const platforms = [
  { name: "Twitter / X", icon: "X", color: "#1DA1F2", followers: "12.4K", label: "Follow", href: "#" },
  { name: "YouTube", icon: "▶", color: "#FF0000", followers: "8.7K", label: "Subscribe", href: "#" },
  { name: "Telegram", icon: "✈", color: "#0088CC", followers: "5.2K", label: "Join", href: "#" },
  { name: "Facebook", icon: "f", color: "#1877F2", followers: "3.9K", label: "Like", href: "#" },
]

export function SocialWidget() {
  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <span className="sidebar-card-icon">◈</span>
        <span className="sidebar-card-title">Follow Us</span>
      </div>
      {platforms.map((p) => (
        <div key={p.name} className="social-row">
          <div className="social-icon-wrap" style={{ background: p.color }}>
            {p.icon}
          </div>
          <div className="social-info">
            <div className="social-name">{p.name}</div>
            <div className="social-followers">{p.followers} followers</div>
          </div>
          <Link href={p.href} className="social-btn" style={{ border: `1px solid ${p.color}`, color: p.color }}>
            {p.label}
          </Link>
        </div>
      ))}
    </div>
  )
}
