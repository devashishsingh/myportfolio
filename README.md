<div align="center">

# 🛡️ Devashish Singh — Portfolio & Platform

**Cyber Coach · Mentor · Advisor**

A full-stack personal portfolio and community platform built with Next.js 14, deployed on Vercel with Supabase PostgreSQL.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ecf8e?logo=supabase)

</div>

---

## ✨ What's Inside

This isn't just a portfolio — it's a complete personal brand platform with admin tools, a blog engine, community features, and email automation.

### 🎨 Frontend
- **Editorial design** — Clean B&W aesthetic with Inter + Playfair Display typography
- **3D FlipBook hero** — Interactive six-page flipbook powered by Framer Motion
- **Mobile responsive** — Breakpoints at 900/768/640/480/400px
- **Brand-colored social icons** — Discord, LinkedIn, GitHub with official brand colors
- **DS monogram favicon** — Custom SVG favicon matching the brand

### 📝 Blog Engine
- **Hybrid MDX + Database** — Existing `.mdx` files from filesystem + admin-created posts in PostgreSQL
- **Rich text editor** — TipTap WYSIWYG with images, YouTube embeds, code blocks, formatting
- **Engagement** — Likes, comments, reading time, share buttons (LinkedIn & Twitter)
- **Tags & categories** — Tag-based filtering, tag cloud page
- **Auto OG images** — Generated at build time from blog post metadata
- **RSS feed** — Auto-generated `/rss.xml`

### 🛡️ Admin Portal (8 Tabs)
| Tab | What it does |
|-----|-------------|
| **Dashboard** | Stats overview — invitations, subscribers, posts, regions |
| **Blog Editor** | Write & publish with TipTap rich editor |
| **Content** | Edit `profile.json` & `projects.json` live |
| **Invitations** | Review, approve/reject community join requests |
| **Subscribers** | Manage newsletter subscribers, export CSV |
| **Feedback** | View site feedback (bugs, suggestions, praise) |
| **Newsletter** | Compose & send newsletters to subscribers |
| **Bookings** | Manage session booking requests |

### 👥 Community Platform
- **Invitation-only access** — Request form with role, interests, region
- **Newsletter subscriptions** — Topic-based interest selection
- **Community posts** — Moderated content pipeline (draft → review → published)
- **Spotlight items** — Featured people, startups, tools, events

### 📬 Email System
- **SendGrid integration** — Transactional emails with graceful fallback to console
- **Contact form** — Spam-protected with rate limiting
- **Invitation emails** — Personalized community invites
- **Confirmation flows** — Subscribe/unsubscribe with token verification

### 🔒 Security
- **Cookie-based auth** — SHA-256 HMAC session tokens
- **Middleware protection** — `/admin` routes guarded at the edge
- **Timing-safe comparisons** — Prevents timing attacks on auth
- **Input validation** — Server-side sanitization on all API routes
- **No secrets in client** — All sensitive ops are server-side

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + custom CSS |
| Animation | Framer Motion |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 5 |
| Blog | MDX (next-mdx-remote 6) + gray-matter |
| Editor | TipTap (12 extensions) |
| Images | Vercel Blob (cloud storage) |
| Email | SendGrid |
| OG Images | Sharp (build-time generation) |
| Deployment | Vercel |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/devashishsingh/myportfolio.git
cd myportfolio

# Install
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database migration
npx prisma migrate dev

# Start dev server
npm run dev
```

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Supabase pooled connection string |
| `DIRECT_URL` | ✅ | Supabase direct connection (migrations) |
| `BASE_URL` | ✅ | Production URL (e.g. `https://yourdomain.com`) |
| `ADMIN_TOKEN` | ✅ | Admin login password |
| `SESSION_SECRET` | ✅ | Cookie signing secret (32+ chars) |
| `BLOB_READ_WRITE_TOKEN` | ✅ | Vercel Blob token (auto-set on Vercel) |
| `SENDGRID_API_KEY` | Optional | For transactional emails |
| `SENDER_EMAIL` | Optional | Verified sender email |
| `CONTACT_TARGET_EMAIL` | Optional | Where contact form submissions go |
| `CALENDAR_URL` | Optional | Booking calendar link |

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin portal (8-tab interface)
│   ├── api/                # 15+ API routes
│   ├── blog/               # Blog listing, posts, tags
│   ├── community/          # Join, subscribe, community hub
│   └── ...                 # About, Work, Services, Teaching, etc.
├── components/             # React components
│   ├── editor/             # TipTap blog editor
│   ├── Header.tsx          # Nav, search, social icons
│   ├── Footer.tsx          # Brand-colored social links
│   ├── FlipBook.tsx        # 3D hero flipbook
│   └── Hero.tsx            # Homepage hero section
├── content/posts/          # MDX blog posts (filesystem)
├── data/                   # profile.json, projects.json
├── lib/                    # Auth, DB, MDX, email utilities
├── prisma/                 # Schema + migrations
├── public/                 # Static assets, OG images
├── scripts/                # OG generation, utilities
└── styles/                 # Global CSS (1500+ lines)
```

---

## 📊 Database Models

```
InvitationRequest  — Community join requests
Subscriber         — Newsletter subscribers
CommunityPost      — User-submitted content
SpotlightItem      — Featured community items
Feedback           — Site feedback
Newsletter         — Newsletter campaigns
BookingRequest     — Session bookings
BlogLike           — Post likes (fingerprinted)
BlogComment        — Post comments
BlogPost           — Admin-created blog posts
SiteContent        — Dynamic site content (profile/projects)
```

---

## 🌐 Deploy to Vercel

1. Push this repo to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Add environment variables (see table above)
4. Add **Vercel Blob** store from the Storage tab
5. Deploy — Vercel auto-detects Next.js

The build runs: `prisma generate` → `generate-og.js` → `next build`

---

## 📄 License

Private project. All rights reserved.

---

<div align="center">

**Built with ☕ and purpose by [Devashish Singh](https://linkedin.com/in/devashish-singh-52a050112)**

</div>
