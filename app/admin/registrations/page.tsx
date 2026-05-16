"use client"

import { useCallback, useEffect, useState } from 'react'

interface Registration {
  id: string
  name: string
  email: string
  phone: string
  college: string
  year: string
  field: string
  createdAt: string
}

export default function WorkshopRegistrationsPage() {
  const [rows, setRows] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/workshop', { cache: 'no-store' })
      if (res.status === 401) {
        window.location.href = '/login'
        return
      }
      if (!res.ok) {
        setError('Failed to load registrations.')
        return
      }
      const data = await res.json()
      setRows(data.registrations || [])
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const downloadCsv = () => {
    window.location.href = '/api/admin/workshop?format=csv'
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#f5f5f5',
        padding: '40px 24px',
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: 4,
              }}
            >
              Admin
            </p>
            <h1
              className="display-font"
              style={{ fontSize: 28, lineHeight: 1.1, margin: 0, color: '#fff' }}
            >
              Workshop Registrations{' '}
              <span style={{ color: '#888', fontSize: 18 }}>({rows.length} / 5)</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={load} style={btnStyle} disabled={loading}>
              {loading ? 'Loading…' : '↻ Refresh'}
            </button>
            <button onClick={downloadCsv} style={{ ...btnStyle, background: '#fff', color: '#0a0a0a' }}>
              ⬇ Download CSV
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: 14,
              background: '#3a0e0e',
              border: '1px solid #6b1a1a',
              color: '#ffb3b3',
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            border: '1px solid #2a2a2a',
            background: '#111',
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
              minWidth: 760,
            }}
          >
            <thead>
              <tr style={{ background: '#1a1a1a' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Interest</th>
                <th style={thStyle}>College / Year</th>
                <th style={thStyle}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#888', padding: 32 }}>
                    No registrations yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid #222' }}>
                  <td style={tdStyle}>{r.name}</td>
                  <td style={tdStyle}>
                    <a href={`mailto:${r.email}`} style={{ color: '#7dd3fc', textDecoration: 'none' }}>
                      {r.email}
                    </a>
                  </td>
                  <td style={tdStyle}>{r.phone}</td>
                  <td style={tdStyle}>{r.field}</td>
                  <td style={{ ...tdStyle, color: '#aaa', fontSize: 12 }}>
                    {r.college}
                    {r.year ? ` · ${r.year}` : ''}
                  </td>
                  <td style={{ ...tdStyle, color: '#888', fontSize: 12 }}>
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 16, color: '#666', fontSize: 12 }}>
          Auto-closes at 5 registrations. Use Download CSV to export all entries.
        </p>
      </div>
    </main>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 14px',
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#aaa',
  borderBottom: '1px solid #2a2a2a',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 14px',
  verticalAlign: 'top',
  color: '#e5e5e5',
}

const btnStyle: React.CSSProperties = {
  padding: '10px 16px',
  background: '#222',
  color: '#fff',
  border: '1px solid #444',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
  letterSpacing: '0.04em',
}
