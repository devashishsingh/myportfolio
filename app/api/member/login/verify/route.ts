import { NextRequest, NextResponse } from 'next/server'
import { consumeLoginToken, createSessionToken, MEMBER_COOKIE, MEMBER_COOKIE_OPTIONS } from '../../../../../lib/member-auth'
import { EMAIL_CONFIG } from '../../../../../lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET ?token=xxx → consume login token, mint session, set cookie, redirect.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || ''
  const memberId = await consumeLoginToken(token)

  if (!memberId) {
    return NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}/community/login?error=invalid_or_expired`)
  }

  const sessionToken = await createSessionToken(memberId)
  const res = NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}/community/welcome`)
  res.cookies.set(MEMBER_COOKIE, sessionToken, MEMBER_COOKIE_OPTIONS)
  return res
}
