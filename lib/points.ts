import { prisma } from './db'

// ─── Builder Points + Streak Engine ──────────────────────────────────
// Centralised awarding so every code path (challenges, posts, helpful
// answers, manual grants) uses identical streak + monthPoints logic.

export type PointAction =
  | 'joined'
  | 'post_published'
  | 'answer_helpful'
  | 'challenge_submit'
  | 'challenge_win'
  | 'quiz_pass'
  | 'lab_complete'
  | 'streak_bonus'
  | 'manual_grant'
  | 'manual_revoke'

interface AwardOpts {
  memberId: string
  action: PointAction
  points: number
  refType?: string
  refId?: string
  note?: string
}

// ISO-week key: YYYY-Wnn used for streak comparison.
function isoWeekKey(d: Date): string {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const dayNum = (target.getUTCDay() + 6) % 7
  target.setUTCDate(target.getUTCDate() - dayNum + 3)
  const firstThursday = target.getTime()
  target.setUTCMonth(0, 1)
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7)
  }
  const week = 1 + Math.ceil((firstThursday - target.getTime()) / 604_800_000)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

/**
 * Award (or revoke, with negative points) Builder Points to a member.
 * Updates: points, monthPoints, streakWeeks, lastActiveAt + creates PointEvent.
 */
export async function awardPoints(opts: AwardOpts): Promise<{ pointsAfter: number; streakAfter: number; streakBonusAdded: number }> {
  const { memberId, action, points, refType, refId, note } = opts
  const now = new Date()

  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: { points: true, streakWeeks: true, lastActiveAt: true },
  })
  if (!member) throw new Error(`awardPoints: member ${memberId} not found`)

  // Streak: bumps when member becomes active in a *new* ISO week.
  // Resets to 1 if the gap is >7 days from lastActiveAt (missed a week).
  let nextStreak = member.streakWeeks
  let streakBonus = 0
  const positiveActivity = points > 0 || action === 'challenge_submit' || action === 'post_published' || action === 'answer_helpful'
  if (positiveActivity) {
    const lastActive = member.lastActiveAt
    if (!lastActive) {
      nextStreak = 1
    } else {
      const lastWeek = isoWeekKey(lastActive)
      const thisWeek = isoWeekKey(now)
      if (lastWeek !== thisWeek) {
        // New week — check whether it was contiguous (within 14 days) or a reset.
        const gapDays = (now.getTime() - lastActive.getTime()) / 86_400_000
        nextStreak = gapDays <= 14 ? member.streakWeeks + 1 : 1
        // Streak bonus every 4 consecutive weeks: +25 pts.
        if (nextStreak > 0 && nextStreak % 4 === 0) {
          streakBonus = 25
        }
      }
    }
  }

  const totalDelta = points + streakBonus

  await prisma.$transaction([
    prisma.member.update({
      where: { id: memberId },
      data: {
        points: { increment: totalDelta },
        monthPoints: { increment: totalDelta },
        streakWeeks: nextStreak,
        lastActiveAt: now,
      },
    }),
    prisma.pointEvent.create({
      data: { memberId, action, points, refType, refId, note },
    }),
    ...(streakBonus > 0
      ? [
          prisma.pointEvent.create({
            data: {
              memberId,
              action: 'streak_bonus' as const,
              points: streakBonus,
              note: `${nextStreak}-week streak bonus`,
            },
          }),
        ]
      : []),
  ])

  return {
    pointsAfter: member.points + totalDelta,
    streakAfter: nextStreak,
    streakBonusAdded: streakBonus,
  }
}

/**
 * Reverse a previous award. Decrements points + monthPoints, logs the reversal.
 * Does NOT modify streak (that's a one-way ratchet for fairness).
 */
export async function revokePoints(opts: AwardOpts): Promise<void> {
  const { memberId, action, points, refType, refId, note } = opts
  const delta = -Math.abs(points)
  await prisma.$transaction([
    prisma.member.update({
      where: { id: memberId },
      data: {
        points: { increment: delta },
        monthPoints: { increment: delta },
      },
    }),
    prisma.pointEvent.create({
      data: { memberId, action, points: delta, refType, refId, note },
    }),
  ])
}
