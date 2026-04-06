import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { createHash } from 'crypto'

function getFingerprint(req: NextRequest): string {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const ua = req.headers.get('user-agent') || 'unknown'
  return createHash('sha256').update(`${ip}:${ua}`).digest('hex').substring(0, 32)
}

// GET — get like count + whether current user liked
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const uid = getFingerprint(req)

  const [count, userLike] = await Promise.all([
    prisma.blogLike.count({ where: { slug } }),
    prisma.blogLike.findUnique({ where: { slug_uid: { slug, uid } } }),
  ])

  return NextResponse.json({ count, liked: !!userLike })
}

// POST — toggle like
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }

    const uid = getFingerprint(req)

    const existing = await prisma.blogLike.findUnique({
      where: { slug_uid: { slug, uid } },
    })

    if (existing) {
      await prisma.blogLike.delete({ where: { id: existing.id } })
      const count = await prisma.blogLike.count({ where: { slug } })
      return NextResponse.json({ count, liked: false })
    } else {
      await prisma.blogLike.create({ data: { slug, uid } })
      const count = await prisma.blogLike.count({ where: { slug } })
      return NextResponse.json({ count, liked: true })
    }
  } catch (err) {
    console.error('Like error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
