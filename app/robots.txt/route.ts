import { NextResponse } from 'next/server'

export async function GET(){
  const siteUrl = (process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://devashishsingh.com').replace(/\/$/, '')
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /api/
Disallow: /og/

# Block AI training crawlers
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: ${siteUrl}/sitemap.xml
`
  return new NextResponse(content, { headers: { 'content-type': 'text/plain' } })
}
