# Pages

Dependency trees for key pages.

## / (Home)
Entry: app/page.tsx
Dependencies:
- components/Hero.tsx
  - components/FlipBook.tsx
  - components/InteractiveElements.tsx
  - components/TextReveal.tsx
  - components/MagneticButton.tsx
- components/ServiceCard.tsx
- components/ProjectCard.tsx
- components/HomeInteractive.tsx
  - components/InteractiveElements.tsx
  - components/ToonGuide.tsx
    - components/ToonMascot.tsx
- components/TextReveal.tsx
- components/CounterReveal.tsx
- components/DragGallery.tsx
- components/MagneticButton.tsx
- app/layout.tsx
  - components/Header.tsx
  - components/Footer.tsx
  - components/WhatsAppButton.tsx
  - components/FeedbackWidget.tsx
  - components/CursorFollower.tsx
  - components/ScrollProgress.tsx
  - components/PageTransition.tsx
- styles/globals.css
- tailwind.config.js

## /services
Entry: app/services/page.tsx
Dependencies:
- components/ServiceCard.tsx
- app/layout.tsx
- styles/globals.css
- tailwind.config.js

## /work
Entry: app/work/page.tsx
Dependencies:
- components/ProjectCard.tsx
- data/projects.json
- app/layout.tsx
- styles/globals.css
- tailwind.config.js

## /contact
Entry: app/contact/page.tsx
Dependencies:
- components/ContactForm.tsx
- app/layout.tsx
- styles/globals.css
- tailwind.config.js

## /community
Entry: app/community/page.tsx
Dependencies:
- app/layout.tsx
- styles/globals.css
- tailwind.config.js

## /blog
Entry: app/blog/page.tsx
Dependencies:
- lib/mdx.ts
- app/layout.tsx
- styles/globals.css
- tailwind.config.js

## /blog/[slug]
Entry: app/blog/[slug]/page.tsx
Dependencies:
- lib/mdx.ts
- components/MDXContent.tsx
  - components/Callout.tsx
  - components/YouTube.tsx
- components/BlogEngagement.tsx
- components/CommentsSection.tsx
- app/layout.tsx
- styles/globals.css
- tailwind.config.js

## /book-session
Entry: app/book-session/page.tsx
Dependencies:
- app/layout.tsx
- styles/globals.css
- tailwind.config.js

## /about
Entry: app/about/page.tsx
Dependencies:
- data/profile.json
- app/layout.tsx
- styles/globals.css
- tailwind.config.js
