# Components

Shared reusable UI components with full source code.

## ServiceCard
- File: components/ServiceCard.tsx
- Description: Primary service and engagement card.

`	sx
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
        <circle cx="20" cy="14" r="7" fill="#fff" stroke="#111" strokeWidth="1.5" />
        <circle cx="18" cy="12.5" r="1.2" fill="#111" />
        <circle cx="22" cy="12.5" r="1.2" fill="#111" />
        <path d="M17.5 15.5Q20 18 22.5 15.5" stroke="#111" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <ellipse cx="20" cy="26" rx="8" ry="5" fill="#111" />
        <path d="M28 14L32 10" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="33" cy="9" r="2" fill="#fff" stroke="#111" strokeWidth="1" />
        <path d="M10 22L6 18" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 16L8 16L6 18L4 16Z" fill="#999" />
      </svg>
    )
  }
  if (type === 'build') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="service-card-icon">
        <rect x="8" y="18" width="24" height="16" rx="2" fill="#111" />
        <rect x="10" y="20" width="20" height="12" rx="1" fill="#222" />
        <rect x="12" y="22" width="6" height="2" rx="1" fill="#999" />
        <rect x="12" y="26" width="10" height="2" rx="1" fill="#bbb" />
        <rect x="12" y="30" width="4" height="1" rx="0.5" fill="#666" />
        <circle cx="20" cy="10" r="6" fill="#fff" stroke="#111" strokeWidth="1.5" />
        <path d="M17.5 9L19 11L23 7" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M32 22L36 20L34 24Z" fill="#999" />
      </svg>
    )
  }
  if (type === 'community') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="service-card-icon">
        <circle cx="14" cy="14" r="5" fill="#fff" stroke="#111" strokeWidth="1.5" />
        <circle cx="12.5" cy="12.5" r="0.8" fill="#111" />
        <circle cx="15.5" cy="12.5" r="0.8" fill="#111" />
        <circle cx="26" cy="14" r="5" fill="#ccc" stroke="#111" strokeWidth="1.5" />
        <circle cx="24.5" cy="12.5" r="0.8" fill="#111" />
        <circle cx="27.5" cy="12.5" r="0.8" fill="#111" />
        <circle cx="20" cy="20" r="5" fill="#111" stroke="#333" strokeWidth="1.5" />
        <circle cx="18.5" cy="18.5" r="0.8" fill="#fff" />
        <circle cx="21.5" cy="18.5" r="0.8" fill="#fff" />
        <ellipse cx="14" cy="28" rx="6" ry="3" fill="#333" />
        <ellipse cx="26" cy="28" rx="6" ry="3" fill="#333" />
        <ellipse cx="20" cy="32" rx="6" ry="3" fill="#111" />
        <path d="M14 19L20 15M26 19L20 15" stroke="#999" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    )
  }
  return null
}

export default function ServiceCard({ title, subtitle, href, cta, icon, children }: Props) {
  return (
    <motion.div
      className="card-3d engagement-card"
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

`

## ProjectCard
- File: components/ProjectCard.tsx
- Description: Project showcase card.

