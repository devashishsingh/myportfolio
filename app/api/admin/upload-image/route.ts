import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const { isAuthenticated } = await import('../../../../lib/auth')
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('image') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, GIF, or WebP.' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]/gi, '-').substring(0, 50)
    const filename = `${Date.now()}-${baseName}.${ext}`

    // Use Vercel Blob in production, local filesystem in development
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const buffer = Buffer.from(await file.arrayBuffer())
      const blob = await put(`blog/${filename}`, buffer, {
        access: 'public',
        contentType: file.type,
        addRandomSuffix: false,
      })
      return NextResponse.json({ url: blob.url })
    }

    // Local filesystem fallback
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'blog')
    await mkdir(uploadDir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/images/blog/${filename}` })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export const maxDuration = 30
