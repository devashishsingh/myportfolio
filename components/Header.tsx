"use client"
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const SITE_KEYWORDS = [
  'Cybersecurity',
  'Digital Transformation',
  'AI',
  'Mentorship',
  'Coaching',
  'Startups',
  'Innovation',
  'Community',
  'Career Growth',
  'Book Session',
  'Consulting',
  'Workshops',
  'DMARC',
  'InMyBox',
  'Career Intelligence Platform',
  'Digital Waste Optimizer',
  'Innovation Network Platform',
  'Writing',
  'Blog',
  'Case Study',
  'Southeast Asia',
  'Middle East',
  'Europe',
  'Cloud Systems',
  'Leadership',
]

const SEARCH_ROUTING = [
  { terms: ['about', 'profile', 'bio'], href: '/about' },
  { terms: ['work', 'project', 'projects', 'case study', 'portfolio', 'inmybox'], href: '/work' },
  { terms: ['services', 'service', 'consulting', 'mentorship', 'coaching', 'workshops'], href: '/services' },
  { terms: ['book session', 'booking', 'session'], href: '/book-session' },
  { terms: ['community', 'join community', 'builders hub'], href: '/community' },
  { terms: ['contact', 'collaborate'], href: '/contact' },
  { terms: ['blog', 'writing', 'article', 'articles', 'post', 'posts', 'dmarc', 'cybersecurity', 'ai', 'innovation', 'career growth', 'leadership'], href: '/blog', blogQuery: true },
]

function resolveSearchTarget(query: string): string {
  const raw = query.trim()
  const normalized = raw.toLowerCase()

  const matchedRoute = SEARCH_ROUTING.find((route) =>
    route.terms.some((term) => normalized === term || normalized.includes(term))
  )

  if (!matchedRoute) {
    return `/blog?q=${encodeURIComponent(raw)}`
  }

  if (matchedRoute.blogQuery) {
    return `/blog?q=${encodeURIComponent(raw)}`
  }

  return matchedRoute.href
}

export default function Header(){
  const [mobileOpen,setMobileOpen] = useState(false)
  const [searchOpen,setSearchOpen] = useState(false)
  const [searchQuery,setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const filteredKeywords = SITE_KEYWORDS.filter((keyword) =>
    keyword.toLowerCase().includes(searchQuery.trim().toLowerCase())
  ).slice(0, 8)

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
      window.location.href = resolveSearchTarget(searchQuery)
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
          </nav>
        </div>

        {/* Right: Search bar + Icons */}
        <div className="header-right">
          <button className="header-search-trigger" onClick={()=>setSearchOpen(true)} aria-label="Search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <span className="header-search-label">search</span>
            <kbd className="header-search-kbd">CTRL K</kbd>
          </button>

          <a href="https://discord.gg/25ufGG4fSR" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="header-icon header-icon-color">
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
          <div className="header-mobile-icons">
            <a href="https://discord.gg/25ufGG4fSR" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="header-icon header-icon-color">
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
            <input
              ref={searchRef}
              type="text"
              list="site-search-keywords"
              value={searchQuery}
              onChange={e=>setSearchQuery(e.target.value)}
              placeholder="Search"
              className="search-input"
            />
            <datalist id="site-search-keywords">
              {(searchQuery.trim() ? filteredKeywords : SITE_KEYWORDS.slice(0, 8)).map((keyword) => (
                <option key={keyword} value={keyword} />
              ))}
            </datalist>
            <kbd className="search-esc">ESC</kbd>
          </form>
        </div>
      </div>
    )}
    </>
  )
}
