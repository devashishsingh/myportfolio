import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devashishsingh.com'

export const metadata: Metadata = {
  title: 'Cyber & AI Cohorts — Learn with Devashish Singh',
  description:
    'Small, hands-on cybersecurity and AI cohorts taught personally by an indie practitioner with 14+ years in the field. Live sessions, weekly labs, personal feedback. Free 5-day email intro to start.',
  keywords: [
    'cybersecurity cohort',
    'learn cybersecurity online',
    'AI cohort course',
    'small cohort cybersecurity',
    'cybersecurity mentor',
    'free cybersecurity email course',
    'cohort based course',
    'Devashish Singh courses',
  ],
  alternates: { canonical: '/study' },
  openGraph: {
    type: 'website',
    title: 'Cyber & AI Cohorts — Devashish Singh',
    description:
      'Small, hands-on cohorts taught personally. Live sessions, weekly labs, personal feedback. Free 5-day email intro to start.',
    url: `${siteUrl}/study`,
    images: [{ url: '/og/png/home', width: 1200, height: 630, alt: 'Cyber & AI Cohorts' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber & AI Cohorts — Learn with Devashish Singh',
    description:
      'Small, hands-on cohorts. Live sessions, weekly labs, personal feedback. Free 5-day email intro.',
    images: ['/og/png/home'],
  },
}

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  const courseListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Devashish Singh — Cyber & AI Cohorts',
    url: `${siteUrl}/study`,
    description:
      'Small, hands-on cybersecurity and AI cohorts with live sessions, weekly labs, and personal feedback. Free 5-day email intro available.',
    sameAs: [
      'https://www.linkedin.com/in/devashishsingh',
      'https://github.com/devashishsingh',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListJsonLd) }}
      />
      {children}
    </>
  )
}
