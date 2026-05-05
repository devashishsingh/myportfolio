import Link from 'next/link'
import type { Metadata } from 'next'
import { getMemberFromCookie } from '../../../lib/member-auth'
import { prisma } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Welcome to the Builders Hub',
  description: 'Your first 5 minutes inside the Hub — channel link, member directory, monthly call, and the discount code.',
  alternates: { canonical: '/community/welcome' },
}

export default async function CommunityWelcomePage() {
  const member = await getMemberFromCookie()
  const channelUrl = process.env.DISCORD_INVITE_URL || ''
  const officeHoursUrl = process.env.OFFICE_HOURS_URL || ''
  const monthlyCallUrl = process.env.MONTHLY_CALL_URL || ''
  const discountCode = process.env.MEMBER_DISCOUNT_CODE || ''

  const founderTotal = await prisma.member.count({ where: { founderNumber: { not: null } } })
  const cap = parseInt(process.env.FOUNDING_CAP || '50', 10)

  const founderLine = member?.founderNumber
    ? `Founding Member #${String(member.founderNumber).padStart(2, '0')}`
    : null

  return (
    <div className="container-narrow" style={{ maxWidth: 760, margin: '0 auto', padding: '60px 20px 120px' }}>
      {/* Hero */}
      <p className="muted-label" style={{ marginBottom: 12 }}>Builders Hub · Welcome</p>
      <h1 className="display-font" style={{ fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1.05, marginBottom: 16 }}>
        {member ? `You're in, ${member.displayName.split(' ')[0]}.` : 'Welcome to the Builders Hub.'}
      </h1>

      {founderLine && (
        <div style={{ display: 'inline-block', padding: '8px 16px', border: '2px solid #1a1a1a', background: '#fffae0', boxShadow: '4px 4px 0 0 #f4b942', marginBottom: 24, fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          🌱 {founderLine}
        </div>
      )}

      <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
        A small, curated room for tech builders, founders and operators who'd rather ship than scroll. Here's everything you have access to.
      </p>

      {!member && (
        <div style={{ padding: 16, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '4px 4px 0 0 #1a1a1a', marginBottom: 32 }}>
          <p style={{ marginBottom: 10, fontWeight: 600 }}>Members see their personalised welcome here.</p>
          <Link href="/community/login" className="btn btn-3d" style={{ display: 'inline-block', padding: '10px 24px' }}>Sign in →</Link>
        </div>
      )}

      {/* Founding 50 counter */}
      <div style={{ padding: 18, border: '2px dashed #1a1a1a', background: '#fdfaf6', marginBottom: 36 }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Founding Members</p>
        <p style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Patrick Hand, cursive', lineHeight: 1.2 }}>
          {founderTotal} <span style={{ color: 'var(--muted)' }}>/ {cap} spots filled</span>
        </p>
      </div>

      {/* Action cards */}
      <Section title="01 · Join the channel" eyebrow="The room">
        <p style={{ marginBottom: 12, lineHeight: 1.7 }}>
          The pulse of the Hub lives on Discord. Introduce yourself in <code>#introductions</code>, drop wins in <code>#showcase</code>, ask in <code>#problems</code>.
        </p>
        {channelUrl ? (
          <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="btn btn-3d" style={{ display: 'inline-block', padding: '10px 24px' }}>
            Open Discord invite →
          </a>
        ) : (
          <p style={{ color: 'var(--muted-2)', fontSize: 14, fontStyle: 'italic' }}>Channel link will appear here once configured.</p>
        )}
      </Section>

      <Section title="02 · Your first 7 days" eyebrow="Onboarding">
        <ul style={{ paddingLeft: 22, lineHeight: 1.8 }}>
          <li>Post your intro: name, what you're building, what you need help with, one strong opinion.</li>
          <li>Drop a win in <code>#showcase</code> — even a tiny one.</li>
          <li>Answer one <code>#problems</code> thread, even if you're not sure. Sketch the trade-offs.</li>
          <li>Update your member profile (handle, bio, tracks, &quot;open to&quot; flags).</li>
          <li>Set a calendar reminder for the next monthly call.</li>
        </ul>
      </Section>

      <Section title="03 · What's on offer" eyebrow="Member benefits">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 8 }}>
          <Bullet emoji="🎯" title="Weekly challenges" body="24h, 48h, 7d windows. Earn Builder Points + skill badges." />
          <Bullet emoji="📚" title="Member library" body="Books, courses, talks shared by members." />
          <Bullet emoji="🤝" title="Open collab" body="Form teams, find collaborators, post jobs." />
          <Bullet emoji="🧭" title="Mentor sessions" body="Monthly office hours, hot-seat reviews." />
          <Bullet emoji="🚀" title="Spotlights" body="Top contributors featured in the newsletter." />
          <Bullet emoji="🎓" title="Member courses" body="Members run cohorts for members. You take 0%." />
        </div>
      </Section>

      {discountCode && (
        <Section title="04 · Member discount" eyebrow="Perks">
          <p style={{ marginBottom: 10, lineHeight: 1.7 }}>
            Members get <strong>20% off</strong> any course, workshop, or 1:1 booking. Use this code at checkout:
          </p>
          <code style={{ display: 'inline-block', background: '#fffae0', padding: '8px 16px', border: '2px solid #1a1a1a', boxShadow: '3px 3px 0 0 #1a1a1a', fontSize: 16, letterSpacing: '0.08em' }}>
            {discountCode}
          </code>
        </Section>
      )}

      {(monthlyCallUrl || officeHoursUrl) && (
        <Section title="05 · Show up" eyebrow="Live time">
          {monthlyCallUrl && (
            <p style={{ marginBottom: 10, lineHeight: 1.7 }}>
              <strong>Monthly community call</strong> — first Saturday, 60 min. <a href={monthlyCallUrl} target="_blank" rel="noopener noreferrer">Add to calendar →</a>
            </p>
          )}
          {officeHoursUrl && (
            <p style={{ lineHeight: 1.7 }}>
              <strong>Members-only office hours</strong> — book a slot. <a href={officeHoursUrl} target="_blank" rel="noopener noreferrer">Reserve a time →</a>
            </p>
          )}
        </Section>
      )}

      <Section title="The promise" eyebrow="Manifesto">
        <p style={{ lineHeight: 1.8, fontSize: 16 }}>
          Ideas are <strong>fuelled here, not stolen</strong>. Every member is reviewed. Every space is moderated.
          You'll find people who actually ship, who'll answer hard questions, and who'll cheer for your wins.
          In exchange, show up, give before you take, and protect the room.
        </p>
      </Section>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: '2px dashed #1a1a1a' }}>
        <Link href="/community" style={{ fontWeight: 700, textDecoration: 'underline' }}>← Back to the Community page</Link>
        {member && (
          <a href="/api/member/logout" style={{ float: 'right', fontSize: 14, color: 'var(--muted)' }}>Sign out</a>
        )}
      </div>
    </div>
  )
}

function Section({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32, padding: 24, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '6px 6px 0 0 #1a1a1a' }}>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{eyebrow}</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, lineHeight: 1.2 }}>{title}</h2>
      <div>{children}</div>
    </section>
  )
}

function Bullet({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div style={{ padding: 14, border: '1.5px solid #1a1a1a', background: '#fdfaf6' }}>
      <p style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</p>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{body}</p>
    </div>
  )
}
