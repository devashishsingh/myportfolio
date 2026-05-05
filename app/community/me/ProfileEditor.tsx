'use client'

import { useState } from 'react'
import Link from 'next/link'

const TRACKS: Array<[string, string]> = [
  ['cyber', 'Cyber'], ['ai', 'AI/ML'], ['cloud', 'Cloud'], ['systems', 'Systems'],
  ['networks', 'Networks'], ['coding', 'Coding'], ['gaming', 'Gaming'], ['digital', 'Digital'],
]

interface InitialProfile {
  email: string
  handle: string
  displayName: string
  bio: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  siteUrl: string | null
  region: string | null
  tracks: string[]
  workingOn: string | null
  openToCollab: boolean
  openToHire: boolean
  openToMentor: boolean
  founderNumber: number | null
  points: number
}

export default function ProfileEditor({ initial }: { initial: InitialProfile }) {
  const [form, setForm] = useState({
    displayName: initial.displayName || '',
    bio: initial.bio || '',
    linkedinUrl: initial.linkedinUrl || '',
    githubUrl: initial.githubUrl || '',
    siteUrl: initial.siteUrl || '',
    region: initial.region || '',
    workingOn: initial.workingOn || '',
    openToCollab: initial.openToCollab,
    openToHire: initial.openToHire,
    openToMentor: initial.openToMentor,
    tracks: initial.tracks,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }))
    setSaved(false)
  }

  function toggleTrack(slug: string) {
    setForm(f => ({
      ...f,
      tracks: f.tracks.includes(slug) ? f.tracks.filter(t => t !== slug) : [...f.tracks, slug],
    }))
    setSaved(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/member/profile', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Save failed')
      }
      setSaved(true)
    } catch (err: any) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '2px solid #1a1a1a',
    fontSize: 15,
    fontFamily: 'inherit',
    boxShadow: '3px 3px 0 0 #1a1a1a',
    background: '#fff',
    width: '100%',
  }

  return (
    <div className="container-narrow" style={{ maxWidth: 720, margin: '0 auto', padding: '60px 20px 120px' }}>
      <p className="muted-label" style={{ marginBottom: 12 }}>Builders Hub · Edit profile</p>
      <h1 className="display-font" style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, marginBottom: 8 }}>
        Your profile.
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 15 }}>
        Public at <Link href={`/community/${initial.handle}`} style={{ textDecoration: 'underline' }}>/community/{initial.handle}</Link> · {initial.points} pts {initial.founderNumber ? `· Founding #${String(initial.founderNumber).padStart(2, '0')}` : ''}
      </p>

      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Display name" required>
          <input style={inputStyle} value={form.displayName} onChange={e => set('displayName', e.target.value)} required />
        </Field>

        <Field label="Bio" hint="One paragraph. What you do, what you believe, why you're here.">
          <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={form.bio} onChange={e => set('bio', e.target.value)} maxLength={500} />
        </Field>

        <Field label="Working on" hint="One line. The thing you'd point at if asked 'what are you building?'">
          <input style={inputStyle} value={form.workingOn} onChange={e => set('workingOn', e.target.value)} maxLength={200} />
        </Field>

        <Field label="Region">
          <input style={inputStyle} value={form.region} onChange={e => set('region', e.target.value)} placeholder="e.g. Malaysia, India, EU" />
        </Field>

        <Field label="Tracks" hint="Pick the spaces you work in.">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TRACKS.map(([slug, label]) => {
              const active = form.tracks.includes(slug)
              return (
                <button type="button" key={slug} onClick={() => toggleTrack(slug)} style={{
                  padding: '6px 14px',
                  border: '2px solid #1a1a1a',
                  background: active ? '#1a1a1a' : '#fff',
                  color: active ? '#fdfaf6' : '#1a1a1a',
                  fontSize: 13,
                  fontFamily: 'IBM Plex Mono, monospace',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: active ? 'none' : '3px 3px 0 0 #1a1a1a',
                }}>{label}</button>
              )
            })}
          </div>
        </Field>

        <Field label="LinkedIn URL">
          <input style={inputStyle} value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} type="url" placeholder="https://linkedin.com/in/..." />
        </Field>
        <Field label="GitHub URL">
          <input style={inputStyle} value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} type="url" placeholder="https://github.com/..." />
        </Field>
        <Field label="Website">
          <input style={inputStyle} value={form.siteUrl} onChange={e => set('siteUrl', e.target.value)} type="url" placeholder="https://..." />
        </Field>

        <Field label="Open to" hint="Tell others how to reach out.">
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 14 }}>
            <Toggle label="🤝 Collab" value={form.openToCollab} onChange={v => set('openToCollab', v)} />
            <Toggle label="💼 Hire" value={form.openToHire} onChange={v => set('openToHire', v)} />
            <Toggle label="🧭 Mentor" value={form.openToMentor} onChange={v => set('openToMentor', v)} />
          </div>
        </Field>

        {error && <p style={{ color: '#dc2626', fontSize: 14 }}>⚠ {error}</p>}
        {saved && <p style={{ color: '#15803d', fontSize: 14 }}>✓ Saved</p>}

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" disabled={saving} className="btn btn-3d" style={{ padding: '12px 28px' }}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
          <Link href="/community/welcome" className="btn-outline" style={{ padding: '12px 24px' }}>Cancel</Link>
        </div>
      </form>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: '2px dashed #1a1a1a', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <Link href={`/community/${initial.handle}`} style={{ textDecoration: 'underline' }}>View public profile →</Link>
        <a href="/api/member/logout" style={{ color: 'var(--muted)' }}>Sign out</a>
      </div>
    </div>
  )
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {label}{required && ' *'}
      </span>
      {children}
      {hint && <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>{hint}</span>}
    </label>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} style={{
      padding: '8px 14px',
      border: '2px solid #1a1a1a',
      background: value ? '#fffae0' : '#fff',
      cursor: 'pointer',
      boxShadow: '3px 3px 0 0 #1a1a1a',
    }}>{value ? '✓ ' : ''}{label}</button>
  )
}
