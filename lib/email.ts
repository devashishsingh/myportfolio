// ─── Email Configuration ─────────────────────────────────────────────
// Update these when you have your own email domain ready.
// All emails gracefully degrade to console.log when not configured.

export const EMAIL_CONFIG = {
  // SendGrid API key
  apiKey: process.env.SENDGRID_API_KEY || '',

  // Your verified sender email (must match SendGrid verified sender)
  fromEmail: process.env.SENDER_EMAIL || 'hello@yourdomain.com',
  fromName: process.env.SENDER_NAME || 'Devashish',

  // Where admin notifications go
  adminEmail: process.env.CONTACT_TARGET_EMAIL || 'admin@yourdomain.com',

  // Base URL for links in emails
  baseUrl: process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),

  // Calendar booking link (Calendly, Cal.com, or custom)
  calendarUrl: process.env.CALENDAR_URL || '',
}

function isConfigured(): boolean {
  return !!(EMAIL_CONFIG.apiKey && EMAIL_CONFIG.adminEmail && EMAIL_CONFIG.fromEmail !== 'hello@yourdomain.com')
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
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${EMAIL_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: EMAIL_CONFIG.fromEmail, name: EMAIL_CONFIG.fromName },
        subject,
        content: [
          ...(text ? [{ type: 'text/plain', value: text }] : []),
          { type: 'text/html', value: html },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Email] SendGrid error:', err)
      return false
    }

    return true
  } catch (err) {
    console.error('[Email] Send failed:', err)
    return false
  }
}

