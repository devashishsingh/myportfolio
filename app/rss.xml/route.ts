import { NextResponse } from 'next/server'
import { getAllPosts } from '../../lib/mdx'

export async function GET(){
  const baseUrl = process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  const posts = await getAllPosts()

  const items = posts.map(p=>{
    const url = `${baseUrl}/blog/${p.slug}`
    return `<item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description || '')}</description>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Your Name — Writing</title>
      <link>${baseUrl}</link>
      <description>Latest posts and insights</description>
      ${items}
    </channel>
  </rss>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/rss+xml' } })
}

function escapeXml(str:any){
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
