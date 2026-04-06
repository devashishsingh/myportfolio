"use client"

import { useState } from 'react'
import Link from 'next/link'
import { REGIONS, INTEREST_AREAS } from '../../../lib/constants'

export default function JoinCommunity() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    role: '',
    interest: '',
    region: '',
    whyJoin: '',
    contribute: '',
    expertise: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/community/invite', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
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
          The Builders Hub is a curated community. All requests are reviewed personally by Devashish Singh. 
          Please fill in the details below so we can understand your background and interests.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="community-form-grid">
            {/* Full Name */}
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

            {/* Email */}
            <div className="community-form-field full-width">
              <label className="editor-label">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                className="editor-input"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* LinkedIn */}
            <div className="community-form-field">
              <label className="editor-label">LinkedIn</label>
              <input
                value={form.linkedIn}
                onChange={e => update('linkedIn', e.target.value)}
                className="editor-input"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            {/* GitHub */}
            <div className="community-form-field">
              <label className="editor-label">GitHub</label>
              <input
                value={form.github}
                onChange={e => update('github', e.target.value)}
                className="editor-input"
                placeholder="https://github.com/..."
              />
            </div>

            {/* Portfolio */}
            <div className="community-form-field full-width">
              <label className="editor-label">Portfolio / Website</label>
              <input
                value={form.portfolio}
                onChange={e => update('portfolio', e.target.value)}
                className="editor-input"
                placeholder="https://yoursite.com"
              />
            </div>

            {/* Role */}
            <div className="community-form-field">
              <label className="editor-label">Role / Profession *</label>
              <input
                value={form.role}
                onChange={e => update('role', e.target.value)}
                className="editor-input"
                placeholder="e.g. Software Engineer, Founder, Student"
                required
              />
            </div>

            {/* Interest Area */}
            <div className="community-form-field">
              <label className="editor-label">Primary Interest *</label>
              <select
                value={form.interest}
                onChange={e => update('interest', e.target.value)}
                className="editor-input"
                required
              >
                <option value="">Select interest area</option>
                {INTEREST_AREAS.map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div className="community-form-field full-width">
              <label className="editor-label">Region *</label>
              <select
                value={form.region}
                onChange={e => update('region', e.target.value)}
                className="editor-input"
                required
              >
                <option value="">Select your region</option>
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Why Join */}
            <div className="community-form-field full-width">
              <label className="editor-label">Why do you want to join? *</label>
              <textarea
                value={form.whyJoin}
                onChange={e => update('whyJoin', e.target.value)}
                className="editor-input"
                placeholder="Tell us what brought you here and what you hope to gain..."
                rows={3}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* What to Contribute */}
            <div className="community-form-field full-width">
              <label className="editor-label">What do you want to contribute? *</label>
              <textarea
                value={form.contribute}
                onChange={e => update('contribute', e.target.value)}
                className="editor-input"
                placeholder="Share how you can add value to the community..."
                rows={3}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Expertise */}
            <div className="community-form-field full-width">
              <label className="editor-label">Startup / Project / Area of Expertise <span style={{ color: '#999', fontWeight: 400 }}>(optional)</span></label>
              <input
                value={form.expertise}
                onChange={e => update('expertise', e.target.value)}
                className="editor-input"
                placeholder="e.g. Building an AI-based security tool"
              />
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
