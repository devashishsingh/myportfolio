'use client'

import { useEffect, useState } from 'react'

// Live countdown — pure presentation. SSR renders a static label, hydration starts ticking.
export default function Countdown({ closesAt }: { closesAt: string }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = new Date(closesAt).getTime() - now
  if (diff <= 0) {
    return <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: '#dc2626' }}>CLOSED</span>
  }

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)

  const urgent = diff < 3600_000 // < 1h
  const warning = diff < 6 * 3600_000 // < 6h

  let display = ''
  if (days > 0) display = `${days}d ${hours}h ${minutes}m`
  else if (hours > 0) display = `${hours}h ${minutes}m ${String(seconds).padStart(2, '0')}s`
  else display = `${minutes}m ${String(seconds).padStart(2, '0')}s`

  return (
    <span style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 13,
      padding: '3px 8px',
      border: '1.5px solid #1a1a1a',
      background: urgent ? '#fee2e2' : warning ? '#fef3c7' : '#fffae0',
      letterSpacing: '0.04em',
    }}>
      ⏱ {display}
    </span>
  )
}
