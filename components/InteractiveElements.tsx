"use client"
import { motion } from 'framer-motion'

export function ScrollHint() {
  return (
    <motion.div
      className="scroll-hint"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
      >
        <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>
          Scroll to explore
        </span>
        <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
          <rect x="1" y="1" width="18" height="30" rx="9" stroke="var(--muted-2)" strokeWidth="1.5" />
          <motion.circle
            cx="10" cy="10" r="3"
            fill="var(--muted)"
            animate={{ cy: [8, 20, 8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}

export function ClickPulse({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <span className="click-pulse-wrap">
      {children}
      {label && (
        <motion.span
          className="click-pulse-label"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: [0, 1, 1, 0], y: [5, 0, 0, -5] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
        >
          {label}
        </motion.span>
      )}
      <motion.span
        className="click-pulse-ring"
        animate={{
          scale: [1, 1.8, 2.2],
          opacity: [0.5, 0.2, 0],
        }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
      />
    </span>
  )
}

export function FloatingArrow({ direction = 'right' }: { direction?: 'right' | 'down' | 'left' }) {
  const rotation = direction === 'down' ? 90 : direction === 'left' ? 180 : 0
  const animProp = direction === 'down' ? { y: [0, 6, 0] } : { x: [0, 6, 0] }

  return (
    <motion.div
      animate={animProp}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-flex', transform: `rotate(${rotation}deg)` }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </motion.div>
  )
}

export function SectionReveal({ children, className, style, delay = 0 }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className, style }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: { transition: { staggerChildren: 0.12 } },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, style }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function Sparkle({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{ display: 'inline-block', ...style }}
      animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="#111" />
    </motion.svg>
  )
}

export function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--muted)' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  )
}
