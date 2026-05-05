import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { getMemberFromCookie } from '../../../../lib/member-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/community/leaderboard?scope=public|members
//   public  → top 3 only (no auth) — used on /community spotlight
//   members → top 50 (requires member cookie) — used on /community/leaderboard
//
// Returns ranked rows for both `month` (current month) + `allTime`.
export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get('scope') || 'public'

  if (scope === 'members') {
    const me = await getMemberFromCookie()
    if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const take = scope === 'members' ? 50 : 3

  const select = {
    id: true,
    handle: true,
    displayName: true,
    region: true,
    founderNumber: true,
    points: true,
    monthPoints: true,
    streakWeeks: true,
  }

  const [month, allTime] = await Promise.all([
    prisma.member.findMany({
      where: { monthPoints: { gt: 0 } },
      orderBy: [{ monthPoints: 'desc' }, { joinedAt: 'asc' }],
      take,
      select,
    }),
    prisma.member.findMany({
      where: { points: { gt: 0 } },
      orderBy: [{ points: 'desc' }, { joinedAt: 'asc' }],
      take,
      select,
    }),
  ])

  return NextResponse.json({ scope, month, allTime })
}
