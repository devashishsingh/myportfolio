import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'
import { createLoginToken } from '../../../../../lib/member-auth'
import { sendEmail, memberLoginEmail, EMAIL_CONFIG } from '../../../../../lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST { email } → if member exists, generate magic link + email it.
// Always returns the same response (don't leak which emails are members).
export async function POST(req: NextRequest) {
  let email = ''
  try {
    const body = await req.json()
    email = (body?.email || '').toLowerCase().trim()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const member = await prisma.member.findUnique({ where: { email } })

  if (member) {
    try {
      const rawToken = await createLoginToken(member.id)
      const magicLoginUrl = `${EMAIL_CONFIG.baseUrl}/api/member/login/verify?token=${rawToken}`
      const payload = memberLoginEmail({ name: member.displayName, magicLoginUrl })
      await sendEmail({ to: member.email, ...payload })
    } catch (err) {
      console.error('[member-login-request] failed:', err)
    }
  }

  // Same response either way
  return NextResponse.json({ ok: true, message: 'If that email belongs to a member, a sign-in link is on its way.' })
}
