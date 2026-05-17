import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { createLead } from '../../../lib/leads'

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
    const { name, email, college, year, field, _hp } = data

    // Honeypot
    if (_hp) return NextResponse.json({ status: 'sent' })

    if (!name || !email || !college || !year || !field) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    const nameStr = String(name).trim().slice(0, 100)
    const emailStr = String(email).trim().toLowerCase().slice(0, 254)
    const collegeStr = String(college).trim().slice(0, 200)
    const yearStr = String(year).trim().slice(0, 50)
    const fieldStr = String(field).trim().slice(0, 100)

    if (nameStr.length < 2) return NextResponse.json({ error: 'Name is too short.' }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })

    // Seat limit
    const current = await workshopCount()
    if (current >= SEAT_LIMIT) {
      return NextResponse.json({ error: `Registrations are closed — all ${SEAT_LIMIT} seats are taken.`, closed: true }, { status: 409 })
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
      meta: { college: collegeStr, year: yearStr, field: fieldStr },
    })

    const after = current + 1
    return NextResponse.json({ status: 'sent', remaining: Math.max(0, SEAT_LIMIT - after), closed: after >= SEAT_LIMIT })
  } catch (err) {
    console.error('[workshop] POST failed', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
