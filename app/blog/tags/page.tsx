import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags, getAllPosts } from '../../../lib/mdx'

const baseUrl = process.env.BASE_URL || 'https://devashishsingh.com'

export const metadata: Metadata = {
  title: 'All Tags — Blog',
  description: 'Browse all blog topics and tags by Devashish Singh — cybersecurity, AI, product strategy, indie dev, and more.',
  alternates: { canonical: `${baseUrl}/blog/tags` },
  openGraph: {
    title: 'All Tags — Devashish Singh Blog',
    description: 'Browse all blog topics and tags.',
    url: `${baseUrl}/blog/tags`,
    type: 'website',
  },
}

export default async function TagsIndex() {
  const [tags, posts] = await Promise.all([getAllTags(), getAllPosts()])
  const sortedTags = [...tags].sort((a, b) => b.count - a.count)

  // Group tags by first letter for alphabet navigation
  const grouped: Record<string, typeof tags> = {}
  sortedTags.forEach(t => {
    const letter = t.tag[0].toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(t)
  })

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: 'Tags', item: `${baseUrl}/blog/tags` },
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
          <span className="blog-breadcrumb-current">All Tags</span>
        </nav>

        <div className="blog-listing-header">
          <h1 className="display-font text-4xl blog-listing-title">All Tags</h1>
          <p className="blog-listing-lead">
            {tags.length} topics across {posts.length} posts. Click a tag to filter.
          </p>
        </div>

        {/* Top tags by count */}
        <div className="blog-tags-top">
          {sortedTags.slice(0, 12).map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/blog/tag/${encodeURIComponent(tag)}`}
              className="blog-tags-top-pill"
              style={{ '--tag-size': `${Math.min(1 + count * 0.15, 1.5)}rem` } as React.CSSProperties}
            >
              #{tag}
              <span className="blog-tags-top-count">{count}</span>
            </Link>
          ))}
        </div>

        {/* All tags grouped by letter */}
        <div className="blog-tags-groups">
          {Object.keys(grouped).sort().map(letter => (
            <div key={letter} className="blog-tags-group">
              <span className="blog-tags-group-letter">{letter}</span>
              <div className="blog-tags-group-list">
                {grouped[letter].map(({ tag, count }) => (
                  <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} className="blog-tag-item">
                    #{tag}
                    <span className="blog-tag-item-count">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
