"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Image, Code, DollarSign, Eye, MousePointer, Calendar, Copy, Check, X, Upload, Monitor } from "lucide-react"
import { AD_POSITIONS } from "@/lib/constants"
import type { Ad } from "@/types/database"

type AdFormat = "banner_image" | "custom_code" | "adsense"
type Campaign = {
  id: string
  advertiser_name: string
  ad_image_url: string | null
  destination_url: string | null
  ad_code: string | null
  positions: string[]
  start_date: string | null
  end_date: string | null
  daily_impression_cap: number | null
  impressions: number
  clicks: number
  is_active: boolean
  created_at: string
}

const FORMAT_LABELS: Record<AdFormat, string> = {
  banner_image: "Banner Image",
  custom_code: "Custom Code",
  adsense: "Google AdSense",
}

const FORMAT_ICONS: Record<AdFormat, any> = {
  banner_image: Image,
  custom_code: Code,
  adsense: DollarSign,
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  // Ad slot form state
  const [name, setName] = useState("")
  const [position, setPosition] = useState("")
  const [adCode, setAdCode] = useState("")

  // Campaign form state
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [advName, setAdvName] = useState("")
  const [advFormat, setAdvFormat] = useState<AdFormat>("banner_image")
  const [advImageUrl, setAdvImageUrl] = useState("")
  const [advDestUrl, setAdvDestUrl] = useState("")
  const [advCode, setAdvCode] = useState("")
  const [advPositions, setAdvPositions] = useState<string[]>([])
  const [advStartDate, setAdvStartDate] = useState("")
  const [advEndDate, setAdvEndDate] = useState("")
  const [advImpCap, setAdvImpCap] = useState("")
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [copiedCampaignId, setCopiedCampaignId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    supabase.from("ads").select("*").order("name").then(({ data }) => {
      if (data) setAds(data)
    })
    supabase.from("ad_campaigns").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setCampaigns(data)
    })
  }, [])

  // ── Ad Slot CRUD ──

  const addAd = async () => {
    if (!name || !position) return
    await supabase.from("ads").insert({ name, type: "banner", position: position as any, ad_code: adCode })
    setName("")
    setPosition("")
    setAdCode("")
    const { data } = await supabase.from("ads").select("*").order("name")
    if (data) setAds(data)
  }

  const toggleAdActive = async (id: string, active: boolean) => {
    await supabase.from("ads").update({ is_active: active }).eq("id", id)
  }

  // ── Campaign CRUD ──

  const resetCampaignForm = () => {
    setEditingCampaign(null)
    setAdvName("")
    setAdvFormat("banner_image")
    setAdvImageUrl("")
    setAdvDestUrl("")
    setAdvCode("")
    setAdvPositions([])
    setAdvStartDate("")
    setAdvEndDate("")
    setAdvImpCap("")
  }

  const openEditCampaign = (c: Campaign) => {
    setEditingCampaign(c)
    setAdvName(c.advertiser_name)
    setAdvFormat(c.ad_code?.startsWith("<script") || c.ad_code?.startsWith("<ins") ? "adsense" : c.ad_image_url ? "banner_image" : "custom_code")
    setAdvImageUrl(c.ad_image_url || "")
    setAdvDestUrl(c.destination_url || "")
    setAdvCode(c.ad_code || "")
    setAdvPositions(c.positions || [])
    setAdvStartDate(c.start_date || "")
    setAdvEndDate(c.end_date || "")
    setAdvImpCap(c.daily_impression_cap?.toString() || "")
    setShowCampaignForm(true)
  }

  const uploadBannerImage = async (file: File) => {
    setUploadingBanner(true)
    const path = `campaigns/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    })
    if (error) {
      console.error("Banner upload error:", error)
      setUploadingBanner(false)
      return
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path)
    setAdvImageUrl(data.publicUrl)
    setUploadingBanner(false)
  }

  const saveCampaign = async () => {
    if (!advName) return

    const payload: any = {
      advertiser_name: advName,
      positions: advPositions,
      start_date: advStartDate || null,
      end_date: advEndDate || null,
      daily_impression_cap: advImpCap ? parseInt(advImpCap) : null,
    }

    if (advFormat === "banner_image") {
      payload.ad_image_url = advImageUrl || null
      payload.destination_url = advDestUrl || null
      payload.ad_code = null
    } else if (advFormat === "adsense") {
      payload.ad_code = advCode || null
      payload.ad_image_url = null
      payload.destination_url = null
    } else {
      payload.ad_code = advCode || null
      payload.ad_image_url = null
      payload.destination_url = null
    }

    if (editingCampaign) {
      await supabase.from("ad_campaigns").update(payload).eq("id", editingCampaign.id)
    } else {
      await supabase.from("ad_campaigns").insert(payload)
    }

    resetCampaignForm()
    setShowCampaignForm(false)
    const { data } = await supabase.from("ad_campaigns").select("*").order("created_at", { ascending: false })
    if (data) setCampaigns(data)
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm("Delete this campaign?")) return
    await supabase.from("ad_campaigns").delete().eq("id", id)
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
  }

  const toggleCampaignActive = async (id: string, active: boolean) => {
    await supabase.from("ad_campaigns").update({ is_active: active }).eq("id", id)
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: active } : c)))
  }

  const togglePosition = (pos: string) => {
    setAdvPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    )
  }

  const copyCampaignAdCode = async (c: Campaign) => {
    const code = c.ad_code || `<!-- ${c.advertiser_name} - ${c.ad_image_url ? "Banner: " + c.ad_image_url : "Custom Ad"} -->`
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCampaignId(c.id)
      setTimeout(() => setCopiedCampaignId(null), 2000)
    } catch {
      const el = document.createElement("textarea")
      el.value = code
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopiedCampaignId(c.id)
      setTimeout(() => setCopiedCampaignId(null), 2000)
    }
  }

  const formatBadge = (c: Campaign) => {
    if (c.ad_code?.startsWith("<script") || c.ad_code?.startsWith("<ins") || (!c.ad_image_url && c.ad_code?.includes("adsense"))) return "Google AdSense"
    if (c.ad_image_url) return "Banner Image"
    if (c.ad_code) return "Custom Code"
    return "Unknown"
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ad Manager</h1>

      <Tabs defaultValue="slots">
        <TabsList className="mb-6">
          <TabsTrigger value="slots">
            <Monitor className="h-4 w-4 mr-2" />
            Ad Slots
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <DollarSign className="h-4 w-4 mr-2" />
            Client Campaigns
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════
           TAB 1 — AD SLOTS
           ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="slots">
          <Card className="mb-8">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Plus className="h-4 w-4" />New Ad Slot</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad name" />
                <select value={position} onChange={(e) => setPosition(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Select position...</option>
                  {Object.entries(AD_POSITIONS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <Button onClick={addAd} disabled={!name || !position}>Add Slot</Button>
              </div>
              <Input value={adCode} onChange={(e) => setAdCode(e.target.value)} placeholder="Ad code (HTML/JS)" className="mt-3 font-mono text-sm" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.map((ad) => (
              <Card key={ad.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{ad.name}</p>
                    <Switch checked={ad.is_active} onCheckedChange={(v) => toggleAdActive(ad.id, v)} />
                  </div>
                  <Badge variant="secondary">{AD_POSITIONS[ad.position as keyof typeof AD_POSITIONS] || ad.position}</Badge>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{ad.impressions}</span>
                    <span className="flex items-center gap-1"><MousePointer className="h-3 w-3" />{ad.clicks}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════
           TAB 2 — CLIENT CAMPAIGNS
           ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="campaigns">
          <div className="mb-6">
            <Button onClick={() => { resetCampaignForm(); setShowCampaignForm(!showCampaignForm) }}>
              <Plus className="h-4 w-4 mr-2" />
              {showCampaignForm ? "Cancel" : "New Campaign"}
            </Button>
          </div>

          {showCampaignForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingCampaign ? "Edit Campaign" : "New Campaign"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Advertiser name */}
                <div className="space-y-2">
                  <Label>Advertiser Name</Label>
                  <Input value={advName} onChange={(e) => setAdvName(e.target.value)} placeholder="e.g. Acme Corp" />
                </div>

                {/* Ad Format */}
                <div className="space-y-2">
                  <Label>Ad Format</Label>
                  <div className="flex gap-2">
                    {(Object.entries(FORMAT_LABELS) as [AdFormat, string][]).map(([key, label]) => {
                      const Icon = FORMAT_ICONS[key]
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setAdvFormat(key)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition-colors ${
                            advFormat === key
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-input hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Format-specific fields */}
                {advFormat === "banner_image" && (
                  <>
                    <div className="space-y-2">
                      <Label>Banner Image</Label>
                      <div className="flex items-center gap-3">
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && uploadBannerImage(e.target.files[0])}
                        />
                        <Button variant="outline" onClick={() => bannerInputRef.current?.click()} disabled={uploadingBanner}>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingBanner ? "Uploading..." : "Upload Banner"}
                        </Button>
                        {advImageUrl && (
                          <div className="flex items-center gap-2">
                            <img src={advImageUrl} alt="Banner preview" className="h-10 rounded border" />
                            <button onClick={() => setAdvImageUrl("")} className="text-muted-foreground hover:text-foreground">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      {advImageUrl && (
                        <p className="text-xs text-muted-foreground truncate mt-1">{advImageUrl}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Destination URL</Label>
                      <Input value={advDestUrl} onChange={(e) => setAdvDestUrl(e.target.value)} placeholder="https://example.com" />
                    </div>
                  </>
                )}

                {advFormat === "custom_code" && (
                  <div className="space-y-2">
                    <Label>Ad Code (HTML/JS)</Label>
                    <Textarea
                      value={advCode}
                      onChange={(e) => setAdvCode(e.target.value)}
                      placeholder={`<div class="my-ad">\n  <a href="...">\n    <img src="..." />\n  </a>\n</div>`}
                      className="font-mono text-sm min-h-[150px]"
                    />
                  </div>
                )}

                {advFormat === "adsense" && (
                  <div className="space-y-2">
                    <Label>Google AdSense Code</Label>
                    <Textarea
                      value={advCode}
                      onChange={(e) => setAdvCode(e.target.value)}
                      placeholder={`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-xxxxxxxxxxxxxx"\n     data-ad-slot="xxxxxxxxxx"\n     data-ad-format="auto"></ins>\n<script>(adsbygoogle=window.adsbygoogle||[]).push({})</script>`}
                      className="font-mono text-sm min-h-[150px]"
                    />
                  </div>
                )}

                {/* Positions */}
                <div className="space-y-2">
                  <Label>Ad Positions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                    {Object.entries(AD_POSITIONS).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                        <input
                          type="checkbox"
                          checked={advPositions.includes(key)}
                          onChange={() => togglePosition(key)}
                          className="rounded"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dates & cap */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={advStartDate} onChange={(e) => setAdvStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={advEndDate} onChange={(e) => setAdvEndDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Impression Cap</Label>
                    <Input type="number" min="0" value={advImpCap} onChange={(e) => setAdvImpCap(e.target.value)} placeholder="Unlimited" />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => { resetCampaignForm(); setShowCampaignForm(false) }}>Cancel</Button>
                  <Button onClick={saveCampaign} disabled={!advName || (advFormat === "banner_image" && !advImageUrl)}>
                    {editingCampaign ? "Update" : "Create"} Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaigns List */}
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-lg font-medium">No client campaigns yet</p>
                <p className="text-sm text-muted-foreground">Create your first campaign to start showing client ads</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{c.advertiser_name}</p>
                          <Badge variant={c.is_active ? "default" : "secondary"}>
                            {c.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{formatBadge(c)}</Badge>
                        </div>
                        {c.positions && c.positions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {c.positions.slice(0, 3).map((pos) => (
                              <Badge key={pos} variant="secondary" className="text-[10px]">
                                {AD_POSITIONS[pos as keyof typeof AD_POSITIONS] || pos}
                              </Badge>
                            ))}
                            {c.positions.length > 3 && (
                              <span className="text-[10px] text-muted-foreground self-center">+{c.positions.length - 3} more</span>
                            )}
                          </div>
                        )}
                        {(c.start_date || c.end_date) && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {c.start_date && <span>{c.start_date}</span>}
                            {c.start_date && c.end_date && <span>→</span>}
                            {c.end_date && <span>{c.end_date}</span>}
                          </div>
                        )}
                        {c.daily_impression_cap && (
                          <p className="text-xs text-muted-foreground mt-0.5">Cap: {c.daily_impression_cap}/day</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right text-xs text-muted-foreground space-y-0.5">
                          <p className="flex items-center gap-1 justify-end"><Eye className="h-3 w-3" />{c.impressions}</p>
                          <p className="flex items-center gap-1 justify-end"><MousePointer className="h-3 w-3" />{c.clicks}</p>
                        </div>
                        <Switch checked={c.is_active} onCheckedChange={(v) => toggleCampaignActive(c.id, v)} />
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => openEditCampaign(c)} title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => copyCampaignAdCode(c)} title="Copy ad code">
                            {copiedCampaignId === c.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => deleteCampaign(c.id)} title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </Button>
                      </div>
                    </div>
                    {c.ad_code && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Ad Code</summary>
                        <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto max-h-32">{c.ad_code}</pre>
                      </details>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
