import { getPostBySlug, getPostSlugs, getAllPosts } from '../../../lib/mdx'
import MDXContent from '../../../components/MDXContent'
import BlogEngagement from '../../../components/BlogEngagement'
import CommentsSection from '../../../components/CommentsSection'
import ReadingProgress from '../../../components/ReadingProgress'
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

  const fs = require('fs')
  const path = require('path')
  const publicOg = path.join(process.cwd(), 'public', 'og', `${params.slug}.png`)
  const ogUrl = (fm as any).ogImage
    ? (fm as any).ogImage
    : (fs.existsSync(publicOg) ? `${baseUrl}/og/${params.slug}.png` : `${baseUrl}/og/png/${params.slug}`)

  const wordCount = post.content.split(/\s+/).filter(Boolean).length
  const postUrl = `${baseUrl}/blog/${params.slug}`

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    headline: fm.title,
    description: fm.description,
    datePublished: fm.date,
    dateModified: fm.updatedAt || fm.date,
    author: {
      '@type': 'Person',
      name: fm.author || 'Devashish Singh',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Devashish Singh',
      url: baseUrl,
    },
    url: postUrl,
    keywords: (fm.tags || []).join(', '),
    articleSection: fm.category || undefined,
    wordCount,
    timeRequired: `PT${fm.readingTime}M`,
    image: ogUrl ? { '@type': 'ImageObject', url: ogUrl, width: 1200, height: 630 } : undefined,
    inLanguage: 'en',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: fm.title, item: postUrl },
    ],
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(blogPostingJsonLd)}} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbJsonLd)}} />
    <ReadingProgress />
    <article className="blog-post-page container-wide">
      <nav className="blog-breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="blog-breadcrumb-link">Home</Link>
        <span className="blog-breadcrumb-sep">›</span>
        <Link href="/blog" className="blog-breadcrumb-link">Blog</Link>
        {fm.category && (
          <>
            <span className="blog-breadcrumb-sep">›</span>
            <Link href={`/blog/tag/${encodeURIComponent(fm.category)}`} className="blog-breadcrumb-link">{fm.category}</Link>
          </>
        )}
      </nav>

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
          <time dateTime={fm.date}>{fm.date}</time>
          <span className="blog-post-meta-dot">·</span>
          <span>{fm.readingTime} min read</span>
          <span className="blog-post-meta-dot">·</span>
          <span>{wordCount.toLocaleString()} words</span>
        </div>
        {fm.tags && fm.tags.length > 0 && (
          <div className="blog-post-tags">
            {fm.tags.map((t: string) => (
              <Link key={t} href={`/blog/tag/${encodeURIComponent(t)}`} className="blog-post-tag">#{t}</Link>
            ))}
          </div>
        )}
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
