"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ToonMascot from './ToonMascot'

type MascotMood = 'wave' | 'think' | 'celebrate' | 'point-right' | 'point-down' | 'cool' | 'rocket'

interface ToonGuideProps {
  message: string
  mood?: MascotMood
  position?: 'bottom-left' | 'bottom-right' | 'inline'
  delay?: number
  dismissible?: boolean
  showOnce?: boolean
  storageKey?: string
}

export default function ToonGuide({
  message,
  mood = 'wave',
  position = 'inline',
  delay = 1,
  dismissible = true,
  showOnce = false,
  storageKey,
}: ToonGuideProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (showOnce && storageKey) {
      const wasDismissed = localStorage.getItem(`toon-guide-${storageKey}`)
      if (wasDismissed) {
        setDismissed(true)
        return
      }
    }
    const timer = setTimeout(() => setVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay, showOnce, storageKey])

  function handleDismiss() {
    setVisible(false)
    setDismissed(true)
    if (showOnce && storageKey) {
      localStorage.setItem(`toon-guide-${storageKey}`, '1')
    }
  }

  if (dismissed) return null

  const isFixed = position !== 'inline'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`toon-guide ${isFixed ? `toon-guide-fixed toon-guide-${position}` : 'toon-guide-inline'}`}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <ToonMascot mood={mood} size={56} />
          <div className="toon-guide-bubble">
            <p className="toon-guide-text">{message}</p>
            {dismissible && (
              <button className="toon-guide-dismiss" onClick={handleDismiss} aria-label="Dismiss">
                Got it!
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
