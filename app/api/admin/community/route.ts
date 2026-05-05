import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { isAuthenticated } from '../../../../lib/auth'
import { createLoginToken, generateHandle } from '../../../../lib/member-auth'
import { sendEmail, memberApprovedEmail, EMAIL_CONFIG } from '../../../../lib/email'

const FOUNDING_CAP = parseInt(process.env.FOUNDING_CAP || '50', 10)

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

    const invitation = await prisma.invitationRequest.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote || null,
      },
    })

    // ─── Approval orchestration ─────────────────────────────────────
    // On approve: auto-confirm subscriber, create Member, claim founder #,
    // award Founding-50 badge, log point event, fire onboarding email.
    let onboarding: { founderNumber: number | null; magicLoginUrl: string; emailQueued: boolean } | undefined
    if (status === 'approved') {
      try {
        // 1. Upsert Subscriber (auto-confirm)
        const subscriber = await prisma.subscriber.upsert({
          where: { email: invitation.email },
          update: { confirmed: true, name: invitation.fullName, region: invitation.region },
          create: {
            name: invitation.fullName,
            email: invitation.email,
            region: invitation.region,
            interests: invitation.interest || '',
            confirmed: true,
          },
        })

        // 2. Find or create Member
        let member = await prisma.member.findUnique({ where: { email: invitation.email } })
        if (!member) {
          // Atomically claim next founder number under cap
          const founderCount = await prisma.member.count({ where: { founderNumber: { not: null } } })
          const founderNumber = founderCount < FOUNDING_CAP ? founderCount + 1 : null

          // Generate unique handle (retry on collision)
          let handle = generateHandle(invitation.fullName)
          for (let attempts = 0; attempts < 5; attempts++) {
            const exists = await prisma.member.findUnique({ where: { handle } })
            if (!exists) break
            handle = generateHandle(invitation.fullName)
          }

          member = await prisma.member.create({
            data: {
              email: invitation.email,
              handle,
              displayName: invitation.fullName,
              region: invitation.region,
              linkedinUrl: invitation.linkedIn || null,
              githubUrl: invitation.github || null,
              siteUrl: invitation.portfolio || null,
              founderNumber,
              invitationId: invitation.id,
              subscriberId: subscriber.id,
            },
          })

          // 3. Award Founding-50 badge if assigned
          if (founderNumber) {
            const foundingBadge = await prisma.badge.findUnique({ where: { slug: 'founding-50' } })
            if (foundingBadge) {
              await prisma.memberBadge.create({
                data: { memberId: member.id, badgeId: foundingBadge.id, note: `Founding Member #${String(founderNumber).padStart(2, '0')}` },
              }).catch(() => {/* unique constraint */})
            }
          }

          // 4. Point event marker
          await prisma.pointEvent.create({
            data: { memberId: member.id, action: 'joined', points: 0, note: 'Welcome to the Builders Hub' },
          })
        }

        // 5. Mint magic-login token
        const rawToken = await createLoginToken(member.id)
        const magicLoginUrl = `${EMAIL_CONFIG.baseUrl}/api/member/login/verify?token=${rawToken}`
        const channelUrl = process.env.DISCORD_INVITE_URL || `${EMAIL_CONFIG.baseUrl}/community`
        const welcomeUrl = `${EMAIL_CONFIG.baseUrl}/community/welcome`
        const discountCode = process.env.MEMBER_DISCOUNT_CODE

        // 6. Fire onboarding email (non-blocking — graceful degradation handled by sendEmail)
        const emailPayload = memberApprovedEmail({
          name: invitation.fullName,
          founderNumber: member.founderNumber,
          magicLoginUrl,
          channelUrl,
          welcomeUrl,
          discountCode,
        })
        const sent = await sendEmail({ to: invitation.email, ...emailPayload })

        onboarding = {
          founderNumber: member.founderNumber,
          magicLoginUrl,
          emailQueued: sent,
        }
      } catch (err: any) {
        console.error('[approval-orchestration] failed:', err)
        // Don't fail the PATCH — invitation status was already updated.
        onboarding = { founderNumber: null, magicLoginUrl: '', emailQueued: false }
      }
    }

    return NextResponse.json({ ok: true, onboarding })
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
