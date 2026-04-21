import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { prisma } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

const profilePath = path.join(process.cwd(), 'data', 'profile.json')
const projectsPath = path.join(process.cwd(), 'data', 'projects.json')

export async function GET() {
  try {
    const { isAuthenticated } = await import('../../../../lib/auth')
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try DB first, fall back to filesystem (for initial migration)
    let profile, projects
    const dbProfile = await prisma.siteContent.findUnique({ where: { key: 'profile' } })
    const dbProjects = await prisma.siteContent.findUnique({ where: { key: 'projects' } })

    if (dbProfile) {
      profile = JSON.parse(dbProfile.value)
    } else {
      profile = JSON.parse(await fs.readFile(profilePath, 'utf8'))
    }

    if (dbProjects) {
      projects = JSON.parse(dbProjects.value)
    } else {
      projects = JSON.parse(await fs.readFile(projectsPath, 'utf8'))
    }

    return NextResponse.json({ profile, projects })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { isAuthenticated } = await import('../../../../lib/auth')
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: 'Missing type or data' }, { status: 400 })
    }

    if (type === 'profile') {
      const allowed = ['name', 'role', 'summary', 'teachingLinks', 'courses', 'experience', 'certifications', 'education']
      const cleaned: Record<string, unknown> = {}
      for (const key of allowed) {
        if (key in data) cleaned[key] = data[key]
      }
      await prisma.siteContent.upsert({
        where: { key: 'profile' },
        update: { value: JSON.stringify(cleaned, null, 2) },
        create: { key: 'profile', value: JSON.stringify(cleaned, null, 2) },
      })
      return NextResponse.json({ ok: true, type: 'profile' })
    }

    if (type === 'projects') {
      if (!Array.isArray(data)) {
        return NextResponse.json({ error: 'Projects must be an array' }, { status: 400 })
      }
      const cleaned = data.map((p: Record<string, unknown>) => ({
        title: String(p.title || ''),
        category: String(p.category || ''),
        excerpt: String(p.excerpt || ''),
        tech: Array.isArray(p.tech) ? p.tech.map(String) : [],
        href: String(p.href || ''),
      }))
      await prisma.siteContent.upsert({
        where: { key: 'projects' },
        update: { value: JSON.stringify(cleaned, null, 2) },
        create: { key: 'projects', value: JSON.stringify(cleaned, null, 2) },
      })
      return NextResponse.json({ ok: true, type: 'projects' })
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
