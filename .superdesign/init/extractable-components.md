# Extractable Components

## Header
- Source: components/Header.tsx
- Category: layout
- Description: Main navigation with desktop/mobile variants and search.
- Extractable props: activeItem (string, default: home), showSearch (boolean, default: true)
- Hardcoded: logo and icon SVGs, nav labels, classes.

## Footer
- Source: components/Footer.tsx
- Category: layout
- Description: Global footer with social links and branding.
- Extractable props: year (string, default: current year)
- Hardcoded: icon SVGs, link labels, classes.

## ServiceCard
- Source: components/ServiceCard.tsx
- Category: basic
- Description: Reusable service card with icon and CTA.
- Extractable props: title, subtitle, href, cta, icon
- Hardcoded: icon art and base visual style.

## ProjectCard
- Source: components/ProjectCard.tsx
- Category: basic
- Description: Reusable project card with tags and CTA.
- Extractable props: title, category, excerpt, href, cta
- Hardcoded: tech icon mappings and style classes.

## ContactForm
- Source: components/ContactForm.tsx
- Category: basic
- Description: Reusable contact capture form.
- Extractable props: submitLabel (string, default: Send message)
- Hardcoded: field labels and control structure.
