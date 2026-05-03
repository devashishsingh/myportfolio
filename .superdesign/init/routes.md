# Routes

Framework: Next.js App Router (app directory)

Global layout:
- All routes use app/layout.tsx

## Route Map
- / -> app/page.tsx
- /about -> app/about/page.tsx
- /services -> app/services/page.tsx
- /work -> app/work/page.tsx
- /work/case-study/sample -> app/work/case-study/sample/page.tsx
- /contact -> app/contact/page.tsx
- /book-session -> app/book-session/page.tsx
- /community -> app/community/page.tsx
- /community/join -> app/community/join/page.tsx
- /community/subscribe -> app/community/subscribe/page.tsx
- /blog -> app/blog/page.tsx
- /blog/[slug] -> app/blog/[slug]/page.tsx
- /blog/tags -> app/blog/tags/page.tsx
- /blog/tag/[tag] -> app/blog/tag/[tag]/page.tsx
- /teaching -> app/teaching/page.tsx
- /terms -> app/terms/page.tsx
- /privacy -> app/privacy/page.tsx
- /login -> app/login/page.tsx
- /admin -> app/admin/page.tsx

## Key Pages Summary
- Home: Hero, service cards, project gallery, counters, community CTA.
- Community: Positioning page, audience chips, pillars, and join flows.
- Blog: Post listing and post detail with MDX, likes, comments.
- Work: Portfolio grid from projects.json.
- Contact: ContactForm entry point.
