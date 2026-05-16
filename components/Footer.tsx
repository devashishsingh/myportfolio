import Link from 'next/link'

const LINKEDIN_URL = 'https://www.linkedin.com/in/devashish-singh-52a050112'
const EMAIL = 'founder@devashishsingh.com'
const WHATSAPP_URL = 'https://wa.me/60174224379'
const DISCORD_URL = 'https://discord.gg/cDHg2fKY'
const YOUTUBE_URL = 'https://www.youtube.com/@devashishsingh'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Learn', href: '/learn' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

function IconLinkedIn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.81 11.81 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  )
}

function IconDiscord() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 40 }}>
      <div
        className="container-wide"
        style={{
          paddingTop: 40,
          paddingBottom: 32,
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 28,
        }}
      >
        {/* Top row: logo + tagline, nav, socials */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 32,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: logo + tagline */}
          <div style={{ minWidth: 220, flex: '1 1 240px' }}>
            <Link href="/" style={{ display: 'inline-block' }}>
              <img
                src="/images/devashish_singh_logo_option_1.svg"
                alt="Devashish Singh"
                style={{ height: 84, width: 'auto', marginBottom: 6 }}
              />
            </Link>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              Cybersecurity Mentor · Practitioner · Educator
            </p>
          </div>

          {/* Center: nav */}
          <nav
            aria-label="Footer navigation"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 18,
              alignSelf: 'center',
              fontSize: 14,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right: socials */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignSelf: 'center' }}>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="footer-btn" aria-label="LinkedIn">
              <IconLinkedIn /><span>LinkedIn</span>
            </a>
            <a href={`mailto:${EMAIL}`} className="footer-btn" aria-label="Email">
              <IconEmail /><span>Email</span>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-btn" aria-label="WhatsApp">
              <IconWhatsApp /><span>WhatsApp</span>
            </a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="footer-btn" aria-label="YouTube">
              <IconYouTube /><span>YouTube</span>
            </a>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="footer-btn" aria-label="Discord">
              <IconDiscord /><span>Discord</span>
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: '1px dashed var(--border)',
            paddingTop: 16,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            color: 'var(--text-muted)',
          }}
        >
          <div>© {year} Devashish Singh</div>
          <div style={{ display: 'flex', gap: 14 }}>
            <a href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Privacy</a>
            <a href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
