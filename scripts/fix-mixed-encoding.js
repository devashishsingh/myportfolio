// Smart UTF-8 / Windows-1252 mixed file fixer.
// Walks bytes; if a sequence is valid UTF-8, keeps it; otherwise treats as Win-1252.
const fs = require('fs');
const path = process.argv[2];
if (!path) { console.error('Usage: node fix-mixed-encoding.js <file>'); process.exit(1); }
const src = fs.readFileSync(path);
const out = [];
let i = 0;
let convertedCount = 0;
let keptCount = 0;
while (i < src.length) {
  const b = src[i];
  if (b < 0x80) { out.push(b); i++; continue; }
  // Try to read a valid UTF-8 sequence starting at i.
  let len = 0;
  if ((b & 0xE0) === 0xC0) len = 2;
  else if ((b & 0xF0) === 0xE0) len = 3;
  else if ((b & 0xF8) === 0xF0) len = 4;
  let valid = len > 0 && i + len <= src.length;
  if (valid) {
    for (let j = 1; j < len; j++) {
      if ((src[i + j] & 0xC0) !== 0x80) { valid = false; break; }
    }
  }
  if (valid) {
    for (let j = 0; j < len; j++) out.push(src[i + j]);
    i += len;
    keptCount++;
  } else {
    // Treat as Win-1252. Map byte to Unicode codepoint then UTF-8.
    const win1252Map = {
      0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026,
      0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160,
      0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019,
      0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
      0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153,
      0x9E: 0x017E, 0x9F: 0x0178,
    };
    const cp = win1252Map[b] !== undefined ? win1252Map[b] : b; // 0xA0-0xFF identity
    // Encode codepoint as UTF-8.
    if (cp < 0x80) out.push(cp);
    else if (cp < 0x800) {
      out.push(0xC0 | (cp >> 6));
      out.push(0x80 | (cp & 0x3F));
    } else {
      out.push(0xE0 | (cp >> 12));
      out.push(0x80 | ((cp >> 6) & 0x3F));
      out.push(0x80 | (cp & 0x3F));
    }
    i++;
    convertedCount++;
  }
}
fs.writeFileSync(path, Buffer.from(out));
// Verify result is valid UTF-8.
const result = fs.readFileSync(path, 'utf8');
console.log(`wrote ${out.length} bytes; kept=${keptCount} convertedFromWin1252=${convertedCount}; valid UTF-8 length: ${result.length} chars`);
