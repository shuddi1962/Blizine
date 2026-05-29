import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const SUPABASE_URL = 'https://xkhvojjogoeuvrifekwr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraHZvampvZ29ldXZyaWZla3dyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU1MjYzMywiZXhwIjoyMDk1MTI4NjMzfQ.06p7J_Gr9CW3nyGc1f0HGj8hXad5U8nJ9yt9XKC9aa8'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

async function watermark(buf) {
  const image = sharp(buf)
  const meta = await image.metadata()
  const w = meta.width || 1200
  const h = meta.height || 800
  const svg = `<svg width="${w}" height="${h}">
    <text x="${w - 20}" y="${h - 20}"
      font-family="Arial" font-size="${Math.max(24, Math.round(w / 25))}"
      font-weight="bold" fill="rgba(255,255,255,0.45)"
      text-anchor="end" dominant-baseline="baseline">Blizine</text>
  </svg>`
  return image.composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).toBuffer()
}

// 1. Watermark images already in storage bucket
const { data: objects } = await supabase.storage.from('post-images').list()
for (const obj of objects || []) {
  console.log(`Watermarking stored: ${obj.name}`)
  const { data } = await supabase.storage.from('post-images').download(obj.name)
  if (!data) continue
  const buf = Buffer.from(await data.arrayBuffer())
  const wm = await watermark(buf)
  await supabase.storage.from('post-images').upload(obj.name, wm, {
    contentType: obj.metadata?.mimetype || 'image/jpeg',
    upsert: true,
  })
  console.log(`  Done`)
}

// 2. Watermark hotlinked images for posts without storage image
const { data: posts } = await supabase
  .from('posts')
  .select('id, title, featured_image, category_id')
  .not('source_url', 'is', null)

for (const post of posts || []) {
  const url = post.featured_image
  if (!url || url.includes(SUPABASE_URL)) continue // already in storage
  console.log(`\nProcessing: ${post.title}`)
  console.log(`  URL: ${url}`)
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) })
    if (!res.ok) { console.log(`  HTTP ${res.status}`); continue }
    let buf = Buffer.from(await res.arrayBuffer())
    buf = await watermark(buf)
    const ext = url.includes('.png') ? '.png' : '.jpg'
    const filename = `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const { error: upErr } = await supabase.storage.from('post-images').upload(filename, buf, {
      contentType: res.headers.get('content-type') || 'image/jpeg',
      upsert: true,
    })
    if (upErr) { console.log(`  Upload fail: ${upErr.message}`); continue }
    const { data: pub } = supabase.storage.from('post-images').getPublicUrl(filename)
    await supabase.from('posts').update({ featured_image: pub.publicUrl }).eq('id', post.id)
    console.log(`  Watermarked -> ${pub.publicUrl}`)
  } catch (e) {
    console.log(`  Error: ${e.message}`)
  }
}

console.log('\nDone!')
