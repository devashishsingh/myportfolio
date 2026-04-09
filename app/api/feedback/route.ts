import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { sendEmail, adminNotificationEmail, EMAIL_CONFIG } from '../../../lib/email'
import { createLead } from '../../../lib/leads'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, type, message, page } = body

    if (!name || !email || !type || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const validTypes = ['bug', 'suggestion', 'praise', 'other']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid feedback type.' }, { status: 400 })
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 characters).' }, { status: 400 })
    }

    const fb = await prisma.feedback.create({
      data: {
        name: name.slice(0, 100),
        email: email.slice(0, 200),
        type,
        message: message.slice(0, 2000),
        page: page?.slice(0, 200) || null,
      },
    })

    // Create lead
    await createLead({ name, email, source: 'feedback', sourceId: fb.id, message, meta: { type, page: page || '' } })

    // Notify admin
    const typeLabels: Record<string, string> = { bug: '🐛 Bug', suggestion: '💡 Suggestion', praise: '🎉 Praise', other: '💬 Other' }
    const notif = adminNotificationEmail('feedback', {
      From: `${name} (${email})`,
      Type: typeLabels[type] || type,
      Page: page || 'Not specified',
      Message: message.substring(0, 300),
    })
    await sendEmail({ to: EMAIL_CONFIG.adminEmail, ...notif })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
