import './globals.css'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import FeedbackWidget from '../components/FeedbackWidget'
import CursorFollower from '../components/CursorFollower'
import ScrollProgress from '../components/ScrollProgress'
import PageTransition from '../components/PageTransition'
import AnnouncementModal from '../components/AnnouncementModal'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devashishsingh.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Devashish Singh — Cyber Coach, Mentor & Advisor',
    template: '%s | Devashish Singh',
  },
  description: 'Cyber Coach, Mentor & Advisor helping founders, developers, and engineering teams with cybersecurity strategy, AI-led development, and technical leadership. Based in Malaysia.',
  keywords: [
    'cyber coach', 'cybersecurity mentor', 'security advisor', 'technical mentor',
    'AI development', 'startup advisor', 'Devashish Singh', 'Malaysia',
    'cybersecurity coaching', 'incident response', 'product strategy', 'tech leadership',
  ],
  authors: [{ name: 'Devashish Singh', url: siteUrl }],
  creator: 'Devashish Singh',
  publisher: 'Devashish Singh',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Devashish Singh',
    title: 'Devashish Singh — Cyber Coach, Mentor & Advisor',
    description: 'Cyber Coach, Mentor & Advisor helping founders, developers, and teams navigate cybersecurity, AI-led development, and technical leadership. Based in Malaysia.',
    images: [{ url: '/og/png/home', width: 1200, height: 630, alt: 'Devashish Singh — Cyber Coach, Mentor & Advisor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devashish Singh — Cyber Coach, Mentor & Advisor',
    description: 'Cyber Coach, Mentor & Advisor helping founders, developers, and teams navigate cybersecurity, AI-led development, and technical leadership.',
    images: ['/og/png/home'],
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({children}:{children:React.ReactNode}){
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Devashish Singh',
    url: siteUrl,
    jobTitle: 'Cyber Coach, Mentor & Advisor',
    description: 'Cyber Coach, Mentor & Advisor helping founders, developers, and engineering teams with cybersecurity strategy, AI-led development, and technical leadership.',
    worksFor: { '@type': 'Organization', name: 'Independent' },
    sameAs: [
      'https://www.linkedin.com/in/devashishsingh',
      'https://github.com/devashishsingh',
    ],
    knowsAbout: ['Cybersecurity', 'AI Development', 'Technical Leadership', 'Incident Response', 'Startup Advisory', 'Mentoring'],
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","w7et9jfxj4");`}
        </Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-RBJJRE06QR" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-RBJJRE06QR');`}
        </Script>
      </head>
      <body>
        <ScrollProgress />
        <Header />
        <main className="py-12">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsAppButton />
        <FeedbackWidget />
        <AnnouncementModal />
        <CursorFollower />
      </body>
    </html>
  )
}
