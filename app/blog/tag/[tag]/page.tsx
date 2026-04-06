import Link from 'next/link'
import { getPostsByTag, getAllTags } from '../../../../lib/mdx'

export async function generateStaticParams(){
  const tags = await getAllTags()
  return tags.map(t=>({ tag: t.tag }))
}

export default async function TagPage({ params }:{params:{tag:string}}){
  const tag = params.tag
  const posts = await getPostsByTag(tag)

  return (
    <section className="container-wide">
      <h1 className="display-font text-3xl">Tag: {tag}</h1>
      <p className="mt-4 text-gray-700">Articles tagged with <strong>{tag}</strong>.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {posts.map((p:any)=> (
          <article key={p.slug} className="border p-4">
            <Link href={`/blog/${p.slug}`} className="text-sm text-gray-500">{p.date} • {p.readingTime} min</Link>
            <h3 className="font-semibold mt-2">{p.title}</h3>
            {p.description && <p className="mt-2 text-sm text-gray-700">{p.description}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}
