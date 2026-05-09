// lib/meeting-invite.ts
// Pure helpers for building meeting invitation artefacts.
// No I/O — safe to import in both server and client components.

export interface MeetingInvite {
  organizerName: string
  organizerEmail: string
  recipientName: string
  recipientEmail: string
  title: string
  description: string
  location: string // meeting URL or physical address
  /** ISO date+time in the organizer's local TZ, e.g. "2026-05-15T14:00" */
  startLocal: string
  /** Duration in minutes */
  durationMin: number
  /** IANA timezone, e.g. "Asia/Kuala_Lumpur" */
  timezone: string
}

/**
 * Convert a local ISO string ("2026-05-15T14:00") + IANA tz to a UTC Date.
 * Uses Intl.DateTimeFormat to derive the tz offset at that wall-clock time
 * (handles DST without bringing in a date-fns dependency).
 */
function localToUtc(localIso: string, timezone: string): Date {
  // Parse as if UTC first
  const naive = new Date(`${localIso}:00Z`)
  if (isNaN(naive.getTime())) throw new Error('Invalid date/time')

  // Format the naive UTC instant using the target timezone to find what it
  // *appears* as there. The difference is the tz offset to apply.
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  })
  const parts = fmt.formatToParts(naive)
  const get = (t: string) => Number(parts.find(p => p.type === t)?.value)
  const tzAsUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour') === 24 ? 0 : get('hour'),
    get('minute'),
    get('second'),
  )
  const offsetMs = tzAsUtc - naive.getTime()
  return new Date(naive.getTime() - offsetMs)
}

/** Format a Date as an ICS-style UTC stamp: 20260515T140000Z */
function toIcsUtc(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
}

/** Format for Google Calendar URL: 20260515T140000Z (same as ICS) */
const toGoogleStamp = toIcsUtc

