"use client"
import { useEffect, useState } from 'react'

const FIELDS = [
  'Cloud Security',
  'AI Security & Governance',
  'Security Architecture',
  'Detection Engineering',
  'Penetration Testing & Red Team',
  'DevSecOps',
  'Security Operations (SOC)',
  'Identity & Access Management',
  'Incident Response & Digital Forensics',
  'GRC & Cybersecurity Strategy',
  'Not sure yet',
]

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Recent Graduate', 'Working Professional']

const inputStyle: React.CSSProperties = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text-primary)',
  padding: 12,
  width: '100%',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 14,
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-primary)',
  marginBottom: 6,
  display: 'block',
}

export default function RegistrationForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error' | 'closed'>('idle')
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)
  const SEAT_TOTAL = 5

  useEffect(() => {
    fetch('/api/workshop')
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.remaining === 'number') setRemaining(d.remaining)
        if (d.closed) setStatus('closed')
      })
      .catch(() => {})
  }, [])

  if (status === 'sent') {
    return (
      <div
        style={{
          border: '2px solid var(--text-primary)',
          borderRadius: 12,
          padding: '32px 24px',
          textAlign: 'center',
          background: 'var(--surface-2)',
          boxShadow: '6px 6px 0 0 var(--text-primary)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
        <h3 className="display-font" style={{ fontSize: 24, margin: '4px 0 8px' }}>You&rsquo;re Registered!</h3>
        <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Thanks for signing up. We&rsquo;ll get back to you within 24 hours with the meeting link and agenda. See you soon!
        </p>
      </div>
    )
  }

  if (status === 'closed') {
    return (
      <div
        style={{
          border: '2px dashed var(--text-primary)',
          borderRadius: 12,
          padding: '28px 24px',
          textAlign: 'center',
          background: 'var(--surface-2)',
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 6 }}>🔒</div>
        <h3 className="display-font" style={{ fontSize: 22, margin: '0 0 8px' }}>Registrations Closed</h3>
        <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          All 5 spots have been filled. We&rsquo;ll open another session soon.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setStatus('submitting')
        setError('')
        const fd = new FormData(e.currentTarget as HTMLFormElement)
        const payload = {
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          college: fd.get('college'),
          year: fd.get('year'),
          field: fd.get('field'),
          _hp: fd.get('_hp'),
        }
        try {
          const res = await fetch('/api/workshop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          const data = await res.json().catch(() => ({}))
          if (res.ok) {
            setStatus('sent')
            if (typeof data.remaining === 'number') setRemaining(data.remaining)
          } else if (data.closed) {
            setStatus('closed')
          } else {
            setError(data.error || 'Something went wrong.')
            setStatus('error')
          }
        } catch {
          setError('Network error. Please try again.')
          setStatus('error')
        }
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div style={{ marginBottom: 4 }}>
        <h3 className="display-font" style={{ fontSize: 26, margin: 0 }}>Reserve Your Free Seat</h3>
        <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
          {remaining === null
            ? 'Loading seat availability…'
            : `⚡ Only ${remaining} of ${SEAT_TOTAL} seats remaining`}
        </p>
      </div>

      <input
        name="_hp"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      <label>
        <span style={labelStyle}>Full Name *</span>
        <input name="name" required maxLength={100} style={inputStyle} />
      </label>

      <label>
        <span style={labelStyle}>Email *</span>
        <input name="email" type="email" required maxLength={254} style={inputStyle} />
      </label>

      <label>
        <span style={labelStyle}>WhatsApp / Phone *</span>
        <input name="phone" type="tel" required maxLength={40} placeholder="+91 98xxxxxxxx" style={inputStyle} />
      </label>

      <label>
        <span style={labelStyle}>College / Organization *</span>
        <input name="college" required maxLength={200} style={inputStyle} />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
        <label>
          <span style={labelStyle}>Year of Study *</span>
          <select name="year" required defaultValue="" style={inputStyle}>
            <option value="" disabled>Select…</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>

        <label>
          <span style={labelStyle}>Which field interests you most? *</span>
          <select name="field" required defaultValue="" style={inputStyle}>
            <option value="" disabled>Select…</option>
            {FIELDS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn btn-3d"
        style={{
          padding: '14px 22px',
          fontSize: 16,
          marginTop: 6,
          opacity: status === 'submitting' ? 0.7 : 1,
          cursor: status === 'submitting' ? 'wait' : 'pointer',
        }}
      >
        {status === 'submitting' ? 'Reserving…' : 'Reserve My Seat'}
      </button>

      {status === 'error' && (
        <div style={{ color: '#E74C3C', fontSize: 13 }}>{error}</div>
      )}

      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
        🔒 No spam. Your data stays private.
      </p>
    </form>
  )
}
