import { MDXRemote } from 'next-mdx-remote/rsc'
import { Callout } from './Callout'
import { YouTube } from './YouTube'
import { Hook, PullQuote, ImagePlaceholder, Takeaways, FAQSection } from './BlogEngineComponents'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const components = { Callout, YouTube, Hook, PullQuote, ImagePlaceholder, Takeaways, FAQSection }

export default function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
          },
        }}
      />
    </div>
  )
}