/** Escape ICS text fields per RFC 5545 */
function icsEscape(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

export function getMeetingTimes(invite: MeetingInvite): { startUtc: Date; endUtc: Date } {
  const startUtc = localToUtc(invite.startLocal, invite.timezone)
  const endUtc = new Date(startUtc.getTime() + invite.durationMin * 60_000)
  return { startUtc, endUtc }
}

/** Build the ICS file body. */
export function buildIcs(invite: MeetingInvite, uid?: string): string {
  const { startUtc, endUtc } = getMeetingTimes(invite)
  const dtStart = toIcsUtc(startUtc)
  const dtEnd = toIcsUtc(endUtc)
  const dtStamp = toIcsUtc(new Date())
  const id = uid || `${dtStart}-${invite.recipientEmail}-${invite.organizerEmail}`.replace(/[^a-zA-Z0-9.-]/g, '')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//devashishsingh.com//Meeting Invite//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${id}@devashishsingh.com`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${icsEscape(invite.title)}`,
    `DESCRIPTION:${icsEscape(invite.description)}`,
    `LOCATION:${icsEscape(invite.location)}`,
    `ORGANIZER;CN=${icsEscape(invite.organizerName)}:mailto:${invite.organizerEmail}`,
    `ATTENDEE;CN=${icsEscape(invite.recipientName)};RSVP=TRUE:mailto:${invite.recipientEmail}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${icsEscape(invite.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  // CRLF per RFC 5545
  return lines.join('\r\n')
}

export function buildGoogleCalendarUrl(invite: MeetingInvite): string {
  const { startUtc, endUtc } = getMeetingTimes(invite)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: invite.title,
    dates: `${toGoogleStamp(startUtc)}/${toGoogleStamp(endUtc)}`,
    details: invite.description + (invite.location ? `\n\nJoin: ${invite.location}` : ''),
    location: invite.location,
    ctz: invite.timezone,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function buildOutlookCalendarUrl(invite: MeetingInvite): string {
  const { startUtc, endUtc } = getMeetingTimes(invite)
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: invite.title,
    body: invite.description + (invite.location ? `\n\nJoin: ${invite.location}` : ''),
    location: invite.location,
    startdt: startUtc.toISOString(),
    enddt: endUtc.toISOString(),
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

export function buildYahooCalendarUrl(invite: MeetingInvite): string {
  const { startUtc, endUtc } = getMeetingTimes(invite)
  const params = new URLSearchParams({
    v: '60',
    title: invite.title,
    st: toGoogleStamp(startUtc),
    et: toGoogleStamp(endUtc),
    desc: invite.description + (invite.location ? `\n\nJoin: ${invite.location}` : ''),
    in_loc: invite.location,
  })
  return `https://calendar.yahoo.com/?${params.toString()}`
}

export interface RenderedEmail {
  subject: string
  html: string
  text: string
  googleUrl: string
  outlookUrl: string
  yahooUrl: string
  startUtc: Date
  endUtc: Date
}

/**
 * Format a UTC Date as a friendly string in the given timezone.
 * Example: "Friday, 15 May 2026 · 2:00 PM (Asia/Kuala_Lumpur)"
 */
export function formatFriendly(d: Date, timezone: string): string {
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(d)
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(d)
  return `${date} · ${time} (${timezone})`
}

export function renderInviteEmail(invite: MeetingInvite, opts?: { icsLinkUrl?: string; bodyOverride?: string }): RenderedEmail {
  const { startUtc, endUtc } = getMeetingTimes(invite)
  const googleUrl = buildGoogleCalendarUrl(invite)
  const outlookUrl = buildOutlookCalendarUrl(invite)
  const yahooUrl = buildYahooCalendarUrl(invite)

  const friendly = formatFriendly(startUtc, invite.timezone)
  const subject = `Invitation: ${invite.title} — ${friendly}`
  const body = (opts?.bodyOverride || invite.description || '').trim()

  const text = [
    `Hi ${invite.recipientName},`,
    '',
    body,
    '',
    `When: ${friendly}`,
    `Duration: ${invite.durationMin} minutes`,
    `Where: ${invite.location}`,
    '',
    'Add to your calendar:',
    `Google Calendar: ${googleUrl}`,
    `Outlook: ${outlookUrl}`,
    `Yahoo Calendar: ${yahooUrl}`,
    ...(opts?.icsLinkUrl ? [`Apple/.ics file: ${opts.icsLinkUrl}`] : []),
    '',
    `Looking forward to it.`,
    '',
    `— ${invite.organizerName}`,
  ].join('\n')

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const button = (href: string, label: string, bg: string) =>
    `<a href="${href}" target="_blank" style="display:inline-block;padding:10px 16px;margin:4px 6px 4px 0;background:${bg};color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;font-family:Arial,Helvetica,sans-serif;">${label}</a>`

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f6f4;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;line-height:1.6;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff;">
  <p style="margin:0 0 16px;font-size:16px;">Hi ${esc(invite.recipientName)},</p>
  <p style="margin:0 0 20px;font-size:15px;white-space:pre-wrap;">${esc(body)}</p>

  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;border-collapse:collapse;">
    <tr><td style="padding:12px 14px;background:#fdfaf6;border:1px solid #e9e6df;font-size:14px;">
      <strong>When:</strong> ${esc(friendly)}<br/>
      <strong>Duration:</strong> ${invite.durationMin} minutes<br/>
      <strong>Where:</strong> ${
        /^https?:\/\//i.test(invite.location)
          ? `<a href="${invite.location}" style="color:#0a66c2;text-decoration:underline;">${esc(invite.location)}</a>`
          : esc(invite.location)
      }
    </td></tr>
  </table>

  <p style="margin:24px 0 8px;font-size:14px;color:#555;">Add to your calendar:</p>
  <div style="margin-bottom:8px;">
    ${button(googleUrl, 'Google Calendar', '#1a73e8')}
    ${button(outlookUrl, 'Outlook', '#0078d4')}
    ${button(yahooUrl, 'Yahoo', '#7B0099')}
    ${opts?.icsLinkUrl ? button(opts.icsLinkUrl, 'Apple / .ics', '#1a1a1a') : ''}
  </div>
  <p style="margin:8px 0 0;font-size:12px;color:#888;">If buttons don&rsquo;t work, the .ics file is attached.</p>

  <p style="margin:32px 0 4px;font-size:15px;">Looking forward to it.</p>
  <p style="margin:0;font-size:15px;">— ${esc(invite.organizerName)}</p>
</div>
</body></html>`

  return { subject, html, text, googleUrl, outlookUrl, yahooUrl, startUtc, endUtc }
}
