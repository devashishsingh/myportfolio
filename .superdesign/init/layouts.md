# Layouts

Shared layout and shell components with full source code.

## RootLayout
- File: app/layout.tsx
- Description: Global app shell and wrapper.

`	sx
import './globals.css'
import Script from 'next/script'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import FeedbackWidget from '../components/FeedbackWidget'
import CursorFollower from '../components/CursorFollower'
import ScrollProgress from '../components/ScrollProgress'
import PageTransition from '../components/PageTransition'

export const metadata = {
  title: 'Devashish Singh â€” Cyber Coach, Mentor & Advisor',
  description: 'Coach and advisor for founders and engineering teams â€” security-aware product strategy, incident response, and technical leadership.',
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
        <ScrollProgress />
        <Header />
        <main className="py-12">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsAppButton />
        <FeedbackWidget />
        <CursorFollower />
      </body>
    </html>
  )
}

`

## Header
- File: components/Header.tsx
- Description: Global top navigation.

`	sx
"use client"
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export default function Header(){
  const [mobileOpen,setMobileOpen] = useState(false)
  const [searchOpen,setSearchOpen] = useState(false)
  const [searchQuery,setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    const handler = (e:KeyboardEvent) => {
      if((e.ctrlKey || e.metaKey) && e.key === 'k'){
        e.preventDefault()
        setSearchOpen(true)
      }
      if(e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown',handler)
    return ()=> window.removeEventListener('keydown',handler)
  },[])

  useEffect(()=>{
    if(searchOpen && searchRef.current) searchRef.current.focus()
  },[searchOpen])

  const handleSearch = (e:React.FormEvent) => {
    e.preventDefault()
    if(searchQuery.trim()){
      window.location.href = `/blog?q=${encodeURIComponent(searchQuery.trim())}`
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
    <header className="header-main">
      <a href="#main" className="sr-only focus-visible">Skip to content</a>
      <div className="header-inner container-wide">
        {/* Left: Logo + Nav links */}
        <div className="header-left">
          <Link href="/" className="header-logo" style={{ display:'flex', alignItems:'center', textDecoration:'none' }}>
            <img src="/images/devashish_singh_logo_option_1.svg" alt="Devashish Singh" style={{height:'120px',width:'auto',marginRight:'-24px'}} />
          </Link>
          <nav aria-label="Primary navigation" className="header-nav">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/work" className="nav-link">Work</Link>
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/community" className="nav-link">Community</Link>
            <Link href="/blog" className="nav-link">Writing</Link>
            <Link href="/contact" className="nav-link nav-contact">Contact</Link>
          </nav>
        </div>

        {/* Right: Search bar + Icons */}
        <div className="header-right">
          <button className="header-search-trigger" onClick={()=>setSearchOpen(true)} aria-label="Search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <span className="header-search-label">search</span>
            <kbd className="header-search-kbd">CTRL K</kbd>
          </button>

          <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="header-icon header-icon-color">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          </a>
          <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="header-icon header-icon-color">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="header-icon header-icon-color">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#181717"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="header-hamburger" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="header-mobile-nav" aria-label="Mobile navigation">
          <Link href="/about" className="nav-link" onClick={()=>setMobileOpen(false)}>About</Link>
          <Link href="/work" className="nav-link" onClick={()=>setMobileOpen(false)}>Work</Link>
          <Link href="/services" className="nav-link" onClick={()=>setMobileOpen(false)}>Services</Link>
          <Link href="/community" className="nav-link" onClick={()=>setMobileOpen(false)}>Community</Link>
          <Link href="/blog" className="nav-link" onClick={()=>setMobileOpen(false)}>Writing</Link>
          <Link href="/contact" className="nav-link nav-contact" onClick={()=>setMobileOpen(false)}>Contact</Link>
          <div className="header-mobile-icons">
            <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="header-icon header-icon-color">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="header-icon header-icon-color">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="header-icon header-icon-color">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#181717"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </nav>
      )}
    </header>

    {/* Search overlay */}
    {searchOpen && (
      <div className="search-overlay" onClick={()=>setSearchOpen(false)}>
        <div className="search-modal" onClick={e=>e.stopPropagation()}>
          <form onSubmit={handleSearch} className="search-form">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-glow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input ref={searchRef} type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search blog posts..." className="search-input" />
            <kbd className="search-esc">ESC</kbd>
          </form>
        </div>
      </div>
    )}
    </>
  )
}

`

## Footer
- File: components/Footer.tsx
- Description: Global footer.

