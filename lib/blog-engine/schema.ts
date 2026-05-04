/**
 * BlogDoc — the canonical structured representation of every blog post.
 *
 * Every post (filesystem MDX, DB-stored, or future-imported) is parsed into
 * this shape before rendering. The frontend renderer ONLY consumes this shape,
 * which guarantees a consistent high-engagement format across the entire blog.
 *
 * Versioning:
 *   - schemaVersion: bumped when this shape changes
 *   - contentVersion: 'v1' = original, 'v2' = AI-transformed, 'vN' future
 *
 * Original raw content is always preserved in `original.raw`.
 */

export const BLOG_SCHEMA_VERSION = 1
export type ContentVersion = 'v1' | 'v2' | string

export interface BlogImage {
  /** placeholder | resolved url */
  src: string
  alt: string
  caption?: string
  /** approximate word position the image was placed at */
  wordOffset?: number
}

export interface BlogQuote {
  text: string
  attribution?: string
}

export interface BlogFAQ {
  q: string
  a: string
}

export interface BlogTakeaway {
  text: string
  emoji?: string
}

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'bullet-list'
  | 'numbered-list'
  | 'quote'
  | 'callout'
  | 'code'
  | 'image'
  | 'divider'
  | 'mdx-raw'

export interface Block {
  type: BlockType
  /** plain markdown / mdx text for this block */
  text: string
  level?: number          // for headings
  items?: string[]        // for lists
  lang?: string           // for code blocks
  image?: BlogImage       // for image blocks
  emoji?: string          // optional decoration on headings
}

export interface BlogSection {
  id: string
  heading: string
  emoji?: string
  blocks: Block[]
}

export interface BlogDoc {
  schemaVersion: number
  contentVersion: ContentVersion
  slug: string

  // Front-matter / metadata
  title: string
  description: string
  author: string
  date: string
  category?: string
  tags: string[]
  featured?: boolean

  // Engagement-focused structure
  hook: string                 // 1-2 sentence opener that hooks the reader
  intro: string                // multi-sentence setup (~50-120 words)
  sections: BlogSection[]
  takeaways: BlogTakeaway[]    // 3-7 key takeaways
  faq: BlogFAQ[]               // optional FAQ
  pullQuotes: BlogQuote[]      // highlighted quotes, scattered through render
  images: BlogImage[]          // all image placeholders/resolved
  coverImage?: string

  // Computed
  wordCount: number
  readingTimeMinutes: number

  // Quality
  quality: {
    score: number              // 0-100
    issues: string[]
    autofixesApplied: string[]
  }

  // Preserve the original so we can re-derive / re-transform later
  original: {
    raw: string                // full mdx including frontmatter
    body: string               // body without frontmatter
  }
}
