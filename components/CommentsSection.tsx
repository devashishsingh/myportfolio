'use client'

import { useState, useEffect, useCallback } from 'react'

interface Comment {
  id: string
  name: string
  message: string
  createdAt: string
}

interface Props {
  slug: string
}

export default function CommentsSection({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`)
      const data = await res.json()
      setComments(data.comments || [])
    } catch {}
    setLoading(false)
  }, [slug])

  useEffect(() => { loadComments() }, [loadComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus('idle')
    setErrorMsg('')

    try {
      const res = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, email, message }),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data.error || 'Failed to post comment')
        setStatus('error')
        setSubmitting(false)
        return
      }

      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
      await loadComments()
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
    setSubmitting(false)
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <section className="blog-comments-section">
      <h3 className="blog-comments-heading">
        Comments {comments.length > 0 && <span className="blog-comments-count">{comments.length}</span>}
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="blog-comment-form">
        <div className="blog-comment-form-row">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="blog-comment-input"
          />
          <input
            type="email"
            placeholder="Your email (not published)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={200}
            className="blog-comment-input"
          />
        </div>
        <textarea
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={2000}
          rows={3}
          className="blog-comment-input blog-comment-textarea"
        />
        <div className="blog-comment-form-footer">
          <button
            type="submit"
            disabled={submitting}
            className="blog-comment-submit"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
          {status === 'sent' && (
            <span className="blog-comment-success">Comment posted!</span>
          )}
          {status === 'error' && (
            <span className="blog-comment-error">{errorMsg}</span>
          )}
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <p style={{ color: '#666', fontSize: 14 }}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p style={{ color: '#666', fontSize: 14, marginTop: 16 }}>No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <div className="blog-comments-list">
          {comments.map((c) => (
            <div key={c.id} className="blog-comment-item">
              <div className="blog-comment-header">
                <span className="blog-comment-avatar">
                  {c.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <span className="blog-comment-author">{c.name}</span>
                  <span className="blog-comment-time">{timeAgo(c.createdAt)}</span>
                </div>
              </div>
              <p className="blog-comment-body">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
