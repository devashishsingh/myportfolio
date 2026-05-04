/**
 * Parser: raw MDX/markdown → BlogDoc (without engagement transforms).
 * This is the deterministic, lossless conversion. The formatter / AI
 * pipeline takes this and adds engagement structure.
 */

import matter from 'gray-matter'
import {
  BlogDoc,
  BlogSection,
  Block,
  BLOG_SCHEMA_VERSION,
  BlogImage,
} from './schema'

function slugifyHeading(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

function leadingEmoji(text: string): string | undefined {
  // Match a leading emoji-ish unicode glyph
  const m = text.match(/^([\p{Extended_Pictographic}\u2600-\u27BF])\s+/u)
  return m ? m[1] : undefined
}

/**
 * Split a markdown body into Block[]. Honors:
 *  - ATX headings (# .. ######)
 *  - bullet & numbered lists
 *  - blockquotes
 *  - fenced code blocks
 *  - <Callout> / <YouTube> MDX components (kept as mdx-raw)
 *  - thematic breaks ---
 *  - everything else → paragraphs (split on blank lines)
 */
export function parseBlocks(body: string): Block[] {
  const lines = body.split(/\r?\n/)
  const blocks: Block[] = []
  let i = 0

  function pushParagraph(buf: string[]) {
    const text = buf.join('\n').trim()
    if (!text) return
    blocks.push({ type: 'paragraph', text })
  }

  let para: string[] = []

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (/^```/.test(line)) {
      pushParagraph(para); para = []
      const lang = line.replace(/^```/, '').trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]); i++
      }
      i++ // skip closing ```
      blocks.push({ type: 'code', text: codeLines.join('\n'), lang })
      continue
    }

    // Heading
    const h = line.match(/^(#{1,6})\s+(.+?)\s*$/)
    if (h) {
      pushParagraph(para); para = []
      const level = h[1].length
      const headingText = h[2]
      blocks.push({
        type: 'heading',
        text: headingText,
        level,
        emoji: leadingEmoji(headingText),
      })
      i++
      continue
    }

    // Thematic break
    if (/^(\s*[-*_]\s*){3,}\s*$/.test(line)) {
      pushParagraph(para); para = []
      blocks.push({ type: 'divider', text: '---' })
      i++
      continue
    }

    // Blockquote
    if (/^>\s/.test(line)) {
      pushParagraph(para); para = []
      const quoteLines: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push({ type: 'quote', text: quoteLines.join('\n').trim() })
      continue
    }

    // Bullet list
    if (/^\s*[-*+]\s+/.test(line)) {
      pushParagraph(para); para = []
      const items: string[] = []
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, '').trim())
        i++
      }
      blocks.push({ type: 'bullet-list', text: items.join('\n'), items })
      continue
    }

    // Numbered list
    if (/^\s*\d+\.\s+/.test(line)) {
      pushParagraph(para); para = []
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim())
        i++
      }
      blocks.push({ type: 'numbered-list', text: items.join('\n'), items })
      continue
    }

    // MDX component (<Callout ...> ... </Callout> or self-closing)
    if (/^<[A-Z][A-Za-z0-9]*[\s/>]/.test(line.trim())) {
      pushParagraph(para); para = []
      const startTag = line.trim().match(/^<([A-Z][A-Za-z0-9]*)/)
      const tag = startTag ? startTag[1] : ''
      // Self-closing or single-line
      if (/\/>\s*$/.test(line) || new RegExp(`</${tag}>`).test(line)) {
        blocks.push({ type: 'mdx-raw', text: line })
        i++
        continue
      }
      // Multi-line until </Tag>
      const buf: string[] = [line]
      i++
      while (i < lines.length && !new RegExp(`</${tag}>`).test(lines[i])) {
        buf.push(lines[i]); i++
      }
      if (i < lines.length) { buf.push(lines[i]); i++ }
      blocks.push({ type: 'mdx-raw', text: buf.join('\n') })
      continue
    }

    // Image (markdown ![alt](src "caption"))
    const img = line.match(/^!\[(.*?)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\s*$/)
    if (img) {
      pushParagraph(para); para = []
      blocks.push({
        type: 'image',
        text: line,
        image: { src: img[2], alt: img[1], caption: img[3] },
      })
      i++
      continue
    }

    // Blank line ends paragraph
    if (line.trim() === '') {
      pushParagraph(para); para = []
      i++
      continue
    }

    para.push(line)
    i++
  }
  pushParagraph(para)
  return blocks
}

function countWords(blocks: Block[]): number {
  let w = 0
  for (const b of blocks) {
    if (b.type === 'code' || b.type === 'mdx-raw' || b.type === 'divider' || b.type === 'image') continue
    w += b.text.split(/\s+/).filter(Boolean).length
  }
  return w
}

/** Group blocks into sections by H2. Anything before the first H2 = intro. */
function buildSections(blocks: Block[]): { intro: Block[]; sections: BlogSection[] } {
  const intro: Block[] = []
  const sections: BlogSection[] = []
  let current: BlogSection | null = null

  for (const b of blocks) {
    // Skip the leading H1 (it's the title)
    if (b.type === 'heading' && b.level === 1 && intro.length === 0 && !current) {
      continue
    }
    if (b.type === 'heading' && b.level === 2) {
      current = {
        id: slugifyHeading(b.text),
        heading: b.text,
        emoji: b.emoji,
        blocks: [],
      }
      sections.push(current)
      continue
    }
    if (current) current.blocks.push(b)
    else intro.push(b)
  }
  return { intro, sections }
}

function firstParagraphText(blocks: Block[]): string {
  const p = blocks.find(b => b.type === 'paragraph')
  return p ? p.text : ''
}

function joinParagraphs(blocks: Block[]): string {
  return blocks
    .filter(b => b.type === 'paragraph')
    .map(b => b.text)
    .join('\n\n')
}

/**
 * Parse a raw MDX file into a BlogDoc (v1, lossless).
 * The formatter is responsible for transforming this into v2.
 */
export function parseMdxToBlogDoc(rawMdx: string, slug: string): BlogDoc {
  const { data, content } = matter(rawMdx)
  const fm = data as Record<string, any>

  const blocks = parseBlocks(content)
  const { intro, sections } = buildSections(blocks)

  const wordCount = countWords(blocks)
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  const hook = firstParagraphText(intro).split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')
  const introText = joinParagraphs(intro)

  // Collect any inline images
  const images: BlogImage[] = []
  for (const b of blocks) {
    if (b.type === 'image' && b.image) images.push(b.image)
  }

  // Collect blockquotes as candidate pull-quotes
  const pullQuotes = blocks
    .filter(b => b.type === 'quote')
    .map(b => ({ text: b.text }))

  return {
    schemaVersion: BLOG_SCHEMA_VERSION,
    contentVersion: 'v1',
    slug,
    title: fm.title || '',
    description: fm.description || '',
    author: fm.author || 'Devashish Singh',
    date: fm.date || '',
    category: fm.category,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    featured: !!fm.featured,
    hook,
    intro: introText,
    sections: sections.map(s => ({
      ...s,
      // Convert section blocks into a section-local list (kept for renderer)
      blocks: s.blocks,
    })),
    takeaways: [],
    faq: [],
    pullQuotes,
    images,
    coverImage: fm.ogImage || fm.coverImage,
    wordCount,
    readingTimeMinutes,
    quality: { score: 0, issues: [], autofixesApplied: [] },
    original: { raw: rawMdx, body: content },
  }
}
