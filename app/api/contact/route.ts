import { NextResponse } from 'next/server'
import { sendEmail, contactAutoReplyEmail, adminNotificationEmail, EMAIL_CONFIG } from '../../../lib/email'
import { createLead } from '../../../lib/leads'

export async function POST(request: Request){
  try{
    const data = await request.json()
    const { name, email, message, _hp } = data

    // Honeypot: bots fill hidden fields; real users don't
    if (_hp) return NextResponse.json({ status: 'sent' })

    if(!name || !email || !message) return NextResponse.json({error:'Missing fields'}, {status:400})

    // Input validation
    const nameStr = String(name).trim().slice(0, 100)
    const emailStr = String(email).trim().toLowerCase().slice(0, 254)
    const messageStr = String(message).trim().slice(0, 2000)

    if (!nameStr || nameStr.length < 2) return NextResponse.json({ error: 'Name is too short.' }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    if (!messageStr || messageStr.length < 10) return NextResponse.json({ error: 'Message is too short.' }, { status: 400 })

    // Create lead
    await createLead({ name: nameStr, email: emailStr, source: 'contact', message: messageStr })

    // Send admin notification
    const notif = adminNotificationEmail('contact', {
      Name: nameStr,
      Email: emailStr,
      Message: messageStr.substring(0, 500),
    })
    await sendEmail({ to: EMAIL_CONFIG.adminEmail, ...notif })

    // Send auto-reply to the sender
    const autoReply = contactAutoReplyEmail(nameStr)
    await sendEmail({ to: emailStr, ...autoReply })

    return NextResponse.json({status:'sent'})
  }catch(err){
    console.error(err)
    return NextResponse.json({error:'server error'}, {status:500})
  }
}
