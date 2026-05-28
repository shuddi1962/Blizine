import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createClient()
  const { data: authUsers, error } = await supabase.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const emailMap: Record<string, string> = {}
  for (const u of authUsers.users) {
    emailMap[u.id] = u.email || ""
  }
  return NextResponse.json({ users: emailMap })
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { email, password, fullName, role, username } = await request.json()

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message || "Failed to create user" }, { status: 400 })
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    full_name: fullName,
    username: username || email.split("@")[0],
    role: role || "contributor",
    bio: "",
  })

  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, userId: authData.user.id })
}
