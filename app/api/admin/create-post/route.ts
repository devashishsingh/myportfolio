import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { sendEmail, newBlogPostEmail, EMAIL_CONFIG } from '../../../../lib/email'

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

    // Check if this is a new post before upsert
    const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug }, select: { id: true } })
    const isNew = !existing

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

    // Notify all subscribers when a new post is published
    if (isNew) {
      try {
        const subscribers = await prisma.subscriber.findMany({ select: { email: true, id: true, unsubscribeToken: true } })
        for (const sub of subscribers) {
          const unsubUrl = `${EMAIL_CONFIG.baseUrl}/api/subscribe/unsubscribe?token=${sub.unsubscribeToken || sub.id}`
          const email = newBlogPostEmail({
            title,
            description: description || title,
            slug: finalSlug,
            category: category || null,
            unsubscribeUrl: unsubUrl,
          })
          await sendEmail({ to: sub.email, ...email })
        }
      } catch (notifyErr) {
        // Non-fatal: log but don't fail the post creation
        console.error('[create-post] Subscriber notification error:', notifyErr)
      }
    }

    return NextResponse.json({ ok: true, slug: post.slug })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
