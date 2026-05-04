import React from 'react'

/* eslint-disable @next/next/no-img-element */

export function Hook({ text }: { text: string }) {
  if (!text) return null
  return (
    <p className="blog-hook" role="doc-introduction">
      {text}
    </p>
  )
}

export function PullQuote({ text, attribution }: { text: string; attribution?: string }) {
  if (!text) return null
  return (
    <figure className="blog-pullquote">
      <blockquote>
        <p>“{text}”</p>
      </blockquote>
      {attribution && <figcaption>— {attribution}</figcaption>}
    </figure>
  )
}

export function ImagePlaceholder({
  src,
  alt,
  caption,
}: {
  src: string
  alt: string
  caption?: string
}) {
  // If a real image URL was substituted, render <img>; otherwise render the styled placeholder
  const isPlaceholder = !src || src.startsWith('placeholder://')
  if (!isPlaceholder) {
    return (
      <figure className="blog-figure">
        <img src={src} alt={alt} loading="lazy" />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    )
  }

  // Decode hint for visible label
  let hint = caption || alt
  try {
    const url = new URL(src.replace('placeholder://', 'https://x/'))
    const h = url.searchParams.get('hint')
    if (h) hint = decodeURIComponent(h)
  } catch {}

  return (
    <figure className="blog-figure blog-figure-placeholder" aria-label={alt}>
      <div className="blog-figure-placeholder-inner">
        <span className="blog-figure-placeholder-icon" aria-hidden="true">🖼️</span>
        <span className="blog-figure-placeholder-label">{hint || 'illustration'}</span>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export function Takeaways({
  items,
}: {
  items: { text: string; emoji?: string }[]
}) {
  if (!items?.length) return null
  return (
    <aside className="blog-takeaways" aria-label="Key takeaways">
      <h3 className="blog-takeaways-title">✅ Key Takeaways</h3>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            {it.emoji && <span className="blog-takeaway-emoji">{it.emoji}</span>}
            <span>{it.text}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function FAQSection({ items }: { items: { q: string; a: string }[] }) {
  if (!items?.length) return null
  return (
    <section className="blog-faq" aria-label="Frequently asked questions">
      <h3 className="blog-faq-title">❓ Frequently Asked</h3>
      {items.map((it, i) => (
        <details key={i} className="blog-faq-item">
          <summary>{it.q}</summary>
          <p>{it.a}</p>
        </details>
      ))}
    </section>
  )
}
