import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '../../../../lib/auth'
import { EMAIL_CONFIG } from '../../../../lib/email'
import {
  buildIcs,
  renderInviteEmail,
  type MeetingInvite,
} from '../../../../lib/meeting-invite'

function validate(invite: any): invite is MeetingInvite {
  return (
    invite &&
    typeof invite.recipientName === 'string' && invite.recipientName.trim() &&
    typeof invite.recipientEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.recipientEmail) &&
    typeof invite.organizerName === 'string' && invite.organizerName.trim() &&
    typeof invite.organizerEmail === 'string' &&
    typeof invite.title === 'string' && invite.title.trim() &&
    typeof invite.startLocal === 'string' && invite.startLocal.trim() &&
    typeof invite.timezone === 'string' && invite.timezone.trim() &&
    typeof invite.durationMin === 'number' && invite.durationMin > 0
  )
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { invite, bodyOverride } = body || {}
  if (!validate(invite)) {
    return NextResponse.json({ error: 'Missing or invalid invite fields' }, { status: 400 })
  }

  let rendered
  let ics: string
  try {
    rendered = renderInviteEmail(invite, { bodyOverride })
    ics = buildIcs(invite)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to render invite' }, { status: 400 })
  }

  // Fallback: log when Resend is not configured (graceful, matches lib/email.ts behaviour)
  if (!EMAIL_CONFIG.apiKey) {
    console.log(`[MeetingInvite] Resend not configured. Would send to ${invite.recipientEmail}: "${rendered.subject}"`)
    return NextResponse.json({
      ok: true,
      method: 'logged',
      note: 'RESEND_API_KEY not configured — invitation logged to server console.',
    })
  }

  try {
    const filename = `${invite.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${EMAIL_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
        to: [invite.recipientEmail.toLowerCase()],
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        reply_to: invite.organizerEmail || EMAIL_CONFIG.fromEmail,
        attachments: [
          {
            filename,
            content: Buffer.from(ics, 'utf-8').toString('base64'),
            content_type: 'text/calendar; method=REQUEST; charset=UTF-8',
          },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[MeetingInvite] Resend error:', err)
      return NextResponse.json({ error: 'Resend rejected the request', detail: err }, { status: 502 })
    }

    return NextResponse.json({ ok: true, method: 'sent', note: `Invitation sent to ${invite.recipientEmail}.` })
  } catch (e: any) {
    console.error('[MeetingInvite] Send failed:', e)
    return NextResponse.json({ error: 'Send failed', detail: e?.message }, { status: 500 })
  }
}
