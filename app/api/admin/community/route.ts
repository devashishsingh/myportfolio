import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { isAuthenticated } from '../../../../lib/auth'

function isAuthed(): boolean {
  return isAuthenticated()
}

// GET: Fetch all community data for admin dashboard
export async function GET(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const type = url.searchParams.get('type')

  if (type === 'invitations') {
    const invitations = await prisma.invitationRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ invitations })
  }

  if (type === 'subscribers') {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ subscribers })
  }

  if (type === 'feedback') {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ feedback })
  }

  // Dashboard stats
  const [
    totalInvitations,
    pendingInvitations,
    approvedMembers,
    rejectedInvitations,
    totalSubscribers,
    totalFeedback,
    newFeedback,
    totalBookings,
    pendingBookings,
    totalNewsletters,
  ] = await Promise.all([
    prisma.invitationRequest.count(),
    prisma.invitationRequest.count({ where: { status: 'pending' } }),
    prisma.invitationRequest.count({ where: { status: 'approved' } }),
    prisma.invitationRequest.count({ where: { status: 'rejected' } }),
    prisma.subscriber.count(),
    prisma.feedback.count(),
    prisma.feedback.count({ where: { status: 'new' } }),
    prisma.bookingRequest.count(),
    prisma.bookingRequest.count({ where: { status: 'pending' } }),
    prisma.newsletter.count({ where: { status: 'sent' } }),
  ])

  // Region breakdown
  const invitationsByRegion = await prisma.invitationRequest.groupBy({
    by: ['region'],
    _count: { region: true },
  })
  const subscribersByRegion = await prisma.subscriber.groupBy({
    by: ['region'],
    _count: { region: true },
  })

  return NextResponse.json({
    stats: {
      totalInvitations,
      pendingInvitations,
      approvedMembers,
      rejectedInvitations,
      totalSubscribers,
      totalFeedback,
      newFeedback,
      totalBookings,
      pendingBookings,
      totalNewsletters,
    },
    invitationsByRegion: invitationsByRegion.map((r: { region: string; _count: { region: number } }) => ({ region: r.region, count: r._count.region })),
    subscribersByRegion: subscribersByRegion.map((r: { region: string; _count: { region: number } }) => ({ region: r.region, count: r._count.region })),
  })
}

// PATCH: Update invitation or feedback status
export async function PATCH(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, status, adminNote, type } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status.' }, { status: 400 })
    }

    if (type === 'feedback') {
      if (!['new', 'reviewed', 'resolved'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
      }
      await prisma.feedback.update({
        where: { id },
        data: { status, adminNote: adminNote || null },
      })
      return NextResponse.json({ ok: true })
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }

    await prisma.invitationRequest.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote || null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

// DELETE: Remove subscriber
export async function DELETE(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const type = url.searchParams.get('type')

    if (!id) {
      return NextResponse.json({ error: 'Missing id.' }, { status: 400 })
    }

    if (type === 'subscriber') {
      await prisma.subscriber.delete({ where: { id } })
    } else if (type === 'feedback') {
      await prisma.feedback.delete({ where: { id } })
    } else {
      await prisma.invitationRequest.delete({ where: { id } })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
