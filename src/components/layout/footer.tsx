import Link from "next/link"

export function Footer({ categories, recentPosts }: { categories: any[]; recentPosts: any[] }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-logo">
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text)" }}>BLIZ</span>
            <span style={{ fontSize: 20, color: "var(--accent)" }}>◈</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text)" }}>INE</span>
          </div>
          <p className="footer-tagline">Tech, decoded. Fast.</p>
          <p className="footer-about">
            Blizine is your daily source for the latest in technology, AI, cybersecurity, gadgets, and digital innovation.
          </p>
          <div className="footer-socials">
            {[
              { icon: "X", href: "#" },
              { icon: "▶", href: "#" },
              { icon: "✈", href: "#" },
              { icon: "f", href: "#" },
              { icon: "◉", href: "/rss.xml" },
            ].map((s, i) => (
              <Link key={i} href={s.href} className="footer-social-icon" aria-label={s.icon}>{s.icon}</Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="footer-col-title">Categories</h3>
          {categories.slice(0, 8).map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="footer-col-link">
              {cat.name}
            </Link>
          ))}
        </div>

        <div>
          <h3 className="footer-col-title">Recent Articles</h3>
          {recentPosts.slice(0, 4).map((post) => (
            <Link key={post.id} href={`/${post.slug}`} className="footer-post-link">
              <span style={{ flexShrink: 0, marginTop: 3 }}>●</span>
              <span>{post.title?.slice(0, 48)}</span>
            </Link>
          ))}
        </div>

        <div>
          <h3 className="footer-col-title">Quick Links</h3>
          {["About Us", "Contact Us", "Advertise With Us", "Privacy Policy", "Terms of Use", "Sitemap", "RSS Feed", "Newsletter", "Write For Us"].map((l) => (
            <Link key={l} href="#" className="footer-col-link">
              <span>{l}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Blizine.com. All rights reserved.</span>
        <span>Built with love for the tech community</span>
        <a href="mailto:hello@blizine.com" style={{ color: "var(--accent)", textDecoration: "none" }}>hello@blizine.com</a>
      </div>
    </footer>
  )
}
