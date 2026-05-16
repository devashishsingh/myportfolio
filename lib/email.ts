// ─── Email Configuration ─────────────────────────────────────────────
// All emails gracefully degrade to console.log when not configured.

// Resend (and most SMTP) reject mailbox-part casing variants on some routes;
// addresses are normalized to lowercase to match the verified sender record.
const lc = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim().toLowerCase() : fallback)

export const EMAIL_CONFIG = {
  // Resend API key
  apiKey: process.env.RESEND_API_KEY || '',

  // Your verified sender email (must match domain verified in Resend)
  fromEmail: lc(process.env.SENDER_EMAIL, 'founder@devashishsingh.com'),
  fromName: process.env.SENDER_NAME || 'Devashish',

  // Where admin notifications go
  adminEmail: lc(process.env.CONTACT_TARGET_EMAIL, 'founder@devashishsingh.com'),

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
  // Normalize recipient — Resend rejects some uppercase mailbox parts.
  const recipient = (to || '').trim().toLowerCase()
  if (!recipient) {
    console.error('[Email] Empty recipient')
    return false
  }

  if (!isConfigured()) {
    console.log(`[Email] Not configured. Would send to ${recipient}: "${subject}"`)
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
        to: [recipient],
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
// Hand-drawn theme: cream paper, dashed borders, offset shadows.
// No external font/image hosts — Gmail's "host images on sending domain"
// guideline flags any third-party URLs (incl. fonts.googleapis.com) as
// suspicious. We rely on system font fallbacks: Comic Sans MS for the
// hand-drawn look, Courier New for monospace, Georgia for body.

function baseTemplate(content: string, eyebrow?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; margin: 0; padding: 0; background: #fdfaf6; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
    .outer { padding: 32px 16px; background: #fdfaf6; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 0 #1a1a1a; }
    .header { padding: 24px 32px 18px; border-bottom: 2px dashed #1a1a1a; }
    .brand { font-family: 'Comic Sans MS', 'Marker Felt', cursive; font-size: 28px; font-weight: 400; margin: 0; line-height: 1.1; letter-spacing: 0.5px; }
    .eyebrow { font-family: 'Courier New', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6b6b; margin-top: 6px; }
    .body { padding: 28px 32px; font-size: 16px; line-height: 1.65; }
    .body h2 { font-family: 'Comic Sans MS', 'Marker Felt', cursive; font-size: 26px; font-weight: 400; margin: 0 0 14px; line-height: 1.2; }
    .body p { margin: 0 0 14px; }
    .body a { color: #1a1a1a; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
    .body ul { padding-left: 22px; margin: 0 0 14px; }
    .body ul li { margin-bottom: 6px; }
    .badge { display: inline-block; background: #fffae0; border: 2px solid #1a1a1a; padding: 5px 14px; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; box-shadow: 3px 3px 0 0 #1a1a1a; margin: 0 0 18px; }
    .cta { display: inline-block; background: #1a1a1a; color: #fffae0 !important; padding: 12px 24px; font-family: 'Comic Sans MS', 'Marker Felt', cursive; font-size: 18px; text-decoration: none; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 0 #f4b942; margin: 12px 0 6px; letter-spacing: 0.5px; }
    .detail { width: 100%; border-collapse: collapse; margin: 14px 0 18px; }
    .detail td { padding: 9px 0; border-bottom: 1px dashed #cfc8bb; font-size: 16px; vertical-align: top; }
    .detail td.k { font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #6b6b6b; width: 110px; padding-right: 16px; padding-top: 12px; }
    .quiet { font-size: 13px; color: #6b6b6b; }
    .footer { padding: 18px 32px 22px; border-top: 2px dashed #1a1a1a; background: #fdfaf6; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.04em; color: #6b6b6b; line-height: 1.7; }
    .footer a { color: #6b6b6b; text-decoration: underline; }
    .signature { font-family: 'Comic Sans MS', 'Marker Felt', cursive; font-size: 22px; margin: 18px 0 4px; }
  </style>
</head>
<body>
  <div class="outer">
    <div class="container">
      <div class="header">
        <p class="brand">${EMAIL_CONFIG.fromName}</p>
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
    `, 'Subscribe'),
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
    `, 'Contact'),
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
    `, 'Community'),
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
    `, 'Booking'),
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
    <span class="badge">Newsletter</span>
    <h2>${subject.replace(/^\[Test\]\s*/i, '')}</h2>
    ${content}
    <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    <p class="quiet">Reply to this email — it goes straight to my inbox.</p>
  `
  // Reuse base template but inject an extra unsubscribe link in the footer area.
  const html = baseTemplate(inner, 'Newsletter').replace(
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
    `, 'Admin notification'),
    text: `${labels[type] || type}\n\n${textRows}\n\nView in admin: ${EMAIL_CONFIG.baseUrl}/admin`,
  }
}

// ─── Member Approved (Builders Hub onboarding) ───────────────────────

export function memberApprovedEmail(opts: {
  name: string
  founderNumber: number | null
  magicLoginUrl: string
  channelUrl: string
  welcomeUrl: string
  discountCode?: string
}): { subject: string; html: string; text: string } {
  const { name, founderNumber, magicLoginUrl, channelUrl, welcomeUrl, discountCode } = opts
  const founderLine = founderNumber ? `Founding Member <strong>#${String(founderNumber).padStart(2, '0')}</strong>` : 'Welcome aboard'
  const base = EMAIL_CONFIG.baseUrl
  const challengesUrl = `${base}/community/challenges`
  const leaderboardUrl = `${base}/community/leaderboard`
  const membersUrl = `${base}/community/members`
  const profileEditUrl = `${base}/community/me`
  const loginUrl = `${base}/community/login`

  return {
    subject: `You're in the Builders Hub${founderNumber ? ` — Founding Member #${String(founderNumber).padStart(2, '0')}` : ''}`,
    html: baseTemplate(`
      <span class="badge">Application approved</span>
      <h2>You're in.</h2>
      <p>Hi ${name},</p>
      <p>Welcome to the <strong>Builders Hub</strong> — a small, curated room for tech builders, founders and operators who'd rather ship than scroll. Here's everything that's open to you starting now.</p>
      <p style="font-family:'Comic Sans MS','Marker Felt',cursive; font-size:22px; margin:18px 0 10px;">${founderLine}</p>

      <h3 style="margin-top:28px;">⚡ Your first 5 minutes</h3>
      <ol style="padding-left:20px; line-height:1.8;">
        <li><a href="${magicLoginUrl}"><strong>Sign in</strong></a> with your one-tap link (valid 15 min, single use)</li>
        <li><strong>Bookmark <a href="${loginUrl}">${loginUrl}</a></strong> — sessions last 2 hours, then you'll request a fresh magic link from there</li>
        <li><a href="${profileEditUrl}"><strong>Set up your profile</strong></a> — handle, bio, tracks, what you're working on, "open to" flags</li>
        <li><a href="${channelUrl}"><strong>Join the private Discord</strong></a> and post in <em>#introductions</em></li>
        <li><a href="${challengesUrl}"><strong>Pick a live challenge</strong></a> and submit before the timer closes</li>
      </ol>

      <div style="margin:18px 0; padding:12px 14px; background:#fffae0; border:2px solid #1a1a1a; box-shadow:4px 4px 0 0 #f4b942;">
        <p style="margin:0; font-size:14px; line-height:1.6;">
          🔐 <strong>Security note:</strong> we don't use passwords. Each sign-in is a one-tap link to your inbox. Sessions auto-expire after 2 hours — bookmark <a href="${loginUrl}">${loginUrl}</a> so re-entry is one tap away.
        </p>
      </div>

      <h3 style="margin-top:28px;">🪪 Your member identity</h3>
      <ul style="padding-left:20px; line-height:1.7;">
        <li><strong>Public profile</strong> at <code>/community/your-handle</code> — bio, region, tracks, social links, badges, points</li>
        <li><strong>Member directory</strong> — discover and DM other builders: <a href="${membersUrl}">${membersUrl}</a></li>
        <li><strong>"Open to"</strong> toggles let you signal Collaboration / Hire / Mentorship</li>
        ${founderNumber ? `<li>Permanent <strong>Founding Member badge</strong> on your profile (only the first 50 ever get this)</li>` : ''}
      </ul>

      <h3 style="margin-top:28px;">🎯 Challenges, quizzes &amp; labs</h3>
      <p style="margin:6px 0;">Live drops with real timers. Three formats:</p>
      <ul style="padding-left:20px; line-height:1.7;">
        <li><strong>Challenges</strong> — build/ship something, judged on rubric</li>
        <li><strong>Quizzes</strong> — quick knowledge checks</li>
        <li><strong>Labs</strong> — hands-on guided exercises</li>
      </ul>
      <p style="margin:6px 0;">Approved submissions earn Builder Points + the optional skill badge. AI-assisted is fine — just be honest about it in your submission notes.</p>

      <h3 style="margin-top:28px;">🏆 Builder Points &amp; Leaderboard</h3>
      <table cellspacing="0" cellpadding="6" style="border-collapse:collapse; margin:8px 0; font-size:14px;">
        <tr><td style="border-bottom:1px solid #1a1a1a; padding-right:18px;">Approved challenge</td><td style="border-bottom:1px solid #1a1a1a;"><strong>+50 pts</strong> (varies by difficulty)</td></tr>
        <tr><td style="border-bottom:1px solid #1a1a1a; padding-right:18px;">Quiz pass / lab complete</td><td style="border-bottom:1px solid #1a1a1a;"><strong>+10–30 pts</strong></td></tr>
        <tr><td style="border-bottom:1px solid #1a1a1a; padding-right:18px;">Helpful answer (Discord)</td><td style="border-bottom:1px solid #1a1a1a;"><strong>+5 pts</strong></td></tr>
        <tr><td style="border-bottom:1px solid #1a1a1a; padding-right:18px;">Published writeup</td><td style="border-bottom:1px solid #1a1a1a;"><strong>+25 pts</strong></td></tr>
        <tr><td style="padding-right:18px;">4-week active streak</td><td><strong>+25 bonus</strong> (auto)</td></tr>
      </table>
      <p style="margin:6px 0;">
        <a href="${leaderboardUrl}"><strong>Members-only leaderboard</strong></a> tracks monthly + all-time. Top 3 each month get a public spotlight on the Community page. Monthly board resets on the 1st.
      </p>

      <h3 style="margin-top:28px;">🎖 Badges you can earn</h3>
      <ul style="padding-left:20px; line-height:1.7;">
        <li><strong>Founding</strong> — first 50 members (permanent)</li>
        <li><strong>Builder I → IV</strong> — auto-awarded at 100 / 500 / 1500 / 5000 lifetime points</li>
        <li><strong>Skill apprentices</strong> — Cyber, AI, Cloud, Systems, Networks, Coding, Gaming, Digital — earned via challenges &amp; labs</li>
        <li><strong>Contributor &amp; Event</strong> badges for writeups, mentorship, monthly-call attendance</li>
      </ul>

      <h3 style="margin-top:28px;">💬 Discord channel layout</h3>
      <ul style="padding-left:20px; line-height:1.7;">
        <li><em>#introductions</em> — say hi, drop your handle</li>
        <li><em>#wins</em> &amp; <em>#stuck</em> — ship logs and help requests</li>
        <li><em>#challenges</em> — discuss the live drop</li>
        <li><em>#showcase</em> — promote your product, get feedback</li>
        <li><em>#hiring</em> &amp; <em>#collab</em> — opportunities</li>
        <li><em>#office-hours</em> — open async Q&amp;A with me</li>
      </ul>
      <p style="margin:6px 0;">Etiquette: be specific, no link-dumps, search before asking, lift others up.</p>

      <h3 style="margin-top:28px;">🎁 Member perks</h3>
      <ul style="padding-left:20px; line-height:1.7;">
        ${discountCode ? `<li><strong>20% off</strong> any course or 1:1 — code: <code style="background:#fffae0; padding:3px 8px; border:1.5px solid #1a1a1a; font-family:'Courier New',monospace;">${discountCode}</code></li>` : ''}
        <li>Monthly live call with me (recording shared after)</li>
        <li>Open async office hours on Discord</li>
        <li>Featured product showcases on the platform</li>
        <li>First look at new courses, labs, and revenue-share opportunities</li>
      </ul>

      <h3 style="margin-top:28px;">📌 Quick links <span style="font-weight:400; color:#6b6b6b; font-size:13px;">(bookmark these)</span></h3>
      <ul style="padding-left:20px; line-height:1.7;">
        <li><strong>Member sign-in:</strong> <a href="${loginUrl}">${loginUrl}</a></li>
        <li>Welcome / dashboard: <a href="${welcomeUrl}">${welcomeUrl}</a></li>
        <li>Edit profile: <a href="${profileEditUrl}">${profileEditUrl}</a></li>
        <li>Live challenges: <a href="${challengesUrl}">${challengesUrl}</a></li>
        <li>Leaderboard: <a href="${leaderboardUrl}">${leaderboardUrl}</a></li>
        <li>Member directory: <a href="${membersUrl}">${membersUrl}</a></li>
        <li>Discord: <a href="${channelUrl}">${channelUrl}</a></li>
      </ul>

      <a href="${magicLoginUrl}" class="cta">Sign in &amp; explore →</a>
      <p class="quiet">Reply to this email if anything looks off — it lands in my inbox. Welcome aboard.</p>
      <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    `, 'Builders Hub · welcome'),
    text: [
      `Hi ${name},`,
      ``,
      `Welcome to the Builders Hub${founderNumber ? ` — Founding Member #${String(founderNumber).padStart(2, '0')}` : ''}.`,
      ``,
      `YOUR FIRST 5 MINUTES`,
      `1. Sign in (15-min link): ${magicLoginUrl}`,
      `2. Bookmark the login page: ${loginUrl}  (sessions last 2 hours)`,
      `3. Set up profile: ${profileEditUrl}`,
      `4. Join Discord: ${channelUrl}`,
      `5. Pick a challenge: ${challengesUrl}`,
      ``,
      `SECURITY: no passwords. Each sign-in is a one-tap link. Sessions auto-expire after 2 hours.`,
      ``,
      `WHAT'S OPEN TO YOU`,
      `- Public profile + member directory: ${membersUrl}`,
      `- Live challenges, quizzes, labs (real timers, points + badges)`,
      `- Builder Points: +50 challenge, +25 writeup, +5 helpful answer, +25 4-week streak`,
      `- Members-only leaderboard (monthly + all-time): ${leaderboardUrl}`,
      `- Top-3 monthly spotlight on the public Community page`,
      `- Auto-awarded Builder I-IV badges at 100/500/1500/5000 pts`,
      `- Skill, Contributor, and Event badges`,
      `- Monthly live call + open Discord office hours`,
      `- Featured product showcases`,
      discountCode ? `- 20% off courses/1:1 — code: ${discountCode}` : '',
      ``,
      `QUICK LINKS (bookmark these)`,
      `Sign in page:  ${loginUrl}`,
      `Dashboard:     ${welcomeUrl}`,
      `Edit profile:  ${profileEditUrl}`,
      `Challenges:    ${challengesUrl}`,
      `Leaderboard:   ${leaderboardUrl}`,
      `Members:       ${membersUrl}`,
      `Discord:       ${channelUrl}`,
      ``,
      `Reply to this email if anything looks off — it lands in my inbox.`,
      ``,
      `— ${EMAIL_CONFIG.fromName}`,
    ].filter(Boolean).join('\n'),
  }
}

// ─── Member Magic-Link Login ─────────────────────────────────────────

export function memberLoginEmail(opts: {
  name: string
  magicLoginUrl: string
}): { subject: string; html: string; text: string } {
  const { name, magicLoginUrl } = opts
  const loginUrl = `${EMAIL_CONFIG.baseUrl}/community/login`
  return {
    subject: 'Your Builders Hub sign-in link',
    html: baseTemplate(`
      <span class="badge">Sign-in link</span>
      <h2>Tap to sign in.</h2>
      <p>Hi ${name},</p>
      <p>Here's your one-time sign-in link. Valid for <strong>15 minutes</strong>, single use. Once you sign in, your session lasts <strong>2 hours</strong>.</p>
      <a href="${magicLoginUrl}" class="cta">Sign in to Builders Hub →</a>
      <p style="margin-top:18px; font-size:13px; color:#6b6b6b;">📌 Tip: bookmark <a href="${loginUrl}">${loginUrl}</a> — that's where you request a fresh link whenever your session expires.</p>
      <p class="quiet">Didn't request this? Ignore the email — the link can't be reused.</p>
      <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    `, 'Builders Hub · sign-in'),
    text: `Hi ${name},\n\nSign in (15-min link, single use): ${magicLoginUrl}\n\nSession lasts 2 hours. Bookmark ${loginUrl} for quick re-entry next time.\n\nDidn't request this? Ignore the email.\n\n— ${EMAIL_CONFIG.fromName}`,
  }
}

// ─── New Blog Post Notification ──────────────────────────────────────

export function newBlogPostEmail(opts: {
  title: string
  description: string
  slug: string
  category?: string | null
  unsubscribeUrl: string
}): { subject: string; html: string; text: string } {
  const { title, description, slug, category, unsubscribeUrl } = opts
  const postUrl = `${EMAIL_CONFIG.baseUrl}/blog/${slug}`
  const categoryBadge = category ? `<span style="font-family:'Courier New',monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:#6b6b6b;">${category}</span><br><br>` : ''

  const inner = `
    <span class="badge">New post</span>
    <h2>${title}</h2>
    ${categoryBadge}
    <p>${description}</p>
    <a href="${postUrl}" class="cta">Read the post →</a>
    <p class="quiet" style="margin-top:18px;">You're getting this because you subscribed to updates. Reply to this email — it goes straight to my inbox.</p>
    <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
  `
  const html = baseTemplate(inner, 'New post').replace(
    '<a href="' + EMAIL_CONFIG.baseUrl + '/privacy">privacy</a>',
    '<a href="' + EMAIL_CONFIG.baseUrl + '/privacy">privacy</a> &nbsp;·&nbsp; <a href="' + unsubscribeUrl + '">unsubscribe</a>'
  )
  return {
    subject: `New post: ${title}`,
    html,
    text: `New post: ${title}\n\n${description}\n\nRead it here: ${postUrl}\n\nUnsubscribe: ${unsubscribeUrl}`,
  }
}

// ─── New Challenge / Quiz / Lab Notification (Members) ───────────────

const KIND_LABEL: Record<string, string> = {
  challenge: 'Challenge',
  quiz: 'Quiz',
  lab: 'Lab',
}
const KIND_EMOJI: Record<string, string> = {
  challenge: '⚔️',
  quiz: '🧠',
  lab: '🔬',
}

export function newChallengeEmail(opts: {
  name: string
  title: string
  brief: string
  kind: string
  track?: string | null
  points: number
  closesAt: Date
  challengeUrl: string
}): { subject: string; html: string; text: string } {
  const { name, title, brief, kind, track, points, closesAt, challengeUrl } = opts
  const label = KIND_LABEL[kind] || 'Challenge'
  const emoji = KIND_EMOJI[kind] || '⚔️'
  const closes = closesAt.toUTCString().replace(' GMT', ' UTC')
  const trackLine = track ? `<tr><td class="k">Track</td><td style="text-transform:capitalize;">${track}</td></tr>` : ''

  return {
    subject: `New ${label}: ${title}`,
    html: baseTemplate(`
      <span class="badge">${emoji} New ${label}</span>
      <h2>${title}</h2>
      <p>Hi ${name},</p>
      <p>${brief}</p>
      <table class="detail" cellspacing="0" cellpadding="0">
        <tr><td class="k">Type</td><td>${label}</td></tr>
        ${trackLine}
        <tr><td class="k">Points</td><td>${points} pts on win</td></tr>
        <tr><td class="k">Closes</td><td>${closes}</td></tr>
      </table>
      <a href="${challengeUrl}" class="cta">View ${label} →</a>
      <p class="quiet" style="margin-top:18px;">You're receiving this as a Builders Hub member. Manage preferences at <a href="${EMAIL_CONFIG.baseUrl}/community/me">${EMAIL_CONFIG.baseUrl}/community/me</a>.</p>
      <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    `, `Builders Hub · ${label}`),
    text: `New ${label}: ${title}\n\nHi ${name},\n\n${brief}\n\nPoints: ${points} pts\nCloses: ${closes}\n\nView it: ${challengeUrl}\n\n— ${EMAIL_CONFIG.fromName}`,
  }
}

// ─── Challenge Submission Approved (Member) ───────────────────────────

export function submissionApprovedEmail(opts: {
  name: string
  challengeTitle: string
  kind: string
  points: number
  score?: number | null
  adminNote?: string | null
  leaderboardUrl: string
}): { subject: string; html: string; text: string } {
  const { name, challengeTitle, kind, points, score, adminNote, leaderboardUrl } = opts
  const label = KIND_LABEL[kind] || 'Challenge'
  const scoreLine = typeof score === 'number' ? `<tr><td class="k">Score</td><td>${score}/100</td></tr>` : ''
  const noteLine = adminNote ? `<p><em>${adminNote}</em></p>` : ''

  return {
    subject: `✅ ${label} approved: ${challengeTitle}`,
    html: baseTemplate(`
      <span class="badge">✅ Submission approved</span>
      <h2>Your submission passed.</h2>
      <p>Hi ${name},</p>
      <p>Your submission for <strong>${challengeTitle}</strong> has been reviewed and approved.</p>
      <table class="detail" cellspacing="0" cellpadding="0">
        ${scoreLine}
        <tr><td class="k">Points</td><td>+${points} pts added to your account</td></tr>
      </table>
      ${noteLine}
      <a href="${leaderboardUrl}" class="cta">See the leaderboard →</a>
      <p class="signature">— ${EMAIL_CONFIG.fromName}</p>
    `, `Builders Hub · ${label} result`),
    text: `Submission approved: ${challengeTitle}\n\nHi ${name},\n\nYour submission has been approved. +${points} pts added.\n${typeof score === 'number' ? `Score: ${score}/100\n` : ''}${adminNote ? `\nNote: ${adminNote}\n` : ''}\nLeaderboard: ${leaderboardUrl}\n\n— ${EMAIL_CONFIG.fromName}`,
  }
}
