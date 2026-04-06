import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { EMAIL_CONFIG } from '../../../../lib/email'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}?error=invalid-token`)
  }

  try {
    const subscriber = await prisma.subscriber.findFirst({
      where: { unsubscribeToken: token },
    })

    if (!subscriber) {
      return NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}?error=invalid-token`)
    }

    await prisma.subscriber.delete({ where: { id: subscriber.id } })

    return NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}?unsubscribed=true`)
  } catch {
    return NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}?error=server-error`)
  }
}
