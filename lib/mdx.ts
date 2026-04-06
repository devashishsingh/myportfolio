import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PrismaClient } from '@prisma/client'

const POSTS_PATH = path.join(process.cwd(), 'content', 'posts')

let prisma: PrismaClient | null = null
function db() {
  if (!prisma) prisma = new PrismaClient()
  return prisma
}

export function getPostSlugs(){
  if(!fs.existsSync(POSTS_PATH)) return []
  return fs.readdirSync(POSTS_PATH).filter(fn=>fn.endsWith('.mdx'))
}

export async function getPostBySlug(slug:string){
  const realSlug = slug.replace(/\.mdx$/, '')

  // Try filesystem first
  const fullPath = path.join(POSTS_PATH, `${realSlug}.mdx`)
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const {data, content} = matter(fileContents)
    const words = content.split(/\s+/).filter(Boolean).length
    const readingTime = Math.max(1, Math.ceil(words / 200))
    return { frontMatter: { ...(data as Record<string, any>), readingTime } as Record<string, any>, content }
  }

  // Try database
  const post = await db().blogPost.findUnique({ where: { slug: realSlug } })
  if (post) {
    const tags = (() => { try { return JSON.parse(post.tags) } catch { return [] } })()
    const words = post.content.split(/\s+/).filter(Boolean).length
    const readingTime = Math.max(1, Math.ceil(words / 200))
    return {
      frontMatter: {
        title: post.title,
        description: post.description || '',
        author: post.author,
        date: post.date,
        category: post.category || '',
        tags,
        featured: post.featured,
        readingTime,
      } as Record<string, any>,
      content: post.content,
    }
  }

  throw new Error(`Post not found: ${realSlug}`)
}

export async function getAllPosts(){
  // Get filesystem posts
  const slugs = getPostSlugs()
  const fsPosts = await Promise.all(slugs.map(async (fileName)=>{
    const fullPath = path.join(POSTS_PATH, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const {data} = matter(fileContents)
    const content = fileContents.replace(/^---[\s\S]*?---/, '')
    const words = content.split(/\s+/).filter(Boolean).length
    const readingTime = Math.max(1, Math.ceil(words / 200))
    return {
      slug: fileName.replace(/\.mdx$/, ''),
      ...(data as Record<string, any>),
      readingTime,
      _source: 'fs' as const,
    } as Record<string, any> & { slug: string; readingTime: number }
  }))

  // Get DB posts
  let dbPosts: Array<Record<string, any> & { slug: string; readingTime: number }> = []
  try {
    const rows = await db().blogPost.findMany({ where: { published: true } })
    dbPosts = rows.map(p => {
      const tags = (() => { try { return JSON.parse(p.tags) } catch { return [] } })()
      const words = p.content.split(/\s+/).filter(Boolean).length
      const readingTime = Math.max(1, Math.ceil(words / 200))
      return {
        slug: p.slug,
        title: p.title,
        description: p.description || '',
        author: p.author,
        date: p.date,
        category: p.category || '',
        tags,
        featured: p.featured,
        readingTime,
        _source: 'db' as const,
      }
    })
  } catch {
    // DB not available — just use filesystem posts
  }

  // Merge, preferring filesystem if slug collides
  const fsSlugs = new Set(fsPosts.map(p => p.slug))
  const merged = [...fsPosts, ...dbPosts.filter(p => !fsSlugs.has(p.slug))]

  merged.sort((a,b)=> (b.date || '').localeCompare(a.date || ''))
  return merged
}

export async function getPostsByTag(tag:string){
  const posts = await getAllPosts()
  return posts.filter(p=> Array.isArray(p.tags) && p.tags.includes(tag))
}

export async function getAllTags(){
  const posts = await getAllPosts()
  const map: Record<string, number> = {}
  posts.forEach(p=>{
    const tags = p.tags || []
    tags.forEach((t:string)=>{ map[t] = (map[t] || 0) + 1 })
  })
  return Object.keys(map).map(k=>({ tag: k, count: map[k] }))
}
