import { getPostBySlug, getPostSlugs, getAllPosts } from '../../../lib/mdx'
import MDXContent from '../../../components/MDXContent'
import BlogEngagement from '../../../components/BlogEngagement'
import CommentsSection from '../../../components/CommentsSection'
import Link from 'next/link'

export const dynamicParams = true
export const revalidate = 0

export async function generateStaticParams(){
  const posts = await getAllPosts()
  return posts.map(p=>({slug: p.slug}))
}

export async function generateMetadata({params}:{params:{slug:string}}){
  const post = await getPostBySlug(params.slug)
  const fm = post.frontMatter
  const baseUrl = process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  const fs = require('fs')
  const path = require('path')
  const publicOg = path.join(process.cwd(), 'public', 'og', `${params.slug}.png`)
  const ogUrl = (fm as any).ogImage ? (fm as any).ogImage : (fs.existsSync(publicOg) ? `${baseUrl}/og/${params.slug}.png` : `${baseUrl}/og/png/${params.slug}`)
  const postUrl = `${baseUrl}/blog/${params.slug}`
  return {
    title: fm.title,
    description: fm.description,
    authors: fm.author ? [{ name: fm.author }] : undefined,
    keywords: fm.tags || [],
    alternates: { canonical: postUrl },
    openGraph: {
      title: fm.title,
      description: fm.description,
      url: postUrl,
      type: 'article',
      publishedTime: fm.date,
      authors: fm.author ? [fm.author] : undefined,
      tags: fm.tags || [],
      images: ogUrl ? [{ url: ogUrl, width: 1200, height: 630, alt: fm.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fm.title,
      description: fm.description,
      images: ogUrl ? [ogUrl] : undefined,
    },
  }
}

export default async function Post({params}:{params:{slug:string}}){
  const post = await getPostBySlug(params.slug)
  const fm = post.frontMatter
  const baseUrl = process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: fm.title,
    description: fm.description,
    datePublished: fm.date,
    author: { '@type': 'Person', name: fm.author },
    url: `${baseUrl}/blog/${params.slug}`,
    keywords: fm.tags?.join(', '),
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}} />
    <article className="blog-post-page container-wide">
      <Link href="/blog" className="blog-back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        Back to Blog
      </Link>

      <header className="blog-post-header">
        {fm.category && <span className="blog-post-category">{fm.category}</span>}
        <h1 className="blog-post-title">{fm.title}</h1>
        <div className="blog-post-meta">
          <span>{fm.author}</span>
          <span className="blog-post-meta-dot">·</span>
          <span>{fm.date}</span>
          <span className="blog-post-meta-dot">·</span>
          <span>{fm.readingTime} min read</span>
        </div>
        {fm.tags && <div className="blog-post-tags">{fm.tags.map((t:string)=> <Link key={t} href={`/blog/tag/${t}`} className="blog-post-tag">#{t}</Link>)}</div>}
      </header>

      <div className="blog-post-content">
        <MDXContent source={post.content} />
      </div>

      {/* Like, Share & Copy */}
      <BlogEngagement slug={params.slug} title={fm.title} baseUrl={baseUrl} />

      {/* Comments */}
      <CommentsSection slug={params.slug} />
    </article>
    </>
  )
}
