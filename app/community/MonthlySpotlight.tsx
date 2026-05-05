import Link from 'next/link'
import { prisma } from '../../lib/db'

export default async function MonthlySpotlight() {
  const top = await prisma.member.findMany({
    where: { monthPoints: { gt: 0 } },
    orderBy: [{ monthPoints: 'desc' }, { joinedAt: 'asc' }],
    take: 3,
    select: { handle: true, displayName: true, region: true, monthPoints: true, founderNumber: true, streakWeeks: true },
  })

  if (top.length === 0) return null

  const monthLabel = new Date().toLocaleString(undefined, { month: 'long' })
  const RANK = ['🥇', '🥈', '🥉']

  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
          Top Builders · {monthLabel}
        </p>
        <h2 className="display-font" style={{ fontSize: 28, marginBottom: 8 }}>This month's spotlight.</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 520, margin: '0 auto' }}>
          Members earning the most Builder Points right now. Rankings reset on the 1st.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 860, margin: '0 auto' }}>
        {top.map((m, i) => (
          <Link key={m.handle} href={`/community/${m.handle}`} style={{
            display: 'block',
            padding: '20px 18px',
            border: '2px solid #1a1a1a',
            background: i === 0 ? '#fffae0' : '#fff',
            boxShadow: i === 0 ? '6px 6px 0 0 #f4b942' : '5px 5px 0 0 #1a1a1a',
            color: 'inherit',
            textDecoration: 'none',
            transition: 'transform 120ms ease',
          }}>
            <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 8 }}>{RANK[i]}</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{m.displayName}</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
              @{m.handle}{m.founderNumber ? ` · #${String(m.founderNumber).padStart(2, '0')}` : ''}{m.region ? ` · ${m.region}` : ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{m.monthPoints}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>pts this month</span>
              {m.streakWeeks > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: 11, padding: '2px 6px', border: '1px solid #1a1a1a', fontFamily: 'IBM Plex Mono, monospace' }}>🔥{m.streakWeeks}w</span>
              )}
            </div>
          </Link>
        ))}
      </div>
      {/* Fade-out FOMO peek */}
      <div style={{ maxWidth: 860, margin: '24px auto 0', position: 'relative' }}>
        <div aria-hidden style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          filter: 'blur(4px) saturate(0.6)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}>
          {[4, 5, 6, 7].map(n => (
            <div key={n} style={{ padding: '14px 16px', border: '2px solid #1a1a1a', background: '#fff' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>#{n}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>████████ ████</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>███ pts · ███</div>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(to top, rgba(253,250,246,0.95) 30%, rgba(253,250,246,0.4))',
        }}>
          <Link href="/community/login" style={{
            padding: '10px 22px',
            border: '2px solid #1a1a1a',
            background: '#fffae0',
            boxShadow: '4px 4px 0 0 #f4b942',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
            color: '#1a1a1a',
          }}>
            🔓 Sign in to see ranks #4–50
          </Link>
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: 'var(--muted)' }}>
        Not a member yet? <Link href="/community/join" style={{ textDecoration: 'underline', fontWeight: 600 }}>Apply to the Builders Hub →</Link>
      </p>
    </section>
  )
}
