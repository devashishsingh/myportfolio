import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { sendEmail, bookingConfirmationEmail, adminNotificationEmail } from '../../../lib/email'
import { createLead } from '../../../lib/leads'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, sessionType, preferredDate, preferredTime, timezone, message } = data

    if (!name || !email || !sessionType || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const validTypes = ['mentorship', 'consulting', 'workshop', 'other']
    if (!validTypes.includes(sessionType)) {
      return NextResponse.json({ error: 'Invalid session type' }, { status: 400 })
    }

    const booking = await prisma.bookingRequest.create({
      data: {
        name,
        email,
        sessionType,
        preferredDate,
        preferredTime,
        timezone: timezone || 'Asia/Kuala_Lumpur',
        message: message?.substring(0, 2000) || null,
      },
    })

    // Create lead
    await createLead({
      name, email, source: 'booking', sourceId: booking.id,
      message: message?.substring(0, 500) || `${sessionType} session on ${preferredDate}`,
      meta: { sessionType, preferredDate, preferredTime, timezone: timezone || 'Asia/Kuala_Lumpur' },
    })

    // Send confirmation to the person booking
    const confirmEmail = bookingConfirmationEmail(name, sessionType, preferredDate, preferredTime, timezone || 'Asia/Kuala_Lumpur')
    await sendEmail({ to: email, ...confirmEmail })

    // Notify admin
    const notif = adminNotificationEmail('booking', {
      Name: name,
      Email: email,
      Session: sessionType,
      Date: preferredDate,
      Time: preferredTime,
      Timezone: timezone || 'Asia/Kuala_Lumpur',
      ...(message ? { Message: message.substring(0, 200) } : {}),
    })
    const { adminEmail } = await import('../../../lib/email').then(m => ({ adminEmail: m.EMAIL_CONFIG.adminEmail }))
    await sendEmail({ to: adminEmail, ...notif })

    return NextResponse.json({ status: 'booked', id: booking.id })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
