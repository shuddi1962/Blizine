"use client"

import { usePathname } from "next/navigation"
import { BreakingNews } from "./breaking-news"
import { Header } from "./header"
import { Nav } from "./nav"
import { Footer } from "./footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <BreakingNews />
      <Header />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
