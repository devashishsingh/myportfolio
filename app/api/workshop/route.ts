import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { createLead } from '../../../lib/leads'
import { sendEmail, adminNotificationEmail, EMAIL_CONFIG } from '../../../lib/email'

export const dynamic = 'force-dynamic'

const SEAT_LIMIT = 25

async function workshopCount() {
  try {
    return await prisma.lead.count({ where: { source: 'workshop' } })
  } catch (err) {
    console.error('[workshop] count failed', err)
    return 0
  }
}

export async function GET() {
  const count = await workshopCount()
  const remaining = Math.max(0, SEAT_LIMIT - count)
  return NextResponse.json({ total: SEAT_LIMIT, registered: count, remaining, closed: remaining <= 0 })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, phone, college, year, field, _hp } = data

    // Honeypot
    if (_hp) return NextResponse.json({ status: 'sent' })

    if (!name || !email || !phone || !college || !year || !field) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    const nameStr = String(name).trim().slice(0, 100)
    const emailStr = String(email).trim().toLowerCase().slice(0, 254)
    const phoneStr = String(phone).trim().slice(0, 40)
    const collegeStr = String(college).trim().slice(0, 200)
    const yearStr = String(year).trim().slice(0, 50)
    const fieldStr = String(field).trim().slice(0, 100)

    if (nameStr.length < 2) return NextResponse.json({ error: 'Name is too short.' }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    if (!/^[+0-9()\-\s]{6,}$/.test(phoneStr)) return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })

    // Seat limit
    const current = await workshopCount()
    if (current >= SEAT_LIMIT) {
      return NextResponse.json({ error: 'Registrations are closed — all 25 seats are taken.', closed: true }, { status: 409 })
    }

    // Block duplicate registration
    try {
      const existing = await prisma.lead.findFirst({ where: { source: 'workshop', email: emailStr } })
      if (existing) {
        return NextResponse.json({ error: "You're already registered with this email. Check your inbox for the meeting link.", duplicate: true }, { status: 409 })
      }
    } catch {}

    const message = `Workshop registration — ${collegeStr} (${yearStr}) · interested in: ${fieldStr}`

    await createLead({
      name: nameStr,
      email: emailStr,
      source: 'workshop',
      message,
      meta: { phone: phoneStr, college: collegeStr, year: yearStr, field: fieldStr },
    })

    // Admin notification (best effort)
    try {
      const notif = adminNotificationEmail('contact', {
        Type: 'Workshop registration',
        Name: nameStr,
        Email: emailStr,
        Phone: phoneStr,
        College: collegeStr,
        Year: yearStr,
        InterestedIn: fieldStr,
      })
      await sendEmail({ to: EMAIL_CONFIG.adminEmail, ...notif })
    } catch (err) {
      console.error('[workshop] admin email failed', err)
    }

    // Confirmation to participant (best effort)
    try {
      await sendEmail({
        to: emailStr,
        subject: "You're in — Cybersecurity Career Workshop",
        html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
          <h2 style="font-family:'Comic Sans MS',cursive;">Seat reserved, ${nameStr.split(' ')[0]}.</h2>
          <p>Thanks for signing up for <strong>"Which Cybersecurity Field is Right for You?"</strong></p>
          <p>You're confirmed. The meeting link, calendar invite, and a short prep note will land in your inbox closer to the session date.</p>
          <p><strong>What you told me:</strong></p>
          <ul>
            <li>Organization: ${collegeStr}</li>
            <li>Stage: ${yearStr}</li>
            <li>Curious about: ${fieldStr}</li>
          </ul>
          <p>If plans change, just reply to this email and let me know.</p>
          <p>— Devashish</p>
        </div>`,
        text: `Hi ${nameStr.split(' ')[0]},\n\nYour seat at the free cybersecurity workshop is confirmed. The meeting link and prep note will arrive closer to the session date.\n\n— Devashish`,
      })
    } catch (err) {
      console.error('[workshop] confirm email failed', err)
    }

    const after = current + 1
    return NextResponse.json({ status: 'sent', remaining: Math.max(0, SEAT_LIMIT - after) })
  } catch (err) {
    console.error('[workshop] POST failed', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
