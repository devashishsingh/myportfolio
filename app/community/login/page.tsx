'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function MemberLoginPage() {
  const params = useSearchParams()
  const error = params?.get('error')
  const signedOut = params?.get('signed_out')

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/member/login/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setMessage(data.message || 'If that email belongs to a member, a sign-in link is on its way.')
      setSubmitted(true)
    } catch {
      setMessage('Something went wrong. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-narrow" style={{ maxWidth: 540, margin: '0 auto', padding: '80px 20px 120px' }}>
      <p className="muted-label" style={{ marginBottom: 12 }}>Builders Hub · Sign In</p>
      <h1 className="display-font" style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, marginBottom: 16 }}>
        Welcome back, builder.
      </h1>
      <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.7 }}>
        Enter your member email. We'll send a one-tap sign-in link — valid 15 minutes, single use. No password to remember.
      </p>

      {error === 'invalid_or_expired' && (
        <div style={{ marginBottom: 20, padding: 14, border: '2px solid #1a1a1a', background: '#fff0f0', boxShadow: '4px 4px 0 0 #dc2626' }}>
          That sign-in link is expired or already used. Request a fresh one below.
        </div>
      )}
      {signedOut && (
        <div style={{ marginBottom: 20, padding: 14, border: '2px solid #1a1a1a', background: '#fffae0', boxShadow: '4px 4px 0 0 #f4b942' }}>
          Signed out. See you soon.
        </div>
      )}

      {submitted ? (
        <div style={{ padding: 24, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '6px 6px 0 0 #1a1a1a' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Check your inbox</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{message}</p>
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--muted-2)' }}>Tip: also peek in spam — Resend lands clean but new domains sometimes flag.</p>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              padding: '14px 16px',
              border: '2px solid #1a1a1a',
              fontSize: 16,
              fontFamily: 'inherit',
              boxShadow: '4px 4px 0 0 #1a1a1a',
              background: '#fff',
            }}
          />
          <button type="submit" disabled={loading || !email} className="btn btn-3d" style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
            {loading ? 'Sending…' : 'Send sign-in link →'}
          </button>
        </form>
      )}

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: '2px dashed #1a1a1a' }}>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
          Not a member yet? <Link href="/community/join" style={{ fontWeight: 700, textDecoration: 'underline' }}>Apply to join the Builders Hub →</Link>
        </p>
      </div>
    </div>
  )
}
