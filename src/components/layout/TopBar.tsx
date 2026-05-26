"use client"

import Link from "next/link"

export function TopBar() {
  const now = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-bar-left">
          <span className="top-date">{now}</span>
          <span className="top-divider" />
          <span className="top-weather">Tech Hub</span>
          <span className="top-divider" />
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/advertise">Advertise</Link>
          <Link href="/newsletter">Newsletter</Link>
        </div>
        <div className="top-bar-right">
          <div className="top-social" style={{ display: "flex", gap: 6 }}>
            <Link href="#" aria-label="Twitter" style={{ fontSize: 14, fontWeight: 700 }}>/ X</Link>
            <Link href="#" aria-label="YouTube" style={{ fontSize: 14 }}>▶</Link>
            <Link href="#" aria-label="Telegram" style={{ fontSize: 14 }}>✈</Link>
            <Link href="#" aria-label="Facebook" style={{ fontSize: 14, fontWeight: 700 }}>f</Link>
            <Link href="/rss.xml" aria-label="RSS" style={{ fontSize: 14 }}>◉</Link>
          </div>
          <span className="top-divider" />
          <Link href="/subscribe" className="top-subscribe-btn">
            Subscribe Free
          </Link>
        </div>
      </div>
    </div>
  )
}
