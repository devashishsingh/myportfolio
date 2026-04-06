import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { isAuthenticated } = await import('../../../../lib/auth')
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, slug, date, description, author, category, tags, featured, content } = body
    if (!title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const safeSlug = slug ? slug : title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
    const postDate = date || new Date().toISOString().slice(0,10)
    const finalSlug = `${postDate}-${safeSlug}`

    const post = await prisma.blogPost.upsert({
      where: { slug: finalSlug },
      update: {
        title,
        description: description || null,
        author: author || 'Devashish Singh',
        date: postDate,
        category: category || null,
        tags: JSON.stringify(Array.isArray(tags) ? tags : []),
        featured: !!featured,
        content,
      },
      create: {
        slug: finalSlug,
        title,
        description: description || null,
        author: author || 'Devashish Singh',
        date: postDate,
        category: category || null,
        tags: JSON.stringify(Array.isArray(tags) ? tags : []),
        featured: !!featured,
        content,
      },
    })

    return NextResponse.json({ ok: true, slug: post.slug })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
