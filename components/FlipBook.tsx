"use client"
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const pages = [
  { id: 1, front: '/images/potrait.jpg.png' },
  { id: 2, type: 'review' as const },
  { id: 3, type: 'startups' as const },
  { id: 4, type: 'enterprise' as const },
  { id: 5, type: 'dashboard' as const },
  { id: 6, type: 'wellness' as const },
  { id: 7, type: 'community' as const },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="22" height="22" viewBox="0 0 24 24"
          fill={star <= Math.floor(rating) ? '#FBBC04' : 'none'}
          stroke="#FBBC04" strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewPage() {
  return (
    <div className="flipbook-content" style={{ flexDirection: 'column', gap: '16px', padding: '32px 28px', textAlign: 'center' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '4px' }}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <div style={{ fontSize: '42px', fontWeight: 700, lineHeight: 1 }}>4.8</div>
      <StarRating rating={4.8} />
      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, maxWidth: '280px' }}>
        Guided and mentored hundreds of students toward promising careers — helping them gain clarity, confidence, and a clear roadmap for what to do next.
      </p>
      <span style={{ fontSize: '11px', color: 'var(--muted-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Google Reviews</span>
    </div>
  )
}

function StartupsPage() {
  return (
    <div className="flipbook-content" style={{ flexDirection: 'column', gap: '16px', padding: '32px 28px', textAlign: 'center' }}>
      {/* GitHub-style success icon */}
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '4px' }}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#0b0b0b"/>
        <circle cx="17" cy="17" r="6" fill="#22c55e"/>
        <path d="M14.5 17l1.5 1.5 3-3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <div style={{ fontSize: '42px', fontWeight: 700, lineHeight: 1 }}>50+</div>
      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, maxWidth: '280px' }}>
        Startup ideas built and launched as fully functional platforms — all powered through AI capabilities, strong prompting, smart scripting, and cost-efficient execution.
      </p>
      <span style={{ fontSize: '11px', color: 'var(--muted-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Platforms Launched</span>
    </div>
  )
}

function EnterprisePage() {
  return (
    <div className="flipbook-content" style={{ flexDirection: 'column', gap: '16px', padding: '32px 28px', textAlign: 'center' }}>
      {/* Career success / shield icon */}
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '4px' }}>
        <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#0b0b0b"/>
        <circle cx="12" cy="12" r="5" fill="#22c55e"/>
        <path d="M10 12l1.5 1.5 3-3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>Enterprise-Grade Security</div>
      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, maxWidth: '280px' }}>
        Trusted by leading airlines, financial institutions, and global service providers, with enterprise-scale expertise across identity, endpoint, network, email, cloud, and AI security.
      </p>
      <span style={{ fontSize: '11px', color: 'var(--muted-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trusted Advisor</span>
    </div>
  )
}

function DashboardPage() {
  return (
    <div className="flipbook-content" style={{ flexDirection: 'column', gap: '16px', padding: '32px 28px', textAlign: 'center' }}>
      {/* Dashboard / visibility icon */}
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '4px' }}>
        <rect x="2" y="3" width="20" height="14" rx="2" fill="#0b0b0b"/>
        <rect x="4" y="5" width="7" height="4" rx="1" fill="#22c55e" opacity="0.9"/>
        <rect x="13" y="5" width="7" height="4" rx="1" fill="#3b82f6" opacity="0.9"/>
        <rect x="4" y="11" width="16" height="2" rx="0.5" fill="#fff" opacity="0.3"/>
        <path d="M8 20h8" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 17v3" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>Complete Digital Visibility</div>
      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, maxWidth: '280px' }}>
        Built out-of-the-box integrations, dashboards, and actionable metrics at low to no cost — delivering complete visibility across every layer of digital infrastructure.
      </p>
      <span style={{ fontSize: '11px', color: 'var(--muted-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Dashboards &amp; Metrics</span>
    </div>
  )
}

function WellnessPage() {
  return (
    <div className="flipbook-content" style={{ flexDirection: 'column', gap: '16px', padding: '32px 28px', textAlign: 'center' }}>
      {/* Heart + person wellness icon */}
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '4px' }}>
        <circle cx="12" cy="12" r="11" fill="#0b0b0b" opacity="0.05"/>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ef4444"/>
        <path d="M8 12h2l1-2 2 4 1-2h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>Health First. Always.</div>
      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, maxWidth: '280px' }}>
        At the heart of everything, mental and physical health come first. Let&apos;s connect, share our values, and build something meaningful for life, people, and the future.
      </p>
      <span style={{ fontSize: '11px', color: 'var(--muted-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Let&apos;s Connect</span>
    </div>
  )
}

