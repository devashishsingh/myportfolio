import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teaching & Mentoring',
  description: '1:1 mentoring, learning cohorts, and portfolio reviews by Devashish Singh. Practical cybersecurity, AI development, and career skills.',
  keywords: ['teaching', 'mentoring', 'portfolio review', 'cybersecurity training', 'cohorts', 'Devashish Singh'],
  alternates: { canonical: '/teaching' },
  openGraph: {
    title: 'Teaching & Mentoring — Devashish Singh',
    description: '1:1 mentoring, learning cohorts, and portfolio reviews. Practical skills for creators and early professionals.',
    url: '/teaching',
  },
}

export default function Teaching(){
  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-4xl">Teaching & Mentoring</h1>
      <p className="mt-4 text-gray-700 max-w-3xl">I run small learning cohorts, 1:1 mentoring, and portfolio reviews for students, creators, and early professionals. Sessions focus on practical skills, narrative clarity, and measurable outcomes.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Cohorts</p>
          <h4 className="font-semibold" style={{ fontSize: 18, marginBottom: 8 }}>Learning Cohorts</h4>
          <p className="text-sm text-gray-700" style={{ lineHeight: 1.7 }}>Small, hands-on cohorts in cybersecurity and AI. Live sessions, weekly labs, personal feedback. <a href="/study" style={{ textDecoration: 'underline' }}>See current cohorts →</a></p>
        </div>
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Mentoring</p>
          <h4 className="font-semibold" style={{ fontSize: 18, marginBottom: 8 }}>1:1 Mentoring</h4>
          <p className="text-sm text-gray-700" style={{ lineHeight: 1.7 }}>Long-term mentoring for creators and early professionals. We focus on career strategy, skill gaps, project feedback, and building a professional narrative that stands out.</p>
        </div>
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Review</p>
          <h4 className="font-semibold" style={{ fontSize: 18, marginBottom: 8 }}>Portfolio Reviews</h4>
          <p className="text-sm text-gray-700" style={{ lineHeight: 1.7 }}>Detailed, structured feedback on your portfolio, resume, or personal site. Get clarity on positioning and how to communicate your value effectively.</p>
        </div>
      </div>
    </section>
  )
}
