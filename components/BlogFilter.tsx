'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  slug: string
  title: string
  description?: string
  date?: string
  category?: string
  tags?: string[]
  readingTime?: number
}

interface BlogFilterProps {
  posts: Post[]
  allTags: { tag: string; count: number }[]
  allCategories: string[]
}

/**
 * Interest groups are auto-derived from post tags + titles using keyword
 * matching. Each interest gets a friendly label and emoji. We only show
 * an interest pill if at least one post in the corpus matches it.
 */
const INTEREST_DEFINITIONS: {
  id: string
  label: string
  emoji: string
  match: RegExp
}[] = [
  { id: 'security',     label: 'Cybersecurity',     emoji: '🔐', match: /\b(security|cyber|cybersecurity|infosec|dmarc|spf|dkim|phish|threat|vuln|owasp|encrypt|auth|zero[- ]?trust)\b/i },
  { id: 'ai',           label: 'AI & ML',           emoji: '🤖', match: /\b(ai|artificial[- ]intelligence|ml|machine[- ]learning|llm|gpt|prompt|model|agent|neural|copilot)\b/i },
  { id: 'dev',          label: 'Developer Life',    emoji: '💻', match: /\b(developer|dev|coding|code|github|open[- ]source|engineer|programming|software)\b/i },
  { id: 'indie',        label: 'Indie / Startup',   emoji: '🚀', match: /\b(indie|startup|founder|bootstrap|build[- ]in[- ]public|solo|entrepreneur|saas|product[- ]hunt)\b/i },
  { id: 'product',      label: 'Product',           emoji: '🎯', match: /\b(product|strategy|ux|design|feature|roadmap|launch|user|customer)\b/i },
  { id: 'mindset',      label: 'Mindset',           emoji: '🧠', match: /\b(mindset|motivation|productivity|habits|career|growth|leadership|burnout)\b/i },
  { id: 'web',          label: 'Web & Frontend',    emoji: '🌐', match: /\b(web|frontend|react|next|nextjs|typescript|javascript|css|tailwind|html)\b/i },
  { id: 'business',     label: 'Business',          emoji: '📈', match: /\b(business|marketing|sales|pricing|revenue|monetization|brand|email[- ]marketing)\b/i },
  { id: 'tutorial',     label: 'How-to & Tutorial', emoji: '🛠️', match: /\b(how[- ]to|tutorial|guide|step[- ]by[- ]step|walkthrough|setup|configure)\b/i },
]

const TASTE_KEY = 'blog-taste-v1'
type Taste = Record<string, number>

function loadTaste(): Taste {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(TASTE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveTaste(taste: Taste) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(TASTE_KEY, JSON.stringify(taste)) } catch {}
}

function postMatchesInterest(post: Post, regex: RegExp) {
  const haystack = [
    post.title || '',
    post.description || '',
    post.category || '',
    ...(post.tags || []),
  ].join(' ')
  return regex.test(haystack)
}

