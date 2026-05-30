import { NextResponse } from 'next/server'

export async function GET() {
  const results: Record<string, any> = {
    envVars: {
      serviceAccount: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      ga4Property: !!process.env.GOOGLE_GA4_PROPERTY_ID,
      scSite: !!process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL,
      psKey: !!process.env.PAGESPEED_API_KEY,
    },
    ga4: null,
    gsc: null,
    pagespeed: null,
  }

  if (!process.env.GOOGLE_PRIVATE_KEY) {
    return NextResponse.json({ ...results, error: 'Missing GOOGLE_PRIVATE_KEY' })
  }

  try {
    const { google } = require('googleapis')
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/webmasters.readonly',
      ],
    })

    const analyticsData = google.analyticsdata({ version: 'v1beta', auth })
    const propertyId = `properties/${process.env.GOOGLE_GA4_PROPERTY_ID!}`

    try {
      const resp = await analyticsData.properties.runReport({
        property: propertyId,
        requestBody: {
          dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
          metrics: [{ name: 'totalUsers' }, { name: 'screenPageViews' }],
          limit: 1,
        },
      })
      results.ga4 = { success: true, data: resp.data }
    } catch (e: any) {
      results.ga4 = { success: false, error: e.message, code: e.code, details: e.errors }
    }

    try {
      const webmasters = google.webmasters({ version: 'v3', auth })
      const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL!
      const resp = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: { startDate: '7daysAgo', endDate: 'today', type: 'web' },
      })
      results.gsc = { success: true, data: resp.data }
    } catch (e: any) {
      results.gsc = { success: false, error: e.message, code: e.code, details: e.errors }
    }
  } catch (e: any) {
    results.authError = e.message
  }

  try {
    const key = process.env.PAGESPEED_API_KEY
    if (key) {
      const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent('https://blizine.com')}&strategy=mobile&key=${key}`
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (res.ok) {
        const data = await res.json()
        results.pagespeed = { success: true }
      } else {
        results.pagespeed = { success: false, error: res.statusText }
      }
    }
  } catch { }

  return NextResponse.json(results)
}
