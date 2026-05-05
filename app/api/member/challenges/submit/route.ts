import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'
import { getMemberFromCookie } from '../../../../../lib/member-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST { challengeId, content, url? } — member submits a writeup.
export async function POST(req: NextRequest) {
  const me = await getMemberFromCookie()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { challengeId, content, url } = body
  if (!challengeId || !content || String(content).trim().length < 30) {
    return NextResponse.json({ error: 'challengeId + content (min 30 chars) required' }, { status: 400 })
  }

  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } })
  if (!challenge || !challenge.published) {
    return NextResponse.json({ error: 'Challenge not found or not live' }, { status: 404 })
  }

  if (challenge.closesAt < new Date()) {
    return NextResponse.json({ error: 'Challenge has closed' }, { status: 400 })
  }

  const submission = await prisma.challengeSubmission.create({
    data: {
      challengeId,
      memberId: me.id,
      content: String(content).slice(0, 20000),
      url: url ? String(url).slice(0, 500) : null,
    },
  })

  // Log point event for participation (0 points until graded — kept for streak signal)
  await prisma.pointEvent.create({
    data: {
      memberId: me.id,
      action: 'challenge_submit',
      points: 0,
      refType: 'challenge',
      refId: challengeId,
      note: `Submitted: ${challenge.title}`,
    },
  })

  await prisma.member.update({
    where: { id: me.id },
    data: { lastActiveAt: new Date() },
  })

  return NextResponse.json({ ok: true, submission })
}
