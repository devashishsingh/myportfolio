'use client'

import React, { useState } from 'react'
import BookingModal from './BookingModal'
import type { SessionType } from '../lib/booking-config'
import Link from 'next/link'

interface BookingButtonProps {
  sessionType: SessionType
  children: React.ReactNode
  href?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * BookingButton
 * 
 * Versatile button that can either:
 * 1. Open Cal.com booking modal (default)
 * 2. Navigate to a traditional booking form (if href is provided)
 * 
 * Usage:
 * <BookingButton sessionType="mentorship">Book a Session</BookingButton>
 * <BookingButton sessionType="mentorship" href="/book-session">Book a Session</BookingButton>
 */
export default function BookingButton({
  sessionType,
  children,
  href,
  className = '',
  style,
}: BookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // If href is provided, render as a regular link
  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {children}
      </Link>
    )
  }

  // Otherwise, render as a button that opens the modal
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
        style={{
          ...style,
          cursor: 'pointer',
          border: 'none',
          background: 'transparent',
          padding: 0,
          font: 'inherit',
        }}
      >
        {children}
      </button>
      <BookingModal sessionType={sessionType} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
