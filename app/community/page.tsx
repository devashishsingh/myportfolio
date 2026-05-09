import Link from 'next/link'
import type { Metadata } from 'next'
import MonthlySpotlight from './MonthlySpotlight'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Community',
  description: 'A curated community where ideas are protected, fuelled, and nurtured — never stolen. Share, showcase, and grow your tech ideas into full-fledged solutions with mentorship and collaboration.',
  keywords: ['developer community', 'tech community', 'startup community', 'mentorship', 'collaboration', 'Devashish Singh', 'Malaysia', 'Southeast Asia'],
  alternates: { canonical: '/community' },
  openGraph: {
    title: 'Community — Devashish Singh',
    description: 'A safe space to fuel ideas, showcase products, and grow innovations into reality — together.',
    url: '/community',
  },
}

const PILLARS = [
  {
    icon: '🛡',
    title: 'Curated, Not Chaotic',
    desc: 'Every member is reviewed. Every post is moderated. Quality over noise.',
  },
  {
    icon: '🌍',
    title: 'Region-Aware',
    desc: 'Connect with builders in your geography. Southeast Asia, Middle East, Europe, and beyond.',
  },
  {
    icon: '🤝',
    title: 'Fuel Ideas, Not Steal Them',
    desc: 'Your ideas are yours. This community exists to motivate, challenge, and nurture your ideas until they become real, working solutions.',
  },
  {
    icon: '✍️',
    title: 'Publish & Lead',
    desc: 'Submit articles, insights, and project writeups. Get featured on the platform.',
  },
  {
    icon: '🚀',
    title: 'Showcase Your Product',
    desc: 'Built something? Tell the world. Feature your creation, share your story, and get the visibility your product deserves.',
  },
  {
    icon: '🧭',
    title: 'Mentor-Led Ecosystem',
    desc: 'Not a faceless platform. Led by a mentor who helps you refine, validate, and grow your ideas with real-world experience.',
  },
]

const AUDIENCES = [
  'Tech Professionals',
  'Startup Founders',
  'Cybersecurity Learners',
  'AI & ML Builders',
  'Digital Transformation Thinkers',
  'Students & Career Starters',
  'Innovation Enthusiasts',
  'Open Source Contributors',
]

