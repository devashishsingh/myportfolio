import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { destroySession, MEMBER_COOKIE } from '../../../../lib/member-auth'
import { EMAIL_CONFIG } from '../../../../lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  const raw = cookies().get(MEMBER_COOKIE)?.value
  await destroySession(raw)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(MEMBER_COOKIE, '', { ...{ httpOnly: true, path: '/', sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' }, maxAge: 0 })
  return res
}

export async function GET() {
  const raw = cookies().get(MEMBER_COOKIE)?.value
  await destroySession(raw)
  const res = NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}/community/login?signed_out=1`)
  res.cookies.set(MEMBER_COOKIE, '', { ...{ httpOnly: true, path: '/', sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' }, maxAge: 0 })
  return res
}
