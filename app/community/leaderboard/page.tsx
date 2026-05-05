import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '../../../lib/db'
import { getMemberFromCookie } from '../../../lib/member-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Leaderboard · Builders Hub',
  description: 'Members ranked by Builder Points — monthly + all-time.',
  alternates: { canonical: '/community/leaderboard' },
  robots: { index: false, follow: false },
}

const RANK_EMOJI = ['🥇', '🥈', '🥉']

export default async function LeaderboardPage() {
  const me = await getMemberFromCookie()
  if (!me) redirect('/community/login?error=invalid_or_expired')

  const select = {
    id: true, handle: true, displayName: true, region: true, founderNumber: true,
    points: true, monthPoints: true, streakWeeks: true,
  }

  const [monthBoard, allTimeBoard] = await Promise.all([
    prisma.member.findMany({
      where: { monthPoints: { gt: 0 } },
      orderBy: [{ monthPoints: 'desc' }, { joinedAt: 'asc' }],
      take: 50,
      select,
    }),
    prisma.member.findMany({
      where: { points: { gt: 0 } },
      orderBy: [{ points: 'desc' }, { joinedAt: 'asc' }],
      take: 50,
      select,
    }),
  ])

  const monthLabel = new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div className="container-narrow" style={{ maxWidth: 820, margin: '0 auto', padding: '60px 20px 120px' }}>
      <p className="muted-label" style={{ marginBottom: 12 }}>Builders Hub · Leaderboard</p>
      <h1 className="display-font" style={{ fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1.05, marginBottom: 16 }}>
        Who's shipping.
      </h1>
      <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32, maxWidth: 660 }}>
        Builder Points are earned through approved challenges, helpful answers, and published writeups. Monthly board resets on the 1st. Top 3 each month get a public spotlight on <Link href="/community" style={{ textDecoration: 'underline' }}>/community</Link>.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 32 }}>
        <Board title={`This month — ${monthLabel}`} eyebrow="MONTHLY" rows={monthBoard} field="monthPoints" highlightId={me.id} />
        <Board title="All time" eyebrow="LIFETIME" rows={allTimeBoard} field="points" highlightId={me.id} />
      </div>

      <p style={{ fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/community/welcome" style={{ textDecoration: 'underline' }}>← Back to your dashboard</Link>
      </p>
    </div>
  )
}

function Board({ title, eyebrow, rows, field, highlightId }: { title: string; eyebrow: string; rows: any[]; field: 'points' | 'monthPoints'; highlightId: string }) {
  return (
    <section style={{ padding: 18, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '5px 5px 0 0 #1a1a1a' }}>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{eyebrow}</p>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{title}</h2>
      {rows.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: 14 }}>No points scored yet. Be the first.</p>
      ) : (
        <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rows.map((m, i) => {
            const isMe = m.id === highlightId
            const value = m[field] as number
            return (
              <li key={m.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                border: '1.5px solid #1a1a1a',
                background: isMe ? '#fffae0' : i < 3 ? '#fdfaf6' : '#fff',
              }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, width: 32, textAlign: 'center' }}>
                  {i < 3 ? RANK_EMOJI[i] : `#${i + 1}`}
                </span>
                <Link href={`/community/${m.handle}`} style={{ flex: 1, minWidth: 0, color: 'inherit', textDecoration: 'none' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.displayName} {isMe && <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>(you)</span>}
                  </div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>
                    @{m.handle}{m.founderNumber ? ` · #${String(m.founderNumber).padStart(2, '0')}` : ''}{m.region ? ` · ${m.region}` : ''}
                  </div>
                </Link>
                <span style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{value}</span>
                {m.streakWeeks > 0 && (
                  <span style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #1a1a1a', background: '#fff', fontFamily: 'IBM Plex Mono, monospace' }}>🔥{m.streakWeeks}w</span>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
