import type { Metadata } from 'next'
import Link from 'next/link'
import profile from '../../data/profile.json'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Devashish Singh — Cybersecurity Mentor, Practitioner & Educator. 14+ years across banking, aviation, insurance & tech.',
  keywords: [
    'Devashish Singh',
    'cybersecurity mentor',
    'cybersecurity educator',
    'AirAsia security',
    'CISA',
    'CEH',
    'Malaysia',
  ],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Devashish Singh — Cybersecurity Mentor & Practitioner',
    description:
      '14+ years in cybersecurity across banking, aviation, insurance & tech. Hands-on training, labs, and mentorship.',
    url: '/about',
    type: 'profile',
  },
}

type TimelineItem = { period: string; title: string; company?: string; summary?: string }

const STATS: { n: string; l: string }[] = [
  { n: '14+', l: 'Years in cybersecurity' },
  { n: '20+', l: 'Projects shipped' },
  { n: '50+', l: 'People mentored' },
  { n: '8', l: 'Countries worked across' },
]

const COMPANIES = ['AIA', 'AirAsia', 'Maybank', 'AT&T']

export default function About() {
  const timeline: TimelineItem[] = (profile as any).timeline || []
  const certifications: string[] = profile.certifications || []
  const education: string[] = profile.education || []

  return (
    <div>
      {/* ── HERO ───────────────────────────────────── */}
      <section style={{ background: '#fdfaf6', borderBottom: '2px solid #1a1a1a' }}>
        <div
          className="container-wide"
          style={{
            paddingTop: 70,
            paddingBottom: 60,
            textAlign: 'center',
            maxWidth: 880,
            margin: '0 auto',
          }}
        >
          <p className="muted-label" style={{ marginBottom: 14 }}>
            Cybersecurity Mentor · Practitioner · Educator
          </p>
          <h1
            className="display-font"
            style={{ fontSize: 'clamp(36px, 7vw, 60px)', lineHeight: 1.05, marginBottom: 18 }}
          >
            About
          </h1>
          <p
            style={{
              fontSize: 18,
              color: 'var(--muted)',
              maxWidth: 660,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            {profile.summary}
          </p>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '60px 20px', borderBottom: '2px solid #1a1a1a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 18,
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.l}
                style={{
                  padding: 22,
                  border: '2px solid #1a1a1a',
                  background: '#fdfaf6',
                  textAlign: 'center',
                }}
              >
                <p
                  className="display-font"
                  style={{ fontSize: 38, lineHeight: 1, marginBottom: 8, fontWeight: 800 }}
                >
                  {s.n}
                </p>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDENTIALS ────────────────────────────── */}
      <section style={{ background: '#fdfaf6', padding: '70px 20px', borderBottom: '2px solid #1a1a1a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <p className="muted-label" style={{ marginBottom: 12 }}>Credentials</p>
          <h2
            className="display-font"
            style={{ fontSize: 'clamp(26px, 5vw, 36px)', marginBottom: 24, lineHeight: 1.1 }}
          >
            Certifications &amp; experience
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ padding: 22, border: '2px solid #1a1a1a', background: '#fff' }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>Certifications</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(certifications.length
                  ? certifications
                  : ['CISA — Certified Information Systems Auditor', 'CEH — Certified Ethical Hacker']
                ).map((c) => (
                  <li
                    key={c}
                    style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)', marginBottom: 6 }}
                  >
                    <span style={{ color: '#1a1a1a', fontWeight: 700 }}>✓</span> {c}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ padding: 22, border: '2px solid #1a1a1a', background: '#fff' }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>Companies</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10 }}>
                14+ years across banking, aviation, insurance, and tech:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {COMPANIES.map((c) => (
                  <span
                    key={c}
                    style={{
                      padding: '6px 12px',
                      border: '1.5px solid #1a1a1a',
                      background: '#fdfaf6',
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {education.length > 0 && (
              <div style={{ padding: 22, border: '2px solid #1a1a1a', background: '#fff' }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>Education</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {education.map((ed) => (
                    <li
                      key={ed}
                      style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)', marginBottom: 6 }}
                    >
                      {ed}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────── */}
      {timeline.length > 0 && (
        <section style={{ background: '#fff', padding: '70px 20px', borderBottom: '2px solid #1a1a1a' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <p className="muted-label" style={{ marginBottom: 12 }}>Journey</p>
            <h2
              className="display-font"
              style={{ fontSize: 'clamp(26px, 5vw, 36px)', marginBottom: 28, lineHeight: 1.1 }}
            >
              Career timeline
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {timeline.map((t, i) => (
                <div
                  key={i}
                  style={{ padding: 20, border: '2px solid #1a1a1a', background: '#fdfaf6' }}
                >
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 12,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      marginBottom: 6,
                    }}
                  >
                    {t.period}
                  </p>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, lineHeight: 1.3 }}>
                    {t.title}
                    {t.company ? ` — ${t.company}` : ''}
                  </h3>
                  {t.summary ? (
                    <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      {t.summary}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ──────────────────────────────── */}
      <section style={{ background: '#1a1a1a', color: '#fff', padding: '80px 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2
            className="display-font"
            style={{ fontSize: 'clamp(28px, 5vw, 42px)', lineHeight: 1.1, marginBottom: 16 }}
          >
            Want to learn from me?
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 16,
              marginBottom: 28,
              lineHeight: 1.7,
            }}
          >
            Hands-on cybersecurity training, labs, and mentorship — built on the real-world skills employers want.
          </p>
          <Link
            href="/learn"
            className="btn btn-3d"
            style={{ background: '#fff', color: '#1a1a1a', padding: '14px 28px' }}
          >
            Explore programs →
          </Link>
        </div>
      </section>
    </div>
  )
}
