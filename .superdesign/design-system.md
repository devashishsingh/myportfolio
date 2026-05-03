# Design System

Theme: Hand-Drawn Sketchbook (Digital Sketchbook)

## Creative Direction
- Organic, imperfect, personality-first UI inspired by physical sketchbooks.
- Hand-drawn visual language over sterile corporate precision.
- Decorative tactile motifs: tape, thumbtacks, scribbles, wavy lines.

## Colors
- Background: #fdfaf6
- Dot pattern: #e5e0d8 dots (1.5px) on 32px spacing
- Primary ink/border: #1a1a1a
- Accent orange: #fb923c
- Accent yellow: #fef08a
- Accent red: #ef4444
- Accent blue: #60a5fa
- Sticky note yellow: #fef9c3

## Typography
- Heading family: Kalam, cursive (H1-H4)
- Body family: Patrick Hand, cursive
- H1 target: 96px (8xl)
- H2 target: 48px (5xl)
- Lead copy: 24px
- Body copy: 18px to 20px

## Borders, Radius, Shadows
- Borders: 3px solid #1a1a1a
- Wobbly radius: 255px 15px 225px 15px / 15px 225px 15px 255px
- Hard shadow default: 6px 6px 0 0 #1a1a1a
- Hover shadow: 3px 3px 0 0 #1a1a1a
- Active pressed: 0px shadow + downward translation

## Motion
- Float: translateY(-10px) rotate(2deg), loop duration 4s
- Scroll reveal: opacity 0 -> 1 using cubic-bezier(0.175, 0.885, 0.32, 1.275)
- Card hover: slight rotation between 1deg and -1deg
- CTA press: translateY(3px)

## Layout Principles
- Irregular, airy spacing and staggered/tilted composition.
- Break strict uniform grids where useful.
- Use dashed separators between major sections.

## Component Specs

### Navigation
- Fixed top nav.
- White wobbly card container + hard shadow.
- Logo format: {brand.sketch}
- Link hover: wavy underline with alternating accent colors.

### Hero
- Center-aligned giant H1.
- Scribble underline under key words.
- Floating icon accents (pencil, code marks).
- Two primary wobble-border CTAs with hard-press behavior.

### Feature Grid
- 3 columns.
- Each card slightly rotated uniquely (-1deg to 2deg).
- Icons in mini wobble circles with pastel fills.

### Project Gallery
- Alternating row composition.
- Image frames styled as polaroids.
- Add tape overlays and thumbtack details.
- Dashed divider between project entries.

### Contact Form
- Large sticky-note style container using #fef9c3.
- Inputs: 2px black borders + wobbly radius.
- Submit button: full width on mobile.

## Special Components

### Digital Tape Overlay
- position: absolute
- width: 80px
- height: 25px
- background: rgba(0,0,0,0.05)
- backdrop-filter: blur(2px)
- border: 1px solid rgba(0,0,0,0.1)
- transform: rotate(-3deg)
- z-index: 10

### Thumbtack Pin
- 14px circle
- fill: #ef4444
- border: 2px solid #1a1a1a
- small 2px shadow
- absolute top edge placement

### Wavy Underline Link
- default: no underline
- hover: text-decoration underline wavy #fb923c 2px
- text-underline-offset: 8px

## Fidelity Constraint
Use only the fonts, colors, motion patterns, borders, and component motifs defined in this file.
Do not introduce extra visual styles outside this design system.
