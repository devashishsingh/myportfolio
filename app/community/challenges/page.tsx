import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '../../../lib/db'
import Countdown from '../../../components/Countdown'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Challenges · Builders Hub',
  description: 'Weekly challenges, quizzes and labs. Earn Builder Points, level up, and prove you ship.',
  alternates: { canonical: '/community/challenges' },
}

const KIND_LABELS: Record<string, string> = { challenge: '🎯 Challenge', quiz: '🧩 Quiz', lab: '🧪 Lab' }

export default async function ChallengesPage() {
  const now = new Date()
  const [live, closed] = await Promise.all([
    prisma.challenge.findMany({
      where: { published: true, closesAt: { gt: now } },
      orderBy: [{ featured: 'desc' }, { closesAt: 'asc' }],
      include: { _count: { select: { submissions: true } } },
    }),
    prisma.challenge.findMany({
      where: { published: true, closesAt: { lte: now } },
      orderBy: { closesAt: 'desc' },
      take: 8,
      include: { _count: { select: { submissions: true } } },
    }),
  ])

  return (
    <div className="container-wide" style={{ padding: '60px 20px 120px' }}>
      <p className="muted-label" style={{ marginBottom: 12 }}>Builders Hub · Challenges</p>
      <h1 className="display-font" style={{ fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1.05, marginBottom: 16 }}>
        Build. Submit. Earn.
      </h1>
      <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 40, maxWidth: 720 }}>
        Time-boxed challenges, quizzes and labs across cyber, AI, cloud, systems and more. Show your thinking, ship a writeup, win Builder Points and badges. AI helps — original thinking wins.
      </p>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Live now <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({live.length})</span></h2>
      {live.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: 40 }}>No live challenges right now. Check back soon — new ones drop weekly.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18, marginBottom: 48 }}>
          {live.map(c => (
            <Card key={c.id} c={c} live />
          ))}
        </div>
      )}

      {closed.length > 0 && (
        <>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Recently closed</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
            {closed.map(c => <Card key={c.id} c={c} live={false} />)}
          </div>
        </>
      )}

      <p style={{ marginTop: 48, fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/community/welcome" style={{ textDecoration: 'underline' }}>← Back to your welcome page</Link>
      </p>
    </div>
  )
}

function Card({ c, live }: { c: any; live: boolean }) {
  return (
    <Link href={`/community/challenges/${c.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ padding: 20, border: '2px solid #1a1a1a', background: '#fff', boxShadow: c.featured ? '6px 6px 0 0 #f4b942' : '5px 5px 0 0 #1a1a1a', display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {KIND_LABELS[c.kind] || c.kind} {c.track ? `· ${c.track}` : ''}
          </span>
          {live && <Countdown closesAt={c.closesAt.toISOString()} />}
        </div>
        <h3 style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.25 }}>{c.title}</h3>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>{c.brief}</p>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 10, fontSize: 12, color: 'var(--muted)', alignItems: 'center', flexWrap: 'wrap' }}>
          <span>⭐ {c.points} pts</span>
          <span>· Level {c.difficulty}</span>
          <span>· {c._count.submissions} {c._count.submissions === 1 ? 'submission' : 'submissions'}</span>
        </div>
      </div>
    </Link>
  )
}
