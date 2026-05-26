"use client"

import { useRef, useEffect } from "react"

interface AdSlotProps {
  position: string
  width: number
  height: number
  className?: string
}

export function AdSlot({ position, width, height, className = "" }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

  useEffect(() => {
    if (publisherId && ref.current) {
      try {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch {}
    }
  }, [])

  return (
    <div className={"ad-slot-wrap " + className}>
      <span className="ad-slot-label">Advertisement</span>
      <div
        ref={ref}
        className="ad-slot-placeholder"
        style={{ width: "100%", minHeight: height }}
      >
        <span className="ad-slot-size">{width} x {height}</span>
        <span className="ad-slot-pos">{position}</span>
      </div>
    </div>
  )
}
