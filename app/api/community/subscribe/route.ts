import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { randomBytes } from 'crypto'
import { sendEmail, subscriberConfirmationEmail, adminNotificationEmail, EMAIL_CONFIG } from '../../../../lib/email'
import { createLead } from '../../../../lib/leads'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, region, interests } = body

    if (!name || !email || !region || !interests) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 409 })
    }

    const confirmToken = randomBytes(32).toString('hex')
    const unsubscribeToken = randomBytes(32).toString('hex')

    await prisma.subscriber.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        region: region.trim(),
        interests: interests.trim(),
        confirmToken,
        unsubscribeToken,
      },
    })

    // Create lead
    await createLead({
      name: name.trim(), email: email.trim().toLowerCase(),
      source: 'community_subscribe',
      message: `Subscribed with interests: ${interests.trim()}`,
      meta: { region: region.trim(), interests: interests.trim() },
    })

    // Send confirmation email to subscriber
    const confirmUrl = `${EMAIL_CONFIG.baseUrl}/api/subscribe/confirm?token=${confirmToken}`
    const confirmMail = subscriberConfirmationEmail(name.trim(), confirmUrl)
    await sendEmail({ to: email.trim().toLowerCase(), ...confirmMail })

    // Notify admin
    const notif = adminNotificationEmail('subscriber', {
      Name: name.trim(),
      Email: email.trim().toLowerCase(),
      Region: region.trim(),
      Interests: interests.trim(),
    })
    await sendEmail({ to: EMAIL_CONFIG.adminEmail, ...notif })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
