'use client'

import { useState } from 'react'

const SESSION_TYPES = [
  { value: 'mentorship', label: 'Mentorship & Coaching', desc: 'Career guidance, skill roadmap, 1-on-1 mentoring' },
  { value: 'consulting', label: 'Consulting', desc: 'Technical strategy, architecture review, product advisory' },
  { value: 'workshop', label: 'Workshop / Talk', desc: 'Team training, speaking engagement, workshop facilitation' },
  { value: 'other', label: 'Other', desc: 'Something else — tell me about it' },
]

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

export default function BookSessionPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    sessionType: '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'Asia/Kuala_Lumpur',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data.error || 'Something went wrong')
        setStatus('error')
        return
      }

      setStatus('sent')
    } catch {
      setErrorMsg('Failed to submit. Please try again.')
      setStatus('error')
    }
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  if (status === 'sent') {
    return (
      <main className="page-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 16 }}>Session Requested</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#666', marginBottom: 24 }}>
            Your booking request has been received. You&apos;ll receive a confirmation email shortly,
            and I&apos;ll follow up within 24 hours with a meeting link or next steps.
          </p>
          <a href="/" style={{ display: 'inline-block', background: '#1a1a1a', color: '#fff', padding: '12px 28px', textDecoration: 'none', fontSize: 14, fontWeight: 600, letterSpacing: '0.5px' }}>
            Back to Home
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="page-container" style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: '#999', marginBottom: 8 }}>Book a Session</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, letterSpacing: '-1px', marginBottom: 16 }}>
          Let&apos;s Talk
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#666', maxWidth: 500 }}>
          Whether it&apos;s mentorship, consulting, or a workshop — pick a time that works for you.
          I&apos;ll confirm within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Session Type */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'block' }}>
            Session Type *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {SESSION_TYPES.map((t) => (
              <label
                key={t.value}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  border: form.sessionType === t.value ? '2px solid #1a1a1a' : '1px solid #e5e5e5',
                  cursor: 'pointer',
                  background: form.sessionType === t.value ? '#fafafa' : '#fff',
                  transition: 'all 0.15s ease',
                }}
              >
                <input
                  type="radio"
                  name="sessionType"
                  value={t.value}
                  checked={form.sessionType === t.value}
                  onChange={(e) => setForm({ ...form, sessionType: e.target.value })}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: 15, fontWeight: 600, display: 'block', marginBottom: 4 }}>{t.label}</span>
                <span style={{ fontSize: 13, color: '#999' }}>{t.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Name & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="booking-label">Full Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="booking-input"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="booking-label">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="booking-input"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="booking-label">Preferred Date *</label>
            <input
              type="date"
              required
              min={minDateStr}
              value={form.preferredDate}
              onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
              className="booking-input"
            />
          </div>
          <div>
            <label className="booking-label">Preferred Time *</label>
            <select
              required
              value={form.preferredTime}
              onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
              className="booking-input"
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="booking-label">Timezone</label>
          <select
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="booking-input"
            style={{ maxWidth: 300 }}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="booking-label">What would you like to discuss? (optional)</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="booking-input"
            rows={4}
            placeholder="Brief context helps me prepare for our session..."
            maxLength={2000}
            style={{ resize: 'vertical' }}
          />
        </div>

        {errorMsg && (
          <p style={{ color: '#dc2626', fontSize: 14, margin: 0 }}>{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            padding: '14px 32px',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.5px',
            cursor: status === 'sending' ? 'wait' : 'pointer',
            opacity: status === 'sending' ? 0.7 : 1,
            alignSelf: 'flex-start',
            transition: 'opacity 0.15s ease',
          }}
        >
          {status === 'sending' ? 'Submitting...' : 'Request Session →'}
        </button>
      </form>
    </main>
  )
}
