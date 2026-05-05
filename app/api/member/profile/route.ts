import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { getMemberFromCookie } from '../../../../lib/member-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TRACKS = ['cyber', 'ai', 'cloud', 'systems', 'networks', 'coding', 'gaming', 'digital']

export async function GET() {
  const me = await getMemberFromCookie()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const member = await prisma.member.findUnique({
    where: { id: me.id },
    select: {
      id: true, email: true, handle: true, displayName: true, avatarUrl: true,
      bio: true, linkedinUrl: true, githubUrl: true, siteUrl: true, region: true,
      tracks: true, workingOn: true, openToCollab: true, openToHire: true, openToMentor: true,
      founderNumber: true, points: true, monthPoints: true, joinedAt: true,
    },
  })
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let tracks: string[] = []
  try { tracks = JSON.parse(member.tracks || '[]') } catch {}

  return NextResponse.json({ ...member, tracks })
}

export async function PATCH(req: NextRequest) {
  const me = await getMemberFromCookie()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Whitelist editable fields. Email + handle + founderNumber not editable here.
  const data: Record<string, any> = {}
  const stringFields = ['displayName', 'bio', 'linkedinUrl', 'githubUrl', 'siteUrl', 'region', 'workingOn', 'avatarUrl']
  for (const f of stringFields) {
    if (typeof body[f] === 'string') {
      const v = body[f].trim()
      data[f] = v.length === 0 ? null : v.slice(0, 500)
    }
  }
  if (typeof body.displayName === 'string' && body.displayName.trim().length === 0) {
    return NextResponse.json({ error: 'displayName required' }, { status: 400 })
  }

  const boolFields = ['openToCollab', 'openToHire', 'openToMentor']
  for (const f of boolFields) {
    if (typeof body[f] === 'boolean') data[f] = body[f]
  }

  if (Array.isArray(body.tracks)) {
    const cleaned = body.tracks.filter((t: any) => typeof t === 'string' && TRACKS.includes(t))
    data.tracks = JSON.stringify(Array.from(new Set(cleaned)))
  }

  data.lastActiveAt = new Date()

  const updated = await prisma.member.update({
    where: { id: me.id },
    data,
    select: { id: true, handle: true, displayName: true },
  })

  return NextResponse.json({ ok: true, member: updated })
}
