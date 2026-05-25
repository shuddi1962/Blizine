"use client"

import { useEffect } from "react"

export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const tracked = sessionStorage.getItem(`viewed_${postId}`)
    if (tracked) return
    sessionStorage.setItem(`viewed_${postId}`, "1")

    const data: Record<string, string> = { postId }
    data.pageUrl = window.location.pathname
    data.referrer = document.referrer || ""

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const region = timeZone.split("/")[0] || ""
      if (region && region !== "Etc") data.country = region
    } catch {}

    fetch("/api/increment-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {})
  }, [postId])

  return null
}
