/**
 * Quality + Formatter
 *
 * Deterministic, rule-based engagement layer. Run on every BlogDoc before
 * render (and as the foundation that the AI pipeline builds upon).
 *
 * Rules enforced:
 *   - Paragraphs ≤ 60 words → split long ones at sentence boundaries
 *   - Insert image placeholders every ~150-250 words (configurable)
 *   - Promote blockquotes to pullQuotes
 *   - Auto-derive takeaways from first item of any "Takeaways" / "Key points" list
 *     OR generate from H2 section first sentences when none provided
 *   - Auto-derive FAQ from H3 questions ("?") when none provided
 *   - Add subtle, controlled emojis to section headings based on keyword cues
 *   - Compute readability score
 */

import { BlogDoc, BlogSection, Block, BlogImage, BlogTakeaway, BlogFAQ } from './schema'

const MAX_PARA_WORDS = 60
const IMAGE_EVERY_WORDS = 200      // place an image every ~200 words
const MIN_IMAGE_GAP = 150           // never closer than 150 words

// Limited, controlled emoji vocabulary keyed off heading keywords.
// We *only* add an emoji if the heading doesn't already have one.
const HEADING_EMOJI_RULES: Array<[RegExp, string]> = [
  [/\b(why|reason|because)\b/i, '🤔'],
  [/\b(how|step|guide|build|setup|configure)\b/i, '🛠️'],
  [/\b(what|definition|intro)\b/i, '💡'],
  [/\b(secur|threat|attack|risk|vuln|phish)\b/i, '🔐'],
  [/\b(ai|gpt|llm|model|agent)\b/i, '🤖'],
  [/\b(money|revenue|business|growth|scale)\b/i, '📈'],
  [/\b(mistake|fail|wrong|bad|never)\b/i, '⚠️'],
  [/\b(win|success|launch|ship|done|result)\b/i, '🚀'],
  [/\b(quote|story|example|case)\b/i, '📖'],
  [/\b(checklist|takeaway|summary|key)\b/i, '✅'],
  [/\b(future|next|tomorrow|2026|2027)\b/i, '🔮'],
  [/\b(community|people|together|team)\b/i, '🤝'],
]

function pickHeadingEmoji(heading: string): string | undefined {
  for (const [re, emoji] of HEADING_EMOJI_RULES) {
    if (re.test(heading)) return emoji
  }
  return undefined
}

function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length
}

