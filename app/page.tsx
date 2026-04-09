import Hero from '../components/Hero'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import Link from 'next/link'
import HomeInteractive from '../components/HomeInteractive'

export default function Home(){
  return (
    <HomeInteractive>
      <section className="pt-12">
        <Hero />
      </section>

      <section className="container-wide mt-20">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="muted-label" style={{ marginBottom: 8 }}>How to Engage</p>
          <h2 className="display-font" style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.1 }}>
            Choose Your Path
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <ServiceCard
            title="Mentorship & Coaching"
            subtitle="For students and professionals"
            href="/book-session"
            cta="Book a Session"
            icon="mentor"
          >
            Career guidance, cybersecurity mentoring, AI learning, leadership coaching, and practical 1:1 sessions to help you move forward with clarity and confidence.
          </ServiceCard>
          <ServiceCard
            title="Build With Me"
            subtitle="For startups and businesses"
            href="/contact"
            cta="Let's Collaborate"
            icon="build"
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
            Be part of a curated community to share ideas, collaborate by region, contribute posts, join workshops, and solve real-world digital problems together.
          </ServiceCard>
        </div>
      </section>

      <section className="container-wide mt-20">
        <div style={{ marginBottom: 32 }}>
          <p className="muted-label" style={{ marginBottom: 8 }}>Proof of Execution</p>
          <h2 className="display-font" style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.1, marginBottom: 10 }}>
            Ideas Brought to Life
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
            Real-world platforms, MVPs, and problem-solving systems built through AI-assisted development and low-cost cloud-first execution.
          </p>
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <ProjectCard
            title="InMyBox — DMARC Intelligence Platform"
            category="Cybersecurity SaaS"
            excerpt="AI-powered low-cost platform built to simplify email authentication reporting, visibility, and security posture management for businesses."
            tech={['VS Code', 'AI Tools', 'GitHub', 'Vercel', 'Supabase']}
            href="/work/case-study/sample"
            cta="View Case Study"
          />
          <ProjectCard
            title="Career Intelligence Platform"
            category="AI Platform"
            excerpt="A student-focused intelligence platform designed to provide career clarity, growth roadmaps, and skill direction using AI-powered insights."
            tech={['VS Code', 'Claude', 'Supabase', 'Render']}
            href="/work"
            cta="View Platform"
          />
          <ProjectCard
            title="Digital Waste Optimizer"
            category="Startup MVP"
            excerpt="A platform built to help businesses identify underutilized digital resources and reduce unnecessary technology spend."
            tech={['AI Tools', 'VS Code', 'Cloud Systems', 'GitHub']}
            href="/work"
            cta="View Solution"
          />
          <ProjectCard
            title="Innovation Network Platform"
            category="Community Platform"
            excerpt="A collaborative ecosystem for innovators, thinkers, and builders to share ideas, showcase products, and solve real-world digital problems together."
            tech={['Next.js', 'Prisma', 'SQLite', 'Tailwind CSS']}
            href="/community"
            cta="Explore"
          />
        </div>
      </section>

      {/* Community Section */}
      <section className="home-community-section">
        <div className="container-wide" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <p className="muted-label" style={{ marginBottom: 8 }}>Builders Hub</p>
              <h2 className="display-font" style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.1, marginBottom: 16 }}>
                Where Ideas Are Fuelled, Not Stolen
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                A curated community that protects your ideas and helps them grow into real, tech-driven solutions. 
                Share safely, get mentorship, showcase your product, and show the world what you have built.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/community/join" className="btn btn-3d">Request Invitation</Link>
                <Link href="/community" className="btn-outline">Learn More</Link>
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
      <section style={{ background: '#000', color: '#fff' }}>
        <div className="container-wide" style={{ paddingTop: 48, paddingBottom: 48, textAlign: 'center' }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#fff' }}>Stay in the Loop</h3>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 20, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            Subscribe for curated insights, featured posts, and community updates.
          </p>
          <Link href="/community/subscribe" className="btn btn-3d" style={{ background: '#fff', color: '#000' }}>
            Subscribe for Updates
          </Link>
        </div>
      </section>

      <section className="container-wide mt-20">
        <h3 className="text-lg font-semibold">Featured writing</h3>
        <p className="mt-4 text-gray-700">Thoughtful pieces on product thinking, design, and research.</p>
      </section>
    </HomeInteractive>
  )
}
