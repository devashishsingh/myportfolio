"use client"

import { useState, useEffect } from 'react'

const FEEDBACK_TYPES = [
  { value: 'bug', label: '🐛 Something\u2019s Broken', color: '#111' },
  { value: 'suggestion', label: '💡 I Have an Idea', color: '#111' },
  { value: 'praise', label: '🎉 Loving It!', color: '#111' },
  { value: 'other', label: '💬 Something Else', color: '#111' },
]

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', type: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [page, setPage] = useState('')

  useEffect(() => {
    setPage(window.location.pathname)
  }, [])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.type || !form.message) return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, page }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', type: '', message: '' })
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Failed to send.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  function reset() {
    setStatus('idle')
    setErrorMsg('')
    setOpen(false)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => { setOpen(!open); if (status === 'sent') setStatus('idle') }}
        aria-label="Send feedback"
        className="feedback-fab"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M12 7v2M12 13h.01" opacity="0.6"/>
          </svg>
        )}
      </button>

      {/* Feedback panel */}
      {open && (
        <div className="feedback-panel">
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🙏</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Thanks for Speaking Up!</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20 }}>
                Your feedback helps make this platform better for everyone. We read every single message.
              </p>
              <button onClick={reset} className="btn btn-3d" style={{ fontSize: 13, padding: '8px 20px' }}>
                Close
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Got Thoughts? We&apos;re Listening.</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                  Something not working? Have a wild idea? Just want to say hi? Drop it here.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Feedback type chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {FEEDBACK_TYPES.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => update('type', t.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                        border: form.type === t.value ? `2px solid ${t.color}` : '1px solid rgba(0,0,0,0.10)',
                        background: form.type === t.value ? `${t.color}12` : 'transparent',
                        color: form.type === t.value ? t.color : 'var(--muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <input
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Your name"
                    className="feedback-input"
                    required
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="Your email"
                    className="feedback-input"
                    required
                  />
                </div>

                <textarea
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  placeholder={
                    form.type === 'bug' ? 'What went wrong? Help us fix it...' :
                    form.type === 'suggestion' ? 'What would make this platform even better?' :
                    form.type === 'praise' ? 'What are you loving about the platform?' :
                    'What\u2019s on your mind?'
                  }
                  className="feedback-input"
                  rows={3}
                  required
                  maxLength={2000}
                  style={{ resize: 'vertical', marginBottom: 12 }}
                />

                {errorMsg && (
                  <p style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>{errorMsg}</p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--muted-2)' }}>
                    {form.message.length}/2000
                  </span>
                  <button
                    type="submit"
                    disabled={status === 'sending' || !form.type}
                    className="btn btn-3d"
                    style={{ fontSize: 13, padding: '8px 20px' }}
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Feedback'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}
