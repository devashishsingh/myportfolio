import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join the Builders Hub — Request Invitation',
  description:
    'Apply to join the Builders Hub — a curated community of founders, developers, and operators building secure, AI-led products together. Request your invitation now.',
  keywords: [
    'builders hub',
    'curated tech community',
    'founder community',
    'developer community',
    'cybersecurity community',
    'AI builders community',
    'indie hackers community',
    'request invitation',
    'Devashish Singh community',
  ],
  alternates: { canonical: '/community/join' },
  openGraph: {
    title: 'Join the Builders Hub — Devashish Singh',
    description:
      'A curated, invitation-only community for founders, developers, and operators. Apply to join the Builders Hub.',
    url: '/community/join',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Builders Hub',
    description:
      'A curated, invitation-only community for founders, developers, and operators.',
  },
}

export default function CommunityJoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
