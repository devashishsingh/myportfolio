"use client"

import { useState } from 'react'
import Link from 'next/link'

// ─── COHORT CONFIG ───────────────────────────────────────────────────
// Edit these fields to update the offer site-wide.
const COHORT = {
  id: 'cyber-foundations-c1',
  title: 'Cyber Foundations — Cohort #1',
  tagline: 'Zero to job-ready in 12 weeks. Real labs. Recruiter intros. Capped at 30 seats.',
  startDate: 'Aug 11, 2026',
  duration: '12 weeks',
  cadence: '2 live sessions/week + 1 weekly lab',
  seats: 30,
  fee: { inr: '₹14,999', usd: '$179', earlyBirdInr: '₹9,999', earlyBirdUsd: '$129' },
  earlyBirdEndsLabel: 'first 10 seats',
  outcomes: [
    'Build a portfolio of 6 hands-on labs (DMARC analyser, log-triage tool, phishing sim, IR runbook, SOC dashboard, policy review)',
    'Earn the Builders Hub Cyber Apprentice badge on your public profile',
    'Live capstone presented to a panel of practicing security engineers',
    'Recruiter intros for top 5 capstones (curated, not spray-and-pray)',
    'Lifetime access to the Builders Hub + alumni Discord channel',
  ],
  forWhom: [
    'Career-switchers eyeing SOC, GRC, or AppSec roles',
    'CS / IT students who want a portfolio that beats a CV',
    'Sysadmins / devs adding security to their toolbelt',
  ],
  notForWhom: [
    'People wanting passive video lectures (this is hands-on, weekly)',
    'Senior security engineers (you already know this)',
  ],
}

const FREE_COURSE = {
  id: 'cyber-essentials-free',
  title: 'Cyber Essentials — 5 lesson email course',
  tagline: 'A no-fluff intro to thinking like a defender. Delivered to your inbox over 5 days.',
  lessons: [
    'Day 1 · How attackers actually pick their targets',
    'Day 2 · The SOC mindset — alerts, noise, and what matters',
    'Day 3 · DMARC explained without the jargon',
    'Day 4 · The 5 logs every analyst opens first',
    'Day 5 · Your 30/60/90-day roadmap into a security role',
  ],
}

const FAQ = [
  {
    q: 'Why should I pay you instead of doing TryHackMe / YouTube?',
    a: "Free resources teach you tools. They don't teach you triage, communication, or how to talk to a hiring manager. The cohort is structured around the muscles you actually flex on the job — plus we ship a capstone you can show recruiters. If self-study worked alone, this market wouldn't exist.",
  },
  {
    q: 'I have zero background. Will I keep up?',
    a: "Yes — Cohort #1 is calibrated for beginners with comfort using a terminal. We send a 2-hour pre-work module before week 1 to get everyone level. If after week 2 you feel it's too advanced, full refund.",
  },
  {
    q: 'Is there a refund policy?',
    a: "Yes. 100% refund within the first 14 days, no questions asked. After that, prorated refunds if you're not progressing — we'd rather you move on than feel stuck.",
  },
  {
    q: 'What about the certificate?',
    a: 'Cohort grads get a verifiable certificate (signed, on-chain hash) plus a permanent Cyber Apprentice badge on your Builders Hub profile. Top 3 capstones get featured on the public Community page.',
  },
  {
    q: 'Will recordings be available?',
    a: "Every live session is recorded and posted within 24 hours. Lifetime access — you can rewatch anytime as an alumnus.",
  },
  {
    q: 'Do you offer scholarships?',
    a: '3 scholarship seats per cohort for under-represented backgrounds in tech. Apply via the waitlist form with a short note in the "anything else" box.',
  },
]

