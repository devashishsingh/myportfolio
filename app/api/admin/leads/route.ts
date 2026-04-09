import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

// GET — list leads with filters + stats
export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const filter = url.searchParams.get('filter') || 'all' // all | new | acknowledged | responded | closed | today
  const source = url.searchParams.get('source') || 'all'  // all | contact | booking | feedback | community_invite | community_subscribe
  const search = url.searchParams.get('search') || ''
  const format = url.searchParams.get('format') // csv

  // Build where clause
  const where: Record<string, unknown> = {}

  if (filter === 'today') {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    where.createdAt = { gte: start }
  } else if (filter !== 'all') {
    where.status = filter
  }

  if (source !== 'all') {
    where.source = source
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ]
  }

  // CSV export
  if (format === 'csv') {
    const leads = await prisma.lead.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
    })

    const headers = ['ID', 'Name', 'Email', 'Source', 'Message', 'Status', 'Admin Note', 'Created At']
    const rows = leads.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      l.source,
      `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      l.status,
      `"${(l.adminNote || '').replace(/"/g, '""')}"`,
      l.createdAt.toISOString(),
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${filter}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  // Normal JSON response
  const [leads, stats] = await Promise.all([
    prisma.lead.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
    }),
    getLeadStats(),
  ])

  return NextResponse.json({ leads, stats })
}

// PATCH — update lead status or admin note
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, adminNote } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 })
    }

    const validStatuses = ['new', 'acknowledged', 'responded', 'closed']
    const data: Record<string, string> = {}

    if (status && validStatuses.includes(status)) {
      data.status = status
    }
    if (adminNote !== undefined) {
      data.adminNote = adminNote
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const lead = await prisma.lead.update({
      where: { id },
      data,
    })

    return NextResponse.json({ lead })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — remove a lead
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 })
    }

    await prisma.lead.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Helper: compute lead stats
async function getLeadStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [total, newCount, acknowledged, responded, closed, todayCount, bySrc] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.lead.count({ where: { status: 'acknowledged' } }),
    prisma.lead.count({ where: { status: 'responded' } }),
    prisma.lead.count({ where: { status: 'closed' } }),
    prisma.lead.count({ where: { createdAt: { gte: today } } }),
    prisma.lead.groupBy({ by: ['source'], _count: { id: true } }),
  ])

  return {
    total,
    new: newCount,
    acknowledged,
    responded,
    closed,
    today: todayCount,
    bySource: bySrc.map(s => ({ source: s.source, count: s._count.id })),
  }
}
