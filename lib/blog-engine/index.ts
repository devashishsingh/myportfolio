/**
 * Centralized Blog Engine — single entry point.
 *
 * Every blog (filesystem MDX or DB-stored) passes through `processPost`
 * before rendering. This is the formatting middleware that guarantees a
 * consistent high-engagement layout across the entire blog.
 *
 * Versioning:
 *   - If a v2 file exists at content/posts/<slug>.v2.mdx, we use it.
 *   - Otherwise we parse v1 → BlogDoc → format → serialize at request time.
 *   - The original raw is always preserved on the BlogDoc.
 */

import fs from 'fs'
import path from 'path'

import { BlogDoc } from './schema'
import { parseMdxToBlogDoc } from './parser'
import { formatBlogDoc } from './formatter'
import { blogDocToMdx } from './serializer'

export * from './schema'
export { parseMdxToBlogDoc } from './parser'
export { formatBlogDoc } from './formatter'
export { blogDocToMdx } from './serializer'
export { transformToV2, aiAvailable } from './ai'

const POSTS_PATH = path.join(process.cwd(), 'content', 'posts')

/**
 * Read raw post content for a slug, preferring v2 if present.
 * Returns null if no file exists (caller can fall through to DB).
 */
export function readPostFile(slug: string): { raw: string; version: 'v1' | 'v2' } | null {
  const v2 = path.join(POSTS_PATH, `${slug}.v2.mdx`)
  if (fs.existsSync(v2)) {
    return { raw: fs.readFileSync(v2, 'utf8'), version: 'v2' }
  }
  const v1 = path.join(POSTS_PATH, `${slug}.mdx`)
  if (fs.existsSync(v1)) {
    return { raw: fs.readFileSync(v1, 'utf8'), version: 'v1' }
  }
  return null
}

/**
 * Process a raw MDX post into the final renderable artifacts.
 *
 *   raw → BlogDoc (parser) → BlogDoc' (formatter) → MDX string (serializer)
 *
 * The same pipeline runs whether the source was filesystem v1, filesystem v2,
 * or DB content. This is the single render middleware.
 */
export function processPost(raw: string, slug: string): {
  doc: BlogDoc
  renderableMdx: string
} {
  const parsed = parseMdxToBlogDoc(raw, slug)
  const formatted = formatBlogDoc(parsed)
  const renderableMdx = blogDocToMdx(formatted)
  return { doc: formatted, renderableMdx }
}
