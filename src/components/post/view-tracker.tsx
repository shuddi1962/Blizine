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
      if (region && region !== "Etc") {
        const countryMap: Record<string, string> = {
          "America": "US", "Europe": "GB", "Asia": "IN", "Africa": "ZA",
          "Australia": "AU", "Pacific": "NZ", "Atlantic": "US",
        }
        data.country = timeZone.includes("/")
          ? (timeZone.split("/")[1]?.length === 2 ? timeZone.split("/")[1] : countryMap[region] || region)
          : region
      }
    } catch {}

    fetch("/api/increment-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch((err) => console.error("ViewTracker error:", err))
  }, [postId])

  return null
}
