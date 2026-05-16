"use client"
import { useState } from 'react'

export interface FieldItem {
  rank: number
  emoji: string
  name: string
  salary: string
  growth: string
  why: string
}

export default function FieldsAccordion({ items }: { items: FieldItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((it, idx) => {
        const isOpen = open === idx
        return (
          <li
            key={it.rank}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              background: 'var(--surface-2)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : idx)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 18px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--text-primary)',
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  width: 36,
                  flexShrink: 0,
                  color: 'var(--muted)',
                }}
              >
                #{it.rank}
              </span>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{it.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    lineHeight: 1.2,
                  }}
                >
                  {it.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    marginTop: 4,
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {it.salary} · {it.growth}
                </span>
              </span>
              <span
                aria-hidden
                style={{
                  fontSize: 18,
                  color: 'var(--muted)',
                  flexShrink: 0,
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.18s ease',
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '0 18px 18px 68px',
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: 'var(--text-muted)',
                  borderTop: '1px dashed var(--border)',
                  paddingTop: 14,
                  marginTop: -1,
                }}
              >
                {it.why}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