function splitSentences(s: string): string[] {
  // Naive but effective sentence split that respects common abbreviations
  const out = s
    .replace(/([.!?])\s+(?=[A-Z0-9"“])/g, '$1\u0001')
    .split('\u0001')
    .map(t => t.trim())
    .filter(Boolean)
  return out.length ? out : [s]
}

/** Split a long paragraph into multiple shorter ones at sentence boundaries. */
function splitLongParagraph(text: string, max = MAX_PARA_WORDS): string[] {
  if (wordCount(text) <= max) return [text]
  const sentences = splitSentences(text)
  const chunks: string[] = []
  let buf: string[] = []
  let count = 0
  for (const s of sentences) {
    const sw = wordCount(s)
    if (count + sw > max && buf.length) {
      chunks.push(buf.join(' '))
      buf = [s]; count = sw
    } else {
      buf.push(s); count += sw
    }
  }
  if (buf.length) chunks.push(buf.join(' '))
  return chunks
}

function imagePlaceholder(slug: string, idx: number, hint: string): BlogImage {
  // Encode a friendly hint into the placeholder URL — the renderer can
  // detect the `placeholder://` scheme and show a styled empty frame.
  const encoded = encodeURIComponent(hint.slice(0, 80))
  return {
    src: `placeholder://${slug}/${idx}?hint=${encoded}`,
    alt: hint,
    caption: hint,
  }
}

/** Walk blocks; whenever we cross IMAGE_EVERY_WORDS without an image, inject one. */
function injectImagePlaceholders(blocks: Block[], slug: string, startIdx: number): { blocks: Block[]; injected: number; lastIdx: number } {
  const out: Block[] = []
  let wordsSinceLast = 0
  let injected = 0
  let imgIdx = startIdx
  let lastHeading = ''

  for (const b of blocks) {
    if (b.type === 'heading') lastHeading = b.text
    out.push(b)

    if (b.type === 'image') {
      wordsSinceLast = 0
      continue
    }
    if (b.type === 'paragraph' || b.type === 'bullet-list' || b.type === 'numbered-list' || b.type === 'quote') {
      wordsSinceLast += wordCount(b.text)
      if (wordsSinceLast >= IMAGE_EVERY_WORDS && wordsSinceLast >= MIN_IMAGE_GAP) {
        const hint = lastHeading || 'illustration for this section'
        const img: BlogImage = imagePlaceholder(slug, imgIdx++, hint)
        out.push({ type: 'image', text: '', image: img })
        injected++
        wordsSinceLast = 0
      }
    }
  }
  return { blocks: out, injected, lastIdx: imgIdx }
}

function splitParagraphsInBlocks(blocks: Block[]): { blocks: Block[]; splits: number } {
  const out: Block[] = []
  let splits = 0
  for (const b of blocks) {
    if (b.type === 'paragraph' && wordCount(b.text) > MAX_PARA_WORDS) {
      const parts = splitLongParagraph(b.text)
      splits += parts.length - 1
      for (const p of parts) out.push({ type: 'paragraph', text: p })
    } else {
      out.push(b)
    }
  }
  return { blocks: out, splits }
}

function decorateHeadings(sections: BlogSection[]): { sections: BlogSection[]; decorated: number } {
  let decorated = 0
  const out = sections.map(s => {
    if (s.emoji) return s
    const emoji = pickHeadingEmoji(s.heading)
    if (emoji) decorated++
    return { ...s, emoji }
  })
  return { sections: out, decorated }
}

function deriveTakeaways(doc: BlogDoc): BlogTakeaway[] {
  if (doc.takeaways.length) return doc.takeaways

  // 1. Look for a "takeaways" / "key points" / "summary" section
  const target = doc.sections.find(s => /takeaway|key point|summary|tl;dr|recap/i.test(s.heading))
  if (target) {
    const list = target.blocks.find(b => b.type === 'bullet-list' || b.type === 'numbered-list')
    if (list && list.items?.length) {
      return list.items.slice(0, 7).map(text => ({ text }))
    }
  }

  // 2. Fall back: first sentence of each H2 section (max 5)
  const out: BlogTakeaway[] = []
  for (const s of doc.sections.slice(0, 5)) {
    const firstPara = s.blocks.find(b => b.type === 'paragraph')
    if (!firstPara) continue
    const sentence = splitSentences(firstPara.text)[0]
    if (sentence) out.push({ text: sentence })
  }
  return out
}

function deriveFAQ(doc: BlogDoc): BlogFAQ[] {
  if (doc.faq.length) return doc.faq

  // Look for a "FAQ" / "Questions" section with H3 question headings
  const target = doc.sections.find(s => /faq|questions|q&a/i.test(s.heading))
  if (!target) return []

  const out: BlogFAQ[] = []
  let pendingQ: string | null = null
  let buf: string[] = []
  for (const b of target.blocks) {
    if (b.type === 'heading' && b.level && b.level >= 3) {
      if (pendingQ) {
        out.push({ q: pendingQ, a: buf.join(' ').trim() })
      }
      pendingQ = b.text.replace(/[?]+$/, '?').trim()
      if (!pendingQ.endsWith('?')) pendingQ += '?'
      buf = []
    } else if (b.type === 'paragraph') {
      buf.push(b.text)
    }
  }
  if (pendingQ) out.push({ q: pendingQ, a: buf.join(' ').trim() })
  return out.slice(0, 8)
}

function derivePullQuotes(doc: BlogDoc): BlogDoc['pullQuotes'] {
  if (doc.pullQuotes.length) return doc.pullQuotes
  // Promote the first short, declarative sentence (≤30 words) of an early section
  for (const s of doc.sections.slice(0, 3)) {
    const para = s.blocks.find(b => b.type === 'paragraph')
    if (!para) continue
    const sentences = splitSentences(para.text).filter(t => wordCount(t) >= 8 && wordCount(t) <= 30)
    if (sentences.length) return [{ text: sentences[0] }]
  }
  return []
}

/**
 * Score readability 0-100. Penalties for: too-long paragraphs,
 * walls of text without subheadings, missing intro, missing takeaways.
 */
function readabilityScore(doc: BlogDoc): { score: number; issues: string[] } {
  let score = 100
  const issues: string[] = []

  if (!doc.hook || wordCount(doc.hook) < 4) {
    score -= 8; issues.push('Weak or missing hook')
  }
  if (!doc.intro || wordCount(doc.intro) < 30) {
    score -= 6; issues.push('Intro too short')
  }
  if (doc.sections.length < 2) {
    score -= 12; issues.push('Too few sections — add subheadings')
  }
  if (!doc.takeaways.length) {
    score -= 10; issues.push('No key takeaways')
  }
  if (doc.wordCount > 600 && !doc.images.length) {
    score -= 8; issues.push('No images for a long-form post')
  }

  // Long-paragraph penalty
  let longParas = 0
  for (const s of doc.sections) {
    for (const b of s.blocks) {
      if (b.type === 'paragraph' && wordCount(b.text) > MAX_PARA_WORDS) longParas++
    }
  }
  if (longParas > 0) {
    score -= Math.min(20, longParas * 3)
    issues.push(`${longParas} paragraph(s) exceed ${MAX_PARA_WORDS} words`)
  }

  return { score: Math.max(0, score), issues }
}

/**
 * The main formatter. Idempotent: running twice produces the same output.
 */
export function formatBlogDoc(doc: BlogDoc): BlogDoc {
  const fixes: string[] = []

  // 0. If the hook sentence is repeated at the start of the intro, strip it.
  let introText = doc.intro || ''
  const hookText = (doc.hook || '').trim()
  if (hookText && introText.trim().startsWith(hookText)) {
    introText = introText.trim().slice(hookText.length).replace(/^\s+/, '')
  }

  // 1. Split overlong paragraphs in intro + sections
  const introBlocks: Block[] = introText
    ? introText.split(/\n\n+/).map(t => ({ type: 'paragraph' as const, text: t.trim() })).filter(b => b.text)
    : []
  const introSplit = splitParagraphsInBlocks(introBlocks)
  if (introSplit.splits) fixes.push(`split ${introSplit.splits} long intro paragraph(s)`)

  let sections = doc.sections.map(s => {
    const r = splitParagraphsInBlocks(s.blocks)
    if (r.splits) fixes.push(`split ${r.splits} long paragraph(s) in "${s.heading}"`)
    return { ...s, blocks: r.blocks }
  })

  // 2. Decorate headings with emoji
  const dec = decorateHeadings(sections)
  sections = dec.sections
  if (dec.decorated) fixes.push(`added emoji cues to ${dec.decorated} heading(s)`)

  // 3. Inject image placeholders (skip the takeaways/FAQ-style sections)
  let imgIdx = doc.images.length
  let totalInjected = 0
  sections = sections.map(s => {
    if (/takeaway|key point|summary|faq|questions|q&a|tl;dr|recap/i.test(s.heading)) return s
    const inj = injectImagePlaceholders(s.blocks, doc.slug, imgIdx)
    imgIdx = inj.lastIdx
    totalInjected += inj.injected
    return { ...s, blocks: inj.blocks }
  })
  if (totalInjected) fixes.push(`inserted ${totalInjected} image placeholder(s)`)

  // 4. Recompute derived collections
  const newImages: BlogImage[] = [...doc.images]
  for (const s of sections) {
    for (const b of s.blocks) {
      if (b.type === 'image' && b.image && !newImages.some(i => i.src === b.image!.src)) {
        newImages.push(b.image)
      }
    }
  }

  const partial: BlogDoc = {
    ...doc,
    intro: introSplit.blocks.map(b => b.text).join('\n\n'),
    sections,
    images: newImages,
  }
  partial.takeaways = deriveTakeaways(partial)
  if (!doc.takeaways.length && partial.takeaways.length) fixes.push(`derived ${partial.takeaways.length} takeaway(s)`)

  partial.faq = deriveFAQ(partial)
  if (!doc.faq.length && partial.faq.length) fixes.push(`derived ${partial.faq.length} FAQ entries`)

  partial.pullQuotes = derivePullQuotes(partial)

  const { score, issues } = readabilityScore(partial)
  partial.quality = { score, issues, autofixesApplied: fixes }

  return partial
}
