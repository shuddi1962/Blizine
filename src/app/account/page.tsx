"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/database"

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push("/login"); return }
      setUser(u)
      const { data: p } = await supabase.from("profiles").select("*").eq("id", u.id).single()
      if (p) {
        setProfile(p)
        setFullName(p.full_name || "")
        setUsername(p.username || "")
        setBio(p.bio || "")
      }
      setLoading(false)
    }
    load()
  }, [router, supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const { error } = await supabase.from("profiles").update({ full_name: fullName, username, bio }).eq("id", user!.id)
    if (!error) setSaved(true)
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p style={{ color: "var(--muted)" }}>Loading...</p></div>

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text)" }}>My Account</h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="text-sm font-medium hover:underline" style={{ color: "hsl(var(--accent))" }}>← Back to site</Link>
            {profile?.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium hover:underline" style={{ color: "hsl(var(--accent))" }}>Admin Panel</Link>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 mb-6" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-4 mb-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: "hsl(var(--accent))" }}>
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "?"}
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--text)" }}>{profile?.full_name || "User"}</p>
              <p className="text-xs capitalize" style={{ color: "var(--muted)" }}>Role: {profile?.role || "contributor"}</p>
            </div>
          </div>

          {saved && <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4">Profile updated successfully.</div>}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Bio</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent resize-none" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <button type="submit" disabled={saving} className="text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-opacity hover:opacity-90" style={{ background: "hsl(var(--accent))" }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="bg-card border rounded-2xl p-6" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Account Actions</h2>
          <div className="space-y-3">
            <Link href="/reading-list" className="block text-sm font-medium hover:underline" style={{ color: "hsl(var(--accent))" }}>My Reading List →</Link>
            <button onClick={handleSignOut} className="text-sm font-medium text-red-500 hover:underline">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  )
}
