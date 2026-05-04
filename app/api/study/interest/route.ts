import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, adminNotificationEmail, EMAIL_CONFIG } from '../../../../lib/email'
import { createLead } from '../../../../lib/leads'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, motivation, courseId, courseTitle } = body

    if (!fullName || !email || !motivation || !courseId) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = String(fullName).trim()
    const cleanMotivation = String(motivation).trim()

    await createLead({
      name: cleanName,
      email: cleanEmail,
      source: 'study_interest',
      sourceId: courseId,
      message: cleanMotivation.substring(0, 1000),
      meta: { courseId: String(courseId), courseTitle: String(courseTitle || courseId) },
    })

    // Notify admin (re-uses 'join' template for clean rendering)
    const notif = adminNotificationEmail('join', {
      Type: '🎓 Study Interest',
      Course: String(courseTitle || courseId),
      Name: cleanName,
      Email: cleanEmail,
      Motivation: cleanMotivation,
    })
    await sendEmail({ to: EMAIL_CONFIG.adminEmail, ...notif })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
