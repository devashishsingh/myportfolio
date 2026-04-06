import { NextRequest, NextResponse } from 'next/server'

async function verifySessionEdge(sessionValue: string): Promise<boolean> {
  const adminToken = process.env.ADMIN_TOKEN
  const sessionSecret = process.env.SESSION_SECRET || 'portfolio-session-default-key'
  if (!adminToken || !sessionValue) return false

  // Reproduce the same SHA-256 derivation as lib/auth.ts using Web Crypto API
  const data = new TextEncoder().encode(`${sessionSecret}:${adminToken}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const expected = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

  // Constant-time comparison (mitigate timing attacks)
  if (sessionValue.length !== expected.length) return false
  let mismatch = 0
  for (let i = 0; i < sessionValue.length; i++) {
    mismatch |= sessionValue.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin page (not /api/admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    const session = req.cookies.get('admin_session')?.value

    if (!session || !(await verifySessionEdge(session))) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
