const fs = require('fs')
// Fallback extractor: read binary and pull printable ASCII runs
try {
  const buf = fs.readFileSync('./public/Devashish_Singh-resume.pdf')
  const bin = buf.toString('latin1')
  const matches = bin.match(/[\x20-\x7E]{50,}/g) || []
  // prefer matches that contain common words
  const good = matches.filter(m => /experience|engineer|coach|founder|security|consult|mentor|product|cyber/i.test(m))
  const pick = (good.length>0?good[0] : (matches[0]||'')).replace(/\s{2,}/g,' ').trim()
  const snippet = pick.split(/\. |\n/).slice(0,3).join(' ').trim()
  console.log('\n---EXTRACTED_SUMMARY_START---\n')
  console.log(snippet || 'No clear summary found; please paste an About blurb or LinkedIn text.')
  console.log('\n---EXTRACTED_SUMMARY_END---')
} catch(err){
  console.error('Failed to read resume:', err)
  process.exit(1)
}
