"use client"

import { useState } from 'react'
import Link from 'next/link'
import { REGIONS, INTEREST_AREAS } from '../../../lib/constants'

export default function SubscribePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    region: '',
    interests: [] as string[],
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function toggleInterest(interest: string) {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.interests.length === 0) {
      setErrorMsg('Please select at least one interest.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/community/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...form,
          interests: form.interests.join(', '),
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
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📬</span>
          <h1 className="display-font" style={{ fontSize: 32, marginBottom: 12 }}>You&apos;re Subscribed!</h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
            You will receive curated updates, featured posts, community news, and selected opportunities. 
            Welcome to the network.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/community" className="btn-outline">Explore Community</Link>
            <Link href="/community/join" className="btn btn-3d">Join the Community</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container-wide" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/community" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
          ← Back to Community
        </Link>
        <h1 className="display-font" style={{ fontSize: 'clamp(28px, 5vw, 36px)', marginBottom: 8 }}>
          Subscribe for Updates
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
          Stay informed with curated updates, featured posts, mentoring opportunities, 
          and community announcements — delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="editor-label">Name *</label>
              <input
                value={form.name}
                onChange={e => update('name', e.target.value)}
                className="editor-input"
                placeholder="Your name"
                required
              />
            </div>

            <div>
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

            <div>
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

            <div>
              <label className="editor-label">Topics of Interest *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {INTEREST_AREAS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`community-interest-chip ${form.interests.includes(interest) ? 'active' : ''}`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 6, background: '#fef2f2', color: '#dc2626', fontSize: 14 }}>
              {errorMsg}
            </div>
          )}

          <div style={{ marginTop: 28 }}>
            <button type="submit" className="btn btn-3d" disabled={status === 'sending'}>
              {status === 'sending' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
