import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '../../../../lib/db'
import { getMemberFromCookie } from '../../../../lib/member-auth'
import Countdown from '../../../../components/Countdown'
import SubmitForm from './SubmitForm'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const c = await prisma.challenge.findUnique({ where: { slug: params.slug } })
  if (!c) return { title: 'Challenge not found' }
  return { title: `${c.title} · Builders Hub`, description: c.brief, alternates: { canonical: `/community/challenges/${c.slug}` } }
}

const KIND_LABELS: Record<string, string> = { challenge: '🎯 Challenge', quiz: '🧩 Quiz', lab: '🧪 Lab' }

export default async function ChallengeDetailPage({ params }: { params: { slug: string } }) {
  const me = await getMemberFromCookie()
  if (!me) redirect('/community/login?error=invalid_or_expired')

  const c = await prisma.challenge.findUnique({ where: { slug: params.slug } })
  if (!c || !c.published) notFound()

  const now = new Date()
  const isLive = c.closesAt > now

  const myPriorSubmission = await prisma.challengeSubmission.findFirst({
    where: { challengeId: c.id, memberId: me.id },
    orderBy: { submittedAt: 'desc' },
  })

  const winners = await prisma.challengeSubmission.findMany({
    where: { challengeId: c.id, status: 'approved' },
    include: { member: { select: { handle: true, displayName: true, founderNumber: true } } },
    orderBy: [{ score: 'desc' }, { submittedAt: 'asc' }],
    take: 5,
  })

  return (
    <div className="container-narrow" style={{ maxWidth: 760, margin: '0 auto', padding: '60px 20px 120px' }}>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        {KIND_LABELS[c.kind] || c.kind} {c.track ? `· ${c.track}` : ''} · Level {c.difficulty}
      </p>

      <h1 className="display-font" style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, marginBottom: 14 }}>{c.title}</h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        {isLive ? <Countdown closesAt={c.closesAt.toISOString()} /> : (
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, padding: '3px 8px', background: '#f3f4f6', border: '1.5px solid #1a1a1a' }}>CLOSED · {c.closesAt.toLocaleDateString()}</span>
        )}
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, padding: '3px 8px', background: '#fffae0', border: '1.5px solid #1a1a1a' }}>⭐ {c.points} pts</span>
        {c.badgeSlug && <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, padding: '3px 8px', background: '#fdfaf6', border: '1.5px solid #1a1a1a' }}>🏅 badge: {c.badgeSlug}</span>}
      </div>

      <p style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 24, color: 'var(--muted)' }}>{c.brief}</p>

      <article style={{ padding: 24, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '5px 5px 0 0 #1a1a1a', marginBottom: 24, lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: 15 }}>
        {c.body}
      </article>

      {c.rubric && (
        <details style={{ padding: 16, border: '2px dashed #1a1a1a', background: '#fdfaf6', marginBottom: 24 }}>
          <summary style={{ fontWeight: 700, cursor: 'pointer' }}>How this gets graded</summary>
          <div style={{ marginTop: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', fontSize: 14 }}>{c.rubric}</div>
        </details>
      )}

      {/* Submission area */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14 }}>Your submission</h2>
        {!isLive ? (
          <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>This challenge has closed. New ones land weekly.</p>
        ) : myPriorSubmission ? (
          <div style={{ padding: 18, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '4px 4px 0 0 #1a1a1a' }}>
            <p style={{ marginBottom: 6, fontWeight: 700 }}>You submitted on {myPriorSubmission.submittedAt.toLocaleString()}</p>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              Status: <strong>{myPriorSubmission.status}</strong>
              {myPriorSubmission.score != null && ` · Score: ${myPriorSubmission.score}/100`}
            </p>
            {myPriorSubmission.adminNote && (
              <p style={{ marginTop: 10, fontSize: 14, padding: 10, background: '#fdfaf6', border: '1.5px solid #1a1a1a' }}>{myPriorSubmission.adminNote}</p>
            )}
            <p style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 10 }}>One submission per challenge. Want a redo? Reply to your approval email and I'll handle it.</p>
          </div>
        ) : (
          <SubmitForm challengeId={c.id} />
        )}
      </section>

      {/* Winners */}
      {winners.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14 }}>Top submissions</h2>
          <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 0, listStyle: 'none' }}>
            {winners.map((w, i) => (
              <li key={w.id} style={{ padding: 12, border: '1.5px solid #1a1a1a', background: '#fff', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, marginRight: 10 }}>#{i + 1}</span>
                  <Link href={`/community/${w.member.handle}`} style={{ fontWeight: 700, textDecoration: 'underline' }}>{w.member.displayName}</Link>
                  {w.member.founderNumber && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--muted)' }}>Founding #{String(w.member.founderNumber).padStart(2, '0')}</span>}
                </span>
                {w.score != null && <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}>{w.score}/100</span>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <p style={{ marginTop: 40, fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/community/challenges" style={{ textDecoration: 'underline' }}>← All challenges</Link>
      </p>
    </div>
  )
}
