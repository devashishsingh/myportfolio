import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '../../../lib/db'

export const dynamic = 'force-dynamic'

const TRACK_LABELS: Record<string, string> = {
  cyber: 'Cyber', ai: 'AI/ML', cloud: 'Cloud', systems: 'Systems',
  networks: 'Networks', coding: 'Coding', gaming: 'Gaming', digital: 'Digital',
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const member = await prisma.member.findUnique({ where: { handle: params.handle } })
  if (!member) return { title: 'Member not found' }
  return {
    title: `${member.displayName} (@${member.handle}) · Builders Hub`,
    description: member.bio || `${member.displayName} — Builders Hub member.`,
    alternates: { canonical: `/community/${member.handle}` },
  }
}

export default async function MemberProfilePage({ params }: { params: { handle: string } }) {
  const member = await prisma.member.findUnique({
    where: { handle: params.handle },
    include: {
      badges: { include: { badge: true }, orderBy: { earnedAt: 'desc' } },
    },
  })
  if (!member) notFound()

  let tracks: string[] = []
  try { tracks = JSON.parse(member.tracks || '[]') } catch {}

  return (
    <div className="container-narrow" style={{ maxWidth: 760, margin: '0 auto', padding: '60px 20px 120px' }}>
      <p className="muted-label" style={{ marginBottom: 12 }}>Member · Builders Hub</p>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
        <h1 className="display-font" style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1 }}>{member.displayName}</h1>
        {member.founderNumber && (
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, padding: '4px 10px', background: '#fffae0', border: '2px solid #1a1a1a', boxShadow: '3px 3px 0 0 #f4b942' }}>
            Founding #{String(member.founderNumber).padStart(2, '0')}
          </span>
        )}
      </div>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
        @{member.handle} · {member.region || 'Earth'} · joined {member.joinedAt.toLocaleDateString()}
      </p>

      {member.bio && <p style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 24 }}>{member.bio}</p>}

      {member.workingOn && (
        <div style={{ padding: 16, border: '2px dashed #1a1a1a', background: '#fdfaf6', marginBottom: 24 }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Working on</p>
          <p style={{ fontSize: 16, lineHeight: 1.5 }}>{member.workingOn}</p>
        </div>
      )}

      {tracks.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Tracks</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tracks.map(t => (
              <span key={t} style={{ fontSize: 13, padding: '4px 10px', border: '2px solid #1a1a1a', background: '#fff', boxShadow: '2px 2px 0 0 #1a1a1a' }}>{TRACK_LABELS[t] || t}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, fontSize: 14, color: 'var(--muted)', marginBottom: 24, flexWrap: 'wrap' }}>
        {member.openToCollab && <span>🤝 Open to collab</span>}
        {member.openToHire && <span>💼 Open to hire</span>}
        {member.openToMentor && <span>🧭 Mentoring</span>}
      </div>

      {(member.linkedinUrl || member.githubUrl || member.siteUrl) && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, fontSize: 14 }}>
          {member.linkedinUrl && <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
          {member.githubUrl && <a href={member.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
          {member.siteUrl && <a href={member.siteUrl} target="_blank" rel="noopener noreferrer">Website ↗</a>}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
        <Stat label="Builder Points" value={String(member.points)} />
        <Stat label="This Month" value={String(member.monthPoints)} />
        <Stat label="Streak" value={`${member.streakWeeks}w`} />
      </div>

      {/* Badges */}
      {member.badges.length > 0 && (
        <section style={{ padding: 20, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '5px 5px 0 0 #1a1a1a' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Badges ({member.badges.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {member.badges.map(mb => (
              <div key={mb.id} style={{ padding: 12, border: '1.5px solid #1a1a1a', background: '#fdfaf6', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{mb.badge.iconEmoji || '⭐'}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{mb.badge.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{mb.badge.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <p style={{ marginTop: 40, fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/community/members" style={{ textDecoration: 'underline' }}>← Back to all members</Link>
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 14, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '3px 3px 0 0 #1a1a1a', textAlign: 'center' }}>
      <p style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Patrick Hand, cursive', lineHeight: 1 }}>{value}</p>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>{label}</p>
    </div>
  )
}
