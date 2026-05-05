import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'
import { isAuthenticated } from '../../../../../lib/auth'
import { awardPoints, revokePoints } from '../../../../../lib/points'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Admin grading: GET list of submissions + PATCH to grade.
export async function GET(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const status = req.nextUrl.searchParams.get('status') || 'pending'
  const list = await prisma.challengeSubmission.findMany({
    where: status === 'all' ? {} : { status },
    orderBy: { submittedAt: 'desc' },
    take: 100,
    include: {
      challenge: { select: { id: true, slug: true, title: true, points: true, badgeSlug: true } },
      member: { select: { id: true, handle: true, displayName: true, email: true } },
    },
  })
  return NextResponse.json({ submissions: list })
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { id, status, score, adminNote } = body
  if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'id + valid status required' }, { status: 400 })
  }

  const submission = await prisma.challengeSubmission.findUnique({
    where: { id },
    include: { challenge: true },
  })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const wasApproved = submission.status === 'approved'
  const becomesApproved = status === 'approved'

  const updated = await prisma.challengeSubmission.update({
    where: { id },
    data: {
      status,
      score: typeof score === 'number' ? Math.max(0, Math.min(100, score)) : submission.score,
      adminNote: typeof adminNote === 'string' ? adminNote : submission.adminNote,
      gradedAt: new Date(),
    },
  })

  // Award points + badge on approval transition.
  if (becomesApproved && !wasApproved) {
    await awardPoints({
      memberId: submission.memberId,
      action: 'challenge_win',
      points: submission.challenge.points,
      refType: 'challenge',
      refId: submission.challengeId,
      note: `Approved: ${submission.challenge.title}`,
    })

    // Optional badge
    if (submission.challenge.badgeSlug) {
      const badge = await prisma.badge.findUnique({ where: { slug: submission.challenge.badgeSlug } })
      if (badge) {
        await prisma.memberBadge.create({
          data: { memberId: submission.memberId, badgeId: badge.id, note: `Won: ${submission.challenge.title}` },
        }).catch(() => { /* unique constraint — already has it */ })
      }
    }
  }

  // Reverse points if approval is being undone
  if (wasApproved && !becomesApproved) {
    await revokePoints({
      memberId: submission.memberId,
      action: 'manual_revoke',
      points: submission.challenge.points,
      refType: 'challenge',
      refId: submission.challengeId,
      note: `Reverted approval: ${submission.challenge.title}`,
    })
  }

  return NextResponse.json({ ok: true, submission: updated })
}
