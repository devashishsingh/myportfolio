import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Session',
  description: 'Book a 1:1 session with Devashish Singh — mentorship, consulting, or workshop. Choose your session type, preferred time slot, and timezone.',
  keywords: ['book session', 'mentorship booking', 'consulting session', '1:1 coaching', 'cybersecurity mentor', 'Devashish Singh'],
  alternates: { canonical: '/book-session' },
  openGraph: {
    title: 'Book a Session — Devashish Singh',
    description: 'Book a 1:1 mentorship, consulting, or workshop session with Devashish Singh. Flexible slots across all major timezones.',
    url: '/book-session',
  },
}

export default function BookSessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
