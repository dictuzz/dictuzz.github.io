# dictuzz UI System

Complete reference for the dictuzz design system. All values are defined as CSS custom properties in `assets/css/tokens.css` and utility classes in `assets/css/core.css`.

## Design Tokens

### Colors (Light / Dark)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--site-bg` | `#f5efe4` | `#121820` | Page background |
| `--site-surface` | `#fffaf2` | `#171d25` | Card/panel fill |
| `--site-text` | `#1d2430` | `#f4efe7` | Primary text |
| `--site-text-muted` | `#5a6778` | `#bec7d3` | Secondary text |
| `--site-accent` | `#335c87` | `#8da8c6` | Accent blue |
| `--site-accent-gold` | `#c4974f` | `#d1ab69` | Accent gold |
| `--color-success` | `#2d8a56` | `#3ddc84` | Success state |
| `--color-warning` | `#b8860b` | `#f0c040` | Warning state |
| `--color-error` | `#c0392b` | `#e74c3c` | Error state |
| `--color-info` | `#2874a6` | `#5dade2` | Info state |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-display` | Fraunces | Headings, titles |
| `--font-body` | Manrope | Body, labels, UI |
| `--text-xs` | 0.75rem | Captions |
| `--text-sm` | 0.875rem | Small text |
| `--text-base` | 1rem | Body text |
| `--text-lg` | 1.125rem | Emphasis |
| `--text-xl`–`--text-4xl` | 1.25–2.5rem | Headlines |

### Spacing

4px-based scale via `--space-2` (0.5rem) through `--space-20` (5rem).

### Shadows, Radii, Animation

| Category | Tokens |
|----------|--------|
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| Radii | `--radius-sm` (12px), `--radius-md` (16px), `--radius-lg` (22px), `--radius-xl` (28px) |
| Motion | `--duration-fast` (160ms), `--duration-normal` (260ms), `--duration-slow` (340ms) |
| Easing | `--ease-out`, `--ease-soft` |

---

## Components

### Card (`.card`)
Surface container with gradient overlay and configurable elevation. Add `.card--interactive` for hover lift.

### Button (`.btn` / `.button`)
Pill-shaped interactive element. Variants: `.btn--primary`, `.btn--ghost`, `.btn--outline`. Add `.btn--glow` for emphasis.

### Glass (`.glass`)
Glassmorphism surface with backdrop blur. Add `.glass--hover` for interactive lift on hover/focus.

### Reveal (`.reveal`)
Scroll-triggered entrance animation. Variants: `.reveal--left`, `.reveal--right`. Uses `is-visible` class toggle.

---

## Utility Classes

### Typography
`.text-xs` `.text-sm` `.text-base` `.text-lg` `.text-xl` `.text-2xl` `.text-3xl` `.text-4xl`
`.text-muted` `.text-subtle` `.text-center` `.text-right`
`.font-display` `.font-body` `.font-bold` `.font-semibold`

### Spacing
`mt-{2,4,6,8,12,16}` `mb-{2,4,6,8}` `px-{4,6}` `py-{4,8}` `gap-{2,4,6}`

### Layout
`.container` `.flex` `.flex--center` `.grid` `.grid--2`

### Accessibility
`.sr-only` — Visually hidden, screen-reader accessible
`.focus-ring` / `:focus-visible` — Consistent 2-tone focus ring using `--focus-ring`

---

## Theme System

Implemented via `data-theme` attribute on `<html>` and `ThemeManager` class in `js/ui-kit.js`.
- Toggle: `ThemeManager.toggle()`
- Persisted to `localStorage` under key `dictuzz-theme`
- Cross-tab sync via `storage` event
- Respects `prefers-color-scheme` on first visit

---

## Accessibility

- All interactive elements have ≥44px touch targets
- `prefers-reduced-motion: reduce` disables all animations
- Focus ring uses high-contrast 2-tone box-shadow
- `.sr-only` available for screen-reader-only content
- Semantic HTML used throughout; ARIA added where needed
