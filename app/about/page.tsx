import type { Metadata } from 'next'
import profile from '../../data/profile.json'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Devashish Singh — Cyber Coach, Mentor & Advisor. Former Information Security Advisor at AirAsia. Helping founders and teams build securely.',
  keywords: ['Devashish Singh', 'about', 'cybersecurity expert', 'AirAsia security', 'mentor', 'advisor', 'Malaysia'],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Devashish Singh — Cyber Coach, Mentor & Advisor',
    description: 'Former Information Security Advisor at AirAsia. Helping founders, developers, and engineering teams navigate cybersecurity and technical leadership.',
    url: '/about',
    type: 'profile',
  },
}

type TeachingLink = { title: string; url?: string; note?: string }
type TimelineItem = { period: string; title: string; company?: string; summary?: string }
type Building = { name: string; description: string }

export default function About(){
  const timeline: TimelineItem[] = (profile as any).timeline || []
  const teachingLinks: TeachingLink[] = profile.teachingLinks || []
  const certifications: string[] = profile.certifications || []
  const education: string[] = profile.education || []
  const building: Building[] = (profile as any).building || []

  return (
    <section className="container-wide" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="display-font text-4xl">About</h1>

      {/* Professional Summary */}
      <p className="mt-6 max-w-3xl text-gray-700">{profile.summary}</p>

      {/* Career Timeline */}
      {timeline.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold">Career Timeline</h2>
          <div className="mt-4 space-y-4">
            {timeline.map((t, i) => (
              <div key={i} className="p-4 border">
                <div className="text-xs uppercase tracking-wider text-gray-500">{t.period}</div>
                <div className="font-semibold mt-1">{t.title}{t.company ? ` — ${t.company}` : ''}</div>
                {t.summary ? <div className="mt-2 text-gray-700">{t.summary}</div> : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Education */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold">Certifications</h3>
          {certifications.length ? (
            <ul className="mt-3 list-disc pl-6 text-gray-700">
              {certifications.map((c, i) => (<li key={i}>{c}</li>))}
            </ul>
          ) : (
            <p className="mt-3 text-gray-500 italic">Certifications being updated — check back soon.</p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">Education</h3>
          {education.length ? (
            <ul className="mt-3 list-disc pl-6 text-gray-700">
              {education.map((ed, i) => (<li key={i}>{ed}</li>))}
            </ul>
          ) : (
            <p className="mt-3 text-gray-500 italic">Education details being updated — check back soon.</p>
          )}
        </div>
      </div>

      {/* Teaching & Courses */}
      {teachingLinks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold">Teaching & Courses</h2>
          <ul className="mt-4 list-disc pl-6 text-gray-700">
            {teachingLinks.map((t, i) => (
              <li key={i} className="mt-2">
                {t.url ? (
                  <a href={t.url} className="underline" target={t.url.startsWith('/') ? undefined : '_blank'} rel={t.url.startsWith('/') ? undefined : 'noopener noreferrer'}>{t.title}</a>
                ) : (
                  <span>{t.title}</span>
                )}
                {t.note ? <div className="text-sm text-gray-500">{t.note}</div> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What I'm Building */}
      {building.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold">What I&apos;m Building</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-6">
            {building.map((b, i) => (
              <div key={i} className="p-4 border">
                <div className="font-semibold">{b.name}</div>
                <div className="mt-2 text-gray-700">{b.description}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            See more on <a href="/work" className="underline">my work page →</a>
          </p>
        </div>
      )}
    </section>
  )
}
