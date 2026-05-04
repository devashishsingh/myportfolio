import type { Metadata } from 'next'
import { getAllPosts, getAllTags } from '../../lib/mdx'
import BlogFilter from '../../components/BlogFilter'

export const revalidate = 0

const baseUrl = process.env.BASE_URL || 'https://devashishsingh.com'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Long-form writing on cybersecurity, AI-led development, product strategy, and technical leadership by Devashish Singh.',
  keywords: ['cybersecurity blog', 'AI development', 'product strategy', 'technical writing', 'Devashish Singh', 'blog', 'indie dev'],
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: 'Blog — Devashish Singh',
    description: 'Long-form writing on cybersecurity, AI-led development, product strategy, and technical leadership.',
    url: `${baseUrl}/blog`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Blog — Devashish Singh',
    description: 'Long-form writing on cybersecurity, AI-led development, product strategy, and technical leadership.',
  },
}

export default async function Blog() {
  const [posts, allTags] = await Promise.all([getAllPosts(), getAllTags()])

  // Derive ordered unique categories
  const categoryCount: Record<string, number> = {}
  posts.forEach(p => { if (p.category) categoryCount[p.category] = (categoryCount[p.category] || 0) + 1 })
  const allCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat)

  // Sort tags by count descending
  const sortedTags = [...allTags].sort((a, b) => b.count - a.count)

  // JSON-LD: Blog + ItemList
  const blogListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Devashish Singh — Blog',
    description: 'Long-form writing on cybersecurity, AI-led development, product strategy, and technical leadership.',
    url: `${baseUrl}/blog`,
    author: {
      '@type': 'Person',
      name: 'Devashish Singh',
      url: baseUrl,
    },
    blogPost: posts.slice(0, 10).map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description || '',
      datePublished: p.date,
      url: `${baseUrl}/blog/${p.slug}`,
      keywords: (p.tags || []).join(', '),
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="container-wide blog-listing-page">
        <div className="blog-listing-header">
          <h1 className="display-font text-4xl blog-listing-title">Writing</h1>
          <p className="blog-listing-lead">Thoughtful long-form pieces on cybersecurity, product, AI, and systems thinking — powered by MDX and crafted for clarity.</p>
        </div>
        <BlogFilter posts={posts as any} allTags={sortedTags} allCategories={allCategories} />
      </section>
    </>
  )
}
