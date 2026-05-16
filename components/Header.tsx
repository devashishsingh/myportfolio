"use client"
import Link from 'next/link'
import { useState } from 'react'

const NAV_ITEMS: { label: string; href: string; highlight?: boolean }[] = [
  { label: 'About', href: '/about' },
  { label: 'Learn', href: '/learn', highlight: true },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const LINKEDIN_URL = 'https://www.linkedin.com/in/devashish-singh-52a050112'

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="header-main">
      <a href="#main-content" className="sr-only focus-visible">Skip to content</a>
      <div className="header-inner container-wide">
        <div className="header-left">
          <Link href="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/images/devashish_singh_logo_option_1.svg"
              alt="Devashish Singh"
              style={{ height: '120px', width: 'auto', marginRight: '-24px' }}
            />
          </Link>
          <nav aria-label="Primary navigation" className="header-nav">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                style={
                  item.highlight
                    ? { fontWeight: 700, color: 'var(--text-primary)', position: 'relative' }
                    : undefined
                }
              >
                {item.label}
                {item.highlight && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 18,
                      height: 2,
                      background: 'var(--text-primary)',
                      borderRadius: 2,
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="header-right">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="header-icon header-icon-color"
          >
            <LinkedInIcon />
          </a>
        </div>

        <button
          className="header-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav className="header-mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              style={item.highlight ? { fontWeight: 700 } : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="header-mobile-icons">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="header-icon header-icon-color">
              <LinkedInIcon />
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
