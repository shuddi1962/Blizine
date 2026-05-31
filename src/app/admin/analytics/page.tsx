'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  Eye, FileText, Activity, RefreshCw, AlertCircle, Zap,
  BarChart3, Globe, MousePointerClick, TrendingUp, Rss,
  PieChart as PieIcon,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'

function KpiCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: color + '20' }}>
          {icon}
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>{children}</div>
}

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
      {icon}{children}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-8 bg-gray-200 rounded" />
      <div className="h-8 bg-gray-200 rounded w-5/6" />
    </div>
  )
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
      <AlertCircle className="h-10 w-10 text-[#EA4335] mx-auto mb-3" />
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      <button onClick={onRetry} className="px-4 py-2 bg-[#6366F1] rounded-lg text-sm text-white hover:bg-[#5457E5] transition-colors">
        Retry
      </button>
    </div>
  )
}

function fmt(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(Math.round(n))
}

const tooltipStyle = {
  contentStyle: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#6B7280' },
  itemStyle: { color: '#111827' },
}

const COLORS = ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#6366F1', '#14B8A6', '#EC4899', '#F59E0B']
const PIE_COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#EC4899', '#4285F4', '#34A853']

function ChartCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <SectionLabel icon={icon}>{title}</SectionLabel>
      <div className="h-72">{children}</div>
    </Card>
  )
}

