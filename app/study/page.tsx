"use client"

import { useState } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  tagline: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  outcomes: string[]
  projects: string[]
  videoUrl?: string // YouTube embed URL or null for "coming soon"
  fee: string
}

const COURSES: Course[] = [
  {
    id: 'cyber-fundamentals',
    title: 'Cybersecurity Fundamentals — The Practitioner Path',
    tagline: 'Learn security by breaking and defending real systems, not by memorizing acronyms.',
    level: 'Beginner',
    duration: '6 weeks · ~5 hrs/week',
    outcomes: [
      'Set up your own home lab with virtual machines',
      'Run real reconnaissance on test targets you own',
      'Read and write basic detection rules (Sigma / KQL)',
      'Build a working DMARC + SPF + DKIM setup for a domain',
    ],
    projects: [
      'Audit and harden a real WordPress site',
      'Investigate a simulated phishing incident end-to-end',
      'Ship one detection rule to a public repo',
    ],
    videoUrl: '',
    fee: '₹4,999 — pay only after you ship all 3 projects',
  },
  {
    id: 'ai-for-builders',
    title: 'AI for Builders — Ship a Real Product in 30 Days',
    tagline: 'No theory marathons. You build a working AI tool by week one.',
    level: 'Intermediate',
    duration: '4 weeks · ~6 hrs/week',
    outcomes: [
      'Use OpenAI-compatible APIs with strict JSON output',
      'Design prompt pipelines that survive real users',
      'Add a vector store and retrieve over your own data',
      'Deploy a Next.js + AI app to Vercel for free',
    ],
    projects: [
      'Build a chatbot grounded in your own PDFs',
      'Build a content rewriter for a real client/use case',
      'Ship one project publicly with a writeup',
    ],
    videoUrl: '',
    fee: '₹6,999 — pay only after your project is live on the internet',
  },
  {
    id: 'indie-saas-launch',
    title: 'Indie SaaS Launchpad — Idea to First Paying User',
    tagline: 'Stop tutorial-hopping. Pick one painful problem and ship it.',
    level: 'Advanced',
    duration: '8 weeks · ~7 hrs/week',
    outcomes: [
      'Validate an idea with 10 real conversations before writing code',
      'Set up Next.js + Postgres + auth + payments end-to-end',
      'Launch on a real domain with analytics and feedback loops',
      'Do basic distribution: SEO, social, communities',
    ],
    projects: [
      'Validation report from 10 user interviews',
      'A live SaaS deployed on your own domain',
      'First paying user (or strong written attempt with feedback)',
    ],
    videoUrl: '',
    fee: '₹9,999 — pay only when you have a live product and real feedback',
  },
]

export default function StudyTogetherPage() {
  const [selected, setSelected] = useState<Course | null>(null)
  const [form, setForm] = useState({ fullName: '', email: '', motivation: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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
        <h1 className="display-font" style={{ fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.1, marginBottom: 16 }}>
          Less theory. More projects. Real outcomes.
        </h1>
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
        <h2 className="display-font" style={{ fontSize: 'clamp(22px, 4vw, 30px)', marginBottom: 24, textAlign: 'center' }}>
          Courses
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {COURSES.map(course => (
            <article key={course.id} className="card-3d" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span className="community-badge">{course.level}</span>
                <span className="community-badge">{course.duration}</span>
              </div>

              <h3 className="display-font" style={{ fontSize: 22, lineHeight: 1.25, marginBottom: 8 }}>
                {course.title}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                {course.tagline}
              </p>

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

              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px dashed var(--border)' }}>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Fee:</strong> {course.fee}
                </p>
                <button onClick={() => openInterest(course)} className="btn btn-3d" style={{ width: '100%' }}>
                  Show Interest &amp; Enroll
                </button>
              </div>
            </article>
          ))}
        </div>
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