export default function CommunityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="community-hero">
        <div className="container-wide" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
          <p className="muted-label" style={{ marginBottom: 12 }}>A Curated Innovation Community</p>
          <h1 className="display-font" style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1, marginBottom: 20 }}>
            Builders Hub
          </h1>
          <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.7 }}>
            A safe, curated space where your ideas are protected — never stolen. We motivate, fuel, and 
            nurture ideas until they become full-fledged tech-driven solutions. Built something? Showcase it to the world.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/community/join" className="btn btn-3d">Join the Community</Link>
            <Link href="#subscribe" className="btn-outline">Subscribe for Updates</Link>
          </div>
          <p style={{ marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
            Already a member? <Link href="/community/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>Sign in →</Link>
          </p>
        </div>
      </section>

      {/* Who is it for */}
      <section className="container-wide" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <h2 className="display-font" style={{ fontSize: 28, marginBottom: 8, textAlign: 'center' }}>Who Is This For?</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 32 }}>
          Professionals and builders who think beyond the ordinary.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {AUDIENCES.map(a => (
            <span key={a} className="community-badge">{a}</span>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <h2 className="display-font" style={{ fontSize: 28, marginBottom: 8, textAlign: 'center' }}>
          Why This Community?
        </h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 40, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          This is not another generic forum. Your ideas stay yours. We exist to fuel them, not take them.
        </p>
        <div className="community-pillars-grid">
          {PILLARS.map(p => (
            <div key={p.title} className="community-pillar-card">
              <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{p.icon}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inside the Community — Discord channel preview */}
      <section style={{ background: '#fdfaf6', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container-wide" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <h2 className="display-font" style={{ fontSize: 28, marginBottom: 8, textAlign: 'center' }}>Inside the Community</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 32, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
            Channels available to members — where the daily conversations happen.
          </p>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: 22, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '5px 5px 0 0 #1a1a1a' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
              {[
                { e: '📣', n: 'announcements' },
                { e: '👋', n: 'introductions' },
                { e: '❓', n: 'ask-anything' },
                { e: '🔐', n: 'cyber-discussions' },
                { e: '🤖', n: 'ai-and-tools' },
                { e: '🧪', n: 'lab-help' },
                { e: '📚', n: 'study-together' },
                { e: '🚀', n: 'project-showcase' },
                { e: '💼', n: 'career-and-jobs' },
                { e: '🌏', n: 'regional-channels' },
                { e: '🎯', n: 'weekly-challenge' },
                { e: '🏆', n: 'wins' },
              ].map(ch => (
                <li key={ch.n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: '#1a1a1a', background: '#fdfaf6', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <span style={{ fontSize: 16 }}>{ch.e}</span>
                  <span>#{ch.n}</span>
                </li>
              ))}
            </ul>
          </div>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 24, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            Join the Discord alongside the website — both are part of the same community. The Discord is where the daily conversations happen.
          </p>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <a href="https://discord.gg/25ufGG4fSR" target="_blank" rel="noopener noreferrer" className="btn btn-3d" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              <span>Join Discord →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Monthly Top-3 spotlight */}
      <MonthlySpotlight />

      {/* What You Can Do */}
      <section style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container-wide" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <h2 className="display-font" style={{ fontSize: 28, marginBottom: 32, textAlign: 'center' }}>
            What You Can Do Here
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="community-action-card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Share Ideas Safely</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Share your ideas in a trusted space. Get honest feedback, motivation, and guidance — without the fear of someone running off with your concept.</p>
            </div>
            <div className="community-action-card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Feature Your Product</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Built something amazing? Showcase your product, tell your story, and let the world see what you&apos;ve created. This is your stage.</p>
            </div>
            <div className="community-action-card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Fuel Ideas Into Reality</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>From raw concept to working solution — get mentorship, collaborators, and the push you need to ship your idea.</p>
            </div>
            <div className="community-action-card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Connect by Region</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Discover builders in Southeast Asia, Middle East, Europe, and globally.</p>
            </div>
            <div className="community-action-card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Request Mentorship</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Connect with experienced professionals who help you refine and validate — not compete with you.</p>
            </div>
            <div className="community-action-card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Show the World</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Submit your startup, tool, or side project for the spotlight. Get the visibility and credibility your work deserves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Start Here — what to do when you arrive */}
      <section className="container-wide" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <h2 className="display-font" style={{ fontSize: 28, marginBottom: 8, textAlign: 'center' }}>What to do when you arrive</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 32, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          A quick five-step starter so your first week feels less like lurking and more like belonging.
        </p>
        <ol style={{ maxWidth: 720, margin: '0 auto', padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
          {[
            { n: 1, t: 'Introduce yourself in #introductions', d: "Where you're from, what you want to learn." },
            { n: 2, t: 'Check #announcements', d: 'For the latest cohort and event dates.' },
            { n: 3, t: 'Post in #ask-anything', d: 'No question is too basic.' },
            { n: 4, t: 'Share something you\u2019re building in #project-showcase', d: 'Even early drafts. Especially early drafts.' },
            { n: 5, t: 'Join the #weekly-challenge', d: 'A new real-world challenge every Monday.' },
          ].map(step => (
            <li key={step.n} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 16, padding: 16, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '4px 4px 0 0 #1a1a1a' }}>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: '#1a1a1a', color: '#fffae0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: 16, fontWeight: 700 }}>{step.n}</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{step.t}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{step.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Subscribe Section */}
      <section id="subscribe" className="container-wide" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <h2 className="display-font" style={{ fontSize: 28, marginBottom: 8 }}>Stay in the Loop</h2>
        <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Not ready to join yet? Subscribe for curated updates, featured posts, community news, and selected opportunities.
        </p>
        <SubscribeInline />
      </section>

      {/* Final CTA */}
      <section style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
        <div className="container-wide" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <h2 className="display-font" style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: 12, color: '#fff' }}>
            Your Idea Deserves to Become Reality
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 28px' }}>
            Join a community that protects your ideas, fuels your vision, and helps you ship.
            Built something? Showcase it. Still building? We will get you there.
          </p>
          <Link href="/community/join" className="btn btn-3d" style={{ background: '#fff', color: '#000' }}>
            Request Invitation
          </Link>
        </div>
      </section>
    </div>
  )
}

/* Inline subscribe form for this page */
function SubscribeInline() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <Link href="/community/subscribe" className="btn btn-3d">Subscribe for Updates →</Link>
    </div>
  )
}
