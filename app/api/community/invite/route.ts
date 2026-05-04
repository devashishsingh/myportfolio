import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { sendEmail, joinAcknowledgmentEmail, adminNotificationEmail, EMAIL_CONFIG } from '../../../../lib/email'
import { createLead } from '../../../../lib/leads'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, github, interest, tellMore } = body

    if (!fullName || !email || !interest || !tellMore) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    // Check if already submitted
    const existing = await prisma.invitationRequest.findUnique({ where: { email: cleanEmail } })
    if (existing) {
      return NextResponse.json({ error: 'An invitation request with this email already exists.' }, { status: 409 })
    }

    await prisma.invitationRequest.create({
      data: {
        fullName: fullName.trim(),
        email: cleanEmail,
        github: github?.trim() || null,
        interest: interest.trim(),
        whyJoin: tellMore.trim(),
        // legacy required columns — kept blank until schema is migrated
        role: '',
        region: '',
        contribute: '',
      },
    })

    // Create lead
    await createLead({
      name: fullName.trim(),
      email: cleanEmail,
      source: 'community_invite',
      message: tellMore.trim().substring(0, 500),
      meta: { interest: interest.trim(), github: github?.trim() || '' },
    })

    // Send acknowledgment to applicant
    const ackEmail = joinAcknowledgmentEmail(fullName.trim())
    await sendEmail({ to: cleanEmail, ...ackEmail })

    // Notify admin
    const notif = adminNotificationEmail('join', {
      Name: fullName.trim(),
      Email: cleanEmail,
      GitHub: github?.trim() || '—',
      Interest: interest.trim(),
      'Tell us more': tellMore.trim(),
    })
    await sendEmail({ to: EMAIL_CONFIG.adminEmail, ...notif })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
