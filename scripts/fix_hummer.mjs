import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const supabase = createClient(
  'https://xkhvojjogoeuvrifekwr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraHZvampvZ29ldXZyaWZla3dyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU1MjYzMywiZXhwIjoyMDk1MTI4NjMzfQ.06p7J_Gr9CW3nyGc1f0HGj8hXad5U8nJ9yt9XKC9aa8'
)

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

const decodedUrl = 'https://www.cnet.com/a/img/resize/3790c42ebd1fb16f57a279eade6e503a20444f5e/hub/2022/12/30/11fc48b2-0acb-47e0-b57e-391d61cb3467/hummer-ev-promo.jpg?auto=webp&fit=crop&height=614&width=1092'

const res = await fetch(decodedUrl, {
  headers: { 'User-Agent': 'Mozilla/5.0' },
  signal: AbortSignal.timeout(15000),
})

if (!res.ok) {
  console.log('HTTP', res.status)
  process.exit(1)
}

let buf = Buffer.from(await res.arrayBuffer())
buf = await watermark(buf)

const filename = `post-hummer-fixed.jpg`
await supabase.storage.from('post-images').upload(filename, buf, {
  contentType: 'image/jpeg',
  upsert: true,
})

const { data: pub } = supabase.storage.from('post-images').getPublicUrl(filename)
await supabase.from('posts').update({ featured_image: pub.publicUrl }).eq('id', 'e3c1e9f5-e7da-4fb7-ab7b-19bbbfd83978')
console.log('Fixed:', pub.publicUrl)