`	sx
export default function Footer(){
  return (
    <footer>
      <div className="container-wide py-10 flex flex-col md:flex-row items-start justify-between text-sm" style={{color:'var(--text-muted)'}}>
        <div>
          <img src="/images/devashish_singh_logo_option_1.svg" alt="Devashish Singh" style={{height:'84px',width:'auto',marginBottom:'12px'}} />
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="https://www.linkedin.com/in/devashish-singh-52a050112" target="_blank" rel="noopener noreferrer" className="footer-btn" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com/devashishsingh" target="_blank" rel="noopener noreferrer" className="footer-btn" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#181717"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              <span>GitHub</span>
            </a>
            <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="footer-btn" aria-label="Discord">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              <span>Discord</span>
            </a>
            <a href="mailto:devashish.singh12@gmail.com" className="footer-btn" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>Email</span>
            </a>
          </div>
        </div>
        <div className="mt-6 md:mt-0 text-right" style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:'var(--text-muted)'}}>Â© {new Date().getFullYear()} Devashish Singh</div>
      </div>
    </footer>
  )
}

`

## PageTransition
- File: components/PageTransition.tsx
- Description: Route transition wrapper.

`	sx
"use client"
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

`

## FeedbackWidget
- File: components/FeedbackWidget.tsx
- Description: Floating feedback panel.

`	sx
"use client"

import { useState, useEffect } from 'react'

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'ðŸ› Something\u2019s Broken', color: '#111' },
  { value: 'suggestion', label: 'ðŸ’¡ I Have an Idea', color: '#111' },
  { value: 'praise', label: 'ðŸŽ‰ Loving It!', color: '#111' },
  { value: 'other', label: 'ðŸ’¬ Something Else', color: '#111' },
]

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', type: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [page, setPage] = useState('')

  useEffect(() => {
    setPage(window.location.pathname)
  }, [])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.type || !form.message) return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, page }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', type: '', message: '' })
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Failed to send.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  function reset() {
    setStatus('idle')
    setErrorMsg('')
    setOpen(false)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => { setOpen(!open); if (status === 'sent') setStatus('idle') }}
        aria-label="Send feedback"
        className="feedback-fab"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M12 7v2M12 13h.01" opacity="0.6"/>
          </svg>
        )}
      </button>

      {/* Feedback panel */}
      {open && (
        <div className="feedback-panel">
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>ðŸ™</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Thanks for Speaking Up!</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20 }}>
                Your feedback helps make this platform better for everyone. We read every single message.
              </p>
              <button onClick={reset} className="btn btn-3d" style={{ fontSize: 13, padding: '8px 20px' }}>
                Close
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Got Thoughts? We&apos;re Listening.</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                  Something not working? Have a wild idea? Just want to say hi? Drop it here.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Feedback type chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {FEEDBACK_TYPES.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => update('type', t.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                        border: form.type === t.value ? `2px solid ${t.color}` : '1px solid rgba(0,0,0,0.10)',
                        background: form.type === t.value ? `${t.color}12` : 'transparent',
                        color: form.type === t.value ? t.color : 'var(--muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <input
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Your name"
                    className="feedback-input"
                    required
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="Your email"
                    className="feedback-input"
                    required
                  />
                </div>

                <textarea
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  placeholder={
                    form.type === 'bug' ? 'What went wrong? Help us fix it...' :
                    form.type === 'suggestion' ? 'What would make this platform even better?' :
                    form.type === 'praise' ? 'What are you loving about the platform?' :
                    'What\u2019s on your mind?'
                  }
                  className="feedback-input"
                  rows={3}
                  required
                  maxLength={2000}
                  style={{ resize: 'vertical', marginBottom: 12 }}
                />

                {errorMsg && (
                  <p style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>{errorMsg}</p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--muted-2)' }}>
                    {form.message.length}/2000
                  </span>
                  <button
                    type="submit"
                    disabled={status === 'sending' || !form.type}
                    className="btn btn-3d"
                    style={{ fontSize: 13, padding: '8px 20px' }}
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Feedback'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}

`

## WhatsAppButton
- File: components/WhatsAppButton.tsx
- Description: Floating WhatsApp CTA.

`	sx
"use client"

export default function WhatsAppButton(){
  const phone = "601133260976"
  const message = encodeURIComponent("Hi Devashish, I'd like to connect with you.")
  const url = `https://wa.me/${phone}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-fab"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}

`

## ScrollProgress
- File: components/ScrollProgress.tsx
- Description: Top scroll progress bar.

`	sx
"use client"
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: '0%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: '#111',
        zIndex: 9999,
      }}
    />
  )
}

`

## CursorFollower
- File: components/CursorFollower.tsx
- Description: Desktop cursor follower.

`	sx
"use client"
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [enlarged, setEnlarged] = useState(false)

  useEffect(() => {
    // Only show on non-touch (desktop) devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    setVisible(true)

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], .btn, .btn-outline, .engagement-cta, .nav-link, .footer-btn')) {
        setEnlarged(true)
      }
    }

    const handleOut = () => {
      setEnlarged(false)
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [])

  if (!visible) return null

  return (
    <motion.div
      className="cursor-dot"
      animate={{
        x: pos.x,
        y: pos.y,
        scale: enlarged ? 3 : 1,
        opacity: enlarged ? 0.5 : 0.8,
      }}
      transition={{
        x: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 },
        y: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 },
        scale: { duration: 0.15 },
        opacity: { duration: 0.15 },
      }}
    />
  )
}

`

