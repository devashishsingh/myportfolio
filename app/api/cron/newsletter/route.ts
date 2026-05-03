import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { sendEmail, newsletterEmail, EMAIL_CONFIG } from '../../../../lib/email'

// This route is called by Vercel Cron every Monday at 00:00 UTC (= 08:00 MYT)
// Vercel passes Authorization: Bearer <CRON_SECRET> automatically

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Verify the request comes from Vercel Cron (or your own secret)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // Find all newsletters scheduled for now or earlier
  const due = await prisma.newsletter.findMany({
    where: {
      status: 'scheduled',
      scheduledAt: { lte: now },
    },
  })

  if (due.length === 0) {
    console.log('[Cron/Newsletter] No newsletters due. Skipping.')
    return NextResponse.json({ status: 'ok', sent: 0, message: 'No newsletters due.' })
  }

  // Get all confirmed subscribers
  const subscribers = await prisma.subscriber.findMany({
    where: { confirmed: true },
  })

  let totalSent = 0

  for (const nl of due) {
    let sentCount = 0

    for (const sub of subscribers) {
      const unsubUrl = `${EMAIL_CONFIG.baseUrl}/api/subscribe/unsubscribe?token=${sub.unsubscribeToken || sub.id}`
      const email = newsletterEmail(nl.content, nl.subject, unsubUrl)
      const ok = await sendEmail({ to: sub.email, ...email })
      if (ok) sentCount++
    }

    await prisma.newsletter.update({
      where: { id: nl.id },
      data: { status: 'sent', sentAt: now, sentTo: sentCount },
    })

    totalSent += sentCount
    console.log(`[Cron/Newsletter] Sent "${nl.subject}" to ${sentCount} subscribers.`)
  }

  return NextResponse.json({
    status: 'ok',
    newslettersSent: due.length,
    totalEmailsSent: totalSent,
    at: now.toISOString(),
  })
}
