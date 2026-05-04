'use client'
import { useEffect, useState } from 'react'

/**
 * Slim, fixed-top reading-progress bar for blog post pages.
 * Tracks the user's scroll position relative to the <article> they're reading.
 */
export default function ReadingProgress({ targetSelector = 'article.blog-post-page' }: { targetSelector?: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = document.querySelector(targetSelector) as HTMLElement | null
    function update() {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const passed = Math.min(Math.max(-rect.top, 0), Math.max(total, 1))
      const pct = total > 0 ? (passed / total) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [targetSelector])

  return (
    <div className="reading-progress-bar" aria-hidden="true">
      <div className="reading-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}
