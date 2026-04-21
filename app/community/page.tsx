import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community — Devashish Singh',
  description: 'A curated community where ideas are protected, fuelled, and nurtured — never stolen. Share, showcase, and grow your tech ideas into full-fledged solutions with mentorship and collaboration.',
  openGraph: {
    title: 'Community — Devashish Singh',
    description: 'A safe space to fuel ideas, showcase products, and grow innovations into reality — together.',
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
