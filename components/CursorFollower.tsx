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
