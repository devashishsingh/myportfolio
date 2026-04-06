import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { sendEmail, joinAcknowledgmentEmail, adminNotificationEmail, EMAIL_CONFIG } from '../../../../lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, linkedIn, github, portfolio, role, interest, region, whyJoin, contribute, expertise } = body

    if (!fullName || !email || !role || !interest || !region || !whyJoin || !contribute) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    // Check if already submitted
    const existing = await prisma.invitationRequest.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An invitation request with this email already exists.' }, { status: 409 })
    }

    await prisma.invitationRequest.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        linkedIn: linkedIn?.trim() || null,
        github: github?.trim() || null,
        portfolio: portfolio?.trim() || null,
        role: role.trim(),
        interest: interest.trim(),
        region: region.trim(),
        whyJoin: whyJoin.trim(),
        contribute: contribute.trim(),
        expertise: expertise?.trim() || null,
      },
    })

    // Send acknowledgment to applicant
    const ackEmail = joinAcknowledgmentEmail(fullName.trim())
    await sendEmail({ to: email.trim().toLowerCase(), ...ackEmail })

    // Notify admin
    const notif = adminNotificationEmail('join', {
      Name: fullName.trim(),
      Email: email.trim().toLowerCase(),
      Role: role.trim(),
      Interest: interest.trim(),
      Region: region.trim(),
    })
    await sendEmail({ to: EMAIL_CONFIG.adminEmail, ...notif })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
