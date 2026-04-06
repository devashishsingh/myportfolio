"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError("You're unauthorized.")
      setLoading(false)
    }
  }

  return (
    <section className="container-wide" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <h1 className="display-font" style={{ fontSize: '32px', marginBottom: '8px' }}>Admin Access</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '32px' }}>
          This area is restricted. If you&apos;re interested in contributing or collaborating, connect with my master{' '}
          <a href="/contact" style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'underline' }}>Devashish Singh here</a>.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            style={{
              padding: '12px 16px',
              border: '1px solid rgba(0,0,0,0.15)',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.18s',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-3d"
            style={{ width: '100%', textAlign: 'center', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '20px', padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
            <p style={{ color: '#dc2626', fontWeight: 600, fontSize: '14px', margin: 0 }}>
              You&apos;re unauthorized.
            </p>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '6px' }}>
              However if you&apos;re interested, connect with my master{' '}
              <a href="/contact" style={{ color: '#0b0b0b', fontWeight: 600, textDecoration: 'underline' }}>Devashish Singh here</a>.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
