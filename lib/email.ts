// ─── Email Configuration ─────────────────────────────────────────────
// All emails gracefully degrade to console.log when not configured.

export const EMAIL_CONFIG = {
  // Resend API key
  apiKey: process.env.RESEND_API_KEY || '',

  // Your verified sender email (must match domain verified in Resend)
  fromEmail: process.env.SENDER_EMAIL || 'hello@devashishsingh.com',
  fromName: process.env.SENDER_NAME || 'Devashish',

  // Where admin notifications go
  adminEmail: process.env.CONTACT_TARGET_EMAIL || 'hello@devashishsingh.com',

  // Base URL for links in emails
  baseUrl: process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),

  // Calendar booking link (Calendly, Cal.com, or custom)
  calendarUrl: process.env.CALENDAR_URL || '',
}

function isConfigured(): boolean {
  return !!(EMAIL_CONFIG.apiKey)
}

// ─── Core Send Function ──────────────────────────────────────────────

interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailPayload): Promise<boolean> {
  if (!isConfigured()) {
    console.log(`[Email] Not configured. Would send to ${to}: "${subject}"`)
    console.log(`[Email] Body preview: ${(text || html).substring(0, 200)}...`)
    return true // graceful degradation
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${EMAIL_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
        to: [to],
        subject,
        html,
        ...(text ? { text } : {}),
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Email] Resend error:', err)
      return false
    }

    return true
  } catch (err) {
    console.error('[Email] Send failed:', err)
    return false
  }
}

// ─── Email Templates ─────────────────────────────────────────────────
// Sketchbook theme: cream paper, hand-drawn borders, offset shadows.
// Fonts load from Google Fonts in clients that support it; fall back gracefully.

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Kalam:wght@400;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`

function baseTemplate(content: string, eyebrow?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${FONT_IMPORT}
    body { font-family: 'Kalam', Georgia, 'Times New Roman', serif; margin: 0; padding: 0; background: #fdfaf6; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
    .outer { padding: 32px 16px; background: #fdfaf6; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 0 #1a1a1a; }
    .header { padding: 24px 32px 18px; border-bottom: 2px dashed #1a1a1a; }
    .brand { font-family: 'Patrick Hand', 'Comic Sans MS', cursive; font-size: 28px; font-weight: 400; margin: 0; line-height: 1.1; letter-spacing: 0.5px; }
    .eyebrow { font-family: 'IBM Plex Mono', 'Courier New', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6b6b; margin-top: 6px; }
    .body { padding: 28px 32px; font-size: 16px; line-height: 1.65; }
    .body h2 { font-family: 'Patrick Hand', 'Comic Sans MS', cursive; font-size: 26px; font-weight: 400; margin: 0 0 14px; line-height: 1.2; }
    .body p { margin: 0 0 14px; }
    .body a { color: #1a1a1a; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
    .body ul { padding-left: 22px; margin: 0 0 14px; }
    .body ul li { margin-bottom: 6px; }
    .badge { display: inline-block; background: #fffae0; border: 2px solid #1a1a1a; padding: 5px 14px; font-family: 'IBM Plex Mono', 'Courier New', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; box-shadow: 3px 3px 0 0 #1a1a1a; margin: 0 0 18px; }
    .cta { display: inline-block; background: #1a1a1a; color: #fffae0 !important; padding: 12px 24px; font-family: 'Patrick Hand', 'Comic Sans MS', cursive; font-size: 18px; text-decoration: none; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 0 #f4b942; margin: 12px 0 6px; letter-spacing: 0.5px; }
    .detail { width: 100%; border-collapse: collapse; margin: 14px 0 18px; }
    .detail td { padding: 9px 0; border-bottom: 1px dashed #cfc8bb; font-size: 16px; vertical-align: top; }
    .detail td.k { font-family: 'IBM Plex Mono', 'Courier New', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #6b6b6b; width: 110px; padding-right: 16px; padding-top: 12px; }
    .quiet { font-size: 13px; color: #6b6b6b; }
    .footer { padding: 18px 32px 22px; border-top: 2px dashed #1a1a1a; background: #fdfaf6; font-family: 'IBM Plex Mono', 'Courier New', monospace; font-size: 11px; letter-spacing: 0.04em; color: #6b6b6b; line-height: 1.7; }
    .footer a { color: #6b6b6b; text-decoration: underline; }
    .signature { font-family: 'Patrick Hand', 'Comic Sans MS', cursive; font-size: 22px; margin: 18px 0 4px; }
  </style>
</head>
<body>
  <div class="outer">
    <div class="container">
      <div class="header">
        <p class="brand">${EMAIL_CONFIG.fromName} — sketchbook</p>
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p style="margin:0 0 6px;">&copy; ${new Date().getFullYear()} ${EMAIL_CONFIG.fromName}. Ideas are fuelled here, not stolen.</p>
        <p style="margin:0;"><a href="${EMAIL_CONFIG.baseUrl}">website</a> &nbsp;·&nbsp; <a href="${EMAIL_CONFIG.baseUrl}/blog">blog</a> &nbsp;·&nbsp; <a href="${EMAIL_CONFIG.baseUrl}/privacy">privacy</a></p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ─── Subscriber Confirmation (Double Opt-in) ─────────────────────────

export function subscriberConfirmationEmail(name: string, confirmUrl: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Confirm your subscription',
    html: baseTemplate(`
      <span class="badge">Confirm subscription</span>
      <h2>One quick tap and you're in.</h2>
      <p>Hi ${name},</p>
      <p>Thanks for subscribing. Tap the button below to confirm your email — that's the only way I'll know it's really you.</p>
      <a href="${confirmUrl}" class="cta">Confirm my subscription →</a>
      <p class="quiet">If you didn't subscribe, you can safely ignore this email.</p>
      <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    `, 'Sketchbook · subscribe'),
    text: `Hi ${name},\n\nThanks for subscribing! Confirm your email here: ${confirmUrl}\n\nIf you didn't subscribe, ignore this email.\n\n— ${EMAIL_CONFIG.fromName}`,
  }
}