export default function StudyPage() {
  return (
    <div>
      <Hero />
      <FreeMiniCourse />
      <FlagshipCohort />
      <HowItWorks />
      <WhyMe />
      <Pricing />
      <FAQSection />
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ background: '#fdfaf6', borderBottom: '2px solid #1a1a1a' }}>
      <div className="container-wide" style={{ paddingTop: 70, paddingBottom: 60, textAlign: 'center', maxWidth: 880, margin: '0 auto' }}>
        <p className="muted-label" style={{ marginBottom: 14 }}>Cohort-based courses · Built by an industry practitioner</p>
        <h1 className="display-font" style={{ fontSize: 'clamp(36px, 7vw, 64px)', lineHeight: 1.05, marginBottom: 18 }}>
          Land your first cybersecurity or AI role —<br />
          <span style={{ background: 'linear-gradient(transparent 60%, #fffae0 60%)' }}>in 90 days, with a portfolio that beats a CV.</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 660, margin: '0 auto 28px', lineHeight: 1.7 }}>
          12-week cohorts taught by someone who&apos;s actually shipped security at scale (ex-AirAsia InfoSec, founder of <Link href="/work" style={{ textDecoration: 'underline' }}>InMyBox</Link> + DMARC Labs). Weekly live labs, real capstones, recruiter intros for top grads.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
          <a href="#cohort" className="btn btn-3d">See the next cohort →</a>
          <a href="#free" className="btn-outline">Start with the free mini-course</a>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted-2)' }}>
          🪑 {COHORT.seats} seats · Starts {COHORT.startDate} · Early-bird pricing for the first 10
        </p>
      </div>
    </section>
  )
}

// ─── Free Mini-Course ────────────────────────────────────────────────
function FreeMiniCourse() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !name) return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/study/interest', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email,
          motivation: 'Free mini-course signup',
          courseId: FREE_COURSE.id,
          courseTitle: FREE_COURSE.title,
        }),
      })
      const json = await res.json()
      if (res.ok) setStatus('sent')
      else { setStatus('error'); setErrorMsg(json.error || 'Something went wrong.') }
    } catch {
      setStatus('error'); setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <section id="free" style={{ background: '#fff', padding: '80px 20px', borderBottom: '2px solid #1a1a1a' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
        <div>
          <p className="muted-label" style={{ marginBottom: 12 }}>Free · No credit card</p>
          <h2 className="display-font" style={{ fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.1, marginBottom: 16 }}>
            Start with 5 free lessons — see if my teaching clicks.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 18 }}>
            {FREE_COURSE.tagline}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {FREE_COURSE.lessons.map(l => (
              <li key={l} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 15, lineHeight: 1.5 }}>
                <span style={{ flexShrink: 0, color: '#f4b942', fontWeight: 700 }}>✓</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ padding: 28, border: '2px solid #1a1a1a', background: '#fdfaf6', boxShadow: '6px 6px 0 0 #1a1a1a' }}>
          {status === 'sent' ? (
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Check your inbox 📬</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
                Day 1 lands within a few minutes. Reply if it doesn&apos;t show up — peek in spam.
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Get the first lesson today</h3>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                style={inputStyle}
              />
              <div style={{ height: 10 }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
              <div style={{ height: 14 }} />
              <button type="submit" disabled={status === 'sending'} className="btn btn-3d" style={{ width: '100%', padding: '12px 20px' }}>
                {status === 'sending' ? 'Sending…' : 'Send me Day 1 →'}
              </button>
              {status === 'error' && (
                <p style={{ marginTop: 10, fontSize: 13, color: '#dc2626' }}>{errorMsg}</p>
              )}
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted-2)' }}>
                One lesson per day for 5 days. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Flagship Cohort ─────────────────────────────────────────────────
function FlagshipCohort() {
  return (
    <section id="cohort" style={{ background: '#fdfaf6', padding: '80px 20px', borderBottom: '2px solid #1a1a1a' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', padding: '5px 14px', border: '2px solid #1a1a1a', background: '#fff', boxShadow: '3px 3px 0 0 #f4b942', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 18 }}>
          Flagship cohort · Live + interactive
        </div>
        <h2 className="display-font" style={{ fontSize: 'clamp(32px, 6vw, 48px)', lineHeight: 1.05, marginBottom: 14 }}>
          {COHORT.title}
        </h2>
        <p style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28, maxWidth: 720 }}>
          {COHORT.tagline}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
          <FactTile label="Starts" value={COHORT.startDate} />
          <FactTile label="Duration" value={COHORT.duration} />
          <FactTile label="Cadence" value={COHORT.cadence} />
          <FactTile label="Seats" value={`${COHORT.seats} max`} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <Card title="🎯 You walk away with">
            <ul style={{ paddingLeft: 18, lineHeight: 1.7, fontSize: 15 }}>
              {COHORT.outcomes.map(o => <li key={o} style={{ marginBottom: 6 }}>{o}</li>)}
            </ul>
          </Card>
          <Card title="✅ Built for">
            <ul style={{ paddingLeft: 18, lineHeight: 1.7, fontSize: 15 }}>
              {COHORT.forWhom.map(o => <li key={o} style={{ marginBottom: 6 }}>{o}</li>)}
            </ul>
            <p style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
              Not for: {COHORT.notForWhom.join(' · ')}
            </p>
          </Card>
        </div>

        <div style={{ marginTop: 36, padding: 24, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '6px 6px 0 0 #1a1a1a' }}>
          <WaitlistForm />
        </div>
      </div>
    </section>
  )
}

function FactTile({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 14, border: '2px solid #1a1a1a', background: '#fff' }}>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 700 }}>{value}</p>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 22, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '5px 5px 0 0 #1a1a1a' }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  )
}

