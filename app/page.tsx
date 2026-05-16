import Hero from '../components/Hero'
import ServiceCard from '../components/ServiceCard'
import HomeInteractive from '../components/HomeInteractive'
import TextReveal from '../components/TextReveal'
import Link from 'next/link'
import { getAllPosts } from '../lib/mdx'
import { nextUpcomingEvent } from '../lib/events'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devashishsingh.com'

export default async function Home() {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Devashish Singh',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/blog?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  const allPosts = await getAllPosts()
  const latestPosts = allPosts.slice(0, 3)
  const upcoming = nextUpcomingEvent()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeInteractive>
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="pt-12">
          <Hero />
        </section>

        {/* ── THREE PATHS ─────────────────────────────────── */}
        <section className="container-wide mt-12">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p className="muted-label" style={{ marginBottom: 8 }}>Three ways to work with me</p>
            <TextReveal
              as="h2"
              className="display-font"
              style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.1 }}
            >
              Choose Your Path
            </TextReveal>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ServiceCard
              title="🎓 Learn & Train"
              subtitle="Courses · Labs · Cohorts"
              href="/learn"
              cta="Explore Programs →"
              icon="mentor"
            >
              Hands-on cybersecurity courses, labs, and job-oriented training. From beginner to advanced. Cohorts, self-paced, and 1:1 mentorship.
            </ServiceCard>
            <ServiceCard
              title="🎤 Events & Workshops"
              subtitle="Live sessions"
              href="/events"
              cta="See Events →"
              icon="build"
            >
              Free and paid workshops, seminars, and live sessions on cybersecurity careers, tools, and real-world skills.
            </ServiceCard>
            <ServiceCard
              title="💼 Work With Me"
              subtitle="Consulting & 1:1"
              href="/contact"
              cta="Get in Touch →"
              icon="community"
            >
              Security consulting, posture reviews, and advisory for startups and businesses. Also available for 1:1 career mentorship.
            </ServiceCard>
          </div>
        </section>

        {/* ── NEXT UPCOMING EVENT (conditional) ───────────── */}
        {upcoming && (
          <section className="container-wide mt-12">
            <div
              style={{
                border: '2px solid var(--text-primary)',
                borderRadius: 14,
                padding: 'clamp(20px, 4vw, 32px)',
                background: 'var(--surface-2)',
                boxShadow: '6px 6px 0 0 var(--text-primary)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 24,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                <p
                  className="muted-label"
                  style={{ marginBottom: 8, color: '#E74C3C', letterSpacing: '0.14em' }}
                >
                  🔴 Next Event
                </p>
                <h3
                  className="display-font"
                  style={{
                    fontSize: 'clamp(22px, 3.5vw, 30px)',
                    lineHeight: 1.15,
                    margin: '0 0 10px',
                    fontWeight: 800,
                  }}
                >
                  {upcoming.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.04em',
                    margin: '0 0 6px',
                  }}
                >
                  {upcoming.date} · {upcoming.time} · {upcoming.format}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {upcoming.price}
                  {upcoming.seatsTotal ? ` · Only ${upcoming.seatsTotal} Seats` : ''}
                </p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Link
                  href={upcoming.registerHref}
                  className="btn btn-3d"
                  style={{ padding: '14px 24px', fontSize: 15 }}
                >
                  Register Now →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── LATEST WRITING & VIDEOS ─────────────────────── */}
        <section className="container-wide mt-12" style={{ paddingBottom: 60 }}>
          <div style={{ marginBottom: 16 }}>
            <p className="muted-label" style={{ marginBottom: 8 }}>From the blog</p>
            <TextReveal
              as="h2"
              className="display-font"
              style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.1 }}
            >
              Latest Writing & Videos
            </TextReveal>
            <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 15 }}>
              Practical notes on cybersecurity, training, and the craft.
            </p>
          </div>
          <div
            style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {latestPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="featured-post-card"
                style={{
                  display: 'block',
                  padding: 20,
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: '#fff',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform .2s ease, box-shadow .2s ease',
                  borderRadius: 8,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontFamily: "'IBM Plex Mono', monospace",
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: 8,
                  }}
                >
                  {(p.tags && p.tags[0]) || 'Writing'} · {p.date}
                </p>
                <h4
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginBottom: 10,
                    color: 'var(--text-primary)',
                  }}
                >
                  {p.title}
                </h4>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {p.description || ''}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  Read more →
                </span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <Link
              href="/blog"
              className="btn-outline"
              style={{ display: 'inline-block', padding: '10px 20px' }}
            >
              All writing →
            </Link>
          </div>
        </section>
      </HomeInteractive>
    </>
  )
}
