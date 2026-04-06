import Link from 'next/link'
import { getAllTags } from '../../../lib/mdx'

export default async function TagsIndex(){
  const tags = await getAllTags()
  return (
    <section className="container-wide">
      <h1 className="display-font text-3xl">Tags</h1>
      <p className="mt-4 text-gray-700">Browse by topic.</p>

      <div className="mt-8 flex flex-wrap gap-4">
        {tags.map((t:any)=> (
          <Link key={t.tag} href={`/blog/tag/${encodeURIComponent(t.tag)}`} className="px-3 py-2 border rounded-sm text-sm">{t.tag} <span className="text-gray-500">({t.count})</span></Link>
        ))}
      </div>
    </section>
  )
}