// ─── Contact Form Auto-Reply ─────────────────────────────────────────

export function contactAutoReplyEmail(name: string): { subject: string; html: string; text: string } {
  return {
    subject: `Thanks for reaching out, ${name}`,
    html: baseTemplate(`
      <span class="badge">Message received</span>
      <h2>Got it — your note landed safely.</h2>
      <p>Hi ${name},</p>
      <p>Thanks for getting in touch. I read every message myself and usually reply within 24–48 hours. If it's urgent, mention it in your subject and I'll bump it up.</p>
      <p>While you wait, a few honest places to wander:</p>
      <ul>
        <li><a href="${EMAIL_CONFIG.baseUrl}/work">Selected work</a> — case studies and projects.</li>
        <li><a href="${EMAIL_CONFIG.baseUrl}/blog">Field notes</a> — what I'm thinking through right now.</li>
        <li><a href="${EMAIL_CONFIG.baseUrl}/community">Builders Hub</a> — small, curated, no noise.</li>
      </ul>
      ${EMAIL_CONFIG.calendarUrl ? `<p>Or skip the wait and grab a slot:</p><a href="${EMAIL_CONFIG.calendarUrl}" class="cta">Book a session →</a>` : ''}
      <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    `, 'Sketchbook · contact'),
    text: `Hi ${name},\n\nThanks for getting in touch. I've received your message and will get back to you within 24-48 hours.\n\nBest,\n${EMAIL_CONFIG.fromName}`,
  }
}

// ─── Community Join Acknowledgment ───────────────────────────────────

export function joinAcknowledgmentEmail(name: string): { subject: string; html: string; text: string } {
  return {
    subject: `Welcome to the review queue, ${name}`,
    html: baseTemplate(`
      <span class="badge">Application received</span>
      <h2>You're in the review queue.</h2>
      <p>Hi ${name},</p>
      <p>Your application to join the Builders Hub has landed. I personally read every one — that's the only way to keep the room small and the signal high.</p>
      <p>You'll hear back within a few days. While you wait:</p>
      <ul>
        <li>Read the latest <a href="${EMAIL_CONFIG.baseUrl}/blog">field notes</a>.</li>
        <li>See <a href="${EMAIL_CONFIG.baseUrl}/community">what we're building together</a>.</li>
      </ul>
      <p>Ideas are fuelled here, not stolen.</p>
      <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    `, 'Sketchbook · community'),
    text: `Hi ${name},\n\nYour application to join the Builders Hub has been received. I personally review every application.\n\nYou'll hear back within a few days.\n\nBest,\n${EMAIL_CONFIG.fromName}`,
  }
}

