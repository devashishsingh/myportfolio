"use client"

import { useState } from 'react'
import Link from 'next/link'

// ─── COHORT CONFIG ───────────────────────────────────────────────────
// Edit these fields to update the offer site-wide.
const COHORT = {
  id: 'cyber-foundations-c1',
  title: 'Cyber Foundations — Cohort #1',
  tagline: 'A small, hands-on cohort. Live sessions, weekly labs, personal feedback.',
  startDate: 'Flexible — set with the cohort',
  duration: '12 weeks',
  cadence: 'Weekend or evening slots · 2 live sessions/week + 1 weekly lab',
  seats: 30,
  outcomes: [
    'Hands-on labs each week — curriculum being finalized for Cohort #1',
    'Earn the Builders Hub Cyber Apprentice badge on your public profile',
    'A capstone project you build alongside the cohort',
    'Lifetime access to the Builders Hub + alumni channel',
  ],
  forWhom: [
    'Curious learners new to cybersecurity',
    'Students or career-changers exploring the field',
    'Devs and sysadmins adding security to their toolbelt',
  ],
  notForWhom: [
    'People wanting passive video lectures (this is hands-on, weekly)',
    'Senior security engineers (you already know this)',
  ],
}

const FREE_COURSE = {
  id: 'career-foundations-free',
  title: 'Career Foundations — 5 lesson email course',
  tagline: 'A short, honest intro to the five tracks I work across — cybersecurity, AI, and the data stack. One foundational lesson each, sent to your inbox.',
  lessons: [
    'Lesson 1 · Cybersecurity — how attackers actually pick their targets',
    "Lesson 2 · AI & ML — what's real and what's hype for builders",
    'Lesson 3 · Data engineering — pipelines, the unsexy backbone of everything',
    'Lesson 4 · Data science — turning messy data into decisions',
    'Lesson 5 · Data analytics — good questions, dashboards, and storytelling',
  ],
}

