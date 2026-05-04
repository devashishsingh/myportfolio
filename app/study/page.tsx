"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  tagline?: string
  category: string // e.g. 'Cybersecurity', 'AI', 'Indie SaaS', 'Cloud', 'Career'
  level?: 'Beginner' | 'Intermediate' | 'Advanced'
  duration?: string
  outcomes?: string[]
  projects?: string[]
  videoUrl?: string // YouTube embed URL or empty for "coming soon"
  fee?: string
}

// Add courses here. Until then the page shows a graceful empty state.
const COURSES: Course[] = []

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

export default function StudyTogetherPage() {
  const [selected, setSelected] = useState<Course | null>(null)
  const [form, setForm] = useState({ fullName: '', email: '', motivation: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Filters
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeLevel, setActiveLevel] = useState<string>('All')

  // Build categories dynamically from the courses that actually exist.
  // No courses → no category filter row at all.
  const CATEGORIES = useMemo(() => {
    const set = new Set<string>()
    for (const c of COURSES) {
      if (c.category) set.add(c.category)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [])

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COURSES.filter(c => {
      if (activeCategory !== 'All' && c.category !== activeCategory) return false
      if (activeLevel !== 'All' && c.level !== activeLevel) return false
      if (!q) return true
      const hay = [
        c.title,
        c.tagline || '',
        c.category,
        c.level || '',
        ...(c.outcomes || []),
        ...(c.projects || []),
      ].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [query, activeCategory, activeLevel])

  function openInterest(course: Course) {
    setSelected(course)
    setForm({ fullName: '', email: '', motivation: '' })
    setStatus('idle')
    setErrorMsg('')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/study/interest', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          motivation: form.motivation,
          courseId: selected.id,
          courseTitle: selected.title,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
        setErrorMsg(json.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <section className="container-wide" style={{ paddingTop: 60, paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ maxWidth: 760, margin: '0 auto 48px', textAlign: 'center' }}>
        <p className="muted-label" style={{ marginBottom: 12 }}>Let&apos;s Study Together</p>
        <h1 className="display-font" style={{ fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.1, marginBottom: 12 }}>
          Less theory. More projects. Real outcomes.
        </h1>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: '0.01em' }}>
          Your one-stop shop for every learning — cybersecurity, AI, indie SaaS and more.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 17, lineHeight: 1.7, marginBottom: 24 }}>
          Hands-on cohorts where we roll up sleeves and build real things together. Every course
          ends with a shipped project &mdash; and you only pay when you finish.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
          <span className="community-badge">✅ Pay only on completion</span>
          <span className="community-badge">🛠️ Project-first, not theory-first</span>
          <span className="community-badge">📺 Video demos &amp; live sessions</span>
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 880, margin: '0 auto 56px' }}>
        <h2 className="display-font" style={{ fontSize: 'clamp(22px, 4vw, 30px)', marginBottom: 20, textAlign: 'center' }}>
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-3d" style={{ padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>1️⃣</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Pick a course &amp; show interest</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
              Browse the list, watch the demo, and tell us a bit about why you want in. No upfront fee.
            </p>
          </div>
          <div className="card-3d" style={{ padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>2️⃣</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Build alongside the cohort</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
              Weekly hands-on tasks, code reviews, and accountability check-ins. Less talking, more shipping.
            </p>
          </div>
          <div className="card-3d" style={{ padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>3️⃣</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Pay only when you finish</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
              Complete the projects and ship. Then &mdash; and only then &mdash; the fee is due.
              No outcome, no payment.
            </p>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display-font" style={{ fontSize: 'clamp(22px, 4vw, 30px)', marginBottom: 16, textAlign: 'center' }}>
          Courses
        </h2>

        {/* Filters */}
        <div style={{ marginBottom: 28 }}>
          {/* Search */}
          <div style={{ maxWidth: 520, margin: '0 auto 16px' }}>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="🔍 Search courses by topic, skill, or keyword…"
              className="editor-input"
              aria-label="Search courses"
            />
          </div>

          {/* Category pills (only when we actually have courses with categories) */}
          {CATEGORIES.length > 0 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
              {(['All', ...CATEGORIES] as string[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={activeCategory === cat ? 'community-interest-chip is-active' : 'community-interest-chip'}
                  style={{
                    cursor: 'pointer',
                    background: activeCategory === cat ? '#111' : 'transparent',
                    color: activeCategory === cat ? '#fff' : 'inherit',
                  }}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Level pills */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {(['All', ...LEVELS] as string[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={activeLevel === lvl ? 'community-interest-chip is-active' : 'community-interest-chip'}
                style={{
                  cursor: 'pointer',
                  fontSize: 12,
                  background: activeLevel === lvl ? '#111' : 'transparent',
                  color: activeLevel === lvl ? '#fff' : 'inherit',
                }}
                aria-pressed={activeLevel === lvl}
              >
                {lvl === 'All' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredCourses.length === 0 && (
          <div className="card-3d" style={{ padding: 40, textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>📚</div>
            <h3 className="display-font" style={{ fontSize: 22, marginBottom: 10 }}>
              {COURSES.length === 0 ? 'Courses dropping soon' : 'No courses match your filters'}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
              {COURSES.length === 0
                ? 'I’m hand-crafting the first batch of project-first courses. Drop your interest below and I’ll personally email you the moment a relevant cohort opens.'
                : 'Try clearing the search or picking a different category.'}
            </p>
            {COURSES.length === 0 ? (
              <Link href="/contact" className="btn btn-3d">Tell me what you want to learn</Link>
            ) : (
              <button
                className="btn-outline"
                onClick={() => { setQuery(''); setActiveCategory('All'); setActiveLevel('All') }}
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {filteredCourses.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCourses.map(course => (
            <article key={course.id} className="card-3d" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span className="community-badge">{course.category}</span>
                {course.level && <span className="community-badge">{course.level}</span>}
                {course.duration && <span className="community-badge">{course.duration}</span>}
              </div>

              <h3 className="display-font" style={{ fontSize: 22, lineHeight: 1.25, marginBottom: 8 }}>
                {course.title}
              </h3>
              {course.tagline && (
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  {course.tagline}
                </p>
              )}

              {/* Video demo placeholder */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  background: 'linear-gradient(135deg,#1a1a1a 0%, #2a2a2a 100%)',
                  borderRadius: 8,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#bbb',
                  fontSize: 13,
                  fontFamily: "'IBM Plex Mono', monospace",
                  letterSpacing: '0.05em',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                aria-label="Video demo placeholder"
              >
                {course.videoUrl ? (
                  <iframe
                    src={course.videoUrl}
                    title={`${course.title} demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 0 }}
                  />
                ) : (
                  <span>▶ DEMO VIDEO COMING SOON</span>
                )}
              </div>

              {course.outcomes && course.outcomes.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    What you&apos;ll be able to do
                  </p>
                  <ul style={{ paddingLeft: 18, color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
                    {course.outcomes.map(o => (
                      <li key={o} style={{ marginBottom: 4 }}>{o}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.projects && course.projects.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Projects you&apos;ll ship
                  </p>
                  <ul style={{ paddingLeft: 18, color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
                    {course.projects.map(p => (
                      <li key={p} style={{ marginBottom: 4 }}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px dashed var(--border)' }}>
                {course.fee && (
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Fee:</strong> {course.fee}
                  </p>
                )}
                <button onClick={() => openInterest(course)} className="btn btn-3d" style={{ width: '100%' }}>
                  Show Interest &amp; Enroll
                </button>
              </div>
            </article>
          ))}
        </div>
        )}
      </div>

      {/* Footer note */}
      <div style={{ maxWidth: 720, margin: '56px auto 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
          Have a topic you wish was here? <Link href="/contact" style={{ textDecoration: 'underline' }}>Tell me</Link>{' '}
          and I&apos;ll consider running a custom cohort.
        </p>
      </div>

      {/* Interest modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Show interest"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="card-3d"
            style={{
              width: '100%',
              maxWidth: 520,
              background: 'var(--bg, #fff)',
              padding: 28,
              borderRadius: 12,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {status === 'sent' ? (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🎉</span>
                <h3 className="display-font" style={{ fontSize: 22, marginBottom: 10 }}>You&apos;re on the list</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  Thanks for your interest in <strong>{selected.title}</strong>. I&apos;ll personally reach out
                  before the next cohort starts.
                </p>
                <button onClick={() => setSelected(null)} className="btn-outline">Close</button>
              </div>
            ) : (
              <>
                <p className="muted-label" style={{ marginBottom: 6 }}>Show Interest</p>
                <h3 className="display-font" style={{ fontSize: 22, lineHeight: 1.25, marginBottom: 8 }}>
                  {selected.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                  No payment now. I&apos;ll review every signup personally before the cohort starts.
                </p>

                <form onSubmit={submit}>
                  <div style={{ marginBottom: 14 }}>
                    <label className="editor-label">Full Name *</label>
                    <input
                      value={form.fullName}
                      onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                      className="editor-input"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label className="editor-label">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="editor-input"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label className="editor-label">Why this course? *</label>
                    <textarea
                      value={form.motivation}
                      onChange={e => setForm(p => ({ ...p, motivation: e.target.value }))}
                      className="editor-input"
                      placeholder="What do you want to build or learn? Where are you stuck today?"
                      rows={4}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  {status === 'error' && (
                    <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 6, background: '#fef2f2', color: '#dc2626', fontSize: 13 }}>
                      {errorMsg}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button type="button" onClick={() => setSelected(null)} className="btn-outline" style={{ flex: 1 }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-3d" disabled={status === 'sending'} style={{ flex: 2 }}>
                      {status === 'sending' ? 'Submitting…' : 'Submit Interest'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
