import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, deriveSessionHash, SESSION_COOKIE_OPTIONS } from '../../../../lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Store a derived hash in the cookie — never the raw password
  const sessionHash = deriveSessionHash(password)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_session', sessionHash, SESSION_COOKIE_OPTIONS)
  return res
}
