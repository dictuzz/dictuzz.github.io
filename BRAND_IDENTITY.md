# dictuzz Brand Identity Manual

## Core Idea
`dictuzz` is positioned as a calm, premium personal operating brand.

The feeling should be:
- credible
- composed
- thoughtful
- structured
- modern without looking trend-chasing

The brand is not loud luxury and not startup-minimal.
It should feel like a trusted dossier, a refined control room, and a personal system built with care.

## Motto
`Quam Plurimi et Quam Aptissimi`

Use the motto sparingly.
It works best as a signature line, not as repetitive headline copy.

## Brand Personality
- Clear under pressure
- Warm but not casual
- Precise without sounding cold
- Elegant without becoming decorative
- Confident without bragging

## Visual Principles
1. Clarity first
Every screen should be easy to scan in under a few seconds.

2. Structured calm
Layouts should feel deliberate and stable, with visible hierarchy and breathing room.

3. Editorial trust
Typography and spacing should evoke a premium reading experience, not a generic app dashboard.

4. Restrained signal
Gold and blue accents are used to guide attention, not to dominate the interface.

5. Motion with purpose
Animation should support polish and pacing, never spectacle.

## Color System
### Light theme
- Background: `#f5efe4`
- Background alt: `#efe4d4`
- Surface: `#fffaf2`
- Text primary: `#1d2430`
- Text muted: `#5a6778`
- Accent blue: `#335c87`
- Accent gold: `#c4974f`

### Dark theme
- Background: `#121820`
- Background alt: `#171f29`
- Surface: `#171d25`
- Text primary: `#f4efe7`
- Text muted: `#bec7d3`
- Accent blue: `#8da8c6`
- Accent gold: `#d1ab69`

## Typography
### Display
- `Fraunces`
- Used for major headings, page titles, and signature statements
- Tone: editorial, mature, intelligent

### Body
- `Manrope`
- Used for paragraphs, metadata, UI labels, and navigation
- Tone: clean, modern, readable

### Typography behavior
- Headlines use tight tracking and strong vertical rhythm
- Body copy should stay readable and never become dense
- Avoid excessively small text unless it is metadata

## Layout Rules
- Prefer generous outer spacing with tighter inner grouping
- Keep content widths readable; avoid full-width text blocks
- Use rounded surfaces with soft shadows, not harsh rectangles
- Cards should feel like refined containers, not floating gadgets

## Surface Language
- Surfaces use soft translucency or layered light, not heavy glassmorphism
- Borders are subtle and usually low-contrast
- Shadows should be diffused and premium, never aggressive
- Rounded corners are part of the identity and should stay consistent

## Motion Rules
- Use subtle reveal-on-scroll only where it improves pacing
- Hover motion should stay within `1px-4px` vertical movement
- Looped animations should be rare and soft
- Always respect `prefers-reduced-motion`

## Imagery
- Portrait framing should feel formal, intentional, and high-trust
- Supporting imagery should reinforce systems, operations, community, and execution
- Avoid random stock-feeling visuals or overly abstract futuristic imagery

## Voice and Copy
- Write like a thoughtful operator, not a marketer
- Prefer exact language over hype
- Keep copy compact and human
- Trust should come from clarity, not exaggeration

## Component Guidance
### Homepage
- Compact, fast, and decisive
- A link hub, not a profile essay

### Portfolio
- Feels like a curated case-study gallery
- Each project should read as evidence of thinking and execution

### Resume
- Feels like a trust dossier
- Should be easy for interviewers to scan and remember

## Logo Usage
- Use the website mark in compact contexts like headers and identity lockups
- Keep logo treatments clean and framed
- Avoid oversized decorative logo usage

## Implementation Notes
- Shared brand base lives in `/css/site.css`
- Resume-specific trust-dossier styling lives in `/css/critical.css` and `/resume/resume.css`
- Portfolio-specific styling lives in `/css/portfolio.css` and `/css/portfolio-detail.css`
- The brand should stay consistent across homepage, portfolio, and resume before new pages are added
