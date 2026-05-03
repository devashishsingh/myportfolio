# Theme

## Stack
- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS + custom global CSS tokens
- framer-motion for animation

## package.json
`json
{
  "name": "my-portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && node scripts/generate-og.js && next build",
    "postinstall": "prisma generate",
    "generate-og": "node scripts/generate-og.js",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "@tailwindcss/typography": "^0.5.19",
    "@tiptap/extension-color": "^3.22.2",
    "@tiptap/extension-font-family": "^3.22.2",
    "@tiptap/extension-highlight": "^3.22.2",
    "@tiptap/extension-image": "^3.22.2",
    "@tiptap/extension-link": "^3.22.2",
    "@tiptap/extension-placeholder": "^3.22.2",
    "@tiptap/extension-text-align": "^3.22.2",
    "@tiptap/extension-text-style": "^3.22.2",
    "@tiptap/extension-underline": "^3.22.2",
    "@tiptap/extension-youtube": "^3.22.2",
    "@tiptap/pm": "^3.22.2",
    "@tiptap/react": "^3.22.2",
    "@tiptap/starter-kit": "^3.22.2",
    "@types/turndown": "^5.0.6",
    "@vercel/blob": "^2.3.3",
    "framer-motion": "^10.12.16",
    "gray-matter": "^4.0.3",
    "next": "^14.2.0",
    "next-mdx-remote": "^6.0.0",
    "pdf-parse": "^2.4.5",
    "prisma": "^5.22.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "^4.0.1",
    "sharp": "^0.34.5",
    "turndown": "^7.2.4"
  },
  "devDependencies": {
    "@types/node": "^20.4.2",
    "@types/react": "^18.2.28",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.2.2"
  }
}

` 

## tailwind.config.js
`js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#0f1720',
        stone: '#e6e6e3'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}

` 

## app/globals.css
`css
@import '../styles/globals.css';

` 

