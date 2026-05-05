'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmitForm({ challengeId }: { challengeId: string }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (content.trim().length < 30) {
      setError('Writeup must be at least 30 characters.')
      return
    }
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/member/challenges/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ challengeId, content, url: url || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submit failed')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>Your writeup *</span>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Walk through your thinking — approach, trade-offs, what surprised you, what you'd do differently. Markdown welcome."
          rows={10}
          required
          style={{
            padding: '12px 14px',
            border: '2px solid #1a1a1a',
            fontSize: 15,
            fontFamily: 'inherit',
            boxShadow: '4px 4px 0 0 #1a1a1a',
            background: '#fff',
            resize: 'vertical',
          }}
        />
        <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>{content.length} chars · min 30 · max 20,000</span>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>Proof URL (optional)</span>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://github.com/... or https://demo.example.com"
          style={{
            padding: '10px 14px',
            border: '2px solid #1a1a1a',
            fontSize: 15,
            fontFamily: 'inherit',
            boxShadow: '3px 3px 0 0 #1a1a1a',
            background: '#fff',
          }}
        />
      </label>

      {error && <p style={{ color: '#dc2626', fontSize: 14 }}>⚠ {error}</p>}

      <button type="submit" disabled={submitting} className="btn btn-3d" style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
        {submitting ? 'Submitting…' : 'Submit →'}
      </button>

      <p style={{ fontSize: 12, color: 'var(--muted-2)' }}>
        One submission per challenge. AI tools welcome — original thinking is what wins. Don't paste raw model output.
      </p>
    </form>
  )
}
