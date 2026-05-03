import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teaching & Mentoring',
  description: 'Workshops, 1:1 mentoring, speaking engagements, and portfolio reviews by Devashish Singh. Practical cybersecurity, AI development, and career skills.',
  keywords: ['teaching', 'workshops', 'mentoring', 'speaking', 'portfolio review', 'cybersecurity training', 'Devashish Singh'],
  alternates: { canonical: '/teaching' },
  openGraph: {
    title: 'Teaching & Mentoring — Devashish Singh',
    description: 'Workshops, 1:1 mentoring, speaking engagements, and portfolio reviews. Practical skills for teams, creators, and early professionals.',
    url: '/teaching',
  },
}

export default function Teaching(){
  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-4xl">Teaching & Mentoring</h1>
      <p className="mt-4 text-gray-700 max-w-3xl">I run workshops, portfolio reviews, and mentoring for students, creators, and teams. Sessions focus on practical skills, narrative clarity and measurable outcomes.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
          <h4 className="font-semibold" style={{ fontSize: 18, marginBottom: 8 }}>Workshops</h4>
          <p className="text-sm text-gray-700" style={{ lineHeight: 1.7 }}>Custom sessions for teams and organisations covering product thinking, portfolio building, cybersecurity fundamentals, and AI-assisted development workflows.</p>
        </div>
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
          <h4 className="font-semibold" style={{ fontSize: 18, marginBottom: 8 }}>1:1 Mentoring</h4>
          <p className="text-sm text-gray-700" style={{ lineHeight: 1.7 }}>Long-term mentoring for creators and early professionals. We focus on career strategy, skill gaps, project feedback, and building a professional narrative that stands out.</p>
        </div>
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎤</div>
          <h4 className="font-semibold" style={{ fontSize: 18, marginBottom: 8 }}>Speaking & Talks</h4>
          <p className="text-sm text-gray-700" style={{ lineHeight: 1.7 }}>Available for keynotes, panel discussions, and guest lectures on topics including digital transformation, cybersecurity, and building with AI.</p>
        </div>
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
          <h4 className="font-semibold" style={{ fontSize: 18, marginBottom: 8 }}>Portfolio Reviews</h4>
          <p className="text-sm text-gray-700" style={{ lineHeight: 1.7 }}>Detailed, structured feedback on your portfolio, resume, or personal site. Get clarity on positioning and how to communicate your value effectively.</p>
        </div>
      </div>
    </section>
  )
}