function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [why, setWhy] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/study/interest', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email,
          motivation: why || 'Cohort waitlist',
          courseId: COHORT.id,
          courseTitle: COHORT.title,
        }),
      })
      const json = await res.json()
      if (res.ok) setStatus('sent')
      else { setStatus('error'); setErrorMsg(json.error || 'Something went wrong.') }
    } catch {
      setStatus('error'); setErrorMsg('Network error. Please try again.')
    }
  }

  if (status === 'sent') {
    return (
      <div>
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>You&apos;re on the list 🎉</h3>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
          Early-bird seats open 7 days before the cohort. You&apos;ll get the link first. In the meantime, <Link href="/community/join" style={{ textDecoration: 'underline', fontWeight: 600 }}>apply to the Builders Hub</Link> to get warm with the room.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Reserve a seat (waitlist)</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
        Pay nothing today. Early-bird at <strong>{COHORT.fee.earlyBirdInr}</strong> / {COHORT.fee.earlyBirdUsd} for the {COHORT.earlyBirdEndsLabel} who confirm. Standard {COHORT.fee.inr} / {COHORT.fee.usd} after.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 10 }}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required style={inputStyle} />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
      </div>
      <textarea value={why} onChange={e => setWhy(e.target.value)} placeholder="Briefly: where you are now, where you want to be (optional)" rows={3} style={{ ...inputStyle, marginBottom: 12, fontFamily: 'inherit', resize: 'vertical' }} />
      <button type="submit" disabled={status === 'sending'} className="btn btn-3d" style={{ padding: '12px 28px' }}>
        {status === 'sending' ? 'Reserving…' : 'Reserve my seat →'}
      </button>
      {status === 'error' && (
        <p style={{ marginTop: 10, fontSize: 13, color: '#dc2626' }}>{errorMsg}</p>
      )}
    </form>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '2px solid #1a1a1a',
  fontSize: 15,
  background: '#fff',
  boxShadow: '3px 3px 0 0 #1a1a1a',
  fontFamily: 'inherit',
}

