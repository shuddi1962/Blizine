import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get("limit") || "5")
  const sort = searchParams.get("sort") || "latest"

  try {
    const supabase = createClient()
    let query = supabase
      .from("posts")
      .select("id,title,slug,featured_image,views,categories(name,slug,color)")
      .eq("status", "published")
      .not("featured_image", "is", null)

    if (sort === "views") {
      query = query.order("views", { ascending: false })
    } else if (sort === "popular") {
      query = query.order("views", { ascending: false })
    } else {
      query = query.order("published_at", { ascending: false })
    }

    const { data } = await query.limit(limit)
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
