'use client'

import Hero from '../components/Hero'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import Link from 'next/link'
import HomeInteractive from '../components/HomeInteractive'
import TextReveal from '../components/TextReveal'
import CounterReveal from '../components/CounterReveal'
import DragGallery from '../components/DragGallery'
import MagneticButton from '../components/MagneticButton'
import BookingModal from '../components/BookingModal'
import { useState } from 'react'
import type { SessionType } from '../lib/booking-config'

export default function Home(){
  const [bookingSession, setBookingSession] = useState<SessionType | null>(null)

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Devashish Singh',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://devashishsingh.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://devashishsingh.com'}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
    <HomeInteractive>
      <section className="pt-12">
        <Hero />
      </section>

      <section className="container-wide mt-12">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p className="muted-label" style={{ marginBottom: 8 }}>How to Engage</p>
          <TextReveal as="h2" className="display-font" style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.1 }}>
            Choose Your Path
          </TextReveal>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ServiceCard
            title="Mentorship & Coaching"
            subtitle="For students and professionals"
            cta="Book a Session"
            icon="mentor"
            onCtaClick={() => setBookingSession('mentorship')}
          >
            Career guidance, cybersecurity mentoring, AI learning, leadership coaching, and practical 1:1 sessions to help you move forward with clarity and confidence.
          </ServiceCard>
          <ServiceCard
            title="Build With Me"
            subtitle="For startups and businesses"
            cta="Start a Conversation"
            icon="build"
            onCtaClick={() => setBookingSession('collaborate')}
          >
            Turn ideas into secure digital realities through startup advisory, MVP planning, digital foundations, AI-led workflows, and practical execution support.
          </ServiceCard>
          <ServiceCard
            title="Join My Community"
            subtitle="For innovators and builders"
            href="/community/join"
            cta="Request Invitation"
            icon="community"
          >
            Be part of a curated community to share ideas, collaborate by region, contribute posts, and solve real-world digital problems together.
          </ServiceCard>
          <ServiceCard
            title="Let's Study Together"
            subtitle="For students and serious learners"
            href="/study"
            cta="Explore Courses"
            icon="mentor"
          >
            Stop learning in isolation. Build consistency, stay accountable, and focus only on what truly matters. Join structured study sessions designed around real-world skills, guided direction, and practical problem-solving—so your effort actually translates into progress.
          </ServiceCard>
        </div>
      </section>

      <section className="container-wide mt-12">
        <div style={{ marginBottom: 24 }}>
          <p className="muted-label" style={{ marginBottom: 8 }}>Proof of Execution</p>
          <TextReveal as="h2" className="display-font" style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.1, marginBottom: 8 }}>
            Ideas Brought to Life
          </TextReveal>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
            Real-world platforms, MVPs, and problem-solving systems built through AI-assisted development and low-cost cloud-first execution.
          </p>
        </div>
        <DragGallery className="mt-6">
          <div style={{ minWidth: 420, maxWidth: 480, flexShrink: 0 }}>
            <ProjectCard
              title="InMyBox — DMARC Intelligence Platform"
              category="Cybersecurity SaaS"
              excerpt="AI-powered low-cost platform built to simplify email authentication reporting, visibility, and security posture management for businesses."
              tech={['VS Code', 'AI Tools', 'GitHub', 'Vercel', 'Supabase']}
              href="#"
              cta="Coming Soon"
            />
          </div>
          <div style={{ minWidth: 420, maxWidth: 480, flexShrink: 0 }}>
            <ProjectCard
              title="Career Intelligence Platform"
              category="AI Platform"
              excerpt="A student-focused intelligence platform designed to provide career clarity, growth roadmaps, and skill direction using AI-powered insights."
              tech={['VS Code', 'Claude', 'Supabase', 'Render']}
              href="#"
              cta="In Progress"
            />
          </div>
          <div style={{ minWidth: 420, maxWidth: 480, flexShrink: 0 }}>
            <ProjectCard
              title="Digital Waste Optimizer"
              category="Startup MVP"
              excerpt="A platform built to help businesses identify underutilized digital resources and reduce unnecessary technology spend."
              tech={['AI Tools', 'VS Code', 'Cloud Systems', 'GitHub']}
              href="#"
              cta="In Progress"
            />
          </div>
          <div style={{ minWidth: 420, maxWidth: 480, flexShrink: 0 }}>
            <ProjectCard
              title="Innovation Network Platform"
              category="Community Platform"
              excerpt="A collaborative ecosystem for innovators, thinkers, and builders to share ideas, showcase products, and solve real-world digital problems together."
              tech={['Next.js', 'Prisma', 'SQLite', 'Tailwind CSS']}
              href="/community"
              cta="Explore"
            />
          </div>
        </DragGallery>
      </section>

      {/* Stats Section */}
      <section className="container-wide mt-12" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          <div>
            <CounterReveal value={14} suffix="+" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#111', lineHeight: 1 }} />
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>Years Experience</p>
          </div>
          <div>
            <CounterReveal value={20} suffix="+" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#111', lineHeight: 1 }} />
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>Projects Delivered</p>
          </div>
          <div>
            <CounterReveal value={50} suffix="+" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#111', lineHeight: 1 }} />
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>People Mentored</p>
          </div>
          <div>
            <CounterReveal value={8} suffix="" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#111', lineHeight: 1 }} />
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>Countries Reached</p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="home-community-section">
        <div className="container-wide" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center' }}>
            <div>
              <p className="muted-label" style={{ marginBottom: 8 }}>Builders Hub</p>
              <TextReveal as="h2" className="display-font" style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.1, marginBottom: 16 }}>
                Where Ideas Are Fuelled, Not Stolen
              </TextReveal>
              <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                A curated community that protects your ideas and helps them grow into real, tech-driven solutions. 
                Share safely, get mentorship, showcase your product, and show the world what you have built.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <MagneticButton>
                  <Link href="/community/join" className="btn btn-3d">Request Invitation</Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/community" className="btn-outline">Learn More</Link>
                </MagneticButton>
              </div>
            </div>
            <div className="home-community-highlights">
              <div className="home-community-stat">
                <span style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Focus Areas</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {['Cybersecurity', 'AI', 'Startups', 'Innovation', 'Mentorship', 'Digital Transformation'].map(t => (
                    <span key={t} className="community-badge">{t}</span>
                  ))}
                </div>
              </div>
              <div className="home-community-stat" style={{ marginTop: 20 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Regions</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {['Southeast Asia', 'Middle East', 'Europe', 'Global'].map(r => (
                    <span key={r} className="community-badge">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section style={{ background: 'var(--surface-1)', color: 'var(--text-primary)' }}>
        <div className="container-wide" style={{ paddingTop: 32, paddingBottom: 32, textAlign: 'center' }}>
          <TextReveal as="h3" style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>Stay in the Loop</TextReveal>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            Subscribe for curated insights, featured posts, and community updates.
          </p>
          <MagneticButton>
            <Link href="/community/subscribe" className="btn btn-3d">
              Subscribe for Updates
            </Link>
          </MagneticButton>
        </div>
      </section>

      <section className="container-wide mt-12" style={{ paddingBottom: 60 }}>
        <h3 className="text-lg font-semibold" style={{color:'var(--text-primary)'}}>Featured writing</h3>
        <p className="mt-4" style={{color:'var(--text-muted)'}}>Thoughtful pieces on product thinking, design, and research.</p>
        {/* TODO: Make this dynamic by fetching from getAllPosts() in a server component wrapper. Hardcoded for now. */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            {
              slug: '2026-05-07-the-wall-is-breaking-domain-experts-become-builders',
              title: "The Wall Is Breaking: How Domain Experts Are Becoming the World's New Builders",
              date: '2026-05-07',
              category: 'AI',
              description: "13,000 people applied to Anthropic's Claude Code hackathon. The winners? A lawyer, a cardiologist, an infrastructure specialist, and a musician.",
            },
            {
              slug: '2026-05-03-indie-developers-surface-break-the-monopoly',
              title: "Stop Letting Your Code Rot in GitHub — The World Needs What You're Building",
              date: '2026-05-03',
              category: 'Indie Dev',
              description: 'Indie developers hold the power to break platform monopolies and change lives. Here\u2019s why you need to stop hiding.',
            },
            {
              slug: '2026-04-05-why-business-emails-dont-reach-inbox-dmarc',
              title: "Why Your Business Emails Don't Reach the Inbox (And Why It's Costing You More Than You Think)?",
              date: '2026-04-05',
              category: 'Email Security',
              description: 'A practical business-focused guide to why emails land in spam or never arrive, and how DMARC helps improve trust and deliverability.',
            },
          ].map(p => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              style={{
                display: 'block',
                padding: 20,
                border: '1px solid rgba(0,0,0,0.08)',
                background: '#fff',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform .2s ease, box-shadow .2s ease',
              }}
              className="featured-post-card"
            >
              <p style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>{p.category} · {p.date}</p>
              <h4 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, marginBottom: 10, color: 'var(--text-primary)' }}>{p.title}</h4>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.description}</p>
              <span style={{ display: 'inline-block', marginTop: 12, fontSize: 13, fontWeight: 600, textDecoration: 'underline' }}>Read more →</span>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <Link href="/blog" className="btn-outline" style={{ display: 'inline-block', padding: '10px 20px' }}>All writing →</Link>
        </div>
      </section>
    </HomeInteractive>
    {/* Keep modal outside HomeInteractive to avoid section index wrapping side effects */}
    {bookingSession && (
      <BookingModal
        sessionType={bookingSession}
        isOpen={!!bookingSession}
        onClose={() => setBookingSession(null)}
      />
    )}
    </>
  )
}
