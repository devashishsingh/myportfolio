"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  buildIcs,
  renderInviteEmail,
  type MeetingInvite,
} from '../../../lib/meeting-invite'

const COMMON_TIMEZONES = [
  'Asia/Kuala_Lumpur',
  'Asia/Singapore',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Jakarta',
  'Asia/Tokyo',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Australia/Sydney',
  'UTC',
]

function defaultStart(): string {
  // Tomorrow at 14:00 in the user's local clock — formatted YYYY-MM-DDTHH:MM
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(14, 0, 0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function MeetingInvitePage() {
  const [invite, setInvite] = useState<MeetingInvite>({
    organizerName: 'Devashish Singh',
    organizerEmail: 'founder@devashishsingh.com',
    recipientName: '',
    recipientEmail: '',
    title: '1:1 Mentoring Session',
    description:
      "Looking forward to chatting. We'll talk through where you are, where you want to be, and what the next step looks like.",
    location: 'https://meet.google.com/your-meeting-link',
    startLocal: defaultStart(),
    durationMin: 45,
    timezone: 'Asia/Kuala_Lumpur',
  })
  const [bodyOverride, setBodyOverride] = useState('')
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [sendMessage, setSendMessage] = useState('')
  const [copied, setCopied] = useState<string>('')

  const update = <K extends keyof MeetingInvite>(k: K, v: MeetingInvite[K]) =>
    setInvite(prev => ({ ...prev, [k]: v }))

  const rendered = useMemo(() => {
    try {
      return renderInviteEmail(invite, { bodyOverride: bodyOverride || invite.description })
    } catch {
      return null
    }
  }, [invite, bodyOverride])

  const ics = useMemo(() => {
    try { return buildIcs(invite) } catch { return '' }
  }, [invite])

  const valid =
    !!invite.recipientName &&
    !!invite.recipientEmail &&
    !!invite.title &&
    !!invite.startLocal &&
    !!invite.timezone &&
    invite.durationMin > 0

  function downloadIcs() {
    if (!ics) return
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${invite.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      setCopied('copy-failed')
    }
  }

  function mailtoUrl(): string {
    if (!rendered) return '#'
    const params = new URLSearchParams({
      subject: rendered.subject,
      body: rendered.text,
    })
    return `mailto:${encodeURIComponent(invite.recipientEmail)}?${params.toString()}`
  }

  async function sendViaServer() {
    if (!valid) return
    setSendStatus('sending')
    setSendMessage('')
    try {
      const res = await fetch('/api/admin/meeting-invite', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ invite, bodyOverride }),
      })
      const json = await res.json()
      if (!res.ok) {
        setSendStatus('error')
        setSendMessage(json.error || 'Failed to send.')
      } else {
        setSendStatus('sent')
        setSendMessage(json.note || 'Sent.')
      }
    } catch (e) {
      setSendStatus('error')
      setSendMessage('Network error.')
    }
  }

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Meeting Invitation Drafter</h1>
        <Link href="/admin" style={{ fontSize: 14, textDecoration: 'underline', color: '#555' }}>← Back to admin</Link>
      </div>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 28, maxWidth: 720 }}>
        Compose a meeting invitation with a meeting link plus calendar buttons (Google, Outlook, Yahoo, Apple/.ics).
        Preview the rendered email, copy it for any client, open it in your default mail app, or send it via Resend.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
        {/* ── FORM ── */}
        <div style={{ padding: 20, border: '1px solid #e3e0d8', background: '#fff', borderRadius: 8 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 14 }}>Meeting details</h2>

          <Field label="Recipient name">
            <input value={invite.recipientName} onChange={e => update('recipientName', e.target.value)} placeholder="Jane Doe" style={inp} />
          </Field>
          <Field label="Recipient email">
            <input type="email" value={invite.recipientEmail} onChange={e => update('recipientEmail', e.target.value)} placeholder="jane@example.com" style={inp} />
          </Field>

          <Field label="Meeting title">
            <input value={invite.title} onChange={e => update('title', e.target.value)} style={inp} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 10 }}>
            <Field label="Start (your local clock)">
              <input type="datetime-local" value={invite.startLocal} onChange={e => update('startLocal', e.target.value)} style={inp} />
            </Field>
            <Field label="Duration (min)">
              <input type="number" min={5} step={5} value={invite.durationMin} onChange={e => update('durationMin', Number(e.target.value) || 0)} style={inp} />
            </Field>
          </div>

          <Field label="Timezone">
            <select value={invite.timezone} onChange={e => update('timezone', e.target.value)} style={inp}>
              {COMMON_TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </Field>

          <Field label="Meeting link or location">
            <input value={invite.location} onChange={e => update('location', e.target.value)} placeholder="https://meet.google.com/..." style={inp} />
          </Field>

          <Field label="Message / agenda">
            <textarea
              value={bodyOverride || invite.description}
              onChange={e => setBodyOverride(e.target.value)}
              rows={5}
              style={{ ...inp, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </Field>

          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: 'pointer', fontSize: 13, color: '#555' }}>Organizer details</summary>
            <div style={{ marginTop: 10 }}>
              <Field label="Organizer name">
                <input value={invite.organizerName} onChange={e => update('organizerName', e.target.value)} style={inp} />
              </Field>
              <Field label="Organizer email">
                <input type="email" value={invite.organizerEmail} onChange={e => update('organizerEmail', e.target.value)} style={inp} />
              </Field>
            </div>
          </details>
        </div>

        {/* ── PREVIEW + ACTIONS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 20, border: '1px solid #e3e0d8', background: '#fff', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Email preview</h2>
              {!valid && <span style={{ fontSize: 12, color: '#b45309' }}>Fill in recipient + title to enable actions</span>}
            </div>
            {rendered ? (
              <>
                <p style={{ fontSize: 12, color: '#666', margin: '0 0 6px' }}>Subject</p>
                <div style={previewBox}>{rendered.subject}</div>
                <p style={{ fontSize: 12, color: '#666', margin: '14px 0 6px' }}>HTML preview</p>
                <div style={{ ...previewBox, padding: 0, overflow: 'hidden' }}>
                  <iframe
                    title="email-preview"
                    srcDoc={rendered.html}
                    style={{ width: '100%', height: 380, border: 0, background: '#f6f6f4' }}
                  />
                </div>
              </>
            ) : (
              <p style={{ color: '#888', fontSize: 14 }}>Invalid input — check date/time fields.</p>
            )}
          </div>

          <div style={{ padding: 20, border: '1px solid #e3e0d8', background: '#fff', borderRadius: 8 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>Actions</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button disabled={!valid} onClick={() => rendered && copy(rendered.html, 'html')} style={btn}>
                {copied === 'html' ? '✓ Copied HTML' : 'Copy HTML'}
              </button>
              <button disabled={!valid} onClick={() => rendered && copy(rendered.text, 'text')} style={btn}>
                {copied === 'text' ? '✓ Copied text' : 'Copy plain text'}
              </button>
              <button disabled={!valid} onClick={() => rendered && copy(rendered.subject, 'subject')} style={btn}>
                {copied === 'subject' ? '✓ Copied subject' : 'Copy subject'}
              </button>
              <button disabled={!valid} onClick={downloadIcs} style={btn}>Download .ics</button>
              <a
                aria-disabled={!valid}
                href={valid ? mailtoUrl() : undefined}
                style={{ ...btnLink, opacity: valid ? 1 : 0.5, pointerEvents: valid ? 'auto' : 'none' }}
              >
                Open in mail app
              </a>
            </div>

            {rendered && (
              <div style={{ marginTop: 14, fontSize: 13, color: '#555' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#333' }}>Calendar links</p>
                <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
                  <li><a href={rendered.googleUrl} target="_blank" rel="noopener noreferrer" style={lnk}>Google Calendar</a></li>
                  <li><a href={rendered.outlookUrl} target="_blank" rel="noopener noreferrer" style={lnk}>Outlook</a></li>
                  <li><a href={rendered.yahooUrl} target="_blank" rel="noopener noreferrer" style={lnk}>Yahoo</a></li>
                </ul>
              </div>
            )}

            <hr style={{ margin: '18px 0', border: 0, borderTop: '1px solid #ececec' }} />
            <div>
              <p style={{ margin: '0 0 8px', fontSize: 13, color: '#555' }}>
                Or send directly via Resend (uses <code>RESEND_API_KEY</code>; falls back to console log if not configured):
              </p>
              <button disabled={!valid || sendStatus === 'sending'} onClick={sendViaServer} style={{ ...btn, background: '#1a1a1a', color: '#fff' }}>
                {sendStatus === 'sending' ? 'Sending…' : sendStatus === 'sent' ? '✓ Sent' : 'Send invitation'}
              </button>
              {sendMessage && (
                <p style={{ marginTop: 8, fontSize: 13, color: sendStatus === 'error' ? '#dc2626' : '#15803d' }}>{sendMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 4, letterSpacing: '0.02em' }}>{label}</span>
      {children}
    </label>
  )
}

const inp: React.CSSProperties = {
  width: '100%',
  padding: '9px 11px',
  border: '1px solid #d6d3cc',
  borderRadius: 6,
  fontSize: 14,
  background: '#fff',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const previewBox: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid #ececec',
  background: '#fafaf8',
  borderRadius: 6,
  fontSize: 13,
  color: '#222',
  fontFamily: 'ui-monospace, Menlo, monospace',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}

const btn: React.CSSProperties = {
  padding: '8px 14px',
  border: '1px solid #1a1a1a',
  background: '#fff',
  cursor: 'pointer',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'inherit',
}

const btnLink: React.CSSProperties = {
  ...btn,
  display: 'inline-block',
  textDecoration: 'none',
  color: '#1a1a1a',
}

const lnk: React.CSSProperties = {
  color: '#0a66c2',
  textDecoration: 'underline',
}
