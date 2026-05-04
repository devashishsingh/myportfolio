"use client"

import { useState } from 'react'
import Link from 'next/link'
import { INTEREST_AREAS } from '../../../lib/constants'

const CUSTOM_INTEREST = '__custom__'

export default function JoinCommunity() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    github: '',
    interest: '',
    customInterest: '',
    tellMore: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    const interest = form.interest === CUSTOM_INTEREST
      ? form.customInterest.trim()
      : form.interest
    if (!interest) {
      setStatus('error')
      setErrorMsg('Please choose or enter an area of interest.')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/community/invite', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          github: form.github,
          interest,
          tellMore: form.tellMore,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
        setErrorMsg(json.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  if (status === 'sent') {
    return (
      <section className="container-wide" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>✉️</span>
          <h1 className="display-font" style={{ fontSize: 32, marginBottom: 12 }}>Request Received</h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
            Thank you for your interest in joining the Builders Hub. Your invitation request has been 
            submitted and will be reviewed personally. You will hear back via email once your request is processed.
          </p>
          <Link href="/community" className="btn-outline">Back to Community</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="container-wide" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Link href="/community" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
          ← Back to Community
        </Link>
        <h1 className="display-font" style={{ fontSize: 'clamp(28px, 5vw, 40px)', marginBottom: 8 }}>
          Request Invitation
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
          The Builders Hub is a curated community. Tell us a bit about yourself and what you&apos;re
          building toward — every request is reviewed personally.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="community-form-grid">
            <div className="community-form-field full-width">
              <label className="editor-label">Full Name *</label>
              <input
                value={form.fullName}
                onChange={e => update('fullName', e.target.value)}
                className="editor-input"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="community-form-field full-width">
              <label className="editor-label">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                className="editor-input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="community-form-field full-width">
              <label className="editor-label">
                GitHub <span style={{ color: '#666', fontWeight: 400 }}>(if any)</span>
              </label>
              <input
                value={form.github}
                onChange={e => update('github', e.target.value)}
                className="editor-input"
                placeholder="https://github.com/yourhandle"
              />
            </div>

            <div className="community-form-field full-width">
              <label className="editor-label">Area of Interest *</label>
              <select
                value={form.interest}
                onChange={e => update('interest', e.target.value)}
                className="editor-input"
                required
              >
                <option value="">Select an area</option>
                {INTEREST_AREAS.map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
                <option value={CUSTOM_INTEREST}>Other (write your own)…</option>
              </select>
              {form.interest === CUSTOM_INTEREST && (
                <input
                  value={form.customInterest}
                  onChange={e => update('customInterest', e.target.value)}
                  className="editor-input"
                  placeholder="Type your area of interest"
                  style={{ marginTop: 8 }}
                  required
                />
              )}
            </div>

            <div className="community-form-field full-width">
              <label className="editor-label">Tell us more about your interest *</label>
              <textarea
                value={form.tellMore}
                onChange={e => update('tellMore', e.target.value)}
                className="editor-input"
                placeholder="e.g. I am a backend engineer exploring AI agents, and I desire to build my own indie SaaS. Looking for builders to learn alongside."
                rows={5}
                required
                style={{ resize: 'vertical' }}
              />
              <small style={{ color: 'var(--muted)', fontSize: 12, display: 'block', marginTop: 6 }}>
                Share where you are today and where you want to go. e.g. &quot;I am __, and I desire to be __.&quot;
              </small>
            </div>
          </div>

          {/* Error */}
          {status === 'error' && (
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 6, background: '#fef2f2', color: '#dc2626', fontSize: 14 }}>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <div style={{ marginTop: 28 }}>
            <button type="submit" className="btn btn-3d" disabled={status === 'sending'}>
              {status === 'sending' ? 'Submitting...' : 'Submit Invitation Request'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
