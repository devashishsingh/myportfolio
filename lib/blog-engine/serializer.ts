/**
 * Render middleware: BlogDoc → MDX string consumable by MDXContent.
 *
 * This is the formatting layer every blog passes through before rendering.
 * The renderer never sees raw user content — it only sees this normalized,
 * engagement-formatted MDX produced from the canonical BlogDoc.
 */

import { BlogDoc, Block, BlogSection } from './schema'

function escapeMdxAttr(s: string): string {
  return s.replace(/"/g, '&quot;')
}

function blockToMdx(b: Block): string {
  switch (b.type) {
    case 'heading': {
      const hashes = '#'.repeat(b.level || 2)
      return `${hashes} ${b.text}\n`
    }
    case 'paragraph':
      return `${b.text}\n`
    case 'bullet-list':
      return (b.items || []).map(it => `- ${it}`).join('\n') + '\n'
    case 'numbered-list':
      return (b.items || []).map((it, i) => `${i + 1}. ${it}`).join('\n') + '\n'
    case 'quote':
      // Render blockquotes as <PullQuote/> for highlighted styling
      return `<PullQuote text="${escapeMdxAttr(b.text)}" />\n`
    case 'code': {
      const lang = b.lang || ''
      return `\`\`\`${lang}\n${b.text}\n\`\`\`\n`
    }
    case 'image': {
      if (!b.image) return ''
      if (b.image.src.startsWith('placeholder://')) {
        return `<ImagePlaceholder src="${escapeMdxAttr(b.image.src)}" alt="${escapeMdxAttr(b.image.alt)}" caption="${escapeMdxAttr(b.image.caption || '')}" />\n`
      }
      const cap = b.image.caption ? `"${b.image.caption.replace(/"/g, '\\"')}"` : ''
      return `![${b.image.alt}](${b.image.src}${cap ? ' ' + cap : ''})\n`
    }
    case 'divider':
      return `---\n`
    case 'mdx-raw':
      return `${b.text}\n`
    default:
      return ''
  }
}

function sectionToMdx(s: BlogSection, withInlinePullQuotes: string[]): string {
  const heading = s.emoji && !s.heading.startsWith(s.emoji) ? `${s.emoji} ${s.heading}` : s.heading
  const blocks = s.blocks.map(blockToMdx).join('\n')
  // Optionally inject a pull-quote at start of section
  const pq = withInlinePullQuotes.shift()
  const pqMdx = pq ? `<PullQuote text="${escapeMdxAttr(pq)}" />\n\n` : ''
  return `## ${heading}\n\n${pqMdx}${blocks}`
}

/**
 * Serialize a BlogDoc into MDX. Adds:
 *   - Hook + intro at top
 *   - All sections with emoji-prefixed H2s
 *   - <PullQuote> sprinkled into every 3rd section
 *   - <Takeaways> component near the end
 *   - <FAQSection> if FAQs exist
 *   - <ImagePlaceholder> for any unresolved images
 */
export function blogDocToMdx(doc: BlogDoc): string {
  const out: string[] = []

  if (doc.hook) {
    out.push(`<Hook text="${escapeMdxAttr(doc.hook)}" />\n`)
  }
  if (doc.intro) {
    out.push(doc.intro)
  }

  // Distribute pullQuotes across sections (one every ~3rd section)
  const pqQueue: string[] = []
  doc.pullQuotes.forEach((q, i) => {
    if (i < doc.pullQuotes.length) pqQueue.push(q.text)
  })

  doc.sections.forEach((s, idx) => {
    const sectionPq: string[] = []
    if (pqQueue.length && idx > 0 && idx % 3 === 0) {
      sectionPq.push(pqQueue.shift()!)
    }
    out.push(sectionToMdx(s, sectionPq))
  })

  // Takeaways
  if (doc.takeaways.length) {
    const items = JSON.stringify(doc.takeaways)
    out.push(`<Takeaways items={${items}} />`)
  }

  // FAQ
  if (doc.faq.length) {
    const items = JSON.stringify(doc.faq)
    out.push(`<FAQSection items={${items}} />`)
  }

  return out.join('\n\n')
}