// ─── How It Works ────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', t: 'Join the waitlist', d: 'Free. We email you the moment seats open. Early-bird pricing for the first 10 to confirm.' },
    { n: '02', t: 'Build alongside the cohort', d: '2 live sessions/week (recorded). 1 weekly lab in the Builders Hub. Weekly check-ins.' },
    { n: '03', t: 'Ship a capstone', d: 'Real project, presented to a panel. Top 3 featured publicly. Top 5 get recruiter intros.' },
    { n: '04', t: 'Stay in the room', d: 'Lifetime alumni access to the Builders Hub. Continuous job board, mentorship, peer reviews.' },
  ]
  return (
    <section style={{ background: '#fff', padding: '80px 20px', borderBottom: '2px solid #1a1a1a' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display-font" style={{ fontSize: 'clamp(28px, 5vw, 40px)', textAlign: 'center', marginBottom: 12 }}>How it works</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 40, fontSize: 16 }}>Less talking. More shipping.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {steps.map(s => (
            <div key={s.n} style={{ padding: 22, border: '2px solid #1a1a1a', background: '#fdfaf6' }}>
              <p className="display-font" style={{ fontSize: 28, color: 'var(--muted)', marginBottom: 8 }}>{s.n}</p>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{s.t}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why Me ──────────────────────────────────────────────────────────
function WhyMe() {
  return (
    <section style={{ background: '#fdfaf6', padding: '70px 20px', borderBottom: '2px solid #1a1a1a' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
        <p className="muted-label" style={{ marginBottom: 12 }}>Built by a practitioner, not a YouTuber</p>
        <h2 className="display-font" style={{ fontSize: 'clamp(26px, 5vw, 38px)', lineHeight: 1.15, marginBottom: 18 }}>
          Why this isn&apos;t another bootcamp.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginTop: 24 }}>
          <Stat n="8+ yrs" l="Building security at scale (ex-AirAsia)" />
          <Stat n="50K+" l="Mailboxes protected via InMyBox + DMARC Labs" />
          <Stat n="3" l="Open-source security tools shipped" />
          <Stat n="100%" l="Of cohort capstones get reviewed by me, personally" />
        </div>
        <p style={{ marginTop: 28, color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
          I teach what I do every week. No outdated 2019 slides. No theory that doesn&apos;t show up in real triage. Each lab is something I&apos;ve actually run in production.
        </p>
        <Link href="/about" style={{ display: 'inline-block', marginTop: 20, fontSize: 14, textDecoration: 'underline', fontWeight: 600 }}>Read the full backstory →</Link>
      </div>
    </section>
  )
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div style={{ padding: 20, border: '2px solid #1a1a1a', background: '#fff' }}>
      <p className="display-font" style={{ fontSize: 32, lineHeight: 1, marginBottom: 6 }}>{n}</p>
      <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>{l}</p>
    </div>
  )
}

// ─── Pricing ─────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" style={{ background: '#fff', padding: '80px 20px', borderBottom: '2px solid #1a1a1a' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h2 className="display-font" style={{ fontSize: 'clamp(28px, 5vw, 40px)', textAlign: 'center', marginBottom: 12 }}>Pricing</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 40, fontSize: 16 }}>
          14-day full refund. No corporate fluff. Scholarship seats reserved each cohort.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          <PriceTier
            name="Self-paced"
            price="₹2,999"
            usd="$39"
            features={['All recordings', 'Weekly labs (async)', 'Builders Hub access', 'Cyber Apprentice badge on completion']}
          />
          <PriceTier
            name="Cohort (early-bird)"
            highlight
            price={COHORT.fee.earlyBirdInr}
            usd={COHORT.fee.earlyBirdUsd}
            note={`First 10 seats only · then ${COHORT.fee.inr}`}
            features={['Everything in Self-paced', '2 live sessions/week', 'Weekly cohort lab', 'Capstone review + recruiter intro pool', '14-day refund guarantee']}
          />
          <PriceTier
            name="Cohort + 4× 1:1"
            price="₹24,999"
            usd="$299"
            features={['Everything in Cohort', '4× 30-min 1:1 with me (career strategy + capstone deep-dive)', 'Priority recruiter intros', 'Resume + LinkedIn audit']}
          />
        </div>
        <p style={{ marginTop: 28, fontSize: 13, color: 'var(--muted-2)', textAlign: 'center' }}>
          Reserve a seat first — I&apos;ll personally email you with enrolment + payment details when seats open. Scholarship seats available; mention it in the waitlist form.
        </p>
      </div>
    </section>
  )
}

function PriceTier({ name, price, usd, features, highlight, note }: { name: string; price: string; usd: string; features: string[]; highlight?: boolean; note?: string }) {
  return (
    <div style={{
      padding: 24,
      border: '2px solid #1a1a1a',
      background: highlight ? '#fffae0' : '#fdfaf6',
      boxShadow: highlight ? '6px 6px 0 0 #f4b942' : '5px 5px 0 0 #1a1a1a',
      position: 'relative',
    }}>
      {highlight && (
        <div style={{ position: 'absolute', top: -14, left: 16, padding: '4px 10px', background: '#1a1a1a', color: '#fffae0', fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Most popular
        </div>
      )}
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{name}</h3>
      <p style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
        {price} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)' }}>/ {usd}</span>
      </p>
      {note && <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>{note}</p>}
      <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 18px' }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 14, lineHeight: 1.5 }}>
            <span style={{ color: '#f4b942', flexShrink: 0 }}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a href="#cohort" className={highlight ? 'btn btn-3d' : 'btn-outline'} style={{ display: 'inline-block', padding: '10px 20px', width: '100%', textAlign: 'center' }}>
        Reserve seat →
      </a>
    </div>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────
function FAQSection() {
  return (
    <section style={{ background: '#fdfaf6', padding: '80px 20px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 className="display-font" style={{ fontSize: 'clamp(28px, 5vw, 40px)', textAlign: 'center', marginBottom: 32 }}>Frequently asked</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQ.map((item, i) => (
            <details key={i} style={{ padding: 18, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '4px 4px 0 0 #1a1a1a' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>{item.q}</summary>
              <p style={{ marginTop: 12, color: 'var(--muted)', lineHeight: 1.7, fontSize: 15 }}>{item.a}</p>
            </details>
          ))}
        </div>
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 12 }}>Still unsure?</p>
          <Link href="/contact" className="btn-outline" style={{ display: 'inline-block', padding: '10px 24px' }}>Ask me a question →</Link>
        </div>
      </div>
    </section>
  )
}
