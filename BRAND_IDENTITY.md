# dictuzz.github.io — Brand Identity & Design System

This is the canonical source of truth for the dictuzz platform brand identity. 

## 1. Brand Concept & Aesthetic
The dictuzz identity is designed to evoke an **"Editorial Archive / Detective Case Board"** aesthetic.
- **Tone:** Professional, Trustworthy, Forensic, Deep, Methodical.
- **Role:** The platform behaves like an investigative dossier — presenting deep research, organized intelligence, and structured case studies.
- **Key Concepts:** Glassmorphism layers over structured grids, "red string and thumbtack" connections (in the Portfolio app), and highly legible journalistic typography (Main Site/Resume).

### The Exceptions
**The 404 Page (`/404.html`)** is intentionally excluded from this design system. It operates as an isolated digital anomaly (a retro arcade game) featuring its own neon syntax and `Inter / JetBrains Mono` type stack.

---

## 2. Global Typography Stack

The typography stack balances premium editorial authority with sharp, modern digital utility. It is implemented natively in `tokens.css`.

### Primary Display: Fraunces
Used exclusively for `H1`, `H2`. Brings warmth, authority, and editorial gravitas.
- `font-family: 'Fraunces', Georgia, serif;`

### Primary Body: Manrope
Clean, highly legible geometric sans for UI elements, paragraphs, buttons, and navigation. 
- `font-family: 'Manrope', system-ui, sans-serif;`

### Portfolio Alternate Typestack
The `/portfolio-app/` uses thematic fonts (`Playfair Display`, `IM Fell English`, `Special Elite`) to push the "detective's corkboard" metaphor, but falls back to pulling global styling for footer modules.

---

## 3. Color Palette & Theming (Tokens.css)

All color tokens revolve around a base dual-identity: Warm Cream/Paper (Light theme) vs Ink/Slate (Dark Theme).
*Never use hardcoded hex values in component CSS. Always use the semantic aliases listed below.*

### Primary Brand Colors
- **The Signature Gold:** `--color-primary-500` (`#c4974f`)
- **The Intelligence Blue:** `--color-secondary-500` (`#335c87`)

### Core Surfaces (Light Theme)
- **Page Background:** `--color-surface-page` (`#f5efe4`)
- **Elevated Cards:** `--color-surface-card` (`#fffaf2`)
- **Text Primary:** `--color-text-primary` (`#1d2430`)
- **Universal Borders:** `--color-border-default` (`rgba(29,36,48,0.10)`)

### Core Surfaces (Dark Theme)
- **Page Background:** `--color-surface-page` (`#121820`)
- **Elevated Cards:** `--color-surface-card` (`#171d25`)
- **Text Primary:** `--color-text-primary` (`#f4efe7`)
- **Universal Borders:** `--color-border-default` (`rgba(255,255,255,0.08)`)

### Semantic Indicators
- **Active/Success:** `--color-status-active` (`#1db954`)

---

## 4. Layout & Spacing Primitives

All spacing adheres strictly to an **8-point system** scaled in `rem`. 

| Token | Value | Pixel Equiv | Ideal Use |
| :--- | :--- | :--- | :--- |
| `--space-1` | `0.5rem` | 8px | Between dense UI icons / tags |
| `--space-2` | `1rem` | 16px | Internal padding for small cards/buttons |
| `--space-3` | `1.5rem` | 24px | Gaps between related paragraphs |
| `--space-6` | `3rem` | 48px | Standard section separation |
| `--space-10` | `5rem` | 80px | Major page segment margins |

---

## 5. Shape & Depth

The UI relies heavily on softly rounded, approachable interactive surfaces, lifted through a robust shadow array.

### Radius (Personality: "Round & Premium")
- **Standard Card:** `--radius-lg` (`22px` / `1.375rem`)
- **Major Shell / Container:** `--radius-2xl` (`34px` / `2.125rem`)
- **Tags, Inputs, Pills:** `--radius-full` (`9999px`)

### Shadows (The "Warm Gray" Lift)
Our shadow system has a unified base color: `rgba(29, 36, 48)`.
- **Card Base:** `--shadow-md`
- **Hover/Interaction:** `--shadow-lg`
- **Brand Glow Base:** `--shadow-brand` (`rgba(196, 151, 79, 0.22)`)

---

## 6. Architecture & File Structure

The structural CSS for dictuzz runs sequentially:
1. `tokens.css`: The root source of truth. Contains palettes, scales, sizes, themes.
2. `core.css`: Component library (`.card`, `.btn`, `.global-footer`, `.glass`). Requires `tokens.css`.
3. `site.css`: Layout behaviors for overarching pages. Requires `core.css`.
4. Feature Styles (e.g., `resume.css`, `critical.css`): Feature-level implementations overriding or extending core elements.

### The Single Footer Law
The global footer exists in `core.css` ONLY. The logic to inject this into static HTML is governed via `site-renderers.js`, ensuring every segment of the site remains harmonized natively.