export default function BlogFilter({ posts, allTags, allCategories }: BlogFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeInterest, setActiveInterest] = useState<string | null>(null)
  const [forYou, setForYou] = useState(false)
  const [search, setSearch] = useState('')
  const [taste, setTaste] = useState<Taste>({})

  useEffect(() => { setTaste(loadTaste()) }, [])

  // Compute which interests actually exist in this corpus + their post counts
  const interests = useMemo(() => {
    return INTEREST_DEFINITIONS
      .map(def => ({
        ...def,
        count: posts.filter(p => postMatchesInterest(p, def.match)).length,
      }))
      .filter(i => i.count > 0)
  }, [posts])

  const hasTaste = Object.keys(taste).length > 0

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    function scorePost(post: Post): number {
      let score = 0
      for (const t of post.tags || []) {
        score += taste[`tag:${t.toLowerCase()}`] || 0
      }
      for (const i of interests) {
        if (postMatchesInterest(post, i.match)) {
          score += taste[`interest:${i.id}`] || 0
        }
      }
      return score
    }

    let list = posts.filter(p => {
      const matchTag = !activeTag || (Array.isArray(p.tags) && p.tags.includes(activeTag))
      const matchCat = !activeCategory || p.category === activeCategory
      const matchInterest = !activeInterest || (() => {
        const def = INTEREST_DEFINITIONS.find(i => i.id === activeInterest)
        return def ? postMatchesInterest(p, def.match) : true
      })()
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      return matchTag && matchCat && matchInterest && matchSearch
    })

    if (forYou && hasTaste) {
      list = list
        .map(p => ({ p, s: scorePost(p) }))
        .sort((a, b) => b.s - a.s)
        .filter(x => x.s > 0)
        .map(x => x.p)
    }
    return list
  }, [posts, activeTag, activeCategory, activeInterest, search, forYou, taste, interests, hasTaste])

  function toggleTag(tag: string) { setActiveTag(prev => (prev === tag ? null : tag)) }
  function toggleCategory(cat: string) { setActiveCategory(prev => (prev === cat ? null : cat)) }
  function toggleInterest(id: string) {
    setActiveInterest(prev => (prev === id ? null : id))
    const next = { ...taste, [`interest:${id}`]: (taste[`interest:${id}`] || 0) + 2 }
    setTaste(next); saveTaste(next)
  }

  function recordRead(post: Post) {
    const next: Taste = { ...taste }
    for (const t of post.tags || []) {
      const k = `tag:${t.toLowerCase()}`
      next[k] = (next[k] || 0) + 1
    }
    for (const i of interests) {
      if (postMatchesInterest(post, i.match)) {
        const k = `interest:${i.id}`
        next[k] = (next[k] || 0) + 1
      }
    }
    setTaste(next); saveTaste(next)
  }

  function resetTaste() {
    setTaste({}); saveTaste({}); setForYou(false)
  }

  return (
    <div className="blog-filter-root">
      {/* Search bar */}
      <div className="blog-filter-search">
        <svg className="blog-filter-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          placeholder="Search posts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="blog-filter-input"
          aria-label="Search blog posts"
        />
        {search && (
          <button className="blog-filter-clear" onClick={() => setSearch('')} aria-label="Clear search">✕</button>
        )}
      </div>

      {/* Interest bar — auto-generated from tags + titles */}
      {interests.length > 0 && (
        <div className="blog-interest-bar" role="group" aria-label="Filter by interest">
          <span className="blog-interest-label">Interests</span>
          <button
            className={`blog-interest-pill${forYou ? ' active' : ''}`}
            onClick={() => setForYou(v => !v)}
            disabled={!hasTaste}
            title={hasTaste ? 'Personalized to what you read' : 'Read a few posts to unlock'}
          >
            <span className="blog-interest-emoji">✨</span>
            For You
          </button>
          {interests.map(i => (
            <button
              key={i.id}
              className={`blog-interest-pill${activeInterest === i.id ? ' active' : ''}`}
              onClick={() => toggleInterest(i.id)}
              title={`${i.count} post${i.count !== 1 ? 's' : ''}`}
            >
              <span className="blog-interest-emoji">{i.emoji}</span>
              {i.label}
              <span className="blog-interest-count">{i.count}</span>
            </button>
          ))}
          {hasTaste && (
            <button
              className="blog-interest-pill"
              onClick={resetTaste}
              title="Forget my reading history"
              style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}
            >
              Reset taste
            </button>
          )}
        </div>
      )}
      {forYou && !hasTaste && (
        <p className="blog-foryou-hint">Open a few posts and we&apos;ll personalize this list for you.</p>
      )}

      {/* Category filter */}
      {allCategories.length > 0 && (
        <div className="blog-filter-row" role="group" aria-label="Filter by category">
          <button
            className={`blog-filter-pill${!activeCategory ? ' active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              className={`blog-filter-pill${activeCategory === cat ? ' active' : ''}`}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="blog-filter-tags" role="group" aria-label="Filter by tag">
          {allTags.map(({ tag, count }) => (
            <button
              key={tag}
              className={`blog-tag-filter${activeTag === tag ? ' active' : ''}`}
              onClick={() => toggleTag(tag)}
              title={`${count} post${count !== 1 ? 's' : ''}`}
            >
              #{tag}
              <span className="blog-tag-filter-count">{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active filters summary + clear */}
      {(activeTag || activeCategory || activeInterest || search || forYou) && (
        <div className="blog-filter-active">
          <span className="blog-filter-count">
            {filtered.length} {filtered.length === 1 ? 'post' : 'posts'} found
          </span>
          <button
            className="blog-filter-reset"
            onClick={() => { setActiveTag(null); setActiveCategory(null); setActiveInterest(null); setSearch(''); setForYou(false) }}
          >
            Clear filters ✕
          </button>
        </div>
      )}

      {/* Post count (when no filter active) */}
      {!activeTag && !activeCategory && !activeInterest && !search && !forYou && (
        <p className="blog-filter-total">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
      )}

      {/* Post grid */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="blog-filter-empty col-span-2">
            <p>No posts match your filters.</p>
            <button
              className="blog-filter-reset"
              onClick={() => { setActiveTag(null); setActiveCategory(null); setActiveInterest(null); setSearch(''); setForYou(false) }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map(post => (
            <article key={post.slug} className="blog-card">
              <div className="blog-card-meta">
                <span>{post.date}</span>
                <span className="blog-card-dot">·</span>
                <span>{post.readingTime} min read</span>
                {post.category && (
                  <>
                    <span className="blog-card-dot">·</span>
                    <button
                      className={`blog-card-category-btn${activeCategory === post.category ? ' active' : ''}`}
                      onClick={() => toggleCategory(post.category!)}
                    >
                      {post.category}
                    </button>
                  </>
                )}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                onClick={() => recordRead(post)}
              >
                <h3 className="blog-card-title">{post.title}</h3>
              </Link>
              {post.description && <p className="blog-card-excerpt">{post.description}</p>}
              {post.tags && post.tags.length > 0 && (
                <div className="blog-card-tags">
                  {post.tags.slice(0, 4).map((t: string) => (
                    <button
                      key={t}
                      className={`blog-card-tag${activeTag === t ? ' active' : ''}`}
                      onClick={() => toggleTag(t)}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className="blog-card-read"
                onClick={() => recordRead(post)}
              >
                Read more →
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
