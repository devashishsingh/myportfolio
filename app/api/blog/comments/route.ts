import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

// GET — get approved comments for a post
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const comments = await prisma.blogComment.findMany({
    where: { slug, status: 'approved' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, message: true, createdAt: true },
  })

  return NextResponse.json({ comments })
}

// POST — submit a comment
export async function POST(req: NextRequest) {
  try {
    const { slug, name, email, message } = await req.json()

    if (!slug || !name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (typeof name !== 'string' || name.length > 100) {
      return NextResponse.json({ error: 'Name too long' }, { status: 400 })
    }

    if (typeof message !== 'string' || message.length > 2000) {
      return NextResponse.json({ error: 'Comment too long (max 2000 chars)' }, { status: 400 })
    }

    const comment = await prisma.blogComment.create({
      data: {
        slug: slug.substring(0, 200),
        name: name.trim().substring(0, 100),
        email: email.trim().toLowerCase().substring(0, 200),
        message: message.trim().substring(0, 2000),
      },
    })

    return NextResponse.json({
      comment: { id: comment.id, name: comment.name, message: comment.message, createdAt: comment.createdAt },
    })
  } catch (err) {
    console.error('Comment error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
