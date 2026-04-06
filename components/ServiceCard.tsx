"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
  title: string
  subtitle?: string
  href: string
  cta: string
  children?: React.ReactNode
}

export default function ServiceCard({ title, subtitle, href, cta, children }: Props) {
  return (
    <motion.div
      className="border bg-white card-3d engagement-card"
      whileHover={{ rotateY: -2, rotateX: 1.5, scale: 1.03, boxShadow: '0 16px 48px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
    >
      <div className="engagement-card-inner">
        <div>
          <span className="engagement-eyebrow">{subtitle}</span>
          <h3 className="engagement-title" style={{ transform: 'translateZ(16px)' }}>{title}</h3>
          <p className="engagement-desc" style={{ transform: 'translateZ(8px)' }}>{children}</p>
        </div>
        <Link href={href} className="engagement-cta" style={{ transform: 'translateZ(12px)' }}>
          {cta}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </motion.div>
  )
}
