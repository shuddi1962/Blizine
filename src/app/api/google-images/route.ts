import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ items: [] })
  }

  const apiKey = process.env.GOOGLE_API_KEY
  const cx = process.env.GOOGLE_CX

  if (apiKey && cx) {
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&safe=active&num=9`
      const res = await fetch(url)
      const data = await res.json()
      return NextResponse.json(data)
    } catch {
      return NextResponse.json({ items: [] })
    }
  }

  return NextResponse.json({ items: [] })
}
