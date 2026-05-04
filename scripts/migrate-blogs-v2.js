/* eslint-disable */
/**
 * Blog migration script: rewrite all v1 posts as v2 using the blog engine.
 *
 * Usage:
 *   node scripts/migrate-blogs-v2.js              # migrate all posts that lack a v2
 *   node scripts/migrate-blogs-v2.js --force      # rewrite v2 even if it already exists
 *   node scripts/migrate-blogs-v2.js <slug>       # migrate a specific slug
 *
 * If OPENAI_API_KEY is set, the AI rewrite pipeline is used; otherwise a
 * deterministic engagement transform is applied (still safe and idempotent).
 *
 * The original v1 file is NEVER modified — v2 is written alongside it as
 *   content/posts/<slug>.v2.mdx
 */

const fs = require('fs')
const path = require('path')

// We compile via ts-node-on-the-fly using the TS source through the Next build.
// To avoid pulling ts-node here, this script is intentionally written in JS
// and re-implements the minimal pieces needed by directly using the engine
// transpiled by Next at build-time. We use require with .ts via a simple
// shim: the Next build emits CJS for these libs into .next, but we want to
// run BEFORE next build. So instead we use tsx if available, else fall back
// to a pure JS pipeline driven by gray-matter only.
//
// Strategy: shell out to `npx tsx` so the TS engine is used directly.

const { spawnSync } = require('child_process')

const args = process.argv.slice(2)
const force = args.includes('--force')
const targets = args.filter(a => !a.startsWith('--'))

const POSTS = path.join(process.cwd(), 'content', 'posts')

if (!fs.existsSync(POSTS)) {
  console.error('No content/posts directory.')
  process.exit(1)
}

// Build the list of slugs to migrate
let slugs = fs
  .readdirSync(POSTS)
  .filter(f => f.endsWith('.mdx') && !f.endsWith('.v2.mdx'))
  .map(f => f.replace(/\.mdx$/, ''))

if (targets.length) {
  slugs = slugs.filter(s => targets.includes(s))
  if (!slugs.length) {
    console.error('No matching slugs:', targets.join(', '))
    process.exit(1)
  }
}

console.log(`[migrate-blogs-v2] Found ${slugs.length} post(s) to consider`)
console.log(`[migrate-blogs-v2] AI: ${process.env.OPENAI_API_KEY ? 'enabled' : 'deterministic fallback'}`)

const runner = path.join(process.cwd(), 'scripts', '_migrate-runner.ts')

let processed = 0
let skipped = 0
let failed = 0

for (const slug of slugs) {
  const v2Path = path.join(POSTS, `${slug}.v2.mdx`)
  if (fs.existsSync(v2Path) && !force) {
    console.log(`  ⏭  ${slug} (v2 already exists, use --force to overwrite)`)
    skipped++
    continue
  }

  const result = spawnSync('npx', ['--yes', 'tsx', runner, slug], {
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  })
  if (result.status === 0) {
    console.log(`  ✅ ${slug}`)
    processed++
  } else {
    console.error(`  ❌ ${slug}`)
    failed++
  }
}

console.log('')
console.log(`Done. processed=${processed} skipped=${skipped} failed=${failed}`)
process.exit(failed > 0 ? 1 : 0)