function BarListCard({ title, icon, data, valueLabel }: { title: string; icon: React.ReactNode; data: { name: string; value: number }[]; valueLabel: string }) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <SectionLabel icon={icon}>{title}</SectionLabel>
        <div className="flex flex-col items-center justify-center h-48 text-sm text-gray-400">
          <BarChart3 className="h-8 w-8 mb-2 text-gray-300" />
          <p>No data yet</p>
          <p className="text-xs mt-1">Data appears as visitors browse your site</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <SectionLabel icon={icon}>{title}</SectionLabel>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#8B9EC7', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
            <Tooltip {...tooltipStyle} formatter={(v: any) => [v, valueLabel]} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((_, i) => (
                <rect key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function DonutCard({ title, icon, data }: { title: string; icon: React.ReactNode; data: { name: string; value: number }[] }) {
  if (!data || data.length === 0) {
    return null
  }

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Card className="p-6">
      <SectionLabel icon={icon}>{title}</SectionLabel>
      <div className="flex flex-col items-center">
        <div className="h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%" cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v} (${Math.round((v / total) * 100)}%)`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-3">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span className="text-gray-700">{d.name}</span>
              <span className="text-gray-400">({Math.round((d.value / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function GaugeCard({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(value / max, 1)
  const color = pct >= 0.9 ? '#34A853' : pct >= 0.5 ? '#FBBC04' : '#EA4335'
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <div className="text-xs text-gray-500 mb-2">{label}</div>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct * 100}%`, background: color }} />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastFetch, setLastFetch] = useState('')
  const [days, setDays] = useState(28)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setLastFetch(new Date().toLocaleTimeString())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => { fetchData() }, [fetchData])

  const b = data?.blizine
  const a = data?.analytics
  const ps = data?.pagespeed

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time site analytics from your database
            {lastFetch && <span className="ml-2">&middot; Updated {lastFetch}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 28, 90].map(d => (
            <button key={d} onClick={() => setDays(d)}
              style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                background: days === d ? '#6366F1' : '#fff',
                border: `1px solid ${days === d ? '#6366F1' : '#D1D5DB'}`,
                color: days === d ? 'white' : '#6B7280',
              }}>
              {d}d
            </button>
          ))}
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366F1] rounded-lg text-xs text-white hover:bg-[#5457E5] disabled:opacity-50 transition-colors">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <ErrorCard message={error} onRetry={fetchData} />}

      {loading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => <Card key={i} className="p-5"><Skeleton /></Card>)}
        </div>
      ) : (
        <>
          {b && (
            <>
              <SectionLabel icon={<Activity className="h-4 w-4 text-[#6366F1]" />}>
                Overview &mdash; last {days} days
              </SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Total Views" value={fmt(b.totalViews || 0)}
                  icon={<Eye className="h-5 w-5" style={{ color: '#4285F4' }} />} color="#4285F4" />
                <KpiCard label="Published Posts" value={b.publishedPosts || 0}
                  icon={<FileText className="h-5 w-5" style={{ color: '#34A853' }} />} color="#34A853" />
                <KpiCard label="Draft Posts" value={b.draftPosts || 0}
                  icon={<FileText className="h-5 w-5" style={{ color: '#FBBC04' }} />} color="#FBBC04" />
                <KpiCard label="Articles Today" value={b.todayArticles || 0}
                  icon={<TrendingUp className="h-5 w-5" style={{ color: '#6366F1' }} />} color="#6366F1" />
                <KpiCard label="Feed Posts" value={fmt(b.totalFeedPosts || 0)}
                  icon={<Rss className="h-5 w-5" style={{ color: '#EA4335' }} />} color="#EA4335" />
                <KpiCard label="Gemini Today" value={`${b.geminiToday || 0}/20`}
                  icon={<Activity className="h-5 w-5" style={{ color: '#14B8A6' }} />} color="#14B8A6" />
              </div>
            </>
          )}

          {a && (
            <>
              <SectionLabel icon={<BarChart3 className="h-4 w-4 text-[#6366F1]" />}>
                Page views &mdash; {a.totalPageViews.toLocaleString()} total
              </SectionLabel>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Views over time" icon={<Activity className="h-4 w-4 text-[#6366F1]" />}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={a.viewsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" tick={{ fill: '#8B9EC7', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#8B9EC7', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip {...tooltipStyle} />
                      <Area type="monotone" dataKey="views" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <DonutCard
                  title="Traffic sources"
                  icon={<Globe className="h-4 w-4 text-[#6366F1]" />}
                  data={a.trafficSourceDist}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarListCard
                  title="Top pages"
                  icon={<FileText className="h-4 w-4 text-[#6366F1]" />}
                  data={a.topPages}
                  valueLabel="Views"
                />
                <BarListCard
                  title="Top referrers"
                  icon={<MousePointerClick className="h-4 w-4 text-[#6366F1]" />}
                  data={a.topReferrers}
                  valueLabel="Visits"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarListCard
                  title="Top countries"
                  icon={<Globe className="h-4 w-4 text-[#6366F1]" />}
                  data={a.topCountries}
                  valueLabel="Visitors"
                />
                <DonutCard
                  title="Post status"
                  icon={<PieIcon className="h-4 w-4 text-[#6366F1]" />}
                  data={b?.postStatusDist}
                />
              </div>

              <BarListCard
                title="Most viewed posts"
                icon={<Eye className="h-4 w-4 text-[#6366F1]" />}
                data={(b?.topPosts || []).map((p: any) => ({ name: p.title.length > 40 ? p.title.slice(0, 37) + '...' : p.title, value: p.views }))}
                valueLabel="Views"
              />
            </>
          )}

          {ps && (
            <Card className="p-6">
              <SectionLabel icon={<Zap className="h-4 w-4 text-[#6366F1]" />}>
                PageSpeed Insights &middot; blizine.com
              </SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <GaugeCard label="Performance" value={ps.performance} max={100} />
                <GaugeCard label="Accessibility" value={ps.accessibility} max={100} />
                <GaugeCard label="SEO score" value={ps.seo} max={100} />
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-2">LCP</div>
                  <div className="text-xl font-bold text-[#6366F1]">{ps.lcp}</div>
                  <div className="text-xs mt-1 text-gray-400">Largest Contentful Paint</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-2">INP</div>
                  <div className="text-xl font-bold text-[#6366F1]">{ps.inp}</div>
                  <div className="text-xs mt-1 text-gray-400">Interaction to Next Paint</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-2">CLS</div>
                  <div className="text-xl font-bold text-[#6366F1]">{ps.cls}</div>
                  <div className="text-xs mt-1 text-gray-400">Cumulative Layout Shift</div>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