// ─── Email Templates ─────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f7f7f7; color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { padding: 32px 40px 16px; border-bottom: 2px solid #1a1a1a; }
    .header h1 { font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
    .body { padding: 32px 40px; }
    .body p { font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .body a { color: #1a1a1a; font-weight: 600; }
    .cta { display: inline-block; background: #1a1a1a; color: #fff !important; padding: 12px 28px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 16px 0; letter-spacing: 0.5px; }
    .footer { padding: 24px 40px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; }
    .footer a { color: #999; }
    .badge { display: inline-block; background: #f0f0f0; padding: 4px 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${EMAIL_CONFIG.fromName}</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${EMAIL_CONFIG.fromName}. All rights reserved.</p>
      <p><a href="${EMAIL_CONFIG.baseUrl}">Visit Website</a> &middot; <a href="${EMAIL_CONFIG.baseUrl}/privacy">Privacy Policy</a></p>
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
      <div class="badge">Confirm Subscription</div>
      <p>Hi ${name},</p>
      <p>Thanks for subscribing! Please confirm your email to start receiving updates, newsletters, and community highlights.</p>
      <a href="${confirmUrl}" class="cta">Confirm My Subscription →</a>
      <p style="font-size:13px; color:#666;">If you didn't subscribe, you can safely ignore this email.</p>
    `),
    text: `Hi ${name},\n\nThanks for subscribing! Confirm your email here: ${confirmUrl}\n\nIf you didn't subscribe, ignore this email.`,
  }
}

// ─── Contact Form Auto-Reply ─────────────────────────────────────────

export function contactAutoReplyEmail(name: string): { subject: string; html: string; text: string } {
  return {
    subject: `Thanks for reaching out, ${name}`,
    html: baseTemplate(`
      <div class="badge">Message Received</div>
      <p>Hi ${name},</p>
      <p>Thanks for getting in touch. I've received your message and will get back to you within 24-48 hours.</p>
      <p>In the meantime, feel free to explore:</p>
      <p>
        <a href="${EMAIL_CONFIG.baseUrl}/work">My Work</a> &middot; 
        <a href="${EMAIL_CONFIG.baseUrl}/blog">Blog</a> &middot; 
        <a href="${EMAIL_CONFIG.baseUrl}/community">Community</a>
      </p>
      ${EMAIL_CONFIG.calendarUrl ? `<p>Or book a session directly:</p><a href="${EMAIL_CONFIG.calendarUrl}" class="cta">Book a Session →</a>` : ''}
    `),
    text: `Hi ${name},\n\nThanks for getting in touch. I've received your message and will get back to you within 24-48 hours.\n\nBest,\n${EMAIL_CONFIG.fromName}`,
  }
}

// ─── Community Join Acknowledgment ───────────────────────────────────

export function joinAcknowledgmentEmail(name: string): { subject: string; html: string; text: string } {
  return {
    subject: `Welcome to the review queue, ${name}`,
    html: baseTemplate(`
      <div class="badge">Application Received</div>
      <p>Hi ${name},</p>
      <p>Your application to join the Builders Hub has been received. I personally review every application to keep the community curated and meaningful.</p>
      <p>You'll hear back within a few days. In the meantime:</p>
      <ul style="font-size:15px; line-height:1.7;">
        <li>Read the latest from the <a href="${EMAIL_CONFIG.baseUrl}/blog">blog</a></li>
        <li>Check out <a href="${EMAIL_CONFIG.baseUrl}/community">what we're building</a></li>
      </ul>
      <p>Ideas are fuelled here, not stolen. Looking forward to reviewing your application.</p>
    `),
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
      <div class="badge">Booking Confirmed</div>
      <p>Hi ${name},</p>
      <p>Your ${sessionType.toLowerCase()} session has been requested. Here are the details:</p>
      <table style="font-size:15px; margin:16px 0;">
        <tr><td style="padding:4px 16px 4px 0; font-weight:600;">Session</td><td>${sessionType}</td></tr>
        <tr><td style="padding:4px 16px 4px 0; font-weight:600;">Date</td><td>${date}</td></tr>
        <tr><td style="padding:4px 16px 4px 0; font-weight:600;">Time</td><td>${time}</td></tr>
        <tr><td style="padding:4px 16px 4px 0; font-weight:600;">Timezone</td><td>${timezone}</td></tr>
      </table>
      <p>I'll confirm the session within 24 hours with a meeting link or next steps.</p>
      ${calendarLink ? `<a href="${calendarLink}" class="cta">Add to Calendar →</a>` : ''}
    `),
    text: `Hi ${name},\n\nYour ${sessionType} session has been requested.\n\nDate: ${date}\nTime: ${time}\nTimezone: ${timezone}\n\nI'll confirm within 24 hours.\n\nBest,\n${EMAIL_CONFIG.fromName}`,
  }
}

// ─── Newsletter Email ────────────────────────────────────────────────

export function newsletterEmail(
  content: string,
  subject: string,
  unsubscribeUrl: string
): { subject: string; html: string; text: string } {
  return {
    subject,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f7f7f7; color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { padding: 32px 40px 16px; border-bottom: 2px solid #1a1a1a; }
    .header h1 { font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
    .body { padding: 32px 40px; font-size: 15px; line-height: 1.7; }
    .body a { color: #1a1a1a; font-weight: 600; }
    .footer { padding: 24px 40px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; }
    .footer a { color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${EMAIL_CONFIG.fromName}</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${EMAIL_CONFIG.fromName}. All rights reserved.</p>
      <p>
        <a href="${EMAIL_CONFIG.baseUrl}">Website</a> &middot; 
        <a href="${EMAIL_CONFIG.baseUrl}/privacy">Privacy</a> &middot; 
        <a href="${unsubscribeUrl}">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    text: `${content.replace(/<[^>]+>/g, '')}\n\nUnsubscribe: ${unsubscribeUrl}`,
  }
}

// ─── Admin Notification ──────────────────────────────────────────────

export function adminNotificationEmail(
  type: 'contact' | 'join' | 'feedback' | 'booking' | 'subscriber',
  details: Record<string, string>
): { subject: string; html: string; text: string } {
  const labels: Record<string, string> = {
    contact: '📬 New Contact Message',
    join: '🚀 New Community Application',
    feedback: '💬 New Feedback',
    booking: '📅 New Booking Request',
    subscriber: '📰 New Subscriber',
  }

  const rows = Object.entries(details)
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0; font-weight:600; vertical-align:top;">${k}</td><td style="padding:4px 0;">${v}</td></tr>`)
    .join('')

  const textRows = Object.entries(details)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  return {
    subject: labels[type] || `New ${type}`,
    html: baseTemplate(`
      <div class="badge">${labels[type] || type}</div>
      <table style="font-size:15px; margin:16px 0; width:100%;">
        ${rows}
      </table>
      <a href="${EMAIL_CONFIG.baseUrl}/admin" class="cta">View in Admin →</a>
    `),
    text: `${labels[type]}\n\n${textRows}\n\nView in admin: ${EMAIL_CONFIG.baseUrl}/admin`,
  }
}