`	sx
"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'

type Props = {
  title: string
  category?: string
  excerpt?: string
  href?: string
  github?: string
  tech?: string[]
  cta?: string
}

const TECH_ICONS: Record<string, JSX.Element> = {
  'VS Code': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M17.583 2.29L12.6 6.862 7.56 3.042l-.05-.03L2.3 5.75l-.3.18v12.14l.3.18 5.2 2.74.05-.03L12.6 17.14l4.984 4.57 2.116-1.11.3-.16V3.56l-.3-.16-2.117-1.11z" fill="#333"/>
      <path d="M17.583 21.71L12.6 17.14 7.56 20.96l-.05.03-5.21-2.74-.3-.18V5.93l.3-.18L7.51 3.01l.05.03L12.6 6.86l4.984-4.57 2.116 1.11.3.16v16.84l-.3.16-2.117 1.11z" fill="#333" opacity=".8"/>
      <path d="M7.51 3.04L2.3 5.75v12.5l5.21 2.74L12.6 17.14V6.86L7.51 3.04z" fill="#555"/>
      <path d="M17.583 2.29L12.6 6.86v10.28l4.984 4.57 2.116-1.11V3.4l-2.117-1.11z" fill="#555"/>
    </svg>
  ),
  'GitHub': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#333">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  'Vercel': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#333">
      <path d="M12 1L24 22H0L12 1z"/>
    </svg>
  ),
  'Supabase': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M13.7 22.3c-.5.6-1.5.2-1.5-.6V13h8.6c.9 0 1.4 1.1.8 1.8L13.7 22.3z" fill="#333"/>
      <path d="M13.7 22.3c-.5.6-1.5.2-1.5-.6V13h8.6c.9 0 1.4 1.1.8 1.8L13.7 22.3z" fill="#555" fillOpacity=".2"/>
      <path d="M10.3 1.7c.5-.6 1.5-.2 1.5.6V11H3.2c-.9 0-1.4-1.1-.8-1.8L10.3 1.7z" fill="#333"/>
      <defs><linearGradient id="sb" x1="12.2" y1="14.4" x2="18" y2="18.4" gradientUnits="userSpaceOnUse"><stop stopColor="#333"/><stop offset="1" stopColor="#555"/></linearGradient></defs>
    </svg>
  ),
  'AI Tools': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  'Claude': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#555"/>
      <path d="M15.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S13.17 7 14 7s1.5.67 1.5 1.5zM11.5 8.5c0 .83-.67 1.5-1.5 1.5S8.5 9.33 8.5 8.5 9.17 7 10 7s1.5.67 1.5 1.5zM12 17c-2.33 0-4.3-1.46-5.11-3.5h10.22c-.81 2.04-2.78 3.5-5.11 3.5z" fill="#fff"/>
    </svg>
  ),
  'Render': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#333"/>
      <path d="M6 13h4v4H6v-4zm0-6h4v4H6V7zm6 6h4v4h-4v-4zm0-6h4v4h-4V7zm6 0h4v4h-4V7z" fill="#fff"/>
    </svg>
  ),
  'Next.js': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#333">
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.073-.091a.637.637 0 0 1 .174-.143c.096-.047.134-.051.534-.051.469 0 .534.016.64.105.03.025 1.34 2.001 2.91 4.394l4.76 7.209.905 1.371.183-.12a12.44 12.44 0 0 0 3.11-3.178 11.89 11.89 0 0 0 2.085-5.137c.096-.659.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.86-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" fill="#333"/>
    </svg>
  ),
  'Prisma': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M21.807 18.285L13.553.756a1.324 1.324 0 0 0-1.129-.754 1.31 1.31 0 0 0-1.206.626L2.408 15.13a1.324 1.324 0 0 0 .168 1.547l6.338 6.67a1.324 1.324 0 0 0 1.33.394l10.93-3.168a1.324 1.324 0 0 0 .633-2.288zM19.36 17.907l-8.828 2.555a.2.2 0 0 1-.248-.268L14.56 4.02a.2.2 0 0 1 .373-.032l5.194 13.27a.2.2 0 0 1-.147.27l-.62.38z" fill="#333"/>
    </svg>
  ),
  'SQLite': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M21.2 4.4c-.8-.8-2-1.2-3.4-1.2-2.3 0-4.9 1.2-7 3.3-3 3-4.7 7.5-3.7 10.3.4 1.2 1.3 2 2.5 2.4.4.1.8.2 1.2.2 1.8 0 3.9-1 5.8-2.9 3-3 4.7-7.5 3.7-10.3-.3-.7-.6-1.3-1.1-1.8z" fill="#333"/>
      <path d="M9.1 16.8c-.7-2 .4-5.3 2.7-8.1.5-.6 1.1-1.2 1.7-1.7-.3-.1-.6-.1-.9-.1-2 0-4.2 1-5.9 2.8-2.5 2.5-3.9 6.2-3.1 8.5.3 1 1.1 1.7 2.1 2 .3.1.7.2 1 .2 1.1 0 2.3-.5 3.4-1.4-.4-.6-.7-1.4-1-2.2z" fill="#777"/>
    </svg>
  ),
  'Tailwind CSS': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#333"/>
    </svg>
  ),
  'Cloud Systems': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  ),
}

function TechIcon({ name }: { name: string }) {
  const icon = TECH_ICONS[name]
  return (
    <span className="project-tech-chip">
      {icon && <span className="project-tech-icon">{icon}</span>}
      {name}
    </span>
  )
}

export default function ProjectCard({ title, category, excerpt, href = '#', github, tech, cta = 'View' }: Props) {
  return (
    <motion.article
      className="group"
      whileHover={{ rotateY: 4, rotateX: -2, scale: 1.03, boxShadow: '8px 16px 40px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
    >
      <div className="card-3d block project-card-inner">
        <div className="flex items-center justify-between">
          <span className="project-category-label">{category}</span>
          {github ? <a href={github} target="_blank" rel="noopener noreferrer" className="project-github-link">GitHub â†—</a> : null}
        </div>
        <h4 className="project-card-title" style={{ transform: 'translateZ(20px)' }}>{title}</h4>
        <p className="project-card-excerpt" style={{ transform: 'translateZ(10px)' }}>{excerpt}</p>
        {tech && tech.length > 0 && (
          <div className="project-tech-row" style={{ transform: 'translateZ(8px)' }}>
            {tech.map(t => (
              <TechIcon key={t} name={t} />
            ))}
          </div>
        )}
        <div className="project-card-cta-row" style={{ transform: 'translateZ(15px)' }}>
          <Link href={href} className="project-card-cta">
            {cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

`

