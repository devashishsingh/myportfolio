'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ds_announcement_v1'

export default function AnnouncementModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  function handleFeedback() {
    dismiss()
    // Open FeedbackWidget after modal exits
    setTimeout(() => {
      const btn = document.querySelector<HTMLButtonElement>('[data-feedback-toggle]')
      btn?.click()
    }, 250)
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div className="announcement-backdrop" onClick={dismiss} />

      {/* Modal */}
      <div
        className="announcement-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="announce-title"
      >
        {/* Close */}
        <button
          className="announcement-close"
          onClick={dismiss}
          aria-label="Close announcement"
        >
          ✕
        </button>

        <p className="announcement-icon">🚧</p>

        <h2 id="announce-title" className="announcement-title">
          Something exciting is cooking…
        </h2>

        <p className="announcement-text">
          I&apos;m currently revamping this space to make your experience smoother, smarter,
          and actually useful (not just &ldquo;good-looking&rdquo; 😄).
        </p>
        <p className="announcement-text">
          If something feels off, breaks, or just doesn&apos;t make sense—don&apos;t worry,
          you&apos;re early 😉
        </p>
        <p className="announcement-text">
          I&apos;d really appreciate your feedback. You can share it using the button just
          above the WhatsApp icon at the bottom right.
        </p>

        <div className="announcement-actions">
          <button className="announcement-cta" onClick={handleFeedback}>
            💬 Share Feedback
          </button>
          <button className="announcement-dismiss" onClick={dismiss}>
            Got it
          </button>
        </div>
      </div>
    </>
  )
}
