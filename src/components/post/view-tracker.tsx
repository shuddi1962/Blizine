"use client"

import { useEffect } from "react"

export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const tracked = sessionStorage.getItem(`viewed_${postId}`)
    if (tracked) return
    sessionStorage.setItem(`viewed_${postId}`, "1")
    fetch("/api/increment-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    }).catch(() => {})
  }, [postId])

  return null
}