// ─── Booking Confirmation ────────────────────────────────────────────

export function bookingConfirmationEmail(
  name: string,
  sessionType: string,
  date: string,
  time: string,
  timezone: string,
  calendarLink?: string | null
): { subject: string; html: string; text: string } {
  return {
    subject: `Session booked: ${sessionType}`,
    html: baseTemplate(`
      <span class="badge">Booking confirmed</span>
      <h2>Your slot is held.</h2>
      <p>Hi ${name},</p>
      <p>Your ${sessionType.toLowerCase()} session has been requested. Here are the details on paper:</p>
      <table class="detail" cellspacing="0" cellpadding="0">
        <tr><td class="k">Session</td><td>${sessionType}</td></tr>
        <tr><td class="k">Date</td><td>${date}</td></tr>
        <tr><td class="k">Time</td><td>${time}</td></tr>
        <tr><td class="k">Timezone</td><td>${timezone}</td></tr>
      </table>
      <p>I'll confirm within 24 hours with a meeting link and a short prep note so we don't waste the first ten minutes.</p>
      ${calendarLink ? `<a href="${calendarLink}" class="cta">Add to calendar →</a>` : ''}
      <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    `, 'Sketchbook · booking'),
    text: `Hi ${name},\n\nYour ${sessionType} session has been requested.\n\nDate: ${date}\nTime: ${time}\nTimezone: ${timezone}\n\nI'll confirm within 24 hours.\n\nBest,\n${EMAIL_CONFIG.fromName}`,
  }
}

// ─── Newsletter Email ────────────────────────────────────────────────

export function newsletterEmail(
  content: string,
  subject: string,
  unsubscribeUrl: string
): { subject: string; html: string; text: string } {
  const inner = `
    <span class="badge">Sketchbook issue</span>
    <h2>${subject.replace(/^\[Test\]\s*/i, '')}</h2>
    ${content}
    <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    <p class="quiet">Reply to this email — it goes straight to my inbox.</p>
  `
  // Reuse base template but inject an extra unsubscribe link in the footer area.
  const html = baseTemplate(inner, 'Sketchbook · newsletter').replace(
    '<a href="' + EMAIL_CONFIG.baseUrl + '/privacy">privacy</a>',
    '<a href="' + EMAIL_CONFIG.baseUrl + '/privacy">privacy</a> &nbsp;·&nbsp; <a href="' + unsubscribeUrl + '">unsubscribe</a>'
  )
  return {
    subject,
    html,
    text: `${content.replace(/<[^>]+>/g, '')}\n\nUnsubscribe: ${unsubscribeUrl}`,
  }
}

// ─── Admin Notification ──────────────────────────────────────────────

export function adminNotificationEmail(
  type: 'contact' | 'join' | 'feedback' | 'booking' | 'subscriber',
  details: Record<string, string>
): { subject: string; html: string; text: string } {
  const labels: Record<string, string> = {
    contact: 'New contact message',
    join: 'New community application',
    feedback: 'New feedback',
    booking: 'New booking request',
    subscriber: 'New subscriber',
  }

  const subjects: Record<string, string> = {
    contact: '📬 New contact message',
    join: '🚀 New community application',
    feedback: '💬 New feedback',
    booking: '📅 New booking request',
    subscriber: '📰 New subscriber',
  }

  const rows = Object.entries(details)
    .map(([k, v]) => `<tr><td class="k">${k}</td><td>${v}</td></tr>`)
    .join('')

  const textRows = Object.entries(details)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  return {
    subject: subjects[type] || `New ${type}`,
    html: baseTemplate(`
      <span class="badge">${labels[type] || type}</span>
      <h2>Something new on the desk.</h2>
      <table class="detail" cellspacing="0" cellpadding="0">
        ${rows}
      </table>
      <a href="${EMAIL_CONFIG.baseUrl}/admin" class="cta">Open admin →</a>
    `, 'Sketchbook · admin'),
    text: `${labels[type] || type}\n\n${textRows}\n\nView in admin: ${EMAIL_CONFIG.baseUrl}/admin`,
  }
}
