const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const matter = require('gray-matter')

const POSTS = path.join(process.cwd(), 'content', 'posts')
const OUT = path.join(process.cwd(), 'public', 'og')

if(!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

function generateSvgFromFrontMatter(fm){
  const title = (fm.title || 'Untitled').replace(/</g,'&lt;')
  const author = fm.author || ''
  const accent = fm.accent || '#9ca3af'
  const template = fm.template || 'clean'

  if(template === 'bold'){
    return `<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'>\n  <rect width='1200' height='630' fill='${accent}' />\n  <text x='60' y='200' font-family='Playfair Display, serif' font-size='64' font-weight='700' fill='#fff'>${title}</text>\n  <text x='60' y='280' font-family='Inter, sans-serif' font-size='20' fill='#fff'>${author}</text>\n</svg>`
  }

  if(template === 'minimal'){
    return `<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'>\n  <rect width='1200' height='630' fill='#ffffff' />\n  <text x='80' y='360' font-family='Playfair Display, serif' font-size='48' fill='#0b0b0b'>${title}</text>\n</svg>`
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'>\n  <defs>\n    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>\n      <stop offset='0' stop-color='#0f1720' />\n      <stop offset='1' stop-color='#0b1220' />\n    </linearGradient>\n  </defs>\n  <rect width='1200' height='630' fill='url(#g)' />\n  <g fill='#fff' font-family='Playfair Display, serif'>\n    <text x='80' y='160' font-size='44' font-weight='700'>${title}</text>\n  </g>\n  <g fill='${accent}' font-family='Inter, sans-serif'>\n    <rect x='80' y='180' width='56' height='6' rx='3' />\n    <text x='150' y='196' font-size='18'>${author}</text>\n  </g>\n  <g fill='#9ca3af' font-family='Inter, sans-serif'>\n    <text x='80' y='580' font-size='14'>Your Name — Writing</text>\n  </g>\n</svg>`
}

async function run(){
  const files = fs.existsSync(POSTS) ? fs.readdirSync(POSTS).filter(f=>f.endsWith('.mdx')) : []
  for(const file of files){
    const slug = file.replace(/\.mdx$/,'')
    const full = path.join(POSTS, file)
    const raw = fs.readFileSync(full,'utf8')
    const { data } = matter(raw)
    const svg = generateSvgFromFrontMatter(data || {})
    const outPath = path.join(OUT, `${slug}.png`)
    try{
      const buf = Buffer.from(svg)
      await sharp(buf).png({ quality: 90 }).toFile(outPath)
      console.log('Wrote', outPath)
    }catch(err){
      console.error('Failed', slug, err)
    }
  }
}

run().catch(err=>{ console.error(err); process.exit(1) })