## MagneticButton
- File: components/MagneticButton.tsx
- Description: Magnetic hover wrapper.

`	sx
"use client"
import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type Props = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  strength?: number
}

export default function MagneticButton({ children, className, style, strength = 0.3 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY, display: 'inline-block', ...style }}
      className={className}
    >
      <motion.div
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

`

## TextReveal
- File: components/TextReveal.tsx
- Description: Animated text reveal.

`	sx
"use client"
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  className?: string
  style?: React.CSSProperties
  delay?: number
  by?: 'word' | 'char'
  once?: boolean
}

export default function TextReveal({
  children,
  as: Tag = 'h2',
  className,
  style,
  delay = 0,
  by = 'word',
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-80px' })
  const [tokens, setTokens] = useState<string[]>([])

  useEffect(() => {
    if (by === 'char') {
      setTokens(children.split(''))
    } else {
      setTokens(children.split(' '))
    }
  }, [children, by])

  return (
    <Tag ref={ref as any} className={className} style={{ ...style, overflow: 'hidden' }}>
      {tokens.map((token, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: delay + i * (by === 'char' ? 0.025 : 0.06),
            }}
          >
            {token}{by === 'word' && i < tokens.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

`

## CounterReveal
- File: components/CounterReveal.tsx
- Description: Animated counter.

`	sx
"use client"
import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

type Props = {
  value: number
  suffix?: string
  prefix?: string
  className?: string
  style?: React.CSSProperties
  duration?: number
}

export default function CounterReveal({ value, suffix = '', prefix = '', className, style, duration = 2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20, duration: duration * 1000 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (isInView) {
      motionVal.set(value)
    }
  }, [isInView, value, motionVal])

  useEffect(() => {
    const unsubscribe = spring.on('change', (v: number) => {
      setDisplay(Math.round(v))
    })
    return unsubscribe
  }, [spring])

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums', ...style }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {prefix}{display}{suffix}
    </motion.span>
  )
}

`

## DragGallery
- File: components/DragGallery.tsx
- Description: Draggable gallery row.

`	sx
"use client"
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  className?: string
}

export default function DragGallery({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragConstraint, setDragConstraint] = useState(0)

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return
      const scrollW = containerRef.current.scrollWidth
      const clientW = containerRef.current.clientWidth
      setDragConstraint(-(scrollW - clientW))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [children])

  return (
    <div className={className} style={{ overflow: 'hidden', cursor: 'grab' }}>
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={{ left: dragConstraint, right: 0 }}
        dragElastic={0.08}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        whileDrag={{ cursor: 'grabbing' }}
        style={{
          display: 'flex',
          gap: 24,
          paddingBottom: 8,
        }}
      >
        {children}
      </motion.div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 20,
        opacity: 0.5,
      }}>
        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666' }}>
            Drag to explore
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

`

## ContactForm
- File: components/ContactForm.tsx
- Description: Reusable contact form.

`	sx
"use client"
import { useState } from 'react'

export default function ContactForm(){
  const [status, setStatus] = useState<'idle'|'sent'|'error'>('idle')

  return (
    <form onSubmit={async (e)=>{
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement
      const fd = new FormData(form)
      const payload = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message') }
      try{
        const res = await fetch('/api/contact', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
        if(res.ok) setStatus('sent')
        else setStatus('error')
      }catch(e){ setStatus('error') }
    }} className="space-y-4">
      <label className="block">
        <div className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Name</div>
        <input name="name" className="mt-2 w-full p-3" style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text-primary)'}} required />
      </label>

      <label className="block">
        <div className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Email</div>
        <input name="email" type="email" className="mt-2 w-full p-3" style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text-primary)'}} required />
      </label>

      <label className="block">
        <div className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Message</div>
        <textarea name="message" rows={5} className="mt-2 w-full p-3" style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text-primary)'}} required />
      </label>

      <div>
        <button className="px-5 py-3 btn btn-3d">Send message</button>
      </div>

      {status==='sent' && <div className="text-sm" style={{color:'#6BCB77'}}>Thanks â€” your message was recorded (placeholder).</div>}
    </form>
  )
}

`

