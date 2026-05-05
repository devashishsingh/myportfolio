import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

// Run on the 1st of each month at 00:05 UTC.
// Resets monthPoints for all members (lifetime `points` is preserved).
//
// Vercel Cron passes Authorization: Bearer <CRON_SECRET>.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Snapshot top-3 of the closing month into PointEvent for historic record.
  const top3 = await prisma.member.findMany({
    where: { monthPoints: { gt: 0 } },
    orderBy: [{ monthPoints: 'desc' }, { joinedAt: 'asc' }],
    take: 3,
    select: { id: true, displayName: true, monthPoints: true },
  })

  const closedMonth = new Date()
  closedMonth.setUTCMonth(closedMonth.getUTCMonth() - 1)
  const monthLabel = closedMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  if (top3.length > 0) {
    await prisma.pointEvent.createMany({
      data: top3.map((m, i) => ({
        memberId: m.id,
        action: 'manual_grant',
        points: 0,
        refType: 'monthly_top',
        refId: monthLabel,
        note: `🏆 Top ${i + 1} for ${monthLabel} (${m.monthPoints} pts)`,
      })),
    })
  }

  // Reset everyone's monthPoints.
  const result = await prisma.member.updateMany({
    where: { monthPoints: { gt: 0 } },
    data: { monthPoints: 0 },
  })

  console.log(`[Cron/MonthlyReset] Reset ${result.count} members. Top 3 of ${monthLabel}:`, top3.map(t => `${t.displayName}=${t.monthPoints}`).join(', '))

  return NextResponse.json({
    status: 'ok',
    monthClosed: monthLabel,
    membersReset: result.count,
    top3: top3.map((m, i) => ({ rank: i + 1, name: m.displayName, points: m.monthPoints })),
  })
}
