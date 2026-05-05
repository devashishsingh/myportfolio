"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const BlogEditor = dynamic(() => import('../../components/editor/BlogEditor'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, color: '#666' }}>
      Loading editor...
    </div>
  ),
})

type Tab = 'dashboard' | 'blog' | 'content' | 'invitations' | 'subscribers' | 'feedback' | 'newsletter' | 'bookings' | 'leads' | 'challenges'

interface Stats {
  totalInvitations: number
  pendingInvitations: number
  approvedMembers: number
  rejectedInvitations: number
  totalSubscribers: number
  totalFeedback: number
  newFeedback: number
  totalBookings: number
  pendingBookings: number
  totalNewsletters: number
}

interface Invitation {
  id: string
  fullName: string
  email: string
  linkedIn?: string
  github?: string
  portfolio?: string
  role: string
  interest: string
  region: string
  whyJoin: string
  contribute: string
  expertise?: string
  status: string
  adminNote?: string
  createdAt: string
}

interface Subscriber {
  id: string
  name: string
  email: string
  region: string
  interests: string
  createdAt: string
}

interface FeedbackItem {
  id: string
  name: string
  email: string
  type: string
  message: string
  page: string | null
  status: string
  adminNote: string | null
  createdAt: string
}

interface NewsletterItem {
  id: string
  subject: string
  content: string
  sentTo: number
  status: string
  sentAt: string | null
  scheduledAt: string | null
  createdAt: string
}

interface BookingItem {
  id: string
  name: string
  email: string
  sessionType: string
  preferredDate: string
  preferredTime: string
  timezone: string
  message: string | null
  status: string
  adminNote: string | null
  createdAt: string
}

interface LeadItem {
  id: string
  name: string
  email: string
  source: string
  sourceId: string | null
  message: string | null
  meta: string | null
  status: string
  adminNote: string | null
  createdAt: string
  updatedAt: string
}

interface LeadStats {
  total: number
  new: number
  acknowledged: number
  responded: number
  closed: number
  today: number
  bySource: { source: string; count: number }[]
}

