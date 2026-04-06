import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import FeedbackWidget from '../components/FeedbackWidget'

export const metadata = {
  title: 'Devashish Singh — Cyber Coach, Mentor & Advisor',
  description: 'Coach and advisor for founders and engineering teams — security-aware product strategy, incident response, and technical leadership.',
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content="/og/2026-04-04-intro.png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" />
        <link rel="canonical" href="/" />
      </head>
      <body>
        <Header />
        <main className="py-12">{children}</main>
        <Footer />
        <WhatsAppButton />
        <FeedbackWidget />
      </body>
    </html>
  )
}
