import type { Metadata } from 'next'
import FieldsAccordion, { type FieldItem } from '../../components/workshop/FieldsAccordion'
import RegistrationForm from '../../components/workshop/RegistrationForm'
import ReserveCTA from '../../components/workshop/ReserveCTA'

export const metadata: Metadata = {
  title: 'Free Cybersecurity Career Workshop — Devashish Singh',
  description:
    'Join a free 90-minute mentorship workshop with Devashish Singh (14+ years in cybersecurity) to discover which of the top 10 cybersecurity fields fits you. Only 25 seats.',
  keywords: [
    'cybersecurity workshop',
    'cybersecurity career',
    'free workshop',
    'cybersecurity mentorship',
    'cloud security',
    'SOC',
    'penetration testing',
    'DevSecOps',
    'Devashish Singh',
  ],
  alternates: { canonical: '/workshop' },
  openGraph: {
    title: 'Free Cybersecurity Career Workshop — Devashish Singh',
    description:
      'Which cybersecurity field is right for you? Free 90-minute mentorship workshop. Only 25 seats.',
    url: '/workshop',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Cybersecurity Career Workshop — Devashish Singh',
    description: 'Free 90-min mentorship workshop. Only 25 seats.',
  },
}

const FIELDS: FieldItem[] = [
  { rank: 1, emoji: '☁️', name: 'Cloud Security', salary: '$130K–$180K', growth: '🔥 Explosive', why: 'Every company is moving to cloud. 65% of breaches now involve cloud misconfigurations.' },
  { rank: 2, emoji: '🤖', name: 'AI Security & Governance', salary: '$140K–$200K', growth: '🚀 Brand New', why: 'Newest field. AI systems need protection AND regulation. Almost zero qualified talent exists today.' },
  { rank: 3, emoji: '🏗️', name: 'Security Architecture', salary: '$150K–$220K', growth: '📈 Steady High', why: 'You design the entire defense. Every org needs architects. Leads directly to CISO path.' },
  { rank: 4, emoji: '🔍', name: 'Detection Engineering', salary: '$120K–$170K', growth: '🔥 Explosive', why: 'Building the rules that catch attackers. Combines coding + threat knowledge. Massive shortage.' },
  { rank: 5, emoji: '⚔️', name: 'Penetration Testing & Red Team', salary: '$95K–$160K', growth: '📈 Strong', why: 'Legal hacking. Most exciting entry point. Every company needs pen testers for compliance.' },
  { rank: 6, emoji: '⚙️', name: 'DevSecOps', salary: '$130K–$175K', growth: '🔥 Explosive', why: 'Security inside CI/CD pipelines. Developers outnumber security 100:1. This bridges the gap.' },
  { rank: 7, emoji: '🛡️', name: 'Security Operations (SOC)', salary: '$70K–$130K', growth: '📈 Steady', why: 'The #1 entry point into cybersecurity. Every company has a SOC. 24/7 monitoring = always hiring.' },
  { rank: 8, emoji: '🔐', name: 'Identity & Access Management', salary: '$115K–$165K', growth: '🔥 Explosive', why: 'Zero Trust runs on identity. If you control who accesses what, you control security.' },
  { rank: 9, emoji: '🔬', name: 'Incident Response & Digital Forensics', salary: '$100K–$155K', growth: '📈 Strong', why: 'When breaches happen, YOU investigate. High-pressure, high-reward. The detectives of cybersecurity.' },
  { rank: 10, emoji: '📋', name: 'GRC & Cybersecurity Strategy', salary: '$90K–$160K', growth: '📈 Steady High', why: 'Not technical? This is your path. Every regulation (GDPR, SOC2, ISO) needs GRC professionals.' },
]

const STATS = [
  { value: '3.5M+', label: 'Unfilled cyber jobs globally' },
  { value: '0%', label: 'Unemployment rate' },
  { value: '33%', label: 'Job growth by 2033' },
  { value: '$103K', label: 'Median entry salary' },
]

const AGENDA = [
  { time: '00:00–00:05', title: 'Welcome & The Big Picture' },
  { time: '00:05–00:15', title: 'The Cybersecurity Career Map' },
  { time: '00:15–00:50', title: 'Top 10 Fields Deep Dive' },
  { time: '00:50–01:00', title: 'Technical Tickle 🧠 (Live Demo)' },
  { time: '01:00–01:10', title: 'Your First 90 Days Roadmap' },
  { time: '01:10–01:20', title: 'Q&A + Mentorship' },
]

const TAGS = ['Live Session', 'Only 25 Seats', 'Completely Free', 'Career Roadmap Included']

const SHARE_MESSAGE = 'Free cybersecurity workshop by a 14+ year expert — only 25 seats! Register: https://devashishsingh.com/workshop'
const SHARE_URL = 'https://devashishsingh.com/workshop'

