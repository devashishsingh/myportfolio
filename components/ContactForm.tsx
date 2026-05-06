"use client"
import { useState } from 'react'

export default function ContactForm(){
  const [status, setStatus] = useState<'idle'|'sent'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  return (
    <form onSubmit={async (e)=>{
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement
      const fd = new FormData(form)
      const payload = {
        name: fd.get('name'),
        email: fd.get('email'),
        message: fd.get('message'),
        _hp: fd.get('_hp'), // honeypot
      }
      try{
        const res = await fetch('/api/contact', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
        if(res.ok) { setStatus('sent'); setErrorMsg('') }
        else {
          const data = await res.json().catch(() => ({}))
          setErrorMsg(data.error || 'Something went wrong.')
          setStatus('error')
        }
      }catch(e){ setStatus('error'); setErrorMsg('Network error. Please try again.') }
    }} className="space-y-4">
      {/* Honeypot — visually hidden, bots fill it, real users don't */}
      <input name="_hp" type="text" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />

      <label className="block">
        <div className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Name</div>
        <input name="name" className="mt-2 w-full p-3" style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text-primary)'}} required maxLength={100} />
      </label>

      <label className="block">
        <div className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Email</div>
        <input name="email" type="email" className="mt-2 w-full p-3" style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text-primary)'}} required maxLength={254} />
      </label>

      <label className="block">
        <div className="text-sm font-medium" style={{color:'var(--text-primary)'}}>Message</div>
        <textarea name="message" rows={5} className="mt-2 w-full p-3" style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text-primary)'}} required minLength={10} maxLength={2000} />
      </label>

      <div>
        <button className="px-5 py-3 btn btn-3d">Send message</button>
      </div>

      {status==='sent' && <div className="text-sm" style={{color:'#6BCB77'}}>Thanks — your message is in. I&apos;ll reply personally within 1–2 working days.</div>}
      {status==='error' && <div className="text-sm" style={{color:'#E74C3C'}}>{errorMsg || 'Something went wrong sending that. Please email me directly at'} {!errorMsg && <a href="mailto:hello@devashishsingh.com" style={{textDecoration:'underline'}}>hello@devashishsingh.com</a>}.</div>}
    </form>
  )
}
