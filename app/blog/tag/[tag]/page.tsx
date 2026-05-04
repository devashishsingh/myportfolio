import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostsByTag, getAllTags } from '../../../../lib/mdx'

const baseUrl = process.env.BASE_URL || 'https://devashishsingh.com'

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map(t => ({ tag: t.tag }))
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag)
  const posts = await getPostsByTag(tag)
  return {
    title: `#${tag} — Blog`,
    description: `All ${posts.length} posts tagged "${tag}" by Devashish Singh — cybersecurity, AI, product strategy, and indie dev.`,
    keywords: [tag, 'Devashish Singh', 'blog', 'articles'],
    alternates: { canonical: `${baseUrl}/blog/tag/${encodeURIComponent(tag)}` },
    openGraph: {
      title: `#${tag} — Devashish Singh Blog`,
      description: `${posts.length} post${posts.length !== 1 ? 's' : ''} tagged "${tag}".`,
      url: `${baseUrl}/blog/tag/${encodeURIComponent(tag)}`,
      type: 'website',
    },
  }
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  const posts = await getPostsByTag(tag)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: `#${tag}`, item: `${baseUrl}/blog/tag/${encodeURIComponent(tag)}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="container-wide blog-listing-page">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="blog-breadcrumb-link">Home</Link>
          <span className="blog-breadcrumb-sep">›</span>
          <Link href="/blog" className="blog-breadcrumb-link">Blog</Link>
          <span className="blog-breadcrumb-sep">›</span>
          <span className="blog-breadcrumb-current">#{tag}</span>
        </nav>

        <div className="blog-listing-header">
          <div className="blog-tag-page-badge">#{tag}</div>
          <h1 className="display-font text-4xl blog-listing-title">{tag}</h1>
          <p className="blog-listing-lead">
            {posts.length} post{posts.length !== 1 ? 's' : ''} tagged <strong>#{tag}</strong>.
          </p>
          <Link href="/blog/tags" className="blog-tag-all-link">Browse all tags →</Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 mt-8">No posts found for this tag.</p>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {posts.map((p: any) => (
              <article key={p.slug} className="blog-card">
                <div className="blog-card-meta">
                  <span>{p.date}</span>
                  <span className="blog-card-dot">·</span>
                  <span>{p.readingTime} min read</span>
                  {p.category && (
                    <><span className="blog-card-dot">·</span><span>{p.category}</span></>
                  )}
                </div>
                <Link href={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 className="blog-card-title">{p.title}</h3>
                </Link>
                {p.description && <p className="blog-card-excerpt">{p.description}</p>}
                {p.tags && p.tags.length > 0 && (
                  <div className="blog-card-tags">
                    {p.tags.slice(0, 4).map((t: string) => (
                      <Link key={t} href={`/blog/tag/${encodeURIComponent(t)}`} className={`blog-card-tag${t === tag ? ' active' : ''}`}>#{t}</Link>
                    ))}
                  </div>
                )}
                <Link href={`/blog/${p.slug}`} className="blog-card-read">Read more →</Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
