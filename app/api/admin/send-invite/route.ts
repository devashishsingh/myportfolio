import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '../../../../lib/auth'

function isAuthed(): boolean {
  return isAuthenticated()
}

export async function POST(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, email, message } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const sendgridKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.CONTACT_TARGET_EMAIL || ''
    const baseUrl = process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const defaultMessage = `Hi ${name},

You are personally invited by Devashish Singh to join the Builders Hub — a curated community of tech professionals, founders, cybersecurity learners, AI builders, and innovators.

This is an invitation-only community where members collaborate, share ideas, and solve real problems digitally.

To accept this invitation and join the community, please fill out a brief profile:

${baseUrl}/community/join

Looking forward to having you onboard.

— Devashish Singh
Cyber Coach · Mentor · Advisor`

    const emailBody = message
      ? `${message}\n\nTo join, visit: ${baseUrl}/community/join`
      : defaultMessage

    if (!sendgridKey || !fromEmail) {
      console.log('Invitation email (no email configured):', { name, email, message: emailBody })
      return NextResponse.json({ ok: true, method: 'logged', note: 'Email logged to console (SendGrid not configured).' })
    }

    const payload = {
      personalizations: [{ to: [{ email, name }] }],
      from: { email: fromEmail, name: 'Devashish Singh' },
      subject: `You're Invited to Join the Builders Hub — Devashish Singh`,
      content: [{ type: 'text/plain', value: emailBody }],
    }

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sendgridKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('SendGrid error:', text)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, method: 'sent' })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
