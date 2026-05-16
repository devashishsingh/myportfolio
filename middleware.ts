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

// Permanent route redirects (site restructure)
const REDIRECTS: Record<string, string> = {
  '/services': '/',
  '/work': '/about',
  '/study': '/learn',
  '/community': '/',
  '/community/join': '/',
  '/community/subscribe': '/',
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Redirects — match exact path or any subpath of /community
  if (REDIRECTS[pathname]) {
    const target = req.nextUrl.clone()
    target.pathname = REDIRECTS[pathname]
    return NextResponse.redirect(target, 308)
  }
  if (pathname.startsWith('/community/') || pathname === '/community') {
    const target = req.nextUrl.clone()
    target.pathname = '/'
    return NextResponse.redirect(target, 308)
  }
  if (pathname.startsWith('/work/') || pathname === '/work') {
    const target = req.nextUrl.clone()
    target.pathname = '/about'
    return NextResponse.redirect(target, 308)
  }
  if (pathname.startsWith('/study/') || pathname === '/study') {
    const target = req.nextUrl.clone()
    target.pathname = '/learn'
    return NextResponse.redirect(target, 308)
  }

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
  matcher: [
    '/admin/:path*',
    '/services',
    '/work',
    '/work/:path*',
    '/study',
    '/study/:path*',
    '/community',
    '/community/:path*',
  ],
}
