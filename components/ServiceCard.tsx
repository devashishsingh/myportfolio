"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
  title: string
  subtitle?: string
  href: string
  cta: string
  icon?: 'mentor' | 'build' | 'community'
  children?: React.ReactNode
}

function CardIcon({ type }: { type: string }) {
  if (type === 'mentor') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="service-card-icon">
        <circle cx="20" cy="14" r="7" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="1.5" />
        <circle cx="18" cy="12.5" r="1.2" fill="#1a1a1a" />
        <circle cx="22" cy="12.5" r="1.2" fill="#1a1a1a" />
        <path d="M17.5 15.5Q20 18 22.5 15.5" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <ellipse cx="20" cy="26" rx="8" ry="5" fill="#1a1a1a" />
        <path d="M28 14L32 10" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="33" cy="9" r="2" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="1" />
        <path d="M10 22L6 18" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 16L8 16L6 18L4 16Z" fill="#4D96FF" />
      </svg>
    )
  }
  if (type === 'build') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="service-card-icon">
        <rect x="8" y="18" width="24" height="16" rx="2" fill="#1a1a1a" />
        <rect x="10" y="20" width="20" height="12" rx="1" fill="#222" />
        <rect x="12" y="22" width="6" height="2" rx="1" fill="#4D96FF" />
        <rect x="12" y="26" width="10" height="2" rx="1" fill="#6BCB77" />
        <rect x="12" y="30" width="4" height="1" rx="0.5" fill="#FF6B6B" />
        <circle cx="20" cy="10" r="6" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="1.5" />
        <path d="M17.5 9L19 11L23 7" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M32 22L36 20L34 24Z" fill="#FF6B6B" />
      </svg>
    )
  }
  if (type === 'community') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="service-card-icon">
        <circle cx="14" cy="14" r="5" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="1.5" />
        <circle cx="12.5" cy="12.5" r="0.8" fill="#1a1a1a" />
        <circle cx="15.5" cy="12.5" r="0.8" fill="#1a1a1a" />
        <circle cx="26" cy="14" r="5" fill="#6BCB77" stroke="#1a1a1a" strokeWidth="1.5" />
        <circle cx="24.5" cy="12.5" r="0.8" fill="#1a1a1a" />
        <circle cx="27.5" cy="12.5" r="0.8" fill="#1a1a1a" />
        <circle cx="20" cy="20" r="5" fill="#4D96FF" stroke="#1a1a1a" strokeWidth="1.5" />
        <circle cx="18.5" cy="18.5" r="0.8" fill="#fff" />
        <circle cx="21.5" cy="18.5" r="0.8" fill="#fff" />
        <ellipse cx="14" cy="28" rx="6" ry="3" fill="#1a1a1a" />
        <ellipse cx="26" cy="28" rx="6" ry="3" fill="#1a1a1a" />
        <ellipse cx="20" cy="32" rx="6" ry="3" fill="#333" />
        <path d="M14 19L20 15M26 19L20 15" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    )
  }
  return null
}

export default function ServiceCard({ title, subtitle, href, cta, icon, children }: Props) {
  return (
    <motion.div
      className="border bg-white card-3d engagement-card"
      whileHover={{ rotateY: -2, rotateX: 1.5, scale: 1.03, boxShadow: '0 16px 48px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
    >
      <div className="engagement-card-inner">
        <div>
          {icon && (
            <motion.div
              style={{ marginBottom: 16 }}
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <CardIcon type={icon} />
            </motion.div>
          )}
          <span className="engagement-eyebrow">{subtitle}</span>
          <h3 className="engagement-title" style={{ transform: 'translateZ(16px)' }}>{title}</h3>
          <p className="engagement-desc" style={{ transform: 'translateZ(8px)' }}>{children}</p>
        </div>
        <Link href={href} className="engagement-cta" style={{ transform: 'translateZ(12px)' }}>
          {cta}
          <motion.svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </motion.svg>
        </Link>
      </div>
    </motion.div>
  )
}
