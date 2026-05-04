import { NextResponse } from 'next/server'
import { getAllPosts } from '../../lib/mdx'

export const revalidate = 0

export async function GET(){
  const baseUrl = (process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://devashishsingh.com').replace(/\/$/, '')
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { path: '',           changefreq: 'weekly',  priority: '1.0', lastmod: today },
    { path: '/about',     changefreq: 'monthly', priority: '0.8', lastmod: today },
    { path: '/services',  changefreq: 'monthly', priority: '0.9', lastmod: today },
    { path: '/work',      changefreq: 'monthly', priority: '0.8', lastmod: today },
    { path: '/blog',      changefreq: 'weekly',  priority: '0.9', lastmod: today },
    { path: '/blog/tags', changefreq: 'weekly',  priority: '0.6', lastmod: today },
    { path: '/teaching',  changefreq: 'monthly', priority: '0.7', lastmod: today },
    { path: '/study',     changefreq: 'weekly',  priority: '0.95', lastmod: today },
    { path: '/community', changefreq: 'weekly',  priority: '0.8', lastmod: today },
    { path: '/community/join', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { path: '/book-session', changefreq: 'monthly', priority: '0.9', lastmod: today },
    { path: '/contact',   changefreq: 'monthly', priority: '0.7', lastmod: today },
    { path: '/privacy',   changefreq: 'yearly',  priority: '0.3', lastmod: today },
    { path: '/terms',     changefreq: 'yearly',  priority: '0.3', lastmod: today },
  ]

  let posts: { slug: string; date?: string }[] = []
  try { posts = await getAllPosts() } catch {}

  const staticUrls = staticPages.map(p =>
    `  <url>\n    <loc>${baseUrl}${p.path}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  ).join('\n')

  const postUrls = posts.map(p => {
    const lastmod = p.date ? new Date(p.date).toISOString().split('T')[0] : today
    return `  <url>\n    <loc>${baseUrl}/blog/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticUrls}\n${postUrls}\n</urlset>`

  return new NextResponse(xml, { headers: { 'content-type': 'application/xml', 'cache-control': 'public, max-age=3600' } })
}