## styles/globals.css
`css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root{
  --bg:#ffffff;
  --text:#111111;
  --muted:#6b6b6b;
  --muted-2:#999999;
  --accent:#111111;
  --accent-primary:#111111;
  --accent-glow:#333333;
  --accent-gold:#111111;
  --surface-1:#ffffff;
  --surface-2:#ffffff;
  --surface-3:#ffffff;
  --border:rgba(0,0,0,0.12);
  --text-primary:#111111;
  --text-muted:#6b6b6b;
  --container:1100px;
}

html{scroll-behavior:smooth;}

html,body {height:100%;}

body{
  font-family: 'IBM Plex Mono', monospace;
  color:var(--text);
  background:var(--bg);
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  line-height:1.6;
}

h1,h2,h3,h4,h5,h6{font-family:'Syne',sans-serif;}

.display-font{font-family: 'Syne', sans-serif;}

@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes pulse-border{0%,100%{box-shadow:0 0 0 0 rgba(0,0,0,0.25);}50%{box-shadow:0 0 0 6px rgba(0,0,0,0);}}

.container-wide{max-width:var(--container);margin-left:auto;margin-right:auto;padding-left:24px;padding-right:24px}

/* Stats responsive */
@media(max-width:640px){
  .container-wide > div[style*="grid-template-columns: repeat(4"]{
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 20px !important;
  }
}

/* Basic utilities */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.focus-visible:focus{outline:2px solid var(--accent);outline-offset:3px}

/* Header */
.header-main{
  width:100%;
  background:rgba(255,255,255,0.85);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  position:sticky;
  top:0;
  z-index:100;
  border-bottom:1px solid var(--border);
}
.header-inner{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 0;
  gap:16px;
}
.header-left{
  display:flex;
  align-items:center;
  gap:0;
  flex:1;
  min-width:0;
}
.header-logo{
  display:flex;
  align-items:center;
  flex-shrink:0;
}
.header-nav{
  display:flex;
  gap:2px;
  align-items:center;
  font-size:14px;
  font-weight:450;
  margin-left:0;
}
.nav-contact{
  border:1px solid var(--border);
  border-radius:999px;
  padding:7px 14px;
  margin-left:4px;
  font-weight:500;
  font-family:'IBM Plex Mono',monospace;
  font-size:12px;
  text-transform:uppercase;
  letter-spacing:0.1em;
}
.nav-contact:hover{
  background:rgba(0,0,0,0.04);
  border-color:#111;
  box-shadow:none;
}
.header-right{
  display:flex;
  align-items:center;
  gap:6px;
  flex-shrink:0;
}
.header-search-trigger{
  display:flex;
  align-items:center;
  gap:8px;
  padding:7px 12px;
  border:1px solid var(--border);
  border-radius:8px;
  background:var(--surface-2);
  color:var(--text-muted);
  font-size:13px;
  font-family:'IBM Plex Mono',monospace;
  cursor:pointer;
  transition:border-color 0.2s,color 0.2s;
  width:170px;
}
.header-search-trigger:hover{
  border-color:var(--accent-primary);
  color:var(--text-primary);
}
.header-search-label{
  flex:1;
  text-align:left;
  font-weight:400;
  letter-spacing:0.02em;
}
.header-search-kbd{
  font-size:10px;
  font-weight:500;
  background:var(--surface-3);
  padding:2px 6px;
  border-radius:4px;
  color:var(--text-muted);
  letter-spacing:0.05em;
  font-family:'IBM Plex Mono',monospace;
  border:none;
}
.header-icon{
  display:flex;
  align-items:center;
  justify-content:center;
  width:36px;
  height:36px;
  border-radius:6px;
  color:var(--text-muted);
  text-decoration:none;
  transition:color 0.15s,background 0.15s;
  background:transparent;
  border:none;
  cursor:pointer;
  flex-shrink:0;
}
.header-icon:hover{
  color:var(--text-primary);
  background:rgba(0,0,0,0.05);
}
.header-icon-color:hover{
  background:rgba(0,0,0,0.05);
}
.header-icon-color svg{
  transition:transform 0.2s ease;
}
.header-icon-color:hover svg{
  transform:scale(1.15) rotate(-5deg);
}
.header-hamburger{
  display:none;
  align-items:center;
  justify-content:center;
  width:40px;
  height:40px;
  border:none;
  background:transparent;
  color:var(--text-primary);
  cursor:pointer;
  border-radius:8px;
}
.header-hamburger:hover{background:rgba(0,0,0,0.05);}
.header-mobile-nav{
  display:none;
  flex-direction:column;
  gap:4px;
  padding:16px 24px 24px;
  border-top:1px solid var(--border);
  background:var(--surface-1);
}
.header-mobile-icons{
  display:flex;
  gap:4px;
  margin-top:12px;
  padding-top:12px;
  border-top:1px solid var(--border);
}

/* Search overlay */
.search-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.3);
  z-index:9999;
  display:flex;
  align-items:flex-start;
  justify-content:center;
  padding-top:20vh;
  backdrop-filter:blur(6px);
}
.search-modal{
  background:#ffffff;
  border:1px solid var(--border);
  border-radius:16px;
  width:90%;
  max-width:560px;
  box-shadow:0 32px 64px rgba(0,0,0,0.12);
  overflow:hidden;
}
.search-form{
  display:flex;
  align-items:center;
  gap:12px;
  padding:16px 20px;
  color:var(--text-muted);
}
.search-input{
  flex:1;
  border:none;
  outline:none;
  font-size:16px;
  background:transparent;
  color:var(--text-primary);
  font-family:'IBM Plex Mono',monospace;
}
.search-input::placeholder{color:var(--text-muted);}
.search-esc{
  font-size:11px;
  font-weight:500;
  background:var(--surface-3);
  padding:3px 8px;
  border-radius:4px;
  color:var(--text-muted);
  font-family:'IBM Plex Mono',monospace;
}

@media(max-width:900px){
  .header-nav{display:none;}
  .header-search-trigger{width:auto;min-width:auto;padding:7px 10px;}
  .header-search-label,.header-search-kbd{display:none;}
  .header-hamburger{display:flex;}
  .header-mobile-nav{display:flex;}
  .header-logo img{height:90px!important;}
}
@media(max-width:480px){
  .header-logo img{height:70px!important;margin-right:-16px!important;}
  .header-inner{padding:8px 0;gap:8px;}
  .header-right{gap:2px;}
  .header-icon{width:32px;height:32px;}
  .header-search-trigger{padding:6px 8px;}
}

/* Navigation */
.nav-link{color:var(--text-primary);text-decoration:none;padding:6px 12px;border-radius:999px;transition:color .18s,background .18s;position:relative;font-family:'IBM Plex Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;}
.nav-link:hover{background:rgba(0,0,0,0.04);color:#111;}
.nav-link::after{
  content:'';position:absolute;bottom:2px;left:12px;right:12px;
  height:2px;background:var(--accent-primary);border-radius:1px;
  transform:scaleX(0);transform-origin:center;
  transition:transform 0.25s cubic-bezier(0.4,0,0.2,1);
}
.nav-link:hover::after{transform:scaleX(1);}
.nav-contact::after{display:none;}

/* Buttons */
.btn{display:inline-block;padding:12px 20px;border-radius:8px;background:#111;color:#fff;text-decoration:none;font-weight:600;font-family:'Syne',sans-serif;transition:transform .18s ease,box-shadow .18s,filter .18s}
.btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.15);filter:brightness(1.1)}
.btn:active{transform:translateY(0);box-shadow:0 2px 8px rgba(0,0,0,0.1)}
.btn-outline{display:inline-block;padding:12px 20px;border-radius:8px;border:1.5px solid #111;color:#111;text-decoration:none;font-weight:600;font-family:'Syne',sans-serif;transition:transform .18s ease,background .18s,box-shadow .18s}
.btn-outline:hover{transform:translateY(-1px);background:rgba(0,0,0,0.04);box-shadow:0 4px 16px rgba(0,0,0,0.08);}
.btn-outline:active{transform:translateY(0);}

/* Cards */
.card{background:var(--surface-2);border:1px solid var(--border);padding:18px;border-radius:12px}

/* Hero */
.hero-outer{
  min-height:auto;
  padding:80px 0 60px;
  display:flex;
  align-items:center;
  position:relative;
  overflow:hidden;
  background: var(--bg);
}
.hero-outer::before{
  content:'';
  position:absolute;
  inset:0;
  background:none;
  pointer-events:none;
}
.hero-inner{display:grid;grid-template-columns:1fr 380px;gap:36px;align-items:start;position:relative;z-index:1;}
.hero-heading{font-size:clamp(2rem,5vw,3.5rem);line-height:1.08;margin:12px 0 0;font-family:'Syne',sans-serif;font-weight:800;color:var(--text-primary);}
.hero-lead{font-size:13px;color:var(--text-muted);max-width:500px;margin-top:12px;font-family:'IBM Plex Mono',monospace;line-height:1.65;}
.hero-cta{display:flex;gap:12px;margin-top:20px}
.muted-label{font-size:11px;color:var(--text-muted);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px;font-family:'IBM Plex Mono',monospace;}
.portrait-wrap{
  padding:0;
  background:#fff;
  border:1px solid var(--border);
  overflow:hidden;
  border-radius: 24px 24px 80px 24px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.08);
  max-width:340px;
  position:relative;
}
.portrait-img{
  display:block;
  width:100%;
  height:440px;
  object-fit:cover;
  object-position:top center;
}

@media (max-width: 980px){
  .hero-inner{grid-template-columns:1fr;gap:28px}
  .portrait-wrap{order:-1}
  .portrait-img{height:240px}
  .flipbook{max-width:100%}
  .flipbook-page,.flipbook-img{height:280px}
}

/* â”€â”€ FlipBook â”€â”€ */
.flipbook{
  max-width:340px;
  position:relative;
  perspective:1200px;
  cursor:pointer;
  user-select:none;
}
.flipbook-page{
  width:100%;
  height:380px;
  border-radius:24px 24px 80px 24px;
  overflow:hidden;
  box-shadow:0 16px 48px rgba(0,0,0,0.08);
  background:#fff;
  border:1px solid var(--border);
  position:relative;
  transform-origin:center;
}
.flipbook-img{
  display:block;
  width:100%;
  height:440px;
  object-fit:cover;
  object-position:top center;
}
.flipbook-content{
  display:flex;
  align-items:center;
  justify-content:center;
  width:100%;
  height:100%;
  background:var(--surface-2);
}
.flipbook-page-label{
  font-size:clamp(28px,5vw,48px);
  color:var(--muted-2);
  letter-spacing:0.02em;
}
.flipbook-hint{
  position:absolute;
  top:-20px;
  left:0;
  right:0;
  display:flex;
  align-items:center;
  justify-content:space-between;
  font-size:11px;
  letter-spacing:0.1em;
  text-transform:uppercase;
  color:var(--muted-2);
  z-index:1;
}

/* Footer */
footer{color:var(--text-muted);background:var(--bg);border-top:1px solid var(--border);}

/* Small helpers */
.muted{color:var(--muted)}

/* â”€â”€ Page Back Button â”€â”€ */
.page-back-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  font-size:14px;
  font-weight:500;
  color:var(--text-muted);
  text-decoration:none;
  padding:8px 16px 8px 12px;
  border-radius:8px;
  transition:all 0.2s ease;
  margin-bottom:8px;
  border:1px solid transparent;
  font-family:'IBM Plex Mono',monospace;
}
.page-back-btn:hover{
  color:var(--text-primary);
  background:rgba(0,0,0,0.04);
  border-color:var(--border);
}
/* Remove old dark override */

/* â”€â”€ 3D Effects â”€â”€ */

/* Portrait 3D depth + glow */
.portrait-3d{
  transition: transform 0.15s ease-out;
  will-change: transform;
}
.portrait-3d::after{
  content:'';
  position:absolute;
  inset:0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
  pointer-events:none;
}

/* 3D card base */
.card-3d{
  border-radius:12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  will-change: transform;
  backface-visibility: hidden;
  background:var(--surface-2);
  border-color:var(--border);
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Project Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.project-card-inner{
  padding:22px 20px;
  display:flex;
  flex-direction:column;
  height:100%;
}
.project-category-label{
  font-size:11px;
  font-weight:500;
  text-transform:uppercase;
  letter-spacing:0.1em;
  color:var(--accent-primary);
  font-family:'IBM Plex Mono',monospace;
}
.project-github-link{
  font-size:12px;
  color:var(--text-muted);
  text-decoration:none;
  transition:color 0.15s ease;
  font-family:'IBM Plex Mono',monospace;
}
.project-github-link:hover{
  color:var(--accent-glow);
}
.project-card-title{
  font-size:16px;
  font-weight:700;
  line-height:1.3;
  margin-top:8px;
  margin-bottom:8px;
  font-family:'Syne',sans-serif;
  color:var(--text-primary);
}
.project-card-excerpt{
  font-size:12.5px;
  line-height:1.6;
  color:var(--text-muted);
  margin-bottom:12px;
  flex-grow:1;
  font-family:'IBM Plex Mono',monospace;
}
.project-tech-row{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  margin-bottom:18px;
}
.project-tech-chip{
  display:inline-flex;
  align-items:center;
  gap:5px;
  padding:3px 10px;
  background:var(--surface-3);
  border:1px solid var(--border);
  border-radius:999px;
  font-size:11px;
  font-weight:500;
  color:var(--text-muted);
  white-space:nowrap;
  font-family:'IBM Plex Mono',monospace;
}
.project-tech-icon{
  display:inline-flex;
  align-items:center;
  flex-shrink:0;
}
.project-card-cta-row{
  margin-top:auto;
}
.project-card-cta{
  display:inline-flex;
  align-items:center;
  gap:6px;
  font-size:14px;
  font-weight:600;
  color:var(--accent-glow);
  text-decoration:none;
  transition:gap 0.2s ease;
  font-family:'Syne',sans-serif;
}
.project-card-cta:hover{
  gap:10px;
}
.project-card-cta svg{
  transition:transform 0.2s ease;
}
.project-card-cta:hover svg{
  transform:translateX(3px);
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Engagement Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.engagement-card{
  border:1px solid var(--border);
  border-radius:14px;
  overflow:hidden;
  cursor:pointer;
  position:relative;
  background:var(--surface-2);
}
.engagement-card:hover{
  border-color:#111;
  box-shadow:0 8px 32px rgba(0,0,0,0.08);
}
.engagement-card-inner{
  padding:24px 22px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  height:100%;
  min-height:220px;
}
.engagement-eyebrow{
  display:inline-block;
  font-size:12px;
  font-weight:500;
  text-transform:uppercase;
  letter-spacing:0.1em;
  color:var(--muted);
  margin-bottom:14px;
}
.engagement-title{
  font-size:19px;
  font-weight:700;
  line-height:1.2;
  margin-bottom:10px;
  font-family:'Syne',sans-serif;
  color:var(--text-primary);
}
.engagement-desc{
  font-size:12.5px;
  line-height:1.6;
  color:var(--text-muted);
  margin-bottom:16px;
  font-family:'IBM Plex Mono',monospace;
}
.engagement-cta{
  display:inline-flex;
  align-items:center;
  gap:8px;
  font-size:14px;
  font-weight:600;
  color:var(--accent-glow);
  text-decoration:none;
  padding:10px 0;
  border:none;
  background:none;
  transition:gap 0.2s ease, color 0.2s ease;
  font-family:'Syne',sans-serif;
}
.engagement-cta:hover{
  gap:12px;
  color:var(--accent-primary);
}
.engagement-cta svg{
  transition:transform 0.2s ease;
}
.engagement-cta:hover svg{
  transform:translateX(3px);
}
@media (max-width:768px){
  .engagement-card-inner{
    padding:24px 20px;
    min-height:auto;
  }
  .engagement-title{
    font-size:20px;
  }
}

/* 3D buttons */
.btn-3d{
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  box-shadow: 0 4px 0 rgba(0,0,0,0.2);
}
.btn-3d:hover{
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}
.btn-3d:active{
  transform: translateY(1px);
  box-shadow: 0 2px 0 rgba(0,0,0,0.2);
}

/* Nav 3D hover lift */
.nav-link{
  transition: color .18s, background .18s, transform .15s;
}
.nav-link:hover{
  background:rgba(0,0,0,0.04);
  transform: translateY(-2px) translateZ(4px);
  color:#111;
}

/* WhatsApp floating action button */
.whatsapp-fab{
  position:fixed;
  bottom:28px;
  right:28px;
  z-index:999;
  width:56px;
  height:56px;
  border-radius:50%;
  background:#25D366;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 4px 14px rgba(37,211,102,0.45),0 0 0 1px rgba(37,211,102,0.2);
  transition:transform .2s ease, box-shadow .2s ease;
  animation:whatsapp-pulse 3s ease-in-out infinite;
}
@keyframes whatsapp-pulse{
  0%,100%{box-shadow:0 4px 14px rgba(37,211,102,0.45);}
  50%{box-shadow:0 4px 24px rgba(37,211,102,0.65),0 0 0 8px rgba(37,211,102,0.1);}
}
.whatsapp-fab:hover{
  transform:scale(1.1) rotate(5deg);
  box-shadow:0 6px 20px rgba(37,211,102,0.55);
  animation:none;
}
.whatsapp-fab:active{
  transform:scale(0.95);
}

/* Footer icon buttons */
.footer-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:8px 14px;
  border:1px solid var(--border);
  border-radius:999px;
  color:var(--text-muted);
  font-size:12px;
  font-weight:500;
  text-decoration:none;
  font-family:'IBM Plex Mono',monospace;
  transition:color .18s, border-color .18s, background .18s, transform .15s;
}
.footer-btn svg{
  flex-shrink:0;
}
.footer-btn:hover{
  color:var(--text-primary);
  border-color:#111;
  background:rgba(0,0,0,0.04);
  transform:translateY(-2px);
}
.footer-btn:hover svg{
  animation:footer-icon-bounce 0.4s ease;
}
@keyframes footer-icon-bounce{
  0%{transform:scale(1);}
  50%{transform:scale(1.25) rotate(-8deg);}
  100%{transform:scale(1);}
}

/* â”€â”€ Blog Editor â”€â”€ */
.blog-editor{
  border:1px solid var(--border);
  border-radius:12px;
  overflow:hidden;
  background:var(--surface-2);
}
.editor-toolbar{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:2px;
  padding:8px 10px;
  border-bottom:1px solid var(--border);
  background:var(--surface-3);
}
.toolbar-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:32px;
  height:32px;
  padding:0 6px;
  border:none;
  background:transparent;
  border-radius:4px;
  cursor:pointer;
  font-size:14px;
  color:var(--text-muted);
  transition:background .15s,color .15s;
}
.toolbar-btn:hover{background:rgba(0,0,0,0.06);color:var(--text-primary);}
.toolbar-btn.is-active{background:#111;color:#fff}
.toolbar-btn:disabled{opacity:0.3;cursor:default}
.toolbar-select{
  height:32px;
  padding:0 8px;
  border:1px solid var(--border);
  border-radius:4px;
  background:var(--surface-2);
  font-size:12px;
  cursor:pointer;
  color:var(--text-primary);
  font-family:'IBM Plex Mono',monospace;
}
.toolbar-divider{
  display:inline-block;
  width:1px;
  height:24px;
  background:rgba(0,0,0,0.12);
  margin:0 6px;
}

/* Editor content area */
.blog-editor .ProseMirror{
  min-height:400px;
  padding:24px;
  outline:none;
  font-size:16px;
  line-height:1.7;
}
.blog-editor .ProseMirror h1{font-size:2em;font-weight:700;margin:.8em 0 .4em;line-height:1.2}
.blog-editor .ProseMirror h2{font-size:1.5em;font-weight:600;margin:.8em 0 .4em;line-height:1.3}
.blog-editor .ProseMirror h3{font-size:1.25em;font-weight:600;margin:.8em 0 .4em;line-height:1.3}
.blog-editor .ProseMirror h4{font-size:1.1em;font-weight:600;margin:.8em 0 .4em}
.blog-editor .ProseMirror p{margin:.5em 0}
.blog-editor .ProseMirror img{max-width:100%;height:auto;border-radius:8px;margin:16px 0}
.blog-editor .ProseMirror blockquote{
  border-left:3px solid #000;
  padding-left:16px;
  margin:16px 0;
  color:var(--muted);
  font-style:italic;
}
.blog-editor .ProseMirror pre{
  background:#1a1a1a;
  color:#e0e0e0;
  padding:16px;
  border-radius:6px;
  overflow-x:auto;
  font-family:'Courier New',monospace;
  font-size:14px;
}
.blog-editor .ProseMirror code{
  background:rgba(0,0,0,0.06);
  padding:2px 6px;
  border-radius:3px;
  font-size:0.9em;
}
.blog-editor .ProseMirror pre code{background:none;padding:0;border-radius:0}
.blog-editor .ProseMirror ul{padding-left:24px;margin:8px 0;list-style-type:disc}
.blog-editor .ProseMirror ol{padding-left:24px;margin:8px 0;list-style-type:decimal}
.blog-editor .ProseMirror ul ul{list-style-type:circle}
.blog-editor .ProseMirror ul ul ul{list-style-type:square}
.blog-editor .ProseMirror li{margin:4px 0}
.blog-editor .ProseMirror li p{margin:0}
.blog-editor .ProseMirror a{color:#0066cc;text-decoration:underline}
.blog-editor .ProseMirror hr{border:none;border-top:2px solid rgba(0,0,0,0.1);margin:24px 0}
.blog-editor .ProseMirror mark{background:#fef08a;padding:1px 2px;border-radius:2px}
.blog-editor .ProseMirror div[data-youtube-video]{margin:16px 0}
.blog-editor .ProseMirror div[data-youtube-video] iframe{border:none;border-radius:8px;max-width:100%}
.blog-editor .ProseMirror p.is-editor-empty:first-child::before{
  content:attr(data-placeholder);
  float:left;
  color:#adb5bd;
  pointer-events:none;
  height:0;
  font-style:italic;
}

/* Admin form */
.editor-label{
  display:block;
  font-size:13px;
  font-weight:600;
  margin-bottom:6px;
  color:#333;
}
.editor-input{
  width:100%;
  padding:10px 12px;
  border:1px solid var(--border);
  border-radius:6px;
  font-size:14px;
  font-family:'IBM Plex Mono',monospace;
  transition:border-color .15s, box-shadow .15s;
  background:var(--surface-3);
  color:var(--text-primary);
}
.editor-input:focus{outline:none;border-color:#111;box-shadow:0 0 0 3px rgba(0,0,0,0.08);}

@media(max-width:640px){
  .editor-toolbar{gap:1px;padding:6px}
  .toolbar-btn{min-width:28px;height:28px;font-size:12px}
  .toolbar-select{height:28px;font-size:11px}
  .toolbar-divider{height:20px;margin:0 3px}
  .blog-editor .ProseMirror{padding:16px;min-height:300px}
}

/* â”€â”€ Community â”€â”€ */

.community-hero{
  background: linear-gradient(180deg, var(--surface-1) 0%, var(--bg) 100%);
  border-bottom: 1px solid var(--border);
}

.community-badge{
  display:inline-block;
  padding:6px 16px;
  border:1px solid var(--border);
  border-radius:999px;
  font-size:13px;
  color:var(--text-primary);
  background:var(--surface-3);
  font-weight:500;
  font-family:'IBM Plex Mono',monospace;
  transition:background .15s, border-color .15s;
}
.community-badge:hover{
  background:rgba(0,0,0,0.04);
  border-color:#111;
}

.community-pillars-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:20px;
}

.community-pillar-card{
  padding:28px 24px;
  border:1px solid var(--border);
  border-radius:12px;
  background:var(--surface-2);
  transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.community-pillar-card:hover{
  transform:translateY(-3px);
  box-shadow:0 8px 24px rgba(0,0,0,0.08);
  border-color:#111;
}

.community-action-card{
  padding:24px;
  border:1px solid var(--border);
  border-radius:12px;
  background:var(--surface-2);
  transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.community-action-card:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 20px rgba(0,0,0,0.08);
  border-color:#111;
}

.community-form-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:20px;
}
.community-form-field.full-width{
  grid-column:1 / -1;
}

.community-interest-chip{
  padding:6px 14px;
  border:1px solid var(--border);
  border-radius:999px;
  font-size:13px;
  background:var(--surface-3);
  color:var(--text-primary);
  cursor:pointer;
  transition:all .15s;
  font-family:'IBM Plex Mono',monospace;
}
.community-interest-chip:hover{
  border-color:#111;
  background:rgba(0,0,0,0.04);
}
.community-interest-chip.active{
  background:var(--accent-primary);
  color:#fff;
  border-color:var(--accent-primary);
}

/* Homepage community section */
.home-community-section{
  margin-top:40px;
  background:var(--surface-1);
  border-top:1px solid var(--border);
  border-bottom:1px solid var(--border);
}

@media(max-width:768px){
  .community-form-grid{grid-template-columns:1fr}
  .community-form-field.full-width{grid-column:1}
  .home-community-section > .container-wide > div{
    display:flex!important;
    flex-direction:column!important;
  }
  .home-community-section > .container-wide > div > div{
    grid-column:1!important;
  }
}

/* â”€â”€ Admin Portal â”€â”€ */

.admin-tabs{
  display:flex;
  gap:0;
  border-bottom:2px solid var(--border);
  overflow-x:auto;
}
.admin-tab{
  padding:10px 20px;
  border:none;
  background:none;
  font-family:'IBM Plex Mono',monospace;
  font-size:13px;
  font-weight:500;
  color:var(--text-muted);
  cursor:pointer;
  border-bottom:2px solid transparent;
  margin-bottom:-2px;
  transition:color .15s, border-color .15s;
  white-space:nowrap;
}
.admin-tab:hover{
  color:var(--text-primary);
}
.admin-tab.active{
  color:var(--accent-glow);
  border-bottom-color:var(--accent-primary);
  font-weight:600;
}

.admin-stat-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
  gap:16px;
}
.admin-stat-card{
  padding:24px;
  border:1px solid var(--border);
  border-radius:12px;
  background:var(--surface-2);
}

.admin-filter-btn{
  padding:6px 14px;
  border:1px solid var(--border);
  border-radius:6px;
  background:var(--surface-3);
  font-family:'IBM Plex Mono',monospace;
  font-size:13px;
  cursor:pointer;
  color:var(--text-muted);
  transition:all .15s;
}
.admin-filter-btn:hover{
  border-color:var(--accent-primary);
}
.admin-filter-btn.active{
  background:var(--accent-primary);
  color:#fff;
  border-color:var(--accent-primary);
}

.admin-invitation-card{
  padding:20px;
  border:1px solid var(--border);
  border-radius:12px;
  background:var(--surface-2);
  transition:box-shadow .15s;
}
.admin-invitation-card:hover{
  box-shadow:0 4px 16px rgba(0,0,0,0.08);
}

.admin-status-badge{
  display:inline-block;
  padding:2px 10px;
  border-radius:999px;
  font-size:11px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:0.05em;
}
.admin-status-badge.status-pending{
  background:#fef3c7;
  color:#92400e;
}
.admin-status-badge.status-approved{
  background:#dcfce7;
  color:#166534;
}
.admin-status-badge.status-rejected{
  background:#fee2e2;
  color:#991b1b;
}

.admin-table{
  width:100%;
  border-collapse:collapse;
  font-size:13px;
}
.admin-table th{
  text-align:left;
  padding:10px 12px;
  border-bottom:2px solid var(--border);
  font-weight:600;
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:0.05em;
  color:var(--text-muted);
  font-family:'IBM Plex Mono',monospace;
}
.admin-table td{
  padding:10px 12px;
  border-bottom:1px solid rgba(0,0,0,0.06);
  vertical-align:top;
}
.admin-table tr:hover td{
  background:rgba(0,0,0,0.02);
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Feedback Widget â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.feedback-fab{
  position:fixed;
  bottom:90px;
  right:24px;
  z-index:999;
  width:48px;
  height:48px;
  border-radius:50%;
  background:var(--surface-3);
  color:var(--accent-glow);
  border:1px solid var(--border);
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,0.4);
  transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
  font-family:'IBM Plex Mono',monospace;
}
.feedback-fab:hover{
  transform:scale(1.08);
  box-shadow:0 6px 28px rgba(0,0,0,0.12);
  border-color:#111;
}
.feedback-panel{
  position:fixed;
  bottom:150px;
  right:24px;
  z-index:998;
  width:380px;
  max-width:calc(100vw - 48px);
  max-height:calc(100vh - 200px);
  overflow-y:auto;
  background:var(--surface-2);
  border:1px solid var(--border);
  border-radius:16px;
  padding:24px;
  box-shadow:0 24px 48px rgba(0,0,0,0.1);
  animation:feedbackSlideIn 0.25s ease;
}
@keyframes feedbackSlideIn{
  from{ opacity:0; transform:translateY(12px) scale(0.96); }
  to{ opacity:1; transform:translateY(0) scale(1); }
}
.feedback-input{
  width:100%;
  padding:10px 14px;
  border:1px solid var(--border);
  border-radius:8px;
  font-size:13px;
  font-family:'IBM Plex Mono',monospace;
  background:var(--surface-3);
  color:var(--text-primary);
  transition:border-color 0.15s ease, box-shadow 0.15s ease;
}
.feedback-input:focus{
  outline:none;
  border-color:#111;
  box-shadow:0 0 0 3px rgba(0,0,0,0.08);
  background:#fff;
}
@media (max-width:480px){
  .feedback-panel{
    right:12px;
    bottom:140px;
    width:calc(100vw - 24px);
    padding:20px 16px;
  }
  .feedback-fab{
    bottom:80px;
    right:16px;
    width:44px;
    height:44px;
  }
}

/* â”€â”€â”€ Booking Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.booking-label{
  display:block;
  font-size:12px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:1px;
  margin-bottom:8px;
}
.booking-input{
  width:100%;
  padding:12px 16px;
  border:1px solid var(--border);
  background:var(--surface-3);
  color:var(--text-primary);
  font-size:15px;
  font-family:'IBM Plex Mono',monospace;
  outline:none;
  transition:border-color 0.15s ease, box-shadow 0.15s ease;
}
.booking-input:focus{
  border-color:#111;
  box-shadow:0 0 0 3px rgba(0,0,0,0.08);
}
@media(max-width: 640px){
  .booking-label{font-size:11px;}
}

/* â”€â”€â”€ Blog Post Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/* â”€â”€â”€ Blog Listing Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.blog-card{
  border:1px solid var(--border);
  border-radius:12px;
  padding:24px;
  background:var(--surface-2);
  transition:transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  display:flex;
  flex-direction:column;
}
.blog-card:hover{
  transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(0,0,0,0.08);
  border-color:#111;
}
.blog-card-meta{
  font-size:13px;
  color:var(--text-muted);
  display:flex;
  align-items:center;
  gap:6px;
  margin-bottom:10px;
  font-family:'IBM Plex Mono',monospace;
}
.blog-card-dot{color:var(--text-muted);}
.blog-card-title{
  font-size:18px;
  font-weight:700;
  line-height:1.3;
  margin-bottom:8px;
  font-family:'Syne',sans-serif;
  color:var(--text-primary);
}
.blog-card-excerpt{
  font-size:13px;
  line-height:1.7;
  color:var(--text-muted);
  margin-bottom:12px;
  flex-grow:1;
  font-family:'IBM Plex Mono',monospace;
}
.blog-card-tags{
  display:flex;
  gap:6px;
  flex-wrap:wrap;
  margin-bottom:14px;
}
.blog-card-tag{
  font-size:12px;
  color:var(--text-muted);
  text-decoration:none;
  padding:2px 8px;
  background:var(--surface-3);
  border-radius:12px;
  font-family:'IBM Plex Mono',monospace;
  transition:background 0.15s, color 0.15s;
}
.blog-card-tag:hover{background:rgba(0,0,0,0.06);color:#111;}
.blog-card-read{
  font-size:13px;
  font-weight:600;
  color:var(--accent-glow);
  text-decoration:none;
  margin-top:auto;
  transition:gap 0.2s ease;
  font-family:'Syne',sans-serif;
}
.blog-card-read:hover{
  text-decoration:underline;
}

/* â”€â”€â”€ Blog Post Detail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.blog-post-page{
  max-width:760px;
  margin:0 auto;
  padding:40px 24px 80px;
}
.blog-back-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  font-size:14px;
  font-weight:500;
  color:#666;
  text-decoration:none;
  padding:8px 16px 8px 12px;
  border-radius:8px;
  transition:all 0.2s ease;
  margin-bottom:32px;
  border:1px solid transparent;
}
.blog-back-btn:hover{
  color:#111;
  background:rgba(0,0,0,0.04);
  border-color:rgba(0,0,0,0.08);
}
.blog-post-header{
  margin-bottom:40px;
  padding-bottom:32px;
  border-bottom:1px solid var(--border);
}
.blog-post-category{
  display:inline-block;
  font-size:11px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:0.1em;
  color:var(--accent-primary);
  margin-bottom:12px;
  font-family:'IBM Plex Mono',monospace;
}
.blog-post-title{
  font-size:2.2rem;
  font-weight:800;
  line-height:1.2;
  letter-spacing:-0.02em;
  margin:0 0 16px;
  font-family:'Syne',sans-serif;
  color:var(--text-primary);
}
.blog-post-meta{
  display:flex;
  align-items:center;
  gap:6px;
  font-size:13px;
  color:var(--text-muted);
  flex-wrap:wrap;
  font-family:'IBM Plex Mono',monospace;
}
.blog-post-meta-dot{
  color:var(--text-muted);
}
.blog-post-tags{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-top:16px;
}
.blog-post-tag{
  font-size:13px;
  color:var(--text-muted);
  background:var(--surface-3);
  padding:4px 12px;
  border-radius:20px;
  text-decoration:none;
  font-family:'IBM Plex Mono',monospace;
  transition:all 0.2s;
}
.blog-post-tag:hover{
  background:rgba(0,0,0,0.06);
  color:#111;
}
.blog-post-content{
  margin-top:0;
}
.blog-post-content .prose{
  font-size:1.05rem;
  line-height:1.8;
  color:#333;
  font-family:'IBM Plex Mono',monospace;
}
.blog-post-content .prose h2{
  font-size:1.5rem;
  font-weight:700;
  margin-top:2.5em;
  margin-bottom:0.8em;
  letter-spacing:-0.01em;
  font-family:'Syne',sans-serif;
  color:var(--text-primary);
}
.blog-post-content .prose h3{
  font-size:1.2rem;
  font-weight:600;
  margin-top:2em;
  margin-bottom:0.6em;
  font-family:'Syne',sans-serif;
  color:var(--text-primary);
}
.blog-post-content .prose p{
  margin-bottom:1.2em;
}
.blog-post-content .prose blockquote{
  border-left:3px solid var(--accent-primary);
  padding:12px 20px;
  margin:24px 0;
  background:rgba(99,102,241,0.06);
  border-radius:0 8px 8px 0;
  font-style:italic;
  color:var(--text-muted);
}
.blog-post-content .prose ul,
.blog-post-content .prose ol{
  padding-left:24px;
  margin-bottom:1.2em;
}
.blog-post-content .prose ul{list-style-type:disc}
.blog-post-content .prose ol{list-style-type:decimal}
.blog-post-content .prose ul ul{list-style-type:circle}
.blog-post-content .prose li{
  margin-bottom:0.4em;
}
.blog-post-content .prose li p{margin-bottom:0}
.blog-post-content .prose strong{
  font-weight:700;
  color:var(--text-primary);
}
.blog-post-content .prose hr{
  border:none;
  border-top:1px solid var(--border);
  margin:2.5em 0;
}
@media(max-width:640px){
  .blog-post-page{padding:24px 16px 60px;}
  .blog-post-title{font-size:1.6rem;}
  .blog-post-content .prose{font-size:1rem;}
}

/* â”€â”€â”€ Blog Engagement Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.blog-engagement{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  align-items:center;
  margin-top:48px;
  padding:20px 0;
  border-top:1px solid #e5e5e5;
  border-bottom:1px solid #e5e5e5;
}
.blog-engage-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:8px 16px;
  border:1px solid #e5e5e5;
  background:#fff;
  color:#1a1a1a;
  font-size:13px;
  font-weight:500;
  font-family:inherit;
  cursor:pointer;
  text-decoration:none;
  transition:all 0.15s ease;
  border-radius:999px;
}
.blog-engage-btn:hover{
  border-color:#1a1a1a;
  background:#fff;
}
.blog-engage-liked{
  color:#dc2626;
  border-color:#fecaca;
  background:#fef2f2;
}
.blog-engage-liked:hover{
  border-color:#dc2626;
  background:#fee2e2;
}

/* â”€â”€â”€ Blog Comments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.blog-comments-section{
  margin-top:48px;
  padding-bottom:48px;
}
.blog-comments-heading{
  font-size:20px;
  font-weight:700;
  font-family:var(--font-display);
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:24px;
}
.blog-comments-count{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:26px;
  height:26px;
  background:#fff;
  border-radius:999px;
  font-size:12px;
  font-weight:600;
  font-family:var(--font-body);
}
.blog-comment-form{
  display:flex;
  flex-direction:column;
  gap:12px;
  margin-bottom:32px;
}
.blog-comment-form-row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}
.blog-comment-input{
  width:100%;
  padding:10px 14px;
  border:1px solid var(--border);
  background:var(--surface-3);
  color:var(--text-primary);
  font-size:14px;
  font-family:'IBM Plex Mono',monospace;
  outline:none;
  transition:border-color 0.15s ease, box-shadow 0.15s ease;
}
.blog-comment-input:focus{
  border-color:#111;
  box-shadow:0 0 0 3px rgba(0,0,0,0.08);
}
.blog-comment-textarea{
  resize:vertical;
  min-height:80px;
}
.blog-comment-form-footer{
  display:flex;
  align-items:center;
  gap:12px;
}
.blog-comment-submit{
  background:var(--accent-primary);
  color:#fff;
  border:none;
  padding:10px 24px;
  font-size:13px;
  font-weight:600;
  font-family:'Syne',sans-serif;
  cursor:pointer;
  letter-spacing:0.3px;
  border-radius:8px;
  transition:opacity 0.15s ease, box-shadow 0.15s ease;
}
.blog-comment-submit:hover{opacity:0.9;box-shadow:0 4px 16px rgba(0,0,0,0.12);}
.blog-comment-submit:disabled{opacity:0.5;cursor:wait;}

/* â”€â”€ Global Mobile Responsiveness â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
@media(max-width:768px){
  .container-wide{padding-left:16px;padding-right:16px;}
  h1.text-4xl,.display-font.text-4xl{font-size:2rem!important;}
  h1.text-3xl,.display-font.text-3xl{font-size:1.6rem!important;}
  .hero-heading{font-size:clamp(32px,10vw,52px)!important;}
  .hero-lead{font-size:16px;}
  .hero-cta{flex-direction:column;gap:10px;}
  .hero-cta .btn,.hero-cta .btn-outline{text-align:center;width:100%;}
}
@media(max-width:640px){
  .mt-8.grid.md\\:grid-cols-2{grid-template-columns:1fr!important;}
  .mt-8.grid{gap:16px!important;}
  .blog-engagement{flex-direction:column;align-items:stretch;}
  .blog-engage-btn{justify-content:center;}
  .blog-comment-form-row{grid-template-columns:1fr;}
  .admin-tabs{gap:0;overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .admin-tab{padding:8px 14px;font-size:13px;}
  .admin-stat-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:400px){
  .admin-stat-grid{grid-template-columns:1fr;}
}

/* â”€â”€ Toon Guide â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.toon-guide{display:flex;align-items:flex-start;gap:12px;z-index:90;}
.toon-guide-inline{margin:20px auto;max-width:460px;padding:0 24px;}
.toon-guide-fixed{position:fixed;bottom:100px;padding:16px;background:var(--surface-2);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.5);border:1px solid var(--border);}
.toon-guide-bottom-right{right:24px;}
.toon-guide-bottom-left{left:24px;}
.toon-guide-bubble{display:flex;flex-direction:column;gap:8px;}
.toon-guide-text{font-size:14px;line-height:1.55;color:var(--text);margin:0;}
.toon-guide-dismiss{
  background:none;border:none;padding:0;
  font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;
  text-decoration:underline;text-underline-offset:2px;
  align-self:flex-start;transition:color 0.2s;
}
.toon-guide-dismiss:hover{color:var(--text);}

/* â”€â”€ Scroll Hint â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.scroll-hint{
  display:flex;justify-content:center;
  margin-top:-8px;margin-bottom:16px;
  padding:12px 0;
}

/* â”€â”€ Click Pulse â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.click-pulse-wrap{position:relative;display:inline-flex;align-items:center;}
.click-pulse-label{
  position:absolute;top:100%;left:50%;transform:translateX(-50%);
  font-size:11px;color:var(--muted);white-space:nowrap;pointer-events:none;
  margin-top:4px;
}
.click-pulse-ring{
  position:absolute;inset:0;border-radius:inherit;
  border:2px solid var(--accent);pointer-events:none;
}

/* â”€â”€ Service Card Icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.service-card-icon{
  transition:transform 0.3s ease;
}

/* â”€â”€ Interactive card hover glow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.engagement-card{
  position:relative;overflow:hidden;
  transition:border-color 0.3s ease, box-shadow 0.3s ease;
}
.engagement-card::before{
  content:'';position:absolute;top:-50%;left:-50%;
  width:200%;height:200%;
  background:radial-gradient(circle,rgba(0,0,0,0.03) 0%,transparent 60%);
  opacity:0;transition:opacity 0.4s ease;pointer-events:none;
}
.engagement-card:hover::before{opacity:1;}
.engagement-card:hover{border-color:#111;box-shadow:0 8px 32px rgba(0,0,0,0.08);}

/* â”€â”€ Page transition â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
main{
  animation:page-fade-in 0.4s ease-out;
}
@keyframes page-fade-in{
  from{opacity:0;transform:translateY(8px);}
  to{opacity:1;transform:translateY(0);}
}

/* â”€â”€ Cursor follower dot (for interactive feel) â”€â”€ */
.cursor-dot{
  position:fixed;width:8px;height:8px;
  background:#111;border-radius:50%;
  pointer-events:none;z-index:9999;
  mix-blend-mode:multiply;
  transition:transform 0.15s ease, opacity 0.15s ease;
  transform:translate(-50%,-50%);
}

/* â”€â”€ Toon Guide mobile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
@media(max-width:768px){
  .toon-guide-fixed{left:16px!important;right:16px!important;bottom:80px;}
  .scroll-hint{margin-top:0;}
}
@media(max-width:640px){
  .toon-guide-fixed{padding:12px;}
  .toon-guide-text{font-size:13px;}
}
.blog-comment-success{font-size:13px;color:#16a34a;font-weight:500;}
.blog-comment-error{font-size:13px;color:#dc2626;}

.blog-comments-list{
  display:flex;
  flex-direction:column;
  gap:16px;
}
.blog-comment-item{
  padding:16px 20px;
  border:1px solid var(--border);
  background:var(--surface-2);
  transition:border-color 0.15s ease;
}
.blog-comment-item:hover{border-color:var(--accent-primary);}
.blog-comment-header{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:8px;
}
.blog-comment-avatar{
  width:32px;
  height:32px;
  border-radius:999px;
  background:var(--accent-primary);
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:13px;
  font-weight:600;
  flex-shrink:0;
}
.blog-comment-author{
  font-size:14px;
  font-weight:600;
  display:block;
}
.blog-comment-time{
  font-size:12px;
  color:#999;
  display:block;
}
.blog-comment-body{
  font-size:14px;
  line-height:1.7;
  color:#333;
  margin:0;
  white-space:pre-wrap;
  word-break:break-word;
}

@media(max-width: 640px){
  .blog-comment-form-row{grid-template-columns:1fr;}
  .blog-engagement{gap:6px;}
  .blog-engage-btn{padding:6px 12px;font-size:12px;}
  .blog-engage-btn span:not(:first-child){display:none;}
}


` 