export default function Admin() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/login')
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'blog', label: 'Blog Editor' },
    { key: 'content', label: 'Content' },
    { key: 'invitations', label: 'Invitations' },
    { key: 'subscribers', label: 'Subscribers' },
    { key: 'feedback', label: 'Feedback' },
    { key: 'newsletter', label: 'Newsletter' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'leads', label: 'ðŸ“Š Leads' },
    { key: 'challenges', label: 'ðŸŽ¯ Challenges' },
  ]

  return (
    <section className="container-wide" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="display-font" style={{ fontSize: 28 }}>Admin Portal</h1>
        <button onClick={logout} className="btn-outline" style={{ fontSize: 13, padding: '6px 14px' }}>Logout</button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`admin-tab ${activeTab === t.key ? 'active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: 24 }}>
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'blog' && <BlogTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'invitations' && <InvitationsTab />}
        {activeTab === 'subscribers' && <SubscribersTab />}
        {activeTab === 'feedback' && <FeedbackTab />}
        {activeTab === 'newsletter' && <NewsletterTab />}
        {activeTab === 'bookings' && <BookingsTab />}
        {activeTab === 'leads' && <LeadsTab />}
        {activeTab === 'challenges' && <ChallengesTab />}
      </div>
    </section>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ DASHBOARD TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [regionData, setRegionData] = useState<{ invitations: { region: string; count: number }[]; subscribers: { region: string; count: number }[] }>({ invitations: [], subscribers: [] })

  useEffect(() => {
    fetch('/api/admin/community')
      .then(r => r.json())
      .then(data => {
        setStats(data.stats)
        setRegionData({
          invitations: data.invitationsByRegion || [],
          subscribers: data.subscribersByRegion || [],
        })
      })
  }, [])

  if (!stats) return <p style={{ color: 'var(--muted)' }}>Loading dashboard...</p>

  const statCards = [
    { label: 'Total Invitations', value: stats.totalInvitations, color: '#000' },
    { label: 'Pending Review', value: stats.pendingInvitations, color: '#f59e0b' },
    { label: 'Approved Members', value: stats.approvedMembers, color: '#16a34a' },
    { label: 'Rejected', value: stats.rejectedInvitations, color: '#dc2626' },
    { label: 'Subscribers', value: stats.totalSubscribers, color: '#0066cc' },
    { label: 'Feedback', value: stats.totalFeedback, color: '#6366f1' },
    { label: 'New Feedback', value: stats.newFeedback, color: '#f59e0b' },
    { label: 'Bookings', value: stats.totalBookings, color: '#8b5cf6' },
    { label: 'Pending Bookings', value: stats.pendingBookings, color: '#f59e0b' },
    { label: 'Newsletters Sent', value: stats.totalNewsletters, color: '#0891b2' },
  ]

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Community Overview</h2>

      {/* Stat Cards */}
      <div className="admin-stat-grid">
        {statCards.map(s => (
          <div key={s.label} className="admin-stat-card">
            <p style={{ fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Region Breakdown */}
      {regionData.invitations.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Invitations by Region</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {regionData.invitations.map(r => (
              <span key={r.region} style={{ padding: '6px 14px', background: '#f5f5f5', borderRadius: 6, fontSize: 13 }}>
                {r.region}: <strong>{r.count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {regionData.subscribers.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Subscribers by Region</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {regionData.subscribers.map(r => (
              <span key={r.region} style={{ padding: '6px 14px', background: '#f5f5f5', borderRadius: 6, fontSize: 13 }}>
                {r.region}: <strong>{r.count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      <EmailHealthPanel />
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ EMAIL HEALTH PANEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
interface EmailDiag {
  configured: boolean
  sender: string
  adminEmail: string
  baseUrl: string
  calendarUrl: string | null
  templates: { key: string; label: string }[]
}

function EmailHealthPanel() {
  const [diag, setDiag] = useState<EmailDiag | null>(null)
  const [recipient, setRecipient] = useState('devashish.singh12@gmail.com')
  const [template, setTemplate] = useState('contactAutoReply')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/test-email')
      .then(r => r.json())
      .then(d => {
        setDiag(d)
      })
      .catch(() => setDiag(null))
  }, [])

  async function send() {
    if (!recipient || !template) return
    setSending(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ recipient, template }),
      })
      const json = await res.json()
      if (res.ok) {
        setResult({ ok: true, message: `${json.delivered ? 'âœ… Sent' : 'â„¹ï¸ Logged only'} â€” "${json.subject}". ${json.note}` })
      } else {
        setResult({ ok: false, message: json.error || 'Failed to send.' })
      }
    } catch (e: any) {
      setResult({ ok: false, message: e?.message || 'Network error.' })
    } finally {
      setSending(false)
    }
  }

  if (!diag) {
    return (
      <div style={{ marginTop: 32, padding: 16, border: '1px solid var(--border)', borderRadius: 8 }}>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Loading email diagnosticsâ€¦</p>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 40, padding: 20, border: '1px solid var(--border)', borderRadius: 10, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Email System Health</h3>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            background: diag.configured ? '#dcfce7' : '#fef3c7',
            color: diag.configured ? '#166534' : '#92400e',
          }}
        >
          {diag.configured ? 'RESEND_API_KEY set' : 'No API key â€” emails log to console only'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, marginBottom: 16, fontSize: 13, color: 'var(--muted)' }}>
        <div><strong style={{ color: 'var(--text-primary)' }}>Sender:</strong> {diag.sender}</div>
        <div><strong style={{ color: 'var(--text-primary)' }}>Admin inbox:</strong> {diag.adminEmail}</div>
        <div><strong style={{ color: 'var(--text-primary)' }}>Base URL:</strong> {diag.baseUrl}</div>
        <div><strong style={{ color: 'var(--text-primary)' }}>Calendar:</strong> {diag.calendarUrl || 'â€” not set â€”'}</div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 220px', minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Template</label>
          <select
            value={template}
            onChange={e => setTemplate(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, background: '#fff' }}
          >
            {diag.templates.map(t => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: '1 1 220px', minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Recipient</label>
          <input
            type="email"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14 }}
          />
        </div>
        <button
          onClick={send}
          disabled={sending || !recipient}
          style={{
            padding: '9px 18px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: sending ? 'wait' : 'pointer',
            opacity: sending || !recipient ? 0.6 : 1,
          }}
        >
          {sending ? 'Sendingâ€¦' : 'Send Test Email'}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: 14,
            padding: '10px 14px',
            borderRadius: 6,
            fontSize: 13,
            background: result.ok ? '#f0fdf4' : '#fef2f2',
            color: result.ok ? '#166534' : '#991b1b',
            border: `1px solid ${result.ok ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          {result.message}
        </div>
      )}

      <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
        Tip: run each template at least once after adding <code>RESEND_API_KEY</code>. If &ldquo;configured&rdquo; is false, fix <code>.env.local</code> (or Vercel project env) and restart the dev server.
      </p>
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ BLOG EDITOR TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function BlogTab() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('Devashish Singh')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [featured, setFeatured] = useState(false)
  const [editorHtml, setEditorHtml] = useState('')
  const [editorKey, setEditorKey] = useState(0)
  const [status, setStatus] = useState('')
  const [publishedSlug, setPublishedSlug] = useState('')

  async function htmlToMarkdown(html: string): Promise<string> {
    const TurndownService = (await import('turndown')).default
    const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' })
    td.addRule('youtube-embed', {
      filter: (node: any) => node.nodeName === 'DIV' && !!node.getAttribute?.('data-youtube-video'),
      replacement: (_content: any, node: any) => {
        const iframe = node.querySelector?.('iframe')
        const src = iframe?.getAttribute('src') || ''
        const match = src.match(/youtube\.com\/embed\/([^?&]+)/)
        return match ? `\n\n<YouTube url="https://www.youtube.com/watch?v=${match[1]}" />\n\n` : ''
      },
    })
    return td.turndown(html).trim()
  }

  async function publish(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !editorHtml) { setStatus('Title and content are required.'); return }
    setStatus('Publishing...')
    try {
      const markdown = await htmlToMarkdown(editorHtml)
      const res = await fetch('/api/admin/create-post', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title, slug: slug || undefined, description, author, category,
          tags: tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
          featured, content: markdown,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setStatus('Published successfully!')
        setPublishedSlug(json.slug || '')
      } else {
        setStatus('Error: ' + (json.error || res.statusText))
      }
    } catch {
      setStatus('Error publishing post.')
    }
  }

  function clearForm() {
    setTitle(''); setSlug(''); setDescription(''); setAuthor('Devashish Singh')
    setCategory(''); setTags(''); setFeatured(false); setEditorHtml('')
    setStatus(''); setPublishedSlug(''); setEditorKey(k => k + 1)
  }

  const tagList = tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const postUrl = publishedSlug ? `${baseUrl}/blog/${publishedSlug}` : ''
  const linkedInUrl = postUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` : ''

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Blog Editor</h2>
      <form onSubmit={publish}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="editor-label">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="editor-input" placeholder="Your blog post title" required />
          </div>
          <div>
            <label className="editor-label">Slug <span style={{ color: '#666', fontWeight: 400 }}>(auto if empty)</span></label>
            <input value={slug} onChange={e => setSlug(e.target.value)} className="editor-input" placeholder="my-blog-post" />
          </div>
          <div>
            <label className="editor-label">Author</label>
            <input value={author} onChange={e => setAuthor(e.target.value)} className="editor-input" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="editor-label">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="editor-input" placeholder="Brief description for SEO and social sharing" />
          </div>
          <div>
            <label className="editor-label">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="editor-input" placeholder="e.g. Cybersecurity" />
          </div>
          <div>
            <label className="editor-label">Tags <span style={{ color: '#666', fontWeight: 400 }}>(comma separated)</span></label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="editor-input" placeholder="dmarc, email, security" />
            {tagList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {tagList.map(t => <span key={t} style={{ padding: '3px 10px', background: '#f1f1f1', borderRadius: 999, fontSize: 12, color: '#555' }}>#{t}</span>)}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8 }}>
            <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#000' }} />
            <label htmlFor="featured" style={{ fontSize: 14, cursor: 'pointer' }}>Featured Post</label>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label className="editor-label" style={{ marginBottom: 8 }}>Content</label>
          <BlogEditor key={editorKey} content="" onChange={setEditorHtml} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <button type="submit" className="btn btn-3d">Publish</button>
          <button type="button" onClick={clearForm} className="btn-outline">Clear</button>
          {publishedSlug && (
            <>
              <a href={postUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>View Post â†’</a>
              <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="btn btn-3d" style={{ background: '#0A66C2', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Share on LinkedIn
              </a>
            </>
          )}
        </div>
      </form>
      {status && (
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 6, fontSize: 14,
          background: status.includes('Error') || status.includes('required') ? '#fef2f2' : status.includes('success') ? '#f0fdf4' : '#f8f9fa',
          color: status.includes('Error') || status.includes('required') ? '#dc2626' : status.includes('success') ? '#16a34a' : '#666',
        }}>
          {status}
        </div>
      )}
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ CONTENT TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
interface ProfileData {
  name: string
  role: string
  summary: string
  teachingLinks: { title: string; url?: string; note?: string }[]
  courses: { title: string; provider: string; year?: string }[]
  experience: { title: string; company: string; dates: string; summary: string }[]
  certifications: string[]
  education: string[]
}

interface ProjectItem {
  title: string
  category: string
  excerpt: string
  tech: string[]
  href: string
}

function ContentTab() {
  const [activeSection, setActiveSection] = useState<'profile' | 'projects'>('profile')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const loadContent = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/content')
      const data = await res.json()
      setProfile(data.profile)
      setProjects(data.projects)
    } catch { setMsg('Failed to load content') }
    setLoading(false)
  }, [])

  useEffect(() => { loadContent() }, [loadContent])

  async function saveProfile() {
    if (!profile) return
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'profile', data: profile }),
      })
      if (res.ok) setMsg('Profile saved!'); else setMsg('Error saving profile')
    } catch { setMsg('Error saving profile') }
    setSaving(false)
  }

  async function saveProjects() {
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'projects', data: projects }),
      })
      if (res.ok) setMsg('Projects saved!'); else setMsg('Error saving projects')
    } catch { setMsg('Error saving projects') }
    setSaving(false)
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading content...</p>

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['profile', 'projects'] as const).map(s => (
          <button key={s} onClick={() => { setActiveSection(s); setMsg('') }}
            className={`admin-filter-btn ${activeSection === s ? 'active' : ''}`}>
            {s === 'profile' ? 'About / Profile' : 'Work / Projects'}
          </button>
        ))}
      </div>

      {msg && <div style={{ padding: '10px 14px', background: msg.includes('Error') ? '#fee2e2' : '#dcfce7', borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 16, color: msg.includes('Error') ? '#991b1b' : '#166534' }}>{msg}</div>}

      {activeSection === 'profile' && profile && (
        <div style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Edit Profile / About Page</h2>

          <div style={{ marginBottom: 16 }}>
            <label className="editor-label">Name</label>
            <input className="editor-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="editor-label">Role</label>
            <input className="editor-input" value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="editor-label">Summary</label>
            <textarea className="editor-input" rows={4} value={profile.summary} onChange={e => setProfile({ ...profile, summary: e.target.value })} />
          </div>

          {/* Experience */}
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 28, marginBottom: 12 }}>Experience</h3>
          {profile.experience.map((exp, i) => (
            <div key={i} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
                <div><label className="editor-label">Title</label><input className="editor-input" value={exp.title} onChange={e => { const u = [...profile.experience]; u[i] = { ...u[i], title: e.target.value }; setProfile({ ...profile, experience: u }) }} /></div>
                <div><label className="editor-label">Company</label><input className="editor-input" value={exp.company} onChange={e => { const u = [...profile.experience]; u[i] = { ...u[i], company: e.target.value }; setProfile({ ...profile, experience: u }) }} /></div>
              </div>
              <div style={{ marginBottom: 8 }}><label className="editor-label">Dates</label><input className="editor-input" value={exp.dates} onChange={e => { const u = [...profile.experience]; u[i] = { ...u[i], dates: e.target.value }; setProfile({ ...profile, experience: u }) }} /></div>
              <div style={{ marginBottom: 8 }}><label className="editor-label">Summary</label><textarea className="editor-input" rows={2} value={exp.summary} onChange={e => { const u = [...profile.experience]; u[i] = { ...u[i], summary: e.target.value }; setProfile({ ...profile, experience: u }) }} /></div>
              <button onClick={() => { const u = profile.experience.filter((_, j) => j !== i); setProfile({ ...profile, experience: u }) }} style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
          <button onClick={() => setProfile({ ...profile, experience: [...profile.experience, { title: '', company: '', dates: '', summary: '' }] })} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>+ Add Experience</button>

          {/* Courses */}
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 28, marginBottom: 12 }}>Courses</h3>
          {profile.courses.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <input className="editor-input" placeholder="Title" value={c.title} onChange={e => { const u = [...profile.courses]; u[i] = { ...u[i], title: e.target.value }; setProfile({ ...profile, courses: u }) }} />
              <input className="editor-input" placeholder="Provider" value={c.provider} style={{ maxWidth: 200 }} onChange={e => { const u = [...profile.courses]; u[i] = { ...u[i], provider: e.target.value }; setProfile({ ...profile, courses: u }) }} />
              <input className="editor-input" placeholder="Year" value={c.year || ''} style={{ maxWidth: 100 }} onChange={e => { const u = [...profile.courses]; u[i] = { ...u[i], year: e.target.value }; setProfile({ ...profile, courses: u }) }} />
              <button onClick={() => { const u = profile.courses.filter((_, j) => j !== i); setProfile({ ...profile, courses: u }) }} style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>âœ•</button>
            </div>
          ))}
          <button onClick={() => setProfile({ ...profile, courses: [...profile.courses, { title: '', provider: '', year: '' }] })} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>+ Add Course</button>

          {/* Certifications */}
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 28, marginBottom: 12 }}>Certifications</h3>
          {profile.certifications.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input className="editor-input" value={c} onChange={e => { const u = [...profile.certifications]; u[i] = e.target.value; setProfile({ ...profile, certifications: u }) }} />
              <button onClick={() => setProfile({ ...profile, certifications: profile.certifications.filter((_, j) => j !== i) })} style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>âœ•</button>
            </div>
          ))}
          <button onClick={() => setProfile({ ...profile, certifications: [...profile.certifications, ''] })} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>+ Add Certification</button>

          {/* Education */}
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 28, marginBottom: 12 }}>Education</h3>
          {profile.education.map((ed, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input className="editor-input" value={ed} onChange={e => { const u = [...profile.education]; u[i] = e.target.value; setProfile({ ...profile, education: u }) }} />
              <button onClick={() => setProfile({ ...profile, education: profile.education.filter((_, j) => j !== i) })} style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>âœ•</button>
            </div>
          ))}
          <button onClick={() => setProfile({ ...profile, education: [...profile.education, ''] })} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>+ Add Education</button>

          <div style={{ marginTop: 32 }}>
            <button onClick={saveProfile} disabled={saving} className="btn" style={{ fontSize: 14, padding: '12px 28px' }}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      )}

      {activeSection === 'projects' && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>Edit Projects ({projects.length})</h2>
            <button onClick={() => setProjects([...projects, { title: '', category: '', excerpt: '', tech: [], href: '' }])} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>+ Add Project</button>
          </div>

          {projects.map((p, i) => (
            <div key={i} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><label className="editor-label">Title</label><input className="editor-input" value={p.title} onChange={e => { const u = [...projects]; u[i] = { ...u[i], title: e.target.value }; setProjects(u) }} /></div>
                <div><label className="editor-label">Category</label><input className="editor-input" value={p.category} onChange={e => { const u = [...projects]; u[i] = { ...u[i], category: e.target.value }; setProjects(u) }} /></div>
              </div>
              <div style={{ marginBottom: 12 }}><label className="editor-label">Excerpt</label><textarea className="editor-input" rows={2} value={p.excerpt} onChange={e => { const u = [...projects]; u[i] = { ...u[i], excerpt: e.target.value }; setProjects(u) }} /></div>
              <div style={{ marginBottom: 12 }}><label className="editor-label">Link (href)</label><input className="editor-input" value={p.href} onChange={e => { const u = [...projects]; u[i] = { ...u[i], href: e.target.value }; setProjects(u) }} /></div>
              <div style={{ marginBottom: 12 }}><label className="editor-label">Tech (comma separated)</label><input className="editor-input" value={p.tech.join(', ')} onChange={e => { const u = [...projects]; u[i] = { ...u[i], tech: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }; setProjects(u) }} /></div>
              <div style={{ display: 'flex', gap: 8 }}>
                {i > 0 && <button onClick={() => { const u = [...projects]; [u[i-1], u[i]] = [u[i], u[i-1]]; setProjects(u) }} style={{ fontSize: 12, color: '#555', background: 'none', border: '1px solid #ddd', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>â†‘ Move Up</button>}
                {i < projects.length - 1 && <button onClick={() => { const u = [...projects]; [u[i], u[i+1]] = [u[i+1], u[i]]; setProjects(u) }} style={{ fontSize: 12, color: '#555', background: 'none', border: '1px solid #ddd', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>â†“ Move Down</button>}
                <button onClick={() => { if (confirm('Remove this project?')) setProjects(projects.filter((_, j) => j !== i)) }} style={{ fontSize: 12, color: '#dc2626', background: 'none', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', marginLeft: 'auto' }}>Remove</button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24 }}>
            <button onClick={saveProjects} disabled={saving} className="btn" style={{ fontSize: 14, padding: '12px 28px' }}>
              {saving ? 'Saving...' : 'Save Projects'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ INVITATIONS TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function InvitationsTab() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Invite via email state
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [inviteStatus, setInviteStatus] = useState('')
  const [inviteSending, setInviteSending] = useState(false)

  const loadInvitations = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/community?type=invitations')
    const data = await res.json()
    setInvitations(data.invitations || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadInvitations() }, [loadInvitations])

  async function sendEmailInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteName || !inviteEmail) return
    setInviteSending(true)
    setInviteStatus('')
    try {
      const res = await fetch('/api/admin/send-invite', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: inviteName, email: inviteEmail, message: inviteMessage || undefined }),
      })
      const data = await res.json()
      if (res.ok) {
        setInviteStatus(data.method === 'sent' ? 'Invitation sent successfully!' : 'Invitation logged (email not configured).')
        setInviteName(''); setInviteEmail(''); setInviteMessage('')
      } else {
        setInviteStatus('Error: ' + (data.error || 'Failed to send.'))
      }
    } catch {
      setInviteStatus('Error: Failed to send invitation.')
    }
    setInviteSending(false)
  }

  async function updateStatus(id: string, status: string, adminNote?: string) {
    // Optimistic update
    const prev = invitations
    setInvitations(invitations.map(i => i.id === id ? { ...i, status, ...(adminNote ? { adminNote } : {}) } : i))
    setActionLoading(id)

    try {
      const res = await fetch('/api/admin/community', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, status, adminNote }),
      })
      if (!res.ok) throw new Error('Update failed')

      // Server-side onboarding orchestration runs inside the PATCH handler
      // when status === 'approved' (auto-subscribe, founder #, badge, email).
      // No client-side follow-up needed.
    } catch {
      setInvitations(prev) // rollback
    } finally {
      setActionLoading(null)
    }
  }

  async function deleteInvitation(id: string) {
    // Optimistic remove
    const prev = invitations
    setInvitations(invitations.filter(i => i.id !== id))
    try {
      const res = await fetch(`/api/admin/community?id=${id}&type=invitation`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
    } catch {
      setInvitations(prev) // rollback
    }
  }

  const filtered = filter === 'all' ? invitations : invitations.filter(i => i.status === filter)
  const counts = {
    all: invitations.length,
    pending: invitations.filter(i => i.status === 'pending').length,
    approved: invitations.filter(i => i.status === 'approved').length,
    rejected: invitations.filter(i => i.status === 'rejected').length,
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading invitations...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Invitation Requests</h2>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="btn btn-3d"
          style={{ fontSize: 13, padding: '8px 18px' }}
        >
          {showInviteForm ? 'Close' : '+ Invite via Email'}
        </button>
      </div>

      {/* Invite via Email Form */}
      {showInviteForm && (
        <div style={{ marginBottom: 24, padding: 20, background: '#fafafa', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Send Invitation Email</h3>
          <form onSubmit={sendEmailInvite}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label className="editor-label">Name</label>
                <input
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="editor-input"
                  placeholder="Recipient's name"
                  required
                />
              </div>
              <div>
                <label className="editor-label">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="editor-input"
                  placeholder="recipient@example.com"
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="editor-label">Personal Message <span style={{ color: '#666', fontWeight: 400 }}>(optional â€” leave empty for default invite)</span></label>
              <textarea
                value={inviteMessage}
                onChange={e => setInviteMessage(e.target.value)}
                className="editor-input"
                placeholder="Add a personal note to the invitation..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button type="submit" disabled={inviteSending} className="btn btn-3d" style={{ fontSize: 13, padding: '8px 20px' }}>
                {inviteSending ? 'Sending...' : 'Send Invite'}
              </button>
              {inviteStatus && (
                <span style={{
                  fontSize: 13,
                  color: inviteStatus.includes('Error') ? '#dc2626' : '#16a34a',
                }}>
                  {inviteStatus}
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No {filter === 'all' ? '' : filter} invitation requests yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(inv => (
            <div key={inv.id} className="admin-invitation-card">
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <strong style={{ fontSize: 15 }}>{inv.fullName}</strong>
                    <span className={`admin-status-badge status-${inv.status}`}>{inv.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {inv.role} Â· {inv.interest} Â· {inv.region}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--muted-2)' }}>
                    {inv.email} Â· {new Date(inv.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', padding: '4px 8px' }}
                >
                  {expandedId === inv.id ? 'Collapse â–²' : 'Details â–¼'}
                </button>
              </div>

              {/* Expanded details */}
              {expandedId === inv.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, marginBottom: 16 }}>
                    {inv.linkedIn && <p><strong>LinkedIn:</strong> <a href={inv.linkedIn} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>{inv.linkedIn}</a></p>}
                    {inv.github && <p><strong>GitHub:</strong> <a href={inv.github} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>{inv.github}</a></p>}
                    {inv.portfolio && <p><strong>Portfolio:</strong> <a href={inv.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>{inv.portfolio}</a></p>}
                    {inv.expertise && <p style={{ gridColumn: '1 / -1' }}><strong>Expertise:</strong> {inv.expertise}</p>}
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 12 }}>
                    <p style={{ marginBottom: 8 }}><strong>Why join:</strong> {inv.whyJoin}</p>
                    <p><strong>Wants to contribute:</strong> {inv.contribute}</p>
                  </div>
                  {inv.adminNote && (
                    <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 12 }}>
                      Admin note: {inv.adminNote}
                    </p>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {inv.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(inv.id, 'approved')}
                        disabled={actionLoading === inv.id}
                        className="btn" style={{ fontSize: 12, padding: '6px 14px', background: '#16a34a' }}
                      >
                        Approve
                      </button>
                    )}
                    {inv.status !== 'rejected' && (
                      <button
                        onClick={() => {
                          const note = prompt('Rejection note (optional):')
                          updateStatus(inv.id, 'rejected', note || undefined)
                        }}
                        disabled={actionLoading === inv.id}
                        className="btn" style={{ fontSize: 12, padding: '6px 14px', background: '#dc2626' }}
                      >
                        Reject
                      </button>
                    )}
                    {inv.status !== 'pending' && (
                      <button
                        onClick={() => updateStatus(inv.id, 'pending')}
                        disabled={actionLoading === inv.id}
                        className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}
                      >
                        Reset to Pending
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirmDeleteId === inv.id) {
                          setConfirmDeleteId(null)
                          deleteInvitation(inv.id)
                        } else {
                          setConfirmDeleteId(inv.id)
                          setTimeout(() => setConfirmDeleteId(c => c === inv.id ? null : c), 3000)
                        }
                      }}
                      disabled={actionLoading === inv.id}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#dc2626', padding: '6px 8px', fontWeight: confirmDeleteId === inv.id ? 700 : 400 }}
                    >
                      {confirmDeleteId === inv.id ? 'Click again to confirm' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ SUBSCRIBERS TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  const loadSubscribers = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/community?type=subscribers')
    const data = await res.json()
    setSubscribers(data.subscribers || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadSubscribers() }, [loadSubscribers])

  async function deleteSubscriber(id: string) {
    const prev = subscribers
    setSubscribers(subscribers.filter(s => s.id !== id))
    try {
      const res = await fetch(`/api/admin/community?id=${id}&type=subscriber`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
    } catch {
      setSubscribers(prev)
    }
  }

  function exportCSV() {
    const header = 'Name,Email,Region,Interests,Date\n'
    const rows = subscribers.map(s =>
      `"${s.name}","${s.email}","${s.region}","${s.interests}","${new Date(s.createdAt).toLocaleDateString()}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading subscribers...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Subscribers ({subscribers.length})</h2>
        {subscribers.length > 0 && (
          <button onClick={exportCSV} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>
            Export CSV
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No subscribers yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Region</th>
                <th>Interests</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 500 }}>{sub.name}</td>
                  <td>{sub.email}</td>
                  <td>{sub.region}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {sub.interests.split(',').map(i => (
                        <span key={i.trim()} style={{ padding: '2px 8px', background: '#f5f5f5', borderRadius: 999, fontSize: 11 }}>
                          {i.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => deleteSubscriber(sub.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#dc2626' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ FEEDBACK TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function FeedbackTab() {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'resolved'>('all')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadFeedback = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/community?type=feedback')
    const data = await res.json()
    setItems(data.feedback || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadFeedback() }, [loadFeedback])

  async function updateStatus(id: string, status: string) {
    setActionLoading(id)
    await fetch('/api/admin/community', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status, type: 'feedback' }),
    })
    await loadFeedback()
    setActionLoading(null)
  }

  async function deleteFeedback(id: string) {
    if (!confirm('Delete this feedback?')) return
    setActionLoading(id)
    await fetch(`/api/admin/community?id=${id}&type=feedback`, { method: 'DELETE' })
    await loadFeedback()
    setActionLoading(null)
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)
  const counts = {
    all: items.length,
    new: items.filter(i => i.status === 'new').length,
    reviewed: items.filter(i => i.status === 'reviewed').length,
    resolved: items.filter(i => i.status === 'resolved').length,
  }

  const typeIcons: Record<string, string> = { bug: 'ðŸ›', suggestion: 'ðŸ’¡', praise: 'ðŸŽ‰', other: 'ðŸ’¬' }
  const typeColors: Record<string, string> = { bug: '#ef4444', suggestion: '#f59e0b', praise: '#16a34a', other: '#6366f1' }

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading feedback...</p>

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Feedback &amp; Suggestions</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'new', 'reviewed', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No {filter === 'all' ? '' : filter} feedback yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(fb => (
            <div key={fb.id} className="admin-invitation-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>{typeIcons[fb.type] || 'ðŸ’¬'}</span>
                    <strong style={{ fontSize: 15 }}>{fb.name}</strong>
                    <span style={{
                      padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: `${typeColors[fb.type] || '#666'}15`,
                      color: typeColors[fb.type] || '#666',
                    }}>
                      {fb.type}
                    </span>
                    <span className={`admin-status-badge status-${fb.status === 'new' ? 'pending' : fb.status === 'resolved' ? 'approved' : 'rejected'}`}>
                      {fb.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted-2)' }}>
                    {fb.email} Â· {fb.page || 'General'} Â· {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 12, padding: '12px 16px', background: '#fafafa', borderRadius: 8, fontSize: 14, lineHeight: 1.6 }}>
                {fb.message}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                {fb.status !== 'reviewed' && (
                  <button
                    onClick={() => updateStatus(fb.id, 'reviewed')}
                    disabled={actionLoading === fb.id}
                    className="btn-outline" style={{ fontSize: 12, padding: '5px 12px' }}
                  >
                    Mark Reviewed
                  </button>
                )}
                {fb.status !== 'resolved' && (
                  <button
                    onClick={() => updateStatus(fb.id, 'resolved')}
                    disabled={actionLoading === fb.id}
                    className="btn" style={{ fontSize: 12, padding: '5px 12px', background: '#16a34a' }}
                  >
                    Resolve
                  </button>
                )}
                {fb.status !== 'new' && (
                  <button
                    onClick={() => updateStatus(fb.id, 'new')}
                    disabled={actionLoading === fb.id}
                    className="btn-outline" style={{ fontSize: 12, padding: '5px 12px' }}
                  >
                    Reopen
                  </button>
                )}
                <button
                  onClick={() => deleteFeedback(fb.id)}
                  disabled={actionLoading === fb.id}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#dc2626', padding: '5px 8px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ NEWSLETTER TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function NewsletterTab() {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([])
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const loadNewsletters = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/newsletter')
    const data = await res.json()
    setNewsletters(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { loadNewsletters() }, [loadNewsletters])

  async function handleSend(mode: 'send' | 'draft' | 'schedule') {
    if (!subject || !content) { setStatusMsg('Subject and content are required.'); return }
    setSending(true)
    setStatusMsg('')
    try {
      const body =
        mode === 'send'     ? { subject, content, send: true } :
        mode === 'schedule' ? { subject, content, schedule: true } :
                              { subject, content, send: false }
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        if (mode === 'send')     setStatusMsg(`Sent to ${data.sentTo} subscribers.`)
        if (mode === 'draft')    setStatusMsg('Saved as draft.')
        if (mode === 'schedule') setStatusMsg(`Scheduled for ${new Date(data.scheduledAt).toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at 8:00 AM MYT.`)
        setSubject('')
        setContent('')
        await loadNewsletters()
      } else {
        setStatusMsg('Error: ' + (data.error || 'Failed'))
      }
    } catch {
      setStatusMsg('Error sending newsletter.')
    }
    setSending(false)
  }

  async function deleteNewsletter(id: string) {
    if (!confirm('Delete this newsletter?')) return
    await fetch('/api/admin/newsletter', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await loadNewsletters()
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Newsletter</h2>

      {/* Compose */}
      <div style={{ marginBottom: 32, padding: 24, border: '1px solid #e5e5e5', borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Compose Newsletter</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            placeholder="Subject line"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="admin-input"
          />
          <textarea
            placeholder="Newsletter content (HTML supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="admin-input"
            rows={10}
            style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSend('send')}
              disabled={sending}
              className="btn"
              style={{ fontSize: 13, padding: '8px 20px' }}
            >
              {sending ? 'Sending...' : 'Send Now'}
            </button>
            <button
              onClick={() => handleSend('schedule')}
              disabled={sending}
              className="btn"
              style={{ fontSize: 13, padding: '8px 20px', background: '#0891b2' }}
            >
              {sending ? 'Scheduling...' : 'â° Schedule â€” Next Monday 8 AM MYT'}
            </button>
            <button
              onClick={() => handleSend('draft')}
              disabled={sending}
              className="btn-outline"
              style={{ fontSize: 13, padding: '8px 20px' }}
            >
              Save as Draft
            </button>
          </div>
          {statusMsg && <p style={{ fontSize: 13, color: statusMsg.startsWith('Error') ? '#dc2626' : '#16a34a', margin: 0 }}>{statusMsg}</p>}
        </div>
      </div>

      {/* History */}
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Sent & Drafts</h3>
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      ) : newsletters.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No newsletters yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {newsletters.map(nl => (
            <div key={nl.id} className="admin-invitation-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <strong style={{ fontSize: 15 }}>{nl.subject}</strong>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                    {nl.status === 'sent'
                      ? `Sent to ${nl.sentTo} subscribers on ${new Date(nl.sentAt || nl.createdAt).toLocaleDateString()}`
                      : nl.status === 'scheduled' && nl.scheduledAt
                      ? `Scheduled for ${new Date(nl.scheduledAt).toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at 8:00 AM MYT`
                      : `Draft â€” ${new Date(nl.createdAt).toLocaleDateString()}`
                    }
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: nl.status === 'sent' ? '#dcfce7' : nl.status === 'scheduled' ? '#dbeafe' : '#fef3c7',
                    color: nl.status === 'sent' ? '#16a34a' : nl.status === 'scheduled' ? '#1d4ed8' : '#f59e0b',
                  }}>
                    {nl.status}
                  </span>
                  <button
                    onClick={() => deleteNewsletter(nl.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#dc2626' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ BOOKINGS TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function BookingsTab() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadBookings = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/bookings')
    const data = await res.json()
    setBookings(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { loadBookings() }, [loadBookings])

  async function updateStatus(id: string, status: string) {
    setActionLoading(id)
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await loadBookings()
    setActionLoading(null)
  }

  async function deleteBooking(id: string) {
    if (!confirm('Delete this booking?')) return
    setActionLoading(id)
    await fetch('/api/admin/bookings', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await loadBookings()
    setActionLoading(null)
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }

  const sessionLabels: Record<string, string> = {
    mentorship: 'ðŸŽ¯ Mentorship',
    consulting: 'ðŸ’¼ Consulting',
    workshop: 'ðŸ“š Workshop',
    other: 'ðŸ’¬ Other',
  }

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    confirmed: '#16a34a',
    cancelled: '#dc2626',
    completed: '#6366f1',
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading bookings...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Session Bookings ({bookings.length})</h2>
        <a href="/book-session" target="_blank" className="btn-outline" style={{ fontSize: 12, padding: '6px 14px', textDecoration: 'none' }}>
          View Booking Page â†—
        </a>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No {filter === 'all' ? '' : filter} bookings yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(bk => (
            <div key={bk.id} className="admin-invitation-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>{sessionLabels[bk.sessionType]?.split(' ')[0] || 'ðŸ’¬'}</span>
                    <strong style={{ fontSize: 15 }}>{bk.name}</strong>
                    <span style={{
                      padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: `${statusColors[bk.status] || '#666'}15`,
                      color: statusColors[bk.status] || '#666',
                    }}>
                      {bk.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0' }}>
                    {bk.email} Â· {sessionLabels[bk.sessionType]?.split(' ').slice(1).join(' ') || bk.sessionType}
                  </p>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{bk.preferredDate} at {bk.preferredTime}</p>
                  <p style={{ margin: '2px 0 0', color: 'var(--muted)', fontSize: 12 }}>{bk.timezone.replace('_', ' ')}</p>
                </div>
              </div>

              {bk.message && (
                <div style={{ marginTop: 12, padding: '12px 16px', background: '#fafafa', borderRadius: 8, fontSize: 14, lineHeight: 1.6 }}>
                  {bk.message}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                {bk.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(bk.id, 'confirmed')}
                    disabled={actionLoading === bk.id}
                    className="btn" style={{ fontSize: 12, padding: '5px 12px', background: '#16a34a' }}
                  >
                    Confirm
                  </button>
                )}
                {(bk.status === 'pending' || bk.status === 'confirmed') && (
                  <button
                    onClick={() => updateStatus(bk.id, 'cancelled')}
                    disabled={actionLoading === bk.id}
                    className="btn-outline" style={{ fontSize: 12, padding: '5px 12px', color: '#dc2626', borderColor: '#dc2626' }}
                  >
                    Cancel
                  </button>
                )}
                {bk.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(bk.id, 'completed')}
                    disabled={actionLoading === bk.id}
                    className="btn-outline" style={{ fontSize: 12, padding: '5px 12px' }}
                  >
                    Mark Completed
                  </button>
                )}
                <button
                  onClick={() => deleteBooking(bk.id)}
                  disabled={actionLoading === bk.id}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#dc2626', padding: '5px 8px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ LEADS TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function LeadsTab() {
  const [leads, setLeads] = useState<LeadItem[]>([])
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'acknowledged' | 'responded' | 'closed' | 'today'>('all')
  const [source, setSource] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState<{ id: string; note: string } | null>(null)

  const loadLeads = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('filter', filter)
    if (source !== 'all') params.set('source', source)
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/leads?${params}`)
    const data = await res.json()
    setLeads(data.leads || [])
    setStats(data.stats || null)
    setLoading(false)
  }, [filter, source, search])

  useEffect(() => { loadLeads() }, [loadLeads])

  async function updateLead(id: string, status: string) {
    setActionLoading(id)
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await loadLeads()
    setActionLoading(null)
  }

  async function saveNote(id: string, adminNote: string) {
    setActionLoading(id)
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, adminNote }),
    })
    setEditNote(null)
    await loadLeads()
    setActionLoading(null)
  }

  async function deleteLead(id: string) {
    if (!confirm('Delete this lead?')) return
    setActionLoading(id)
    await fetch('/api/admin/leads', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await loadLeads()
    setActionLoading(null)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
  }

  function exportCSV() {
    const params = new URLSearchParams()
    params.set('format', 'csv')
    if (filter !== 'all') params.set('filter', filter)
    if (source !== 'all') params.set('source', source)
    if (search) params.set('search', search)
    window.open(`/api/admin/leads?${params}`, '_blank')
  }

  const sourceLabels: Record<string, string> = {
    contact: 'âœ‰ï¸ Contact',
    booking: 'ðŸ“… Booking',
    feedback: 'ðŸ’¬ Feedback',
    community_invite: 'ðŸ¤ Community Join',
    community_subscribe: 'ðŸ“¬ Subscribe',
  }

  const statusColors: Record<string, string> = {
    new: '#f59e0b',
    acknowledged: '#3b82f6',
    responded: '#16a34a',
    closed: '#6b7280',
  }

  const filterTabs = [
    { key: 'all', label: 'All', count: stats?.total || 0 },
    { key: 'new', label: 'New', count: stats?.new || 0 },
    { key: 'today', label: 'Today', count: stats?.today || 0 },
    { key: 'acknowledged', label: 'Acknowledged', count: stats?.acknowledged || 0 },
    { key: 'responded', label: 'Responded', count: stats?.responded || 0 },
    { key: 'closed', label: 'Closed', count: stats?.closed || 0 },
  ]

  if (loading && !stats) return <p style={{ color: 'var(--muted)' }}>Loading leads...</p>

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Lead Management</h2>
        <button onClick={exportCSV} className="btn" style={{ fontSize: 12, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="admin-stat-grid" style={{ marginBottom: 20 }}>
          {stats.bySource.map(s => (
            <div key={s.source} className="admin-stat-card">
              <p style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{s.count}</p>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{sourceLabels[s.source] || s.source}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {filterTabs.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`admin-filter-btn ${filter === f.key ? 'active' : ''}`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Source filter + search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          aria-label="Filter by source"
          value={source}
          onChange={e => setSource(e.target.value)}
          style={{
            padding: '7px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)',
            fontSize: 13, background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="all">All Sources</option>
          <option value="contact">âœ‰ï¸ Contact</option>
          <option value="booking">ðŸ“… Booking</option>
          <option value="feedback">ðŸ’¬ Feedback</option>
          <option value="community_invite">ðŸ¤ Community Join</option>
          <option value="community_subscribe">ðŸ“¬ Subscribe</option>
        </select>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search name, email, message..."
            style={{
              padding: '7px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)',
              fontSize: 13, width: 260,
            }}
          />
          <button type="submit" className="btn" style={{ fontSize: 12, padding: '6px 12px' }}>Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchInput('') }} className="btn-outline" style={{ fontSize: 12, padding: '6px 12px' }}>
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Leads list */}
      {leads.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14, padding: '20px 0' }}>
          No {filter === 'all' ? '' : filter} leads{source !== 'all' ? ` from ${sourceLabels[source] || source}` : ''}{search ? ` matching "${search}"` : ''}.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
          {leads.map(lead => {
            const isExpanded = expandedId === lead.id
            const meta = lead.meta ? JSON.parse(lead.meta) : null
            const isEditing = editNote?.id === lead.id

            return (
              <div key={lead.id} className="admin-invitation-card">
                {/* Top row */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, cursor: 'pointer', flexWrap: 'wrap' }}
                  onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16 }}>{sourceLabels[lead.source]?.charAt(0) || 'ðŸ“‹'}</span>
                      <strong style={{ fontSize: 15 }}>{lead.name}</strong>
                      <span style={{
                        padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: `${statusColors[lead.status] || '#666'}18`,
                        color: statusColors[lead.status] || '#666',
                      }}>
                        {lead.status}
                      </span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 500,
                        background: '#f3f4f6', color: '#6b7280',
                      }}>
                        {sourceLabels[lead.source] || lead.source}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                      {lead.email} Â· {new Date(lead.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, marginTop: 4 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    {/* Message */}
                    {lead.message && (
                      <div style={{ padding: '12px 16px', background: '#fafafa', borderRadius: 8, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                        {lead.message}
                      </div>
                    )}

                    {/* Meta data */}
                    {meta && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        {Object.entries(meta).map(([k, v]) => (
                          <span key={k} style={{
                            padding: '3px 10px', borderRadius: 6, fontSize: 12,
                            background: '#f0f4ff', color: '#4b5563',
                          }}>
                            <strong>{k}:</strong> {String(v)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Admin note */}
                    {lead.adminNote && !isEditing && (
                      <div style={{ padding: '10px 14px', background: '#fffbeb', borderRadius: 8, fontSize: 13, marginBottom: 12, border: '1px solid #fde68a' }}>
                        <strong>Note:</strong> {lead.adminNote}
                      </div>
                    )}

                    {/* Note editor */}
                    {isEditing && (
                      <div style={{ marginBottom: 12 }}>
                        <textarea
                          value={editNote.note}
                          onChange={e => setEditNote({ ...editNote, note: e.target.value })}
                          rows={3}
                          placeholder="Add your note..."
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)',
                            fontSize: 13, resize: 'vertical', fontFamily: 'inherit',
                          }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button
                            onClick={() => saveNote(lead.id, editNote.note)}
                            disabled={actionLoading === lead.id}
                            className="btn" style={{ fontSize: 12, padding: '5px 14px' }}
                          >
                            Save Note
                          </button>
                          <button onClick={() => setEditNote(null)} className="btn-outline" style={{ fontSize: 12, padding: '5px 12px' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      {lead.status === 'new' && (
                        <button
                          onClick={() => updateLead(lead.id, 'acknowledged')}
                          disabled={actionLoading === lead.id}
                          className="btn" style={{ fontSize: 12, padding: '5px 12px', background: '#3b82f6' }}
                        >
                          Acknowledge
                        </button>
                      )}
                      {(lead.status === 'new' || lead.status === 'acknowledged') && (
                        <button
                          onClick={() => updateLead(lead.id, 'responded')}
                          disabled={actionLoading === lead.id}
                          className="btn" style={{ fontSize: 12, padding: '5px 12px', background: '#16a34a' }}
                        >
                          Mark Responded
                        </button>
                      )}
                      {lead.status !== 'closed' && (
                        <button
                          onClick={() => updateLead(lead.id, 'closed')}
                          disabled={actionLoading === lead.id}
                          className="btn-outline" style={{ fontSize: 12, padding: '5px 12px' }}
                        >
                          Close
                        </button>
                      )}
                      {lead.status === 'closed' && (
                        <button
                          onClick={() => updateLead(lead.id, 'new')}
                          disabled={actionLoading === lead.id}
                          className="btn-outline" style={{ fontSize: 12, padding: '5px 12px' }}
                        >
                          Reopen
                        </button>
                      )}
                      {!isEditing && (
                        <button
                          onClick={() => setEditNote({ id: lead.id, note: lead.adminNote || '' })}
                          className="btn-outline" style={{ fontSize: 12, padding: '5px 12px' }}
                        >
                          {lead.adminNote ? 'Edit Note' : 'Add Note'}
                        </button>
                      )}
                      <button
                        onClick={() => deleteLead(lead.id)}
                        disabled={actionLoading === lead.id}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#dc2626', padding: '5px 8px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


// --- Challenges Tab (Phase 4) --------------------------------------

function ChallengesTab() {
  const [challenges, setChallenges] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [view, setView] = useState<'list' | 'create' | 'submissions'>('list')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const [cRes, sRes] = await Promise.all([
        fetch('/api/admin/challenges'),
        fetch('/api/admin/challenges/submissions?status=pending'),
      ])
      const cData = await cRes.json()
      const sData = await sRes.json()
      setChallenges(cData.challenges || [])
      setSubmissions(sData.submissions || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setView('list')} className={view === 'list' ? 'btn btn-3d' : 'btn-outline'} style={{ padding: '6px 14px', fontSize: 13 }}>All ({challenges.length})</button>
        <button onClick={() => setView('submissions')} className={view === 'submissions' ? 'btn btn-3d' : 'btn-outline'} style={{ padding: '6px 14px', fontSize: 13 }}>?? Pending ({submissions.length})</button>
        <button onClick={() => setView('create')} className={view === 'create' ? 'btn btn-3d' : 'btn-outline'} style={{ padding: '6px 14px', fontSize: 13 }}>+ New Challenge</button>
      </div>

      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}

      {!loading && view === 'list' && <ChallengeList challenges={challenges} onChange={load} />}
      {!loading && view === 'create' && <ChallengeCreator onCreated={() => { setView('list'); load() }} />}
      {!loading && view === 'submissions' && <SubmissionsGrader submissions={submissions} onChange={load} />}
    </div>
  )
}

function ChallengeList({ challenges, onChange }: { challenges: any[]; onChange: () => void }) {
  async function togglePublish(id: string, published: boolean) {
    await fetch('/api/admin/challenges', {
      method: 'PATCH', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, published }),
    })
    onChange()
  }

  async function remove(id: string) {
    if (!confirm('Delete this challenge and all submissions? Cannot be undone.')) return
    await fetch(`/api/admin/challenges?id=${id}`, { method: 'DELETE' })
    onChange()
  }

  if (challenges.length === 0) return <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No challenges yet. Click "+ New Challenge" to create one.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {challenges.map(c => {
        const closed = new Date(c.closesAt) < new Date()
        return (
          <div key={c.id} style={{ padding: 14, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '4px 4px 0 0 #1a1a1a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <strong style={{ fontSize: 16 }}>{c.title}</strong>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  {c.kind} · L{c.difficulty} · {c.points}pts · {c._count.submissions} subs · closes {new Date(c.closesAt).toLocaleString()}
                </p>
                <p style={{ fontSize: 13, marginTop: 6 }}>{c.brief}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                <span style={{ padding: '3px 8px', background: c.published ? '#dcfce7' : '#f3f4f6', border: '1px solid #1a1a1a' }}>
                  {c.published ? '?? Live' : '? Draft'}
                </span>
                {closed && <span style={{ padding: '3px 8px', background: '#fee2e2', border: '1px solid #1a1a1a' }}>Closed</span>}
                <button onClick={() => togglePublish(c.id, !c.published)} className="btn-outline" style={{ fontSize: 11, padding: '4px 8px' }}>
                  {c.published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => remove(c.id)} className="btn-outline" style={{ fontSize: 11, padding: '4px 8px', color: '#dc2626' }}>Delete</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ChallengeCreator({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({
    title: '', kind: 'challenge', track: '', difficulty: 2,
    brief: '', body: '', rubric: '', points: 50, badgeSlug: '',
    hoursOpen: 24, published: true, featured: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/challenges', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Create failed')
      onCreated()
    } catch (err: any) { setError(err.message); setSaving(false) }
  }

  const inputStyle: React.CSSProperties = { padding: '8px 12px', border: '2px solid #1a1a1a', fontSize: 14, fontFamily: 'inherit', background: '#fff', width: '100%' }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
      <label><div style={{ fontSize: 11, marginBottom: 4, fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Title *</div>
        <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} required maxLength={200} />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
        <label><div style={{ fontSize: 11, marginBottom: 4 }}>Kind</div>
          <select style={inputStyle} value={form.kind} onChange={e => set('kind', e.target.value)}>
            <option value="challenge">?? Challenge</option>
            <option value="quiz">?? Quiz</option>
            <option value="lab">?? Lab</option>
          </select>
        </label>
        <label><div style={{ fontSize: 11, marginBottom: 4 }}>Track</div>
          <select style={inputStyle} value={form.track} onChange={e => set('track', e.target.value)}>
            <option value="">— any —</option>
            <option value="cyber">cyber</option><option value="ai">ai</option><option value="cloud">cloud</option>
            <option value="systems">systems</option><option value="networks">networks</option><option value="coding">coding</option>
            <option value="gaming">gaming</option><option value="digital">digital</option>
          </select>
        </label>
        <label><div style={{ fontSize: 11, marginBottom: 4 }}>Difficulty (1-5)</div>
          <input type="number" style={inputStyle} value={form.difficulty} onChange={e => set('difficulty', Number(e.target.value))} min={1} max={5} />
        </label>
        <label><div style={{ fontSize: 11, marginBottom: 4 }}>Points</div>
          <input type="number" style={inputStyle} value={form.points} onChange={e => set('points', Number(e.target.value))} min={0} max={500} />
        </label>
        <label><div style={{ fontSize: 11, marginBottom: 4 }}>Hours open</div>
          <input type="number" style={inputStyle} value={form.hoursOpen} onChange={e => set('hoursOpen', Number(e.target.value))} min={1} max={720} />
        </label>
        <label><div style={{ fontSize: 11, marginBottom: 4 }}>Badge slug (opt)</div>
          <input style={inputStyle} value={form.badgeSlug} onChange={e => set('badgeSlug', e.target.value)} placeholder="cyber-apprentice" />
        </label>
      </div>

      <label><div style={{ fontSize: 11, marginBottom: 4 }}>Brief (1-2 lines, shown on cards) *</div>
        <input style={inputStyle} value={form.brief} onChange={e => set('brief', e.target.value)} required maxLength={500} />
      </label>

      <label><div style={{ fontSize: 11, marginBottom: 4 }}>Body (full prompt — markdown ok) *</div>
        <textarea style={{ ...inputStyle, minHeight: 200, resize: 'vertical' }} value={form.body} onChange={e => set('body', e.target.value)} required maxLength={20000} />
      </label>

      <label><div style={{ fontSize: 11, marginBottom: 4 }}>Rubric / how it gets graded (optional)</div>
        <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.rubric} onChange={e => set('rubric', e.target.value)} maxLength={5000} />
      </label>

      <div style={{ display: 'flex', gap: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} /> Publish immediately</label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Featured (gold border)</label>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: 14 }}>? {error}</p>}

      <button type="submit" disabled={saving} className="btn btn-3d" style={{ alignSelf: 'flex-start', padding: '10px 22px' }}>
        {saving ? 'Creating…' : 'Create challenge'}
      </button>
    </form>
  )
}

function SubmissionsGrader({ submissions, onChange }: { submissions: any[]; onChange: () => void }) {
  async function grade(id: string, status: 'approved' | 'rejected', score?: number, adminNote?: string) {
    await fetch('/api/admin/challenges/submissions', {
      method: 'PATCH', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status, score, adminNote }),
    })
    onChange()
  }

  if (submissions.length === 0) return <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No pending submissions. ??</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {submissions.map(s => <SubmissionCard key={s.id} s={s} onGrade={grade} />)}
    </div>
  )
}

function SubmissionCard({ s, onGrade }: { s: any; onGrade: (id: string, status: 'approved' | 'rejected', score?: number, adminNote?: string) => Promise<void> }) {
  const [score, setScore] = useState(70)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  async function decide(status: 'approved' | 'rejected') {
    setBusy(true)
    await onGrade(s.id, status, score, note)
    setBusy(false)
  }

  return (
    <div style={{ padding: 16, border: '2px solid #1a1a1a', background: '#fff', boxShadow: '4px 4px 0 0 #1a1a1a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <div>
          <strong>{s.member.displayName}</strong> <span style={{ color: 'var(--muted)', fontSize: 12 }}>@{s.member.handle}</span>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>on <em>{s.challenge.title}</em> · {s.challenge.points}pts · {new Date(s.submittedAt).toLocaleString()}</p>
        </div>
      </div>
      <details>
        <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>View writeup ({s.content.length} chars)</summary>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, background: '#fdfaf6', padding: 12, border: '1.5px solid #1a1a1a', maxHeight: 400, overflow: 'auto' }}>{s.content}</pre>
        {s.url && <p style={{ marginTop: 8, fontSize: 13 }}>Proof: <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a></p>}
      </details>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
        <label style={{ fontSize: 12 }}>Score: <input type="number" value={score} onChange={e => setScore(Number(e.target.value))} min={0} max={100} style={{ width: 60, padding: 4, border: '1.5px solid #1a1a1a', marginLeft: 4 }} />/100</label>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note for member (optional)" style={{ flex: 1, minWidth: 180, padding: 6, border: '1.5px solid #1a1a1a', fontSize: 13 }} />
        <button disabled={busy} onClick={() => decide('approved')} className="btn btn-3d" style={{ padding: '6px 14px', fontSize: 13 }}>? Approve & award</button>
        <button disabled={busy} onClick={() => decide('rejected')} className="btn-outline" style={{ padding: '6px 14px', fontSize: 13, color: '#dc2626' }}>? Reject</button>
      </div>
    </div>
  )
}
