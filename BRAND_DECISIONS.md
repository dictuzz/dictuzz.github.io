# Brand Unification Decisions

This document logs all fundamental architectural and design system choices made during the Brand Identity Unification phase (v2.0).

## 1. Unified Typography Scale
- **Conflict**: `--text-xl` and `--text-2xl` were both `1.5rem`.
- **Resolution**: Reset `--text-xl` to `1.25rem` and `--text-xl` to `1.125rem` where appropriate to establish a true monotonic typographic scale. Added `--text-5xl` (3rem) and `--text-6xl` (3.75rem) to support Display headings natively without relying purely on ad-hoc CSS.

## 2. Global Footer Deduplication
- **Conflict**: The `.global-footer` was identically duplicated in `css/site.css` and `resume/resume.css`.
- **Resolution**: Centralized the global footer CSS into `assets/css/core.css`. `core.css` is implicitly imported by both top-level stylesheets, reducing payload size and ensuring there's only one source of truth for footer styling across all apps (Main Site, Resume, Portfolio).

## 3. The 404 Exception
- **Decision**: The 404 Snake Game serves as a deliberate "break" in the reality of the site's editorial aesthetic. It uses its own custom arcade/hacker tokens (JetBrains Mono / Inter, neon colors). It is completely exempted from the core global design system constraints by design.

## 4. Single Shadow/Z-Index Truth
- **Conflict**: Dual shadow bases existed (`rgba(52,57,68)` vs `rgba(27,36,48)`) alongside arbitrarily high `z-index` values (`1000` / `10000`).
- **Resolution**: 
  - Standardized shadows to use the `rgba(29,36,48)` base for the "warm gray" editorial feel.
  - Abolished raw integer z-indexes. Created a semantic `--z-base`, `--z-elevated`, `--z-sticky`, `--z-overlay`, `--z-skip-link` scale.

## 5. Normalized CSS Properties
- **Conflict**: `assets/css/core.css` used hardcoded padding and heights on UI elements (e.g. `min-height: 50px`, `border-radius: 24px`, `.glass` specific shadows).
- **Resolution**: All shared foundation components were tokenized (`min-height: 3.125rem`, `var(--radius-lg)` etc.) drawing from `tokens.css`. Fallback hardcoded values inside the components were dropped to enforce strict token adherence.

## 6. Body Gradient Unification
- **Conflict**: The background gradients in `critical.css` (the trust dossier page) differed significantly from `site.css` (all other pages); `site.css` used `#f7f1e7` while `critical.css` used `#f7f2e8`. The dark mode stops were also slightly unaligned.
- **Resolution**: Synchronized the body background implementations using the canonical warm cream `#f7f2e8` → `#efe6d8` and standard dark gray scale `#10161d` → `#141a22` → `#11171f`.

## 7. Portfolio Typography Bridge
- **Decision**: Kept the Portfolio app's highly thematic fonts (`Playfair Display`, `IM Fell English`, `Special Elite`) but wired the site's underlying `Fraunces` and `Manrope` fonts as `--font-brand-display` and `--font-brand-body` tokens so the global footer and shared nav bars render in alignment with the rest of the ecosystem.
