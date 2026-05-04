'use client'

import React, { useState, useEffect } from 'react'
import { getBookingSession } from '../lib/booking-config'
import type { SessionType } from '../lib/booking-config'

interface BookingModalProps {
  sessionType: SessionType
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ sessionType, isOpen, onClose }: BookingModalProps) {
  const session = getBookingSession(sessionType)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'Asia/Kuala_Lumpur',
    message: '',
  })

  const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM',
  ]

  const TIMEZONES = [
    'Asia/Kuala_Lumpur',
    'Asia/Singapore',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Tokyo',
    'Europe/London',
    'America/New_York',
    'America/Los_Angeles',
    'Australia/Sydney',
  ]

  useEffect(() => {
    if (isOpen) {
      setStatus('idle')
      setErrorMsg('')
      document.body.style.overflow = 'hidden'
      return
    }
    document.body.style.overflow = ''
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sessionType: session.apiSessionType,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data.error || 'Could not submit your request')
        setStatus('error')
        return
      }

      setStatus('sent')
    } catch {
      setErrorMsg('Failed to submit request. Please try again.')
      setStatus('error')
    }
  }

  if (!isOpen) return null

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="booking-modal-shell"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 10001,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
              {session.label}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
              {session.description}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#666',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#111')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '20px 8px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 20 }}>Session Request Sent</h3>
              <p style={{ margin: 0, color: '#666', lineHeight: 1.6 }}>
                Thanks for reaching out. You will receive a confirmation email shortly, and I will follow up with next steps.
              </p>
              <button
                onClick={onClose}
                className="btn btn-3d"
                style={{ marginTop: 18 }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <input
                  className="booking-input"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  className="booking-input"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <input
                  className="booking-input"
                  type="date"
                  min={minDateStr}
                  value={form.preferredDate}
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                  required
                />
                <select
                  className="booking-input"
                  value={form.preferredTime}
                  onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                  required
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <select
                className="booking-input"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                ))}
              </select>

              <textarea
                className="booking-input"
                rows={4}
                placeholder="Anything you want me to know before we connect?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
                style={{ resize: 'vertical' }}
              />

              {errorMsg && <p style={{ margin: 0, color: '#dc2626', fontSize: 13 }}>{errorMsg}</p>}

              <div className="booking-modal-actions" style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-3d" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Submitting...' : 'Request Session'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @media (max-width: 640px) {
          .booking-modal-shell {
            top: 16px !important;
            left: 16px !important;
            right: 16px !important;
            width: auto !important;
            max-width: none !important;
            max-height: calc(100vh - 32px) !important;
            transform: none !important;
            border-radius: 12px !important;
          }

          .booking-modal-actions {
            flex-direction: column-reverse;
          }

          .booking-modal-actions > .btn,
          .booking-modal-actions > .btn-outline {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </>
  )
}
