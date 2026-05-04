/**
 * AI Transformation Pipeline (v2 generation)
 *
 * Input:  BlogDoc (v1 — parsed from raw)
 * Output: BlogDoc (v2 — rewritten for engagement, with hook/intro/sections
 *         in storytelling tone, controlled emojis, short paragraphs, image
 *         placeholders, takeaways, FAQ, pullQuotes)
 *
 * Strategy:
 *   - If OPENAI_API_KEY is configured, call an OpenAI-compatible chat
 *     completion endpoint with a strict JSON-only system prompt.
 *   - Otherwise, fall back to a deterministic transformer that uses the
 *     formatter rules to lift the v1 doc into v2 shape (still high quality,
 *     just no LLM rewrite).
 *
 * Either way, the final BlogDoc is always passed through `formatBlogDoc`
 * for normalization and quality enforcement.
 */

import { BlogDoc, BlogSection, Block, BlogTakeaway, BlogFAQ } from './schema'
import { formatBlogDoc } from './formatter'

const SYSTEM_PROMPT = `You are an editor that rewrites technical blog posts to maximise reader engagement and retention.

Rules:
- Keep ALL factual claims, code, links, and the author's voice intact. Do not invent facts.
- Open with a strong 1-2 sentence HOOK that creates curiosity or stakes.
- Use storytelling tone. Short paragraphs (1-3 sentences). No walls of text.
- Use bullets and numbered lists where they aid scanning.
- Use clear H2 subheadings. Add a controlled emoji prefix to each H2 ONLY when it adds clarity (max 1 emoji per heading).
- Insert image placeholder lines of the form: [IMAGE: <one-line caption>] every 150-250 words.
- End with 3-7 actionable Takeaways and (optionally) 2-5 FAQ entries.
- Pick 1-2 short, quotable pullQuotes from the body.

Return STRICT JSON matching this TypeScript type, no commentary:
{
  "hook": string,
  "intro": string,
  "sections": [{ "heading": string, "emoji"?: string, "markdown": string }],
  "takeaways": [{ "text": string, "emoji"?: string }],
  "faq": [{ "q": string, "a": string }],
  "pullQuotes": [{ "text": string }]
}`

interface AiOutput {
  hook: string
  intro: string
  sections: { heading: string; emoji?: string; markdown: string }[]
  takeaways: { text: string; emoji?: string }[]
  faq: { q: string; a: string }[]
  pullQuotes: { text: string }[]
}

function buildUserPrompt(doc: BlogDoc): string {
  return [
    `Title: ${doc.title}`,
    `Description: ${doc.description}`,
    `Tags: ${doc.tags.join(', ')}`,
    '',
    'ORIGINAL POST (markdown body, do not lose any factual content):',
    '---',
    doc.original.body,
    '---',
  ].join('\n')
}

export function aiAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY
}

async function callOpenAI(doc: BlogDoc): Promise<AiOutput | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(doc) },
      ],
      temperature: 0.6,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`AI call failed (${res.status}): ${text.slice(0, 200)}`)
  }
  const json: any = await res.json()
  const content = json?.choices?.[0]?.message?.content
  if (!content) return null
  try {
    return JSON.parse(content) as AiOutput
  } catch {
    return null
  }
}

/** Convert AI markdown sections into Block[] using the parser. */
function aiSectionsToDocSections(ai: AiOutput, parseBlocks: (s: string) => Block[]): BlogSection[] {
  return ai.sections.map(s => ({
    id: s.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80),
    heading: s.heading,
    emoji: s.emoji,
    blocks: parseBlocks(s.markdown),
  }))
}

/**
 * Deterministic v1 → v2 lift used when no AI key is configured.
 * Simply applies the formatter (which already handles 90% of the rules)
 * but also rewrites the hook from the first sentence and copies the intro.
 */
function deterministicLift(doc: BlogDoc): BlogDoc {
  const hook = doc.hook && doc.hook.trim()
    ? doc.hook
    : doc.intro.split(/(?<=[.!?])\s+/)[0] || doc.title
  return formatBlogDoc({ ...doc, hook, contentVersion: 'v2' })
}

/**
 * Main entry: transform a v1 BlogDoc into a v2 BlogDoc.
 *
 * - With OPENAI_API_KEY set: full LLM rewrite, then format/normalize.
 * - Without: deterministic lift only.
 */
export async function transformToV2(doc: BlogDoc): Promise<BlogDoc> {
  if (!aiAvailable()) {
    return deterministicLift(doc)
  }

  let ai: AiOutput | null = null
  try {
    ai = await callOpenAI(doc)
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.warn('[blog-engine] AI rewrite failed, falling back to deterministic lift:', err?.message || err)
  }

  if (!ai) return deterministicLift(doc)

  // Lazy import to avoid circular
  const { parseBlocks } = await import('./parser')

  const v2: BlogDoc = {
    ...doc,
    contentVersion: 'v2',
    hook: ai.hook || doc.hook,
    intro: ai.intro || doc.intro,
    sections: aiSectionsToDocSections(ai, parseBlocks),
    takeaways: ai.takeaways?.length ? ai.takeaways : doc.takeaways,
    faq: ai.faq?.length ? ai.faq : doc.faq,
    pullQuotes: ai.pullQuotes?.length ? ai.pullQuotes : doc.pullQuotes,
  }

  return formatBlogDoc(v2)
}
