"use client"
import { useState } from 'react'

export default function ContactForm(){
  const [status, setStatus] = useState<'idle'|'sent'|'error'>('idle')

  return (
    <form onSubmit={async (e)=>{
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement
      const fd = new FormData(form)
      const payload = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message') }
      try{
        const res = await fetch('/api/contact', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
        if(res.ok) setStatus('sent')
        else setStatus('error')
      }catch(e){ setStatus('error') }
    }} className="space-y-4">
      <label className="block">
        <div className="text-sm font-medium">Name</div>
        <input name="name" className="mt-2 w-full border p-3" required />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Email</div>
        <input name="email" type="email" className="mt-2 w-full border p-3" required />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Message</div>
        <textarea name="message" rows={5} className="mt-2 w-full border p-3" required />
      </label>

      <div>
        <button className="px-5 py-3 bg-black text-white">Send message</button>
      </div>

      {status==='sent' && <div className="text-sm text-green-600">Thanks — your message was recorded (placeholder).</div>}
    </form>
  )
}
