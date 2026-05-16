import type { Metadata } from 'next'
import Link from 'next/link'
import { UPCOMING_EVENTS, PAST_EVENTS } from '../../lib/events'

export const metadata: Metadata = {
  title: 'Events & Workshops · Devashish Singh',
  description:
    'Free and paid live sessions on cybersecurity careers, tools, and real-world skills.',
}

export default function EventsPage() {
  return (
    <div>
      {/* ── HERO ───────────────────────────────────── */}
      <section style={{ background: '#fdfaf6', borderBottom: '2px solid #1a1a1a' }}>
        <div
          className="container-wide"
          style={{
            paddingTop: 70,
            paddingBottom: 60,
            textAlign: 'center',
            maxWidth: 880,
            margin: '0 auto',
          }}
        >
          <p className="muted-label" style={{ marginBottom: 14 }}>
            Live sessions · Free &amp; paid
          </p>
          <h1
            className="display-font"
            style={{
              fontSize: 'clamp(36px, 7vw, 60px)',
              lineHeight: 1.05,
              marginBottom: 18,
            }}
          >
            Events &amp; Workshops
          </h1>
          <p
            style={{
              fontSize: 18,
              color: 'var(--muted)',
              maxWidth: 660,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Free and paid sessions on cybersecurity careers, tools, and real-world skills.
          </p>
        </div>
      </section>

      {/* ── UPCOMING ───────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 20px', borderBottom: '2px solid #1a1a1a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <h2
            className="display-font"
            style={{
              fontSize: 'clamp(26px, 5vw, 36px)',
              marginBottom: 28,
              lineHeight: 1.1,
            }}
          >
            Upcoming
          </h2>

          {UPCOMING_EVENTS.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7 }}>
              No events scheduled right now. Check back soon — or{' '}
              <Link href="/contact" style={{ textDecoration: 'underline', fontWeight: 600 }}>
                get in touch
              </Link>{' '}
              if you&apos;d like me to run something specific.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {UPCOMING_EVENTS.map((e) => (
                <article
                  key={e.id}
                  style={{
                    padding: 'clamp(20px, 4vw, 32px)',
                    border: '2px solid #1a1a1a',
                    background: '#fdfaf6',
                    boxShadow: '6px 6px 0 0 #1a1a1a',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 24,
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                      <p
                        className="muted-label"
                        style={{ marginBottom: 8, color: '#E74C3C' }}
                      >
                        🔴 Upcoming
                      </p>
                      <h3
                        className="display-font"
                        style={{
                          fontSize: 'clamp(20px, 3vw, 26px)',
                          lineHeight: 1.2,
                          marginBottom: 10,
                          fontWeight: 800,
                        }}
                      >
                        {e.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 13,
                          color: 'var(--muted)',
                          marginBottom: 6,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {e.date} · {e.time} · {e.format}
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
                        {e.price}
                        {e.seatsTotal ? ` · ${e.seatsTotal} seats total` : ''}
                      </p>
                      <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                        {e.description}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <Link
                        href={e.registerHref}
                        className="btn btn-3d"
                        style={{ padding: '12px 22px', fontSize: 15 }}
                      >
                        Register →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PAST ───────────────────────────────────── */}
      <section style={{ background: '#fdfaf6', padding: '80px 20px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <h2
            className="display-font"
            style={{
              fontSize: 'clamp(26px, 5vw, 36px)',
              marginBottom: 28,
              lineHeight: 1.1,
            }}
          >
            Past events
          </h2>

          {PAST_EVENTS.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7 }}>
              Recordings and recaps will appear here after each event.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {PAST_EVENTS.map((e) => (
                <div
                  key={e.id}
                  style={{
                    padding: 22,
                    border: '2px solid #1a1a1a',
                    background: '#fff',
                    boxShadow: '4px 4px 0 0 #1a1a1a',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 12,
                      color: 'var(--muted)',
                      marginBottom: 8,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {e.date}
                    {e.attendees ? ` · ${e.attendees} attendees` : ''}
                  </p>
                  <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>
                    {e.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {e.recordingHref && (
                      <a
                        href={e.recordingHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 14, fontWeight: 700, textDecoration: 'underline' }}
                      >
                        Watch recording →
                      </a>
                    )}
                    {e.recapHref && (
                      <a
                        href={e.recapHref}
                        style={{ fontSize: 14, fontWeight: 700, textDecoration: 'underline' }}
                      >
                        Recap →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
