import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devashishsingh.com'

export const metadata: Metadata = {
  title: 'Cyber Foundations Cohort — Land your first cybersecurity role in 90 days',
  description:
    '12-week cybersecurity cohort taught by an industry practitioner. Real labs, live capstones, recruiter intros for top grads. Free 5-day email mini-course. Early-bird seats from ₹9,999.',
  keywords: [
    'cybersecurity cohort course',
    'learn cybersecurity online',
    'cybersecurity bootcamp india',
    'SOC analyst training',
    'GRC training course',
    'AppSec course',
    'DMARC training',
    'cybersecurity mentor',
    'land cybersecurity job',
    'career switch to cybersecurity',
    'free cybersecurity email course',
    'cohort based course',
    'Devashish Singh courses',
  ],
  alternates: { canonical: '/study' },
  openGraph: {
    type: 'website',
    title: 'Cyber Foundations Cohort — Devashish Singh',
    description:
      '12-week cybersecurity cohort with real labs, live capstones, and recruiter intros. Free 5-day email mini-course to start.',
    url: `${siteUrl}/study`,
    images: [{ url: '/og/png/home', width: 1200, height: 630, alt: 'Cyber Foundations Cohort' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber Foundations Cohort — Land your first cybersecurity role',
    description:
      '12-week cohort with real labs, live capstones, recruiter intros. Free 5-day email mini-course.',
    images: ['/og/png/home'],
  },
}

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  const courseListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Devashish Singh — Cyber Foundations',
    url: `${siteUrl}/study`,
    description:
      'Cohort-based cybersecurity courses with hands-on labs, live capstones, and recruiter intros. Free 5-day email mini-course available.',
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
