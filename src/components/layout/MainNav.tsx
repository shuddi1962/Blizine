"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export function MainNav({ categories, subcategories }: { categories: any[]; subcategories?: any[] }) {
  const [sticky, setSticky] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setSticky(window.scrollY > 100)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const subcatsByCat: Record<string, any[]> = {}
  if (subcategories) {
    for (const sub of subcategories) {
      const catSlug = sub.categories?.slug
      if (!subcatsByCat[catSlug]) subcatsByCat[catSlug] = []
      subcatsByCat[catSlug].push(sub)
    }
  }

  return (
    <>
      <div className={`main-nav${sticky ? " nav-sticky" : ""}`}>
        <div className="nav-inner">
          <div className="nav-links">
            <Link href="/" className="nav-link nav-home">Home</Link>
            {categories.map((cat: any) => (
              <div key={cat.id} className="nav-item">
                <Link
                  href={`/category/${cat.slug}`}
                  className="nav-link"
                  style={{ "--hover-color": cat.color || "var(--accent)" } as React.CSSProperties}
                >
                  {cat.name}
                  {cat.icon && <span>{cat.icon}</span>}
                </Link>
                <div className="nav-dropdown">
                  <div className="dropdown-head" style={{ borderColor: cat.color || "var(--accent)" }}>{cat.name}</div>
                  {(subcatsByCat[cat.slug] || []).length > 0 ? (
                    subcatsByCat[cat.slug].map((sub: any) => (
                      <Link key={sub.id} href={`/category/${cat.slug}/${sub.slug}`} className="dropdown-item">
                        {sub.name}
                      </Link>
                    ))
                  ) : (
                    ["Latest", "Popular"].map((label) => (
                      <Link key={label} href={`/category/${cat.slug}`} className="dropdown-item">
                        {label}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="nav-right">
            <div className="live-dot-wrap">
              <span className="live-pulse" />
              <span className="live-text">LIVE</span>
            </div>
            <button className="nav-mobile-toggle" onClick={() => setMobileOpen(m => !m)} aria-label="Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <Link href="/" className="mobile-link">Home</Link>
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="mobile-link">{cat.name}</Link>
          ))}
        </div>
      )}
    </>
  )
}
