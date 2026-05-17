import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '../../../../lib/db'
import { verifySession } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = cookies().get('admin_session')?.value
  if (!session || !verifySession(session)) return false
  return true
}

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rows = await prisma.lead.findMany({
      where: { source: 'workshop' },
      orderBy: { createdAt: 'desc' },
    })

    const registrations = rows.map((r: any) => {
      let meta: any = {}
      try {
        meta = r.meta ? (typeof r.meta === 'string' ? JSON.parse(r.meta) : r.meta) : {}
      } catch {
        meta = {}
      }
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        phone: meta.phone || '',
        college: meta.college || '',
        year: meta.year || '',
        field: meta.field || '',
        createdAt: r.createdAt,
      }
    })

    const url = new URL(req.url)
    if (url.searchParams.get('format') === 'csv') {
      const headers = ['Name', 'Email', 'College', 'Year', 'Interest', 'Submitted']
      const escape = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`
      const lines = [
        headers.join(','),
        ...registrations.map((r: any) =>
          [r.name, r.email, r.college, r.year, r.field, new Date(r.createdAt).toISOString()]
            .map(escape)
            .join(','),
        ),
      ]
      return new NextResponse(lines.join('\n'), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="workshop-registrations.csv"',
        },
      })
    }

    return NextResponse.json({ count: registrations.length, registrations })
  } catch (err) {
    console.error('[admin/workshop] failed', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
