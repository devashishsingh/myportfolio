import { NextResponse } from 'next/server'

export async function GET(){
  const baseUrl = process.env.BASE_URL || 'https://example.com'
  const pages = ['','about','services','work','blog','teaching','contact','privacy','terms']

  const urls = pages.map(p=>{
    const path = p? `/${p}` : ''
    return `<url><loc>${baseUrl}${path}</loc><changefreq>monthly</changefreq></url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  </urlset>`

  return new NextResponse(xml, {headers:{'content-type':'application/xml'}})
}
