import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { isAuthenticated } from '../../../../lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID_KINDS = ['challenge', 'quiz', 'lab']
const VALID_TRACKS = ['cyber', 'ai', 'cloud', 'systems', 'networks', 'coding', 'gaming', 'digital']

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'challenge'
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const status = req.nextUrl.searchParams.get('status')
  const where: any = {}
  if (status === 'live') where.published = true
  const list = await prisma.challenge.findMany({
    where,
    orderBy: [{ closesAt: 'desc' }],
    take: 100,
    include: { _count: { select: { submissions: true } } },
  })
  return NextResponse.json({ challenges: list })
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { title, kind, track, difficulty, brief, body: content, rubric, points, badgeSlug, hoursOpen, published, featured } = body
  if (!title || !brief || !content) return NextResponse.json({ error: 'title, brief, body required' }, { status: 400 })
  if (!VALID_KINDS.includes(kind)) return NextResponse.json({ error: 'Invalid kind' }, { status: 400 })

  const hours = Number(hoursOpen) || 24
  const closesAt = new Date(Date.now() + hours * 3600 * 1000)

  // Generate unique slug
  let slug = slugify(title)
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.challenge.findUnique({ where: { slug } })
    if (!exists) break
    slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`
  }

  const created = await prisma.challenge.create({
    data: {
      slug,
      title: String(title).slice(0, 200),
      kind,
      track: track && VALID_TRACKS.includes(track) ? track : null,
      difficulty: Math.max(1, Math.min(5, Number(difficulty) || 2)),
      brief: String(brief).slice(0, 500),
      body: String(content).slice(0, 20000),
      rubric: rubric ? String(rubric).slice(0, 5000) : null,
      points: Math.max(0, Math.min(500, Number(points) || 50)),
      badgeSlug: badgeSlug || null,
      closesAt,
      published: !!published,
      featured: !!featured,
    },
  })

  return NextResponse.json({ ok: true, challenge: created })
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { id, ...rest } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const data: any = {}
  for (const f of ['title', 'brief', 'body', 'rubric', 'badgeSlug']) {
    if (typeof rest[f] === 'string') data[f] = rest[f]
  }
  if (typeof rest.published === 'boolean') data.published = rest.published
  if (typeof rest.featured === 'boolean') data.featured = rest.featured
  if (typeof rest.points === 'number') data.points = Math.max(0, Math.min(500, rest.points))
  if (typeof rest.difficulty === 'number') data.difficulty = Math.max(1, Math.min(5, rest.difficulty))
  if (typeof rest.closesAt === 'string') data.closesAt = new Date(rest.closesAt)

  const updated = await prisma.challenge.update({ where: { id }, data })
  return NextResponse.json({ ok: true, challenge: updated })
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.challenge.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
