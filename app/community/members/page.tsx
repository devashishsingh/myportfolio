import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Members · Builders Hub',
  description: 'Meet the builders, founders and operators inside the Hub.',
  alternates: { canonical: '/community/members' },
}

const TRACK_LABELS: Record<string, string> = {
  cyber: 'Cyber', ai: 'AI/ML', cloud: 'Cloud', systems: 'Systems',
  networks: 'Networks', coding: 'Coding', gaming: 'Gaming', digital: 'Digital',
}

export default async function MembersDirectoryPage({ searchParams }: { searchParams?: { region?: string; track?: string } }) {
  const region = searchParams?.region
  const track = searchParams?.track

  const where: any = {}
  if (region && region !== 'all') where.region = region
  if (track && track !== 'all') where.tracks = { contains: `"${track}"` }

  const [members, regions] = await Promise.all([
    prisma.member.findMany({
      where,
      orderBy: [{ founderNumber: 'asc' }, { points: 'desc' }, { joinedAt: 'desc' }],
      take: 100,
      select: {
        id: true, handle: true, displayName: true, region: true, bio: true,
        tracks: true, workingOn: true, openToCollab: true, openToHire: true, openToMentor: true,
        founderNumber: true, points: true,
      },
    }),
    prisma.member.findMany({ select: { region: true }, distinct: ['region'] }),
  ])

  const regionList = regions.map(r => r.region).filter(Boolean) as string[]

  return (
    <div className="container-wide" style={{ padding: '60px 20px 120px' }}>
      <p className="muted-label" style={{ marginBottom: 12 }}>Builders Hub · Members</p>
      <h1 className="display-font" style={{ fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1.05, marginBottom: 16 }}>
        The room.
      </h1>
      <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32, maxWidth: 720 }}>
        {members.length} {members.length === 1 ? 'builder' : 'builders'} inside. Each one reviewed, each one shipping.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        <FilterPill href="/community/members" label="All" active={!region && !track} />
        {regionList.map(r => (
          <FilterPill key={r} href={`/community/members?region=${encodeURIComponent(r)}`} label={r} active={region === r} />
        ))}
        <span style={{ borderLeft: '2px solid #1a1a1a', margin: '0 4px' }} />
        {Object.entries(TRACK_LABELS).map(([slug, label]) => (
          <FilterPill key={slug} href={`/community/members?track=${slug}`} label={label} active={track === slug} />
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
        {members.length === 0 && (
          <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No members match those filters yet.</p>
        )}
        {members.map(m => {
          let tracks: string[] = []
          try { tracks = JSON.parse(m.tracks || '[]') } catch {}
          return (
            <Link key={m.id} href={`/community/${m.handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ padding: 18, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '5px 5px 0 0 #1a1a1a', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{m.displayName}</h3>
                  {m.founderNumber && (
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, padding: '2px 6px', background: '#fffae0', border: '1.5px solid #1a1a1a' }}>
                      #{String(m.founderNumber).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--muted)' }}>@{m.handle} · {m.region || 'Earth'}</p>
                {m.workingOn && <p style={{ fontSize: 14, lineHeight: 1.5 }}>🛠 {m.workingOn}</p>}
                {m.bio && <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{m.bio.slice(0, 140)}{m.bio.length > 140 ? '…' : ''}</p>}
                {tracks.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 'auto' }}>
                    {tracks.slice(0, 4).map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #1a1a1a', background: '#fdfaf6' }}>{TRACK_LABELS[t] || t}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
                  {m.openToCollab && <span>· collab</span>}
                  {m.openToHire && <span>· hire</span>}
                  {m.openToMentor && <span>· mentor</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <p style={{ marginTop: 40, fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/community/welcome" style={{ textDecoration: 'underline' }}>← Back to your welcome page</Link>
      </p>
    </div>
  )
}

function FilterPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} style={{
      padding: '6px 14px',
      border: '2px solid #1a1a1a',
      background: active ? '#1a1a1a' : '#fff',
      color: active ? '#fdfaf6' : '#1a1a1a',
      fontSize: 13,
      fontFamily: 'IBM Plex Mono, monospace',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      textDecoration: 'none',
      boxShadow: active ? 'none' : '3px 3px 0 0 #1a1a1a',
    }}>{label}</Link>
  )
}
