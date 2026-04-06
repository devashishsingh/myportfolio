import { NextResponse } from 'next/server'
import { sendEmail, contactAutoReplyEmail, adminNotificationEmail, EMAIL_CONFIG } from '../../../lib/email'

export async function POST(request: Request){
  try{
    const data = await request.json()
    const { name, email, message } = data

    if(!name || !email || !message) return NextResponse.json({error:'Missing fields'}, {status:400})

    // Send admin notification
    const notif = adminNotificationEmail('contact', {
      Name: name,
      Email: email,
      Message: message.substring(0, 500),
    })
    await sendEmail({ to: EMAIL_CONFIG.adminEmail, ...notif })

    // Send auto-reply to the sender
    const autoReply = contactAutoReplyEmail(name)
    await sendEmail({ to: email, ...autoReply })

    return NextResponse.json({status:'sent'})
  }catch(err){
    console.error(err)
    return NextResponse.json({error:'server error'}, {status:500})
  }
}
