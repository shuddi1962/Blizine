"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Key, ExternalLink, BarChart3, Search, Zap, Activity,
  CheckCircle2, XCircle, Globe,
} from "lucide-react"

const integrationFields = [
  { key: "openrouter_api_key", label: "OpenRouter API Key", placeholder: "sk-or-v1-..." },
  { key: "ga4_measurement_id", label: "Google Analytics 4 ID (frontend)", placeholder: "G-XXXXXXXXXX" },
  { key: "gtm_container_id", label: "Google Tag Manager ID", placeholder: "GTM-XXXXXXX" },
  { key: "google_search_console_verification", label: "Search Console Verification Meta", placeholder: "<meta> tag content" },
  { key: "bing_webmaster_verification", label: "Bing Webmaster Verification", placeholder: "Verification code" },
  { key: "openrouter_model", label: "OpenRouter Model", placeholder: "mistralai/mixtral-8x7b-instruct" },
]

interface GoogleServiceStatus {
  ga4: boolean
  searchConsole: boolean
  pageSpeed: boolean
}

function GoogleServiceCard({
  icon, name, description, configured, envVars, color,
}: {
  icon: React.ReactNode; name: string; description: string; configured: boolean; envVars: string[]; color: string
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg shrink-0" style={{ background: color + '15' }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{name}</span>
              {configured ? (
                <Badge variant="default" className="bg-[#34A853] hover:bg-[#2D9248]">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not configured
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2">{description}</p>
            <div className="flex flex-wrap gap-1.5">
              {envVars.map((ev) => (
                <code key={ev} className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-mono text-gray-600">
                  {ev}
                </code>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminIntegrationsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [googleStatus, setGoogleStatus] = useState<GoogleServiceStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from("site_settings").select("*").then(({ data }) => {
      if (data) {
        const map: Record<string, any> = {}
        data.forEach((s) => { map[s.key] = s.value })
        setSettings(map)
      }
    })

    fetch('/api/admin/analytics/status')
      .then((r) => r.json())
      .then((d) => {
        setGoogleStatus({
          ga4: d.ga4,
          searchConsole: d.searchConsole,
          pageSpeed: d.pageSpeed,
        })
      })
      .catch(() => setGoogleStatus({ ga4: false, searchConsole: false, pageSpeed: false }))
      .finally(() => setStatusLoading(false))
  }, [])

  const updateSetting = async (key: string, value: any) => {
    const supabase = createClient()
    await supabase.from("site_settings").upsert({ key, value })
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-sm text-gray-500">Manage third‑party service connections and API keys</p>
      </div>

      {/* GOOGLE SERVICES STATUS */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#4285F4]" />
          Google Analytics Services
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          These services use server‑side environment variables configured in Vercel. 
          <a href="https://vercel.com/shuddi1962s-projects/blizine/settings/environment-variables" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-1 text-[#6366F1] hover:underline">
            Manage in Vercel <ExternalLink className="h-3 w-3" />
          </a>
        </p>
        {statusLoading ? (
          <div className="text-sm text-gray-400">Checking connection status...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GoogleServiceCard
              icon={<BarChart3 className="h-5 w-5" style={{ color: '#4285F4' }} />}
              name="Google Analytics 4"
              description="Real‑time & historical traffic data via Data API"
              configured={googleStatus?.ga4 ?? false}
              envVars={['GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_GA4_PROPERTY_ID']}
              color="#4285F4"
            />
            <GoogleServiceCard
              icon={<Search className="h-5 w-5" style={{ color: '#34A853' }} />}
              name="Google Search Console"
              description="Search impressions, clicks, keyword positions"
              configured={googleStatus?.searchConsole ?? false}
              envVars={['GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_SEARCH_CONSOLE_SITE_URL']}
              color="#34A853"
            />
            <GoogleServiceCard
              icon={<Zap className="h-5 w-5" style={{ color: '#FBBC04' }} />}
              name="PageSpeed Insights"
              description="Performance, LCP, INP, CLS scores"
              configured={googleStatus?.pageSpeed ?? false}
              envVars={['PAGESPEED_API_KEY']}
              color="#FBBC04"
            />
          </div>
        )}
      </div>

      {/* SITE INTEGRATION KEYS */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-[#6366F1]" />
          Site Keys &amp; Tokens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrationFields.map((field) => (
            <Card key={field.key}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  {field.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={settings[field.key] || ""}
                    onChange={(e) => updateSetting(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1 font-mono"
                  />
                  <Badge variant={settings[field.key] ? "default" : "secondary"}>
                    {settings[field.key] ? "Set" : "Not set"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
