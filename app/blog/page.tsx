import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '../../lib/mdx'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Long-form writing on cybersecurity, AI-led development, product strategy, and technical leadership by Devashish Singh.',
  keywords: ['cybersecurity blog', 'AI development', 'product strategy', 'technical writing', 'Devashish Singh', 'blog', 'indie dev'],
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Devashish Singh',
    description: 'Long-form writing on cybersecurity, AI-led development, product strategy, and technical leadership.',
    url: '/blog',
    type: 'website',
  },
}

export default async function Blog(){
  const posts = await getAllPosts()

  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-4xl">Writing</h1>
      <p className="mt-4 text-gray-700 max-w-3xl">Thoughtful long-form pieces on product, design and systems thinking. Posts are powered by MDX and crafted for clarity and searchability.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {posts.map(post=> (
          <article key={post.slug} className="blog-card">
            <div className="blog-card-meta">
              <span>{post.date}</span>
              <span className="blog-card-dot">·</span>
              <span>{post.readingTime} min read</span>
            </div>
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 className="blog-card-title">{post.title}</h3>
            </Link>
            {post.description && <p className="blog-card-excerpt">{post.description}</p>}
            {post.tags && <div className="blog-card-tags">{(post.tags||[]).slice(0,4).map((t:string)=> <Link key={t} href={`/blog/tag/${encodeURIComponent(t)}`} className="blog-card-tag">#{t}</Link>)}</div>}
            <Link href={`/blog/${post.slug}`} className="blog-card-read">Read more →</Link>
          </article>
        ))}
      </div>
    </section>
  )
}
