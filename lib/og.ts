import { getPostBySlug } from './mdx'

export async function generateOgSvg(slug:string){
  const post = await getPostBySlug(slug)
  const fm = post.frontMatter
  const title = (fm.title || 'Untitled').replace(/</g,'&lt;')
  const author = (fm.author || '')
  const accent = fm.accent || '#9ca3af'
  const template = fm.template || 'clean'

  // Three simple templates: clean, bold, minimal
  if(template === 'bold'){
    return `<?xml version="1.0" encoding="utf-8"?>
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'>
      <rect width='1200' height='630' fill='${accent}' />
      <text x='60' y='200' font-family='Playfair Display, serif' font-size='64' font-weight='700' fill='#fff'>${title}</text>
      <text x='60' y='280' font-family='Inter, sans-serif' font-size='20' fill='#fff'>${author}</text>
    </svg>`
  }

  if(template === 'minimal'){
    return `<?xml version="1.0" encoding="utf-8"?>
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'>
      <rect width='1200' height='630' fill='#ffffff' />
      <text x='80' y='360' font-family='Playfair Display, serif' font-size='48' fill='#0b0b0b'>${title}</text>
    </svg>`
  }

  // default: clean
  return `<?xml version="1.0" encoding="utf-8"?>
  <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0' stop-color='#0f1720' />
        <stop offset='1' stop-color='#0b1220' />
      </linearGradient>
    </defs>
    <rect width='1200' height='630' fill='url(#g)' />
    <g fill='#fff' font-family='Playfair Display, serif'>
      <text x='80' y='160' font-size='44' font-weight='700'>${title}</text>
    </g>
    <g fill='${accent}' font-family='Inter, sans-serif'>
      <rect x='80' y='180' width='56' height='6' rx='3' />
      <text x='150' y='196' font-size='18'>${author}</text>
    </g>
    <g fill='#9ca3af' font-family='Inter, sans-serif'>
      <text x='80' y='580' font-size='14'>Your Name — Writing</text>
    </g>
  </svg>`
}