function CommunityFlipPage() {
  return (
    <div className="flipbook-content" style={{ flexDirection: 'column', gap: '16px', padding: '32px 28px', textAlign: 'center' }}>
      {/* Community of thinkers & doers icon */}
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '4px' }}>
        {/* Center person */}
        <circle cx="12" cy="7" r="2.5" fill="#0b0b0b"/>
        <path d="M8.5 14c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5" stroke="#0b0b0b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* Left person */}
        <circle cx="5" cy="9" r="1.8" fill="#0b0b0b" opacity="0.6"/>
        <path d="M2.5 15c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5" stroke="#0b0b0b" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.6"/>
        {/* Right person */}
        <circle cx="19" cy="9" r="1.8" fill="#0b0b0b" opacity="0.6"/>
        <path d="M16.5 15c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5" stroke="#0b0b0b" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.6"/>
        {/* Connection lines */}
        <path d="M8 11.5L6.5 12.5" stroke="#0b0b0b" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
        <path d="M16 11.5L17.5 12.5" stroke="#0b0b0b" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
        {/* Lightbulb / idea spark above */}
        <circle cx="12" cy="2.5" r="1" fill="#f59e0b" opacity="0.8"/>
        <path d="M12 1l0-0.5M10.5 1.5l-0.4-0.4M13.5 1.5l0.4-0.4" stroke="#f59e0b" strokeWidth="0.6" strokeLinecap="round" opacity="0.7"/>
        {/* Base connection arc */}
        <path d="M4 18c0-2 3.5-3.5 8-3.5s8 1.5 8 3.5" stroke="#0b0b0b" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.2"/>
        {/* Small dots representing network */}
        <circle cx="8" cy="19" r="0.8" fill="#22c55e" opacity="0.7"/>
        <circle cx="12" cy="19.5" r="0.8" fill="#3b82f6" opacity="0.7"/>
        <circle cx="16" cy="19" r="0.8" fill="#ef4444" opacity="0.7"/>
      </svg>
      <div style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.3, maxWidth: '280px' }}>A Community of Thinkers &amp; Doers</div>
      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '280px' }}>
        Building a community of tech minds, innovators, thinkers, and digital geeks — to share ideas, solve real problems, and create meaningful impact together.
      </p>
      <span style={{ fontSize: '11px', color: 'var(--muted-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Builders Hub</span>
    </div>
  )
}

export default function FlipBook() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  function handleClick(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const clickX = e.clientX - rect.left
    const half = rect.width / 2

    if (clickX >= half) {
      // Right side → flip forward
      setDirection(1)
      setCurrent((prev) => (prev + 1) % pages.length)
    } else {
      // Left side → flip backward
      setDirection(-1)
      setCurrent((prev) => (prev - 1 + pages.length) % pages.length)
    }
  }

  const page = pages[current]

  return (
    <div className="flipbook" ref={containerRef} onClick={handleClick} role="button" tabIndex={0} aria-label="Click left to go back, right to flip forward">
      {/* Hint above the image */}
      <div className="flipbook-hint">
        <span>← {current + 1} / {pages.length} →</span>
        <span>Click to flip</span>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={page.id}
          custom={direction}
          variants={{
            enter: (d: number) => ({ rotateY: d > 0 ? 90 : -90, opacity: 0 }),
            center: { rotateY: 0, opacity: 1 },
            exit: (d: number) => ({ rotateY: d > 0 ? -90 : 90, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flipbook-page"
        >
          {page.front ? (
            <img src={page.front} alt="Devashish Singh" className="flipbook-img" />
          ) : page.type === 'review' ? (
            <ReviewPage />
          ) : page.type === 'startups' ? (
            <StartupsPage />
          ) : page.type === 'enterprise' ? (
            <EnterprisePage />
          ) : page.type === 'dashboard' ? (
            <DashboardPage />
          ) : page.type === 'wellness' ? (
            <WellnessPage />
          ) : page.type === 'community' ? (
            <CommunityFlipPage />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
