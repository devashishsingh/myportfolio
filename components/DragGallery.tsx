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
