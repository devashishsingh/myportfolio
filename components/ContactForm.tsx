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
        <div className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Name</div>
        <input name="name" className="mt-2 w-full p-3" style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text-primary)'}} required />
      </label>

      <label className="block">
        <div className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Email</div>
        <input name="email" type="email" className="mt-2 w-full p-3" style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text-primary)'}} required />
      </label>

      <label className="block">
        <div className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Message</div>
        <textarea name="message" rows={5} className="mt-2 w-full p-3" style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text-primary)'}} required />
      </label>

      <div>
        <button className="px-5 py-3 btn btn-3d">Send message</button>
      </div>

      {status==='sent' && <div className="text-sm" style={{color:'#6BCB77'}}>Thanks — your message was recorded (placeholder).</div>}
    </form>
  )
}
