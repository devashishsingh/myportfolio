import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devashishsingh.com'

export const metadata: Metadata = {
  title: 'Project-Based Online Courses — Pay Only on Completion',
  description:
    'Hands-on, project-first online courses in cybersecurity, AI, indie SaaS, web development, and more. Learn by building real projects with Devashish Singh — and pay only when you finish.',
  keywords: [
    'project based online courses',
    'pay after completion courses',
    'hands on cybersecurity course',
    'learn AI by building',
    'indie SaaS course',
    'cybersecurity training',
    'AI for builders',
    'practical coding bootcamp',
    'cohort based course',
    'live cohort cybersecurity',
    'mentor led courses',
    'Devashish Singh courses',
    'study together',
    'one stop learning shop',
  ],
  alternates: { canonical: '/study' },
  openGraph: {
    type: 'website',
    title: 'Let’s Study Together — Project-Based Courses with Devashish Singh',
    description:
      'Your one-stop shop for hands-on learning across cybersecurity, AI, indie SaaS and more. Build real projects in cohorts and pay only on completion.',
    url: `${siteUrl}/study`,
    images: [{ url: '/og/png/home', width: 1200, height: 630, alt: 'Let’s Study Together — Project-First Courses' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Let’s Study Together — Project-Based Courses',
    description:
      'Hands-on cohorts in cybersecurity, AI, indie SaaS and more. Build real projects, pay only on completion.',
    images: ['/og/png/home'],
  },
}

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  const courseListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Devashish Singh — Let’s Study Together',
    url: `${siteUrl}/study`,
    description:
      'Project-first cohort-based online courses across cybersecurity, AI, indie SaaS, cloud, and more. Pay only on completion.',
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