const FAQ = [
  {
    q: 'How is this different from TryHackMe / YouTube / a Udemy course?',
    a: "Free and pre-recorded resources are great — I use them too. The difference here is that you learn alongside a small group, with someone who's actually working in the field, who'll answer your questions and look at your work each week. It's slower, smaller, and more personal.",
  },
  {
    q: 'I have zero background. Will I keep up?',
    a: "Cohort #1 is calibrated for beginners who are comfortable using a terminal. There's a short pre-work module before week 1 to get everyone level. If it doesn't feel like the right fit after the first couple of weeks, just say so and we'll figure it out together.",
  },
  {
    q: 'How much does it cost?',
    a: "I'll share pricing privately when seats open — it's intentionally affordable, especially for students and career-switchers. Join the waitlist and I'll personally email you the details.",
  },
  {
    q: 'Is there a refund policy?',
    a: "Yes. 100% refund within the first 14 days, no questions asked. After that, we'll work out something fair if you need to step away.",
  },
  {
    q: 'Will recordings be available?',
    a: "Every live session is recorded and posted within 24 hours. Lifetime access — you can rewatch anytime as an alumnus.",
  },
  {
    q: 'Do you offer scholarships?',
    a: 'A few scholarship seats are reserved each cohort for people who genuinely need them. Mention it in the waitlist form and I&apos;ll be in touch.',
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
        <p className="muted-label" style={{ marginBottom: 14 }}>Small cohorts · Personal teaching</p>
        <h1 className="display-font" style={{ fontSize: 'clamp(36px, 7vw, 64px)', lineHeight: 1.05, marginBottom: 18 }}>
          Learn cybersecurity &amp; AI <span style={{ background: 'linear-gradient(transparent 60%, #fffae0 60%)' }}>with me.</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 660, margin: '0 auto 28px', lineHeight: 1.7 }}>
          Small, hands-on cohorts and 1:1 guidance from someone who&apos;s spent 14+ years in the field. I teach what I&apos;ve actually been doing in the trenches — the kind of practical work that lands you a real job.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
          <a href="#cohort" className="btn btn-3d">See the cohort →</a>
          <a href="#free" className="btn-outline">Start with the free 5-lesson intro</a>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted-2)' }}>
          Small group · Weekend &amp; evening options · Start date set with the cohort
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
                Lesson 1 lands within a few minutes. Reply if it doesn&apos;t show up — peek in spam.
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
                {status === 'sending' ? 'Sending…' : 'Send me Lesson 1 →'}
              </button>
              {status === 'error' && (
                <p style={{ marginTop: 10, fontSize: 13, color: '#dc2626' }}>{errorMsg}</p>
              )}
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted-2)' }}>
                Five foundational lessons — one per track. Unsubscribe anytime.
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
          I&apos;ll personally email you when Cohort #1 opens with all the details. In the meantime, <Link href="/community/join" style={{ textDecoration: 'underline', fontWeight: 600 }}>apply to the Builders Hub</Link> to start meeting the room.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Join the waitlist</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
        Free to join. I&apos;ll personally email you when seats open with all the details — including pricing, which is intentionally affordable.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 10 }}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required style={inputStyle} />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
      </div>
      <textarea value={why} onChange={e => setWhy(e.target.value)} placeholder="Briefly: where you are now, where you want to be (optional)" rows={3} style={{ ...inputStyle, marginBottom: 12, fontFamily: 'inherit', resize: 'vertical' }} />
      <button type="submit" disabled={status === 'sending'} className="btn btn-3d" style={{ padding: '12px 28px' }}>
        {status === 'sending' ? 'Adding…' : 'Add me to the list →'}
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
    { n: '01', t: 'Join the waitlist', d: 'Free. I&apos;ll personally email you when seats open with all the details.' },
    { n: '02', t: 'Learn alongside the cohort', d: '2 live sessions/week (recorded). 1 weekly lab. Weekly check-ins. Small enough that I&apos;ll know your name.' },
    { n: '03', t: 'Build a capstone', d: 'A real project you build alongside the cohort, with personal feedback from me each step.' },
    { n: '04', t: 'Stay in the room', d: 'Lifetime alumni access to the Builders Hub. Keep learning, keep building, keep meeting people.' },
  ]
  return (
    <section style={{ background: '#fff', padding: '80px 20px', borderBottom: '2px solid #1a1a1a' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display-font" style={{ fontSize: 'clamp(28px, 5vw, 40px)', textAlign: 'center', marginBottom: 12 }}>How it works</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 40, fontSize: 16 }}>Small group. Honest teaching. Hands-on the whole way through.</p>
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
        <p className="muted-label" style={{ marginBottom: 12 }}>A bit about me</p>
        <h2 className="display-font" style={{ fontSize: 'clamp(26px, 5vw, 38px)', lineHeight: 1.15, marginBottom: 18 }}>
          Why learn with me.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginTop: 24 }}>
          <Stat n="14+ yrs" l="In cybersecurity, including time at AirAsia&apos;s InfoSec team" />
          <Stat n="Indie" l="Building security products independently for the last several years" />
          <Stat n="Open" l="Open-source contributions and tools shared with the community" />
          <Stat n="Personal" l="Cohorts kept small enough that I review every learner&apos;s work" />
        </div>
        <p style={{ marginTop: 28, color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
          I teach what I&apos;m actually working on. The labs and topics evolve with what&apos;s relevant in the field, not what&apos;s left over from a 2019 syllabus.
        </p>
        <Link href="/about" style={{ display: 'inline-block', marginTop: 20, fontSize: 14, textDecoration: 'underline', fontWeight: 600 }}>Read more about me →</Link>
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
    <section id="formats" style={{ background: '#fff', padding: '80px 20px', borderBottom: '2px solid #1a1a1a' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h2 className="display-font" style={{ fontSize: 'clamp(28px, 5vw, 40px)', textAlign: 'center', marginBottom: 12 }}>Three ways to learn</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 40, fontSize: 16, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          Pick the format that fits where you are. Reach out and we&apos;ll talk through the right one for you.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          <FormatTier
            name="Self-paced"
            description="Recorded lessons and labs you can work through on your own time."
            features={['All recordings', 'Weekly labs (async)', 'Builders Hub access', 'Cyber Apprentice badge on completion']}
          />
          <FormatTier
            name="Cohort"
            highlight
            description="Learn alongside a small group, with live sessions and personal feedback."
            features={['Everything in Self-paced', '2 live sessions/week', 'Weekly cohort lab', 'Capstone with personal review', '14-day refund window']}
          />
          <FormatTier
            name="Cohort + 1:1"
            description="Cohort plus dedicated time with me for career and project guidance."
            features={['Everything in Cohort', '1:1 sessions with me (career strategy + capstone deep-dive)', 'Resume / portfolio review']}
          />
        </div>
        <p style={{ marginTop: 28, fontSize: 13, color: 'var(--muted-2)', textAlign: 'center' }}>
          Pricing is intentionally affordable, especially for students and career-switchers. I&apos;ll share full details when you reach out.
        </p>
      </div>
    </section>
  )
}

function FormatTier({ name, description, features, highlight }: { name: string; description: string; features: string[]; highlight?: boolean }) {
  return (
    <div style={{
      padding: 24,
      border: '2px solid #1a1a1a',
      background: highlight ? '#fffae0' : '#fdfaf6',
      boxShadow: highlight ? '6px 6px 0 0 #f4b942' : '5px 5px 0 0 #1a1a1a',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {highlight && (
        <div style={{ position: 'absolute', top: -14, left: 16, padding: '4px 10px', background: '#1a1a1a', color: '#fffae0', fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Most popular
        </div>
      )}
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{name}</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>{description}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px', flexGrow: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 14, lineHeight: 1.5 }}>
            <span style={{ color: '#f4b942', flexShrink: 0 }}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link href="/contact" className={highlight ? 'btn btn-3d' : 'btn-outline'} style={{ display: 'inline-block', padding: '10px 20px', width: '100%', textAlign: 'center' }}>
        Contact me about this →
      </Link>
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
