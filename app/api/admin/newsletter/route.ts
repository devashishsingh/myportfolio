import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { sendEmail, newsletterEmail, EMAIL_CONFIG } from '../../../../lib/email'
import { isAuthenticated } from '../../../../lib/auth'

function isAuthed() {
  return isAuthenticated()
}

/** Returns the next Monday at 00:00 UTC (= 08:00 MYT) */
function nextMondayMYT(): Date {
  const now = new Date()
  const day = now.getUTCDay() // 0=Sun, 1=Mon, …, 6=Sat
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7 || 7
  const next = new Date(now)
  next.setUTCDate(now.getUTCDate() + daysUntilMonday)
  next.setUTCHours(0, 0, 0, 0) // 00:00 UTC = 08:00 MYT
  return next
}

// GET — list newsletters
export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const newsletters = await prisma.newsletter.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(newsletters)
}

// POST — create & optionally send newsletter
export async function POST(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { subject, content, send, schedule } = await request.json()
    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content required' }, { status: 400 })
    }

    // ── Schedule for next Monday 8 AM MYT ──
    if (schedule) {
      const scheduledAt = nextMondayMYT()
      const newsletter = await prisma.newsletter.create({
        data: { subject, content, status: 'scheduled', scheduledAt },
      })
      return NextResponse.json({ status: 'scheduled', scheduledAt: scheduledAt.toISOString(), id: newsletter.id })
    }

    if (send) {
      // Get all confirmed subscribers (or all if confirmation not yet enforced)
      const subscribers = await prisma.subscriber.findMany()
      let sentCount = 0

      for (const sub of subscribers) {
        const unsubUrl = `${EMAIL_CONFIG.baseUrl}/api/subscribe/unsubscribe?token=${sub.unsubscribeToken || sub.id}`
        const email = newsletterEmail(content, subject, unsubUrl)
        const ok = await sendEmail({ to: sub.email, ...email })
        if (ok) sentCount++
      }

      const newsletter = await prisma.newsletter.create({
        data: { subject, content, sentTo: sentCount, status: 'sent', sentAt: new Date() },
      })

      return NextResponse.json({ status: 'sent', sentTo: sentCount, id: newsletter.id })
    } else {
      // Save as draft
      const newsletter = await prisma.newsletter.create({
        data: { subject, content, status: 'draft' },
      })
      return NextResponse.json({ status: 'draft', id: newsletter.id })
    }
  } catch (err) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — remove a newsletter
export async function DELETE(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    await prisma.newsletter.delete({ where: { id } })
    return NextResponse.json({ status: 'deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
