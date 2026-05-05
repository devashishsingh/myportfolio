import type { Metadata } from 'next'
import ServiceCard from '../../components/ServiceCard'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Consulting, cybersecurity reviews, learning cohorts, mentoring, workshops, and 1:1 sessions by Devashish Singh. Each engagement scoped to clear outcomes.',
  keywords: ['cybersecurity consulting', 'mentoring', 'portfolio review', 'workshops', 'technical advisory', 'learning cohorts', 'Devashish Singh'],
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services — Devashish Singh',
    description: 'Consulting, cybersecurity reviews, learning cohorts, mentoring, workshops, and 1:1 sessions. Scoped to clear outcomes.',
    url: '/services',
  },
}

export default function Services(){
  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-4xl">Services</h1>
      <p className="mt-4 text-gray-700 max-w-3xl">
        Six clear ways to work together. Pick what fits — every engagement is scoped to a defined
        outcome, with timelines and deliverables agreed upfront.
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <ServiceCard title="Consulting & Advisory" subtitle="For founders & leadership" href="/contact" cta="Get in Touch">
          Strategic guidance on product direction, security posture, and digital transformation. Typically a multi-week engagement with weekly working sessions and a written brief.
        </ServiceCard>

        <ServiceCard title="Cybersecurity Reviews" subtitle="For SMBs & startups" href="/contact" cta="Request a Review">
          DMARC fixes, email deliverability audits, and practical security posture reviews. You get a prioritised action list — not a 60-page PDF that nobody reads.
        </ServiceCard>

        <ServiceCard title="Learning Courses & Mentoring" subtitle="Project-first cohorts" href="/study" cta="Browse Courses">
          Small cohorts in cybersecurity, AI, and indie SaaS. Every course ends with a shipped project, and you only pay when you finish. Ongoing 1:1 mentoring also available.
        </ServiceCard>

        <ServiceCard title="Workshops & Talks" subtitle="For teams & events" href="/contact" cta="Inquire">
          Custom workshops for engineering and product teams, plus keynotes and guest lectures on cybersecurity, AI-assisted development, and building in public.
        </ServiceCard>

        <ServiceCard title="Portfolio & Positioning" subtitle="For early professionals" href="/contact" cta="Get Started">
          Structured review of your portfolio, resume, or personal site. You leave with concrete edits, a sharper narrative, and a clear answer to &ldquo;why you?&rdquo;
        </ServiceCard>

        <ServiceCard title="1:1 Booking" subtitle="Single session" href="/book-session" cta="Book a Session">
          A focused 45-minute call for a specific question — career pivot, portfolio feedback, security gut-check, or project review. Async follow-up notes included.
        </ServiceCard>
      </div>
    </section>
  )
}