export default function WorkshopPage() {
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationEvent',
    name: 'Which Cybersecurity Field is Right for You?',
    description:
      'A free 90-minute mentorship workshop by Devashish Singh covering the top 10 cybersecurity career paths, salary expectations, and a 90-day roadmap.',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    organizer: { '@type': 'Person', name: 'Devashish Singh', url: 'https://devashishsingh.com' },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/LimitedAvailability' },
    maximumAttendeeCapacity: 25,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ maxWidth: 820 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: 999,
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              fontSize: 12,
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: '0.06em',
              fontWeight: 500,
            }}
          >
            🔴 Free Workshop · Only 25 Seats
          </span>

          <h1
            className="display-font"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, margin: '20px 0 16px', fontWeight: 800 }}
          >
            Which Cybersecurity Field is Right for You?
          </h1>

          <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 720, margin: '0 0 24px', lineHeight: 1.6 }}>
            A free mentorship session by <strong style={{ color: 'var(--text-primary)' }}>Devashish Singh</strong> —
            14+ years in cybersecurity across banking, aviation, insurance &amp; tech.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {TAGS.map((t) => (
              <span
                key={t}
                style={{
                  padding: '5px 11px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  fontSize: 12,
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: 'var(--text-muted)',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <ReserveCTA />
        </div>
      </section>

      {/* ── MENTOR ─────────────────────────────────────────── */}
      <section className="container-wide" style={{ paddingTop: 24, paddingBottom: 32 }}>
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 24,
            background: 'var(--surface-2)',
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
            Your mentor
          </div>
          <h2 className="display-font" style={{ fontSize: 28, margin: '0 0 6px', fontWeight: 700 }}>Devashish Singh</h2>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            Senior Manager, Digital Security · CISA · CEH
          </div>
          <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-primary)' }}>
            14+ years leading cybersecurity operations at AIA Insurance, AirAsia, Maybank &amp; AT&amp;T. Built SOCs,
            led incident response, architected security across GCP/Azure/AWS.
          </p>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section className="container-wide" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '28px 0',
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                className="display-font"
                style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, lineHeight: 1.1 }}
              >
                {s.value}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOP 10 FIELDS ──────────────────────────────────── */}
      <section className="container-wide" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            What we&rsquo;ll cover
          </div>
          <h2 className="display-font" style={{ fontSize: 'clamp(26px, 4vw, 38px)', margin: '6px 0 0', fontWeight: 800 }}>
            Top 10 Cybersecurity Fields
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 0, fontSize: 14 }}>
            Tap a field to see why it matters.
          </p>
        </div>
        <FieldsAccordion items={FIELDS} />
      </section>

      {/* ── AGENDA ─────────────────────────────────────────── */}
      <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Agenda
        </div>
        <h2 className="display-font" style={{ fontSize: 'clamp(26px, 4vw, 38px)', margin: '6px 0 24px', fontWeight: 800 }}>
          90 minutes, end to end
        </h2>

        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            position: 'relative',
            borderLeft: '2px solid var(--border)',
            paddingLeft: 24,
          }}
        >
          {AGENDA.map((a, i) => (
            <li key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: -32,
                  top: 4,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'var(--bg)',
                  border: '2px solid var(--text-primary)',
                }}
              />
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.04em',
                }}
              >
                {a.time}
              </div>
              <div
                className="display-font"
                style={{ fontSize: 17, fontWeight: 700, marginTop: 2, color: 'var(--text-primary)' }}
              >
                {a.title}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── QUOTE ──────────────────────────────────────────── */}
      <section className="container-wide" style={{ paddingTop: 16, paddingBottom: 48 }}>
        <blockquote
          style={{
            margin: 0,
            padding: '28px 24px',
            borderLeft: '4px solid var(--text-primary)',
            background: 'var(--surface-2)',
            borderRadius: '0 12px 12px 0',
          }}
        >
            <p
              className="display-font"
              style={{ fontSize: 'clamp(20px, 3vw, 26px)', lineHeight: 1.4, margin: 0, fontWeight: 600 }}
            >
              &ldquo;The more you know, the more you would know.&rdquo;
            </p>
          <footer
            style={{
              marginTop: 10,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            — Devashish Singh
          </footer>
        </blockquote>
      </section>

      {/* ── REGISTRATION ───────────────────────────────────── */}
      <section
        id="register"
        className="container-wide"
        style={{ paddingTop: 32, paddingBottom: 48, scrollMarginTop: 80 }}
      >
        <div
          style={{
            maxWidth: 560,
            margin: '0 auto',
            border: '2px solid var(--text-primary)',
            borderRadius: 14,
            padding: 'clamp(20px, 4vw, 32px)',
            background: 'var(--surface-1)',
            boxShadow: '6px 6px 0 0 var(--text-primary)',
          }}
        >
          <RegistrationForm />
        </div>
      </section>

      {/* ── SHARE ──────────────────────────────────────────── */}
      <section className="container-wide" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <h3 className="display-font" style={{ fontSize: 22, margin: '0 0 14px', fontWeight: 700 }}>
            Know someone who wants a career in cybersecurity?
          </h3>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(SHARE_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-3d"
              style={{ padding: '12px 20px', fontSize: 14, background: '#25D366', color: '#fff' }}
            >
              Share on WhatsApp
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-3d"
              style={{ padding: '12px 20px', fontSize: 14, background: '#0A66C2', color: '#fff' }}
            >
              Share on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── PAGE FOOTER ────────────────────────────────────── */}
      <section className="container-wide" style={{ paddingTop: 16, paddingBottom: 24 }}>
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--text-muted)',
            fontFamily: "'IBM Plex Mono', monospace",
            margin: 0,
            letterSpacing: '0.04em',
          }}
        >
          © 2026 Devashish Singh · <a href="https://devashishsingh.com" style={{ textDecoration: 'underline' }}>devashishsingh.com</a>
        </p>
      </section>
    </>
  )
}
