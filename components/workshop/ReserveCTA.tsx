"use client"

export default function ReserveCTA({ label = 'Reserve Your Free Seat' }: { label?: string }) {
  return (
    <button
      onClick={() => {
        const el = document.getElementById('register')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
      className="btn btn-3d"
      style={{ padding: '14px 24px', fontSize: 15, border: 'none', cursor: 'pointer' }}
    >
      {label} →
    </button>
  )
}
