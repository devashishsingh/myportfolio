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
      where: { confirmToken: token },
    })

    if (!subscriber) {
      return NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}?error=invalid-token`)
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { confirmed: true, confirmToken: null },
    })

    return NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}?subscribed=confirmed`)
  } catch {
    return NextResponse.redirect(`${EMAIL_CONFIG.baseUrl}?error=server-error`)
  }
}
