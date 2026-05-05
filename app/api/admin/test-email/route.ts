import { NextResponse } from 'next/server'
import { isAuthenticated } from '../../../../lib/auth'
import {
  sendEmail,
  EMAIL_CONFIG,
  subscriberConfirmationEmail,
  contactAutoReplyEmail,
  joinAcknowledgmentEmail,
  bookingConfirmationEmail,
  newsletterEmail,
  adminNotificationEmail,
} from '../../../../lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Template =
  | 'subscriberConfirmation'
  | 'contactAutoReply'
  | 'joinAcknowledgment'
  | 'bookingConfirmation'
  | 'newsletter'
  | 'adminNotification'

const TEMPLATE_LABELS: Record<Template, string> = {
  subscriberConfirmation: 'Subscriber double opt-in confirmation',
  contactAutoReply: 'Contact form auto-reply',
  joinAcknowledgment: 'Community join acknowledgment',
  bookingConfirmation: 'Booking confirmation',
  newsletter: 'Newsletter (sample issue)',
  adminNotification: 'Admin notification (to admin inbox)',
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    configured: !!process.env.RESEND_API_KEY,
    sender: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
    adminEmail: EMAIL_CONFIG.adminEmail,
    baseUrl: EMAIL_CONFIG.baseUrl,
    calendarUrl: EMAIL_CONFIG.calendarUrl || null,
    templates: Object.entries(TEMPLATE_LABELS).map(([key, label]) => ({ key, label })),
  })
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { template, recipient } = (await request.json()) as { template: Template; recipient: string }

    if (!template || !TEMPLATE_LABELS[template]) {
      return NextResponse.json({ error: 'Unknown template' }, { status: 400 })
    }
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      return NextResponse.json({ error: 'Valid recipient email is required.' }, { status: 400 })
    }

    const sampleName = 'Test User'
    let payload: { subject: string; html: string; text: string }

    switch (template) {
      case 'subscriberConfirmation':
        payload = subscriberConfirmationEmail(
          sampleName,
          `${EMAIL_CONFIG.baseUrl}/api/subscribe/confirm?token=TEST-TOKEN-DO-NOT-USE`
        )
        break
      case 'contactAutoReply':
        payload = contactAutoReplyEmail(sampleName)
        break
      case 'joinAcknowledgment':
        payload = joinAcknowledgmentEmail(sampleName)
        break
      case 'bookingConfirmation':
        payload = bookingConfirmationEmail(
          sampleName,
          'Strategy Session',
          'Monday, 12 May 2026',
          '15:00',
          'Asia/Kuala_Lumpur',
          EMAIL_CONFIG.calendarUrl || null
        )
        break
      case 'newsletter':
        payload = newsletterEmail(
          `<p>This is a sample newsletter rendered from the live template.</p>
           <p>Here's where the weekly issue would go — one sharp idea, a short story, and a single action.</p>
           <p><strong>Action:</strong> Reply to this email with one question you want answered next week.</p>`,
          '[Test] Sample newsletter issue',
          `${EMAIL_CONFIG.baseUrl}/api/subscribe/unsubscribe?token=TEST-TOKEN-DO-NOT-USE`
        )
        break
      case 'adminNotification':
        payload = adminNotificationEmail('contact', {
          Name: sampleName,
          Email: recipient,
          Message: 'This is a test admin notification triggered from the dashboard.',
        })
        break
    }

    const ok = await sendEmail({ to: recipient, ...payload })

    return NextResponse.json({
      ok,
      delivered: !!process.env.RESEND_API_KEY,
      template,
      label: TEMPLATE_LABELS[template],
      recipient,
      subject: payload.subject,
      note: process.env.RESEND_API_KEY
        ? 'Email dispatched via Resend. Check the recipient inbox and the Resend dashboard.'
        : 'RESEND_API_KEY is not set — email was logged to the server console only (graceful degradation).',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to send test email' }, { status: 500 })
  }
}
