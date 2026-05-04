/**
 * Per-slug migration runner. Invoked by scripts/migrate-blogs-v2.js via
 * `npx tsx`. This file uses the TypeScript blog engine directly.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import { parseMdxToBlogDoc, formatBlogDoc, blogDocToMdx } from '../lib/blog-engine'
import { transformToV2 } from '../lib/blog-engine/ai'

async function main() {
  const slug = process.argv[2]
  if (!slug) {
    console.error('Usage: tsx scripts/_migrate-runner.ts <slug>')
    process.exit(2)
  }

  const POSTS = path.join(process.cwd(), 'content', 'posts')
  const v1Path = path.join(POSTS, `${slug}.mdx`)
  if (!fs.existsSync(v1Path)) {
    console.error(`v1 not found: ${v1Path}`)
    process.exit(2)
  }

  const raw = fs.readFileSync(v1Path, 'utf8')
  const v1Doc = parseMdxToBlogDoc(raw, slug)
  const v2Doc = await transformToV2(v1Doc)
  const formatted = formatBlogDoc(v2Doc)
  const renderable = blogDocToMdx(formatted)

  // Compose a v2 file: keep frontmatter from v1 (with engine metadata added)
  const fm = matter(raw).data as Record<string, any>
  const v2FrontMatter = {
    ...fm,
    contentVersion: 'v2',
    qualityScore: formatted.quality.score,
    autofixes: formatted.quality.autofixesApplied,
  }
  const v2File = matter.stringify(renderable, v2FrontMatter)

  const v2Path = path.join(POSTS, `${slug}.v2.mdx`)
  fs.writeFileSync(v2Path, v2File, 'utf8')

  console.log(JSON.stringify({
    slug,
    score: formatted.quality.score,
    issues: formatted.quality.issues,
    autofixes: formatted.quality.autofixesApplied,
    sections: formatted.sections.length,
    images: formatted.images.length,
    takeaways: formatted.takeaways.length,
    faq: formatted.faq.length,
  }, null, 2))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
