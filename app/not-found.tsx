import Link from 'next/link'

export default function NotFound(){
  return (
    <div className="container-wide" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 72, fontWeight: 800, color: '#e5e5e5', lineHeight: 1, marginBottom: 16 }}>404</div>
      <h1 className="display-font" style={{ fontSize: 28, marginBottom: 12 }}>Page not found</h1>
      <p style={{ color: '#888', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.7 }}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="btn" style={{ fontSize: 14, padding: '12px 28px' }}>Back to Home</Link>
    </div>
  )
}
