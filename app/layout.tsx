import './globals.css'
import Script from 'next/script'
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
        <meta property="og:image" content="/favicon.svg" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" />
        <link rel="canonical" href="/" />
        <Script id="microsoft-clarity" strategy="beforeInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","w7et9jfxj4");`}
        </Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-RBJJRE06QR" strategy="beforeInteractive" />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-RBJJRE06QR');`}
        </Script>
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
