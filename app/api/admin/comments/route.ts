import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { isAuthenticated } from '../../../../lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/admin/comments?status=pending|approved|all
export async function GET(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = req.nextUrl.searchParams.get('status') || 'pending'
  const where = status === 'all' ? {} : { status }

  const comments = await prisma.blogComment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: { id: true, slug: true, name: true, email: true, message: true, status: true, createdAt: true },
  })

  return NextResponse.json({ comments })
}

// PATCH /api/admin/comments  { id, status: 'approved' | 'hidden' }
export async function PATCH(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { id, status } = body
  if (!id || !['approved', 'pending', 'hidden'].includes(status)) {
    return NextResponse.json({ error: 'id and valid status required' }, { status: 400 })
  }

  const updated = await prisma.blogComment.update({ where: { id }, data: { status } })
  return NextResponse.json({ ok: true, comment: { id: updated.id, status: updated.status } })
}

// DELETE /api/admin/comments?id=xxx
export async function DELETE(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await prisma.blogComment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
