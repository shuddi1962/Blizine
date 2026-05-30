import { NextResponse } from 'next/server'

export async function GET() {
  const ga4 = !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_GA4_PROPERTY_ID
  )
  const searchConsole = !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL
  )
  const pageSpeed = !!process.env.PAGESPEED_API_KEY

  return NextResponse.json({
    ga4,
    searchConsole,
    pageSpeed,
    envCheck: {
      serviceAccount: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      ga4Property: !!process.env.GOOGLE_GA4_PROPERTY_ID,
      scSite: !!process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL,
      psKey: !!process.env.PAGESPEED_API_KEY,
    },
  })
}
