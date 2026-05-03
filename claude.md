# `claude.md` — Project Operating Manual for AI Pair Programmers

> **Audience:** Claude (and any other AI agent) collaborating on this codebase.
> **Goal:** Give the agent the full mental model of `dictuzz.github.io` so it never has to guess about architecture, conventions, content contracts, or deployment.
>
> Read this **end-to-end before** making any non-trivial change. When something here disagrees with the code, the **code wins** — but please flag the drift in your PR description so this file can be updated.

---

## 0. TL;DR (read this first)

- This repo is **one static product** served at `https://dictuzz.me` from GitHub Pages: hand-written HTML, plain CSS, vanilla JS, no build step, no framework runtime.
- Public surfaces:
  1. Root homepage (`/index.html`) — link-hub bio card.
  2. Resume (`/resume/`) — long-form, i18n (EN/ID/DE).
  3. Portfolio (`/portfolio/`) — _The Operational Record_, an NYT-inspired editorial magazine treatment with a landing edition + per-case-file long-form articles in `/portfolio/cases/<slug>/`.
  4. Terms (`/terms/`).
  5. `404.html` — deliberate retro arcade aesthetic break (its own token stack).
- The previous **Next.js portfolio app** (`portfolio-app/`) and the published static-export mirror at the root `portfolio/` have been **removed**. The current portfolio is hand-written HTML + CSS + JS that uses the same Fraunces + Manrope type system as the rest of the site.
- All shared copy (profile, contact, socials, SEO, navigation, home folders, resume locales, portfolio case studies) lives as **JSON in `/content/`**. Portfolio case-study HTML is kept in sync with `/content/portfolio/case-studies.json`; both must agree.
- **Quality gate (must pass before merge):**
  - `npm run validate:content` (root)
  - `npm test` (root, Node `--test` runner)
- **CI:** `.github/workflows/deploy.yml` runs `validate:content` + root tests on push to `main` and on PRs. Node **20** in CI.
- **Deploy:** GitHub Pages serves the entire repo as-is (`.nojekyll` is present, `CNAME` is `dictuzz.me`). No publish step.
- **Branding rule:** never break the contract enforced by `js/site-content.js` (`validateSharedSiteConfig`, `validateHomeContent`, `validateResumeContent`) and the `validatePortfolioCaseStudies` / `validatePortfolioHome` helpers in `scripts/validate-content.mjs`. Validators reject `[TODO: ...]` placeholders, missing required fields, and duplicate slugs/aliases.

---

## 1. Identity & Brand Constants

These values are **canonical**. They appear in many files and must be kept in sync via `content/site.json`.

| Field | Value |
|---|---|
| Site name | `dictuzz` |
| Domain | `https://dictuzz.me` |
| Author | `Benedictus Richard Ricardo` (handle: `dictuzz`) |
| Title | `Systems Architect & Automation Specialist` |
| Location | `Bandung, Indonesia` |
| Timezone | `Asia/Bangkok` (UTC+7) |
| Contact email | `contact@dictuzz.me` |
| Theme color (light) | `#f5efe4` |
| Theme color (dark) | `#121820` |
| Primary brand gold | `#c4974f` |
| Secondary blue | `#335c87` |
| Display font (root + resume) | `Fraunces` (serif) |
| Body font (root + resume) | `Manrope` (sans-serif) |
| Portfolio headline font | `Fraunces` (shared with site) |
| Portfolio body font | `Fraunces` (shared with site) |
| Portfolio utility font | `Manrope` (shared with site) |
| Resume locales | `en` (default), `id`, `de` |
| Twitter handle | from `siteConfig.seo.twitterCreator` |

**Design aesthetic:** _“Editorial Archive / NYT Magazine.”_ Root + resume + portfolio share the same warm, paper-like editorial system. The portfolio is laid out as an NYT-inspired magazine: masthead, lead story / from-the-editor block, multi-column case-file front, sidebar feature for capabilities and profile, and a “letter from the editor” contact close. Per-case sub-pages are long-form articles with drop caps, pull quotes, decked headlines, and a numbered evidence list.

See `BRAND_IDENTITY.md` and `BRAND_DECISIONS.md` for the complete decision log (why specific tokens were unified, what aliases are deprecated, etc.).

---

## 2. Top-Level Repository Layout

```
dictuzz.github.io/
├── index.html                  # Home / bio card / accordion of links
├── 404.html + js/404.js + css/404.css
│                               # Snake-game 404 page (noindex)
├── sitemap.xml, robots.txt, site.webmanifest, CNAME, .nojekyll
├── favicon*, apple-touch-icon.png, og-image.png, web-app-manifest-*.png
│
├── content/                    # Single source of truth (JSON)
│   ├── site.json               # Profile, contact, socials, footer nav, SEO pages
│   ├── home.json               # Folders + items for the home accordion
│   ├── resume/                 # i18n: en.json | id.json | de.json
│   └── portfolio/              # home.json + case-studies.json (consumed by Next app)
│
├── js/                         # Static site ES modules (vanilla)
│   ├── home.js                 # Home page bootstrap
│   ├── terms.js                # Terms page bootstrap
│   ├── 404.js                  # Snake game (canvas)
│   ├── site-content.js         # JSON loader + validators + cache
│   ├── site-renderers.js       # HTML rendering helpers
│   ├── site-seo.js             # Runtime SEO meta + JSON-LD
│   ├── ui-kit.js               # ThemeManager, Typer, theme-color sync
│   └── icon-kit.js             # SVG icon registry / upgrade
│
├── css/                        # Page-level CSS
│   ├── critical.css            # Above-the-fold inlined-style support
│   ├── site.css                # Shared site CSS (imports tokens + core)
│   └── 404.css                 # Snake-game styles
│
├── assets/
│   ├── css/tokens.css          # **Design tokens (single source of truth)**
│   ├── css/core.css            # Shared utility classes (.card, .btn, .glass…)
│   └── images/                 # WebP-optimized photography + portraits
│
├── resume/
│   ├── index.html              # Resume page (long, structured, i18n)
│   ├── resume.css              # Resume-only styles
│   ├── resume.js               # Bootstrap (DOMContentLoaded entry point)
│   ├── resume-state.js         # Module-level singleton state
│   ├── resume-content-loader.js # Locale resolution + storage
│   ├── resume-renderers.js     # Section renderers (experience, skills…)
│   ├── resume-interactions.js  # Theme, scrollspy, profile tilt, typer
│   └── resume-seo.js           # Runtime <meta>/JSON-LD per locale
│
├── terms/index.html            # Static legal terms page (uses shared footer)
│
├── portfolio/                  # **Published static mirror of the old portfolio.**
│                               # DO NOT HAND-EDIT. Regenerated only via the
│                               # legacy publish flow (currently disabled).
│
├── portfolio-app/              # Next.js 16 portfolio source (see §6)
│   ├── package.json            # next 16.1.6, react 19.2.4, framer-motion 12, tailwindcss 4
│   ├── next.config.ts          # basePath: '/portfolio', trailingSlash: true
│   ├── proxy.ts                # Cookie-gated middleware (matcher /portfolio/:path*)
│   ├── tsconfig.json           # strict, baseUrl '.', alias '@/*'
│   ├── app/                    # App Router pages
│   ├── components/             # React components
│   ├── config/board.ts         # Board canvas constants
│   ├── content/                # TS wrappers around JSON in generated-content/
│   ├── data/cases.ts           # CaseStudy → BoardCase adapter
│   ├── hooks/                  # use-board-camera, use-prefers-reduced-motion…
│   ├── lib/                    # auth, content, seo, utils
│   ├── scripts/                # sync-content, generate-protected-content, publish (disabled)
│   ├── public/                 # Static portfolio assets (favicons, og)
│   └── generated-content/      # **Auto-copied** from /content at build time (gitignored?)
│
├── docs/                       # Human docs (content guide, SEO, UI system, perf)
├── tests/                      # Node --test runner specs (root)
├── scripts/validate-content.mjs # Pre-merge content validator
├── .agent/workflows/           # Reusable workflow prompts
├── .github/workflows/deploy.yml
│
├── .editorconfig, .eslintrc.json, .prettierrc, .gitignore
├── package.json                # Root scripts (dev, test, validate:content, build:portfolio)
└── README.md, BRAND_IDENTITY.md, BRAND_DECISIONS.md, REFACTOR_REPORT.md, SEO_*.md
```

**Important:** the root `portfolio/` directory is generated output, not source. The current source is `portfolio-app/`. Treat anything under `portfolio/` as immutable artifact unless you are intentionally re-publishing.

---

## 3. The Three Surfaces (Architecture)

### 3.1 Surface A — Static root (`/`, `/resume/`, `/terms/`, `/404.html`)
- **Stack:** plain HTML5 + vanilla ES modules (no bundler) + plain CSS that imports `tokens.css` + `core.css`.
- **Module loading:** every entrypoint HTML uses `<script type="module" src="/js/<page>.js">`. There is no bundler, no transpiler, no test for browser support older than ES2022.
- **Content loading:** all dynamic copy comes from `/content/*.json` via `fetch()`. Validators in `js/site-content.js` reject malformed JSON; renderers degrade gracefully (`renderDirectoryUnavailableMarkup`).
- **SEO:** Both static (in HTML) and runtime (via `js/site-seo.js`). The static values are the canonical fallback for non-JS crawlers; runtime values are richer and include JSON-LD.
- **Theme:** `ThemeManager` (`js/ui-kit.js`) handles `data-theme` on `<html>`, persists to `localStorage` (`dictuzz-theme`), syncs across tabs via `storage` event, and respects `prefers-color-scheme` on first visit. It dispatches a `theme-changed` CustomEvent on `window`.
- **Animations:** Intersection-observer-driven `.reveal` class, with a `prefers-reduced-motion` opt-out path.

### 3.2 Surface B — Resume (`/resume/`)
- Same vanilla stack as Surface A but **i18n** in 3 locales (`en`, `id`, `de`).
- Locale resolution order (`resume/resume-content-loader.js → getInitialLanguage`):
  1. `?lang=` query param
  2. `localStorage["dictuzz-lang"]`
  3. `navigator.language.split('-')[0]`
  4. `'en'` (default)
- After load, `resume-content-loader` writes back the chosen locale to localStorage and rewrites the URL with `history.replaceState`. Also sets `document.documentElement.lang`.
- **Renderers (`resume-renderers.js`)** are isolated and **must not throw** the whole bootstrap; `resume.js` wraps each in a try/catch and calls `console.error` only — failures don’t block other sections.
- **Validation:** `validateResumeContent` enforces `locale`, `strings.hero.role`, `sections.experience[]`, `collections.skills.strategic[]`, `downloads.resumeUrl` starts with `https://`.
- **SEO:** `resume-seo.js` rebuilds title/description/canonical/OG/JSON-LD on each locale switch (so canonical stays `/resume/` but OG/Twitter copy changes).

### 3.3 Surface C — Portfolio (`/portfolio/`, served by `portfolio-app/`)
- **Stack:** Next.js 16.1.6 (App Router) + React 19.2.4 + TypeScript (strict) + Tailwind CSS v4 + Framer Motion 12.
- **basePath:** `/portfolio`, **trailingSlash:** `true` (see `next.config.ts`). All internal links must respect this.
- **Auth:** Cookie-based gate enforced by `proxy.ts` (Next middleware exported as `proxy`). Public paths: `/login`, `/api/portfolio-auth`. Everything else under `/portfolio/` (including `/work/[slug]/`) requires the cookie.
  - Cookie name: `dictuzz-portfolio-access`, value `'granted'`, `httpOnly`, `sameSite: lax`, `secure` in prod, `maxAge` 12h, `path: /`.
  - Access key: `process.env.PORTFOLIO_ACCESS_KEY` (defaults to `'dictuzzportfolio'` only in dev — see `lib/auth.ts`).
  - Wrong key redirects to `/resume/#connect`. After success, redirects to `next` query param.
- **Data flow:** `lib/content.ts` re-exports validated copies of JSON imported via `content/*.ts`. The TS wrappers import from `generated-content/`, which is populated by `scripts/sync-content.mjs` (copies `/content/` into the app at `dev`/`build`/`test`/`typecheck` time).
- **Static export of protected payloads:** `scripts/generate-protected-content.mjs` AES-256-GCM encrypts content using `PORTFOLIO_ACCESS_CODE` (PBKDF2 / SHA-512 / 350k iterations) and writes JSON envelopes to `public/protected/`. This is for an alternate “fully static + client-decrypts” path. The currently-active path is the cookie middleware approach; the encrypted output exists but isn’t the primary access mechanism.
- **`scripts/publish.mjs` is intentionally disabled** — it throws an error explaining the new portfolio needs a runtime host and cannot be statically published.

---

## 4. Content Model (`/content/`) — The Contract

Editing copy means editing **JSON**, not HTML. Each JSON file has a strict shape enforced by both the standalone Node validator (`scripts/validate-content.mjs`) and the runtime validators (`js/site-content.js`, `portfolio-app/lib/content.ts`).

**Universal rule:** any string `[TODO: ...]` anywhere in the tree fails validation.

### 4.1 `content/site.json`
Shared by every surface. Required keys (verified by `validateSharedSiteConfig`):
- `site` — `name`, `domain`, `siteUrl`, `defaultLocale`, `themeColorLight`, `themeColorDark`
- `profile` — `name`, `handle`, `title`, `description`, `longDescription`, `motto`, `image: { portrait, og, resumeOg, alt }`, `location: { city, countryCode, countryName, timeZone }`, `alumniOf: { name, url }`, `knowsAbout: string[]`
- `contact` — `email` (must contain `@`), `whatsappLabel`, `whatsappUrl`, `calendarUrl`
- `socials[]` — `{ id, label, url, icon }`
- `navigation.footer[]` — `{ label, href }`
- `seo` — `twitterCreator`, `keywords`, `pages` map keyed by `home | resume | terms | portfolio | portfolioLogin` with `{ path, title, description, ogType, titleTemplate? }`

### 4.2 `content/home.json`
Used by the homepage accordion. Required (verified by `validateHomeContent`):
- `folders: Array<{ id: string (unique), title, summary?, items: Array<...> }>`
- Each `items[]` entry typically has `{ icon, label, value, href, external?, kind? }`

The home page renders three sections in the order they appear; see `js/site-renderers.js → renderFoldersMarkup`.

### 4.3 `content/resume/{en,id,de}.json`
Required shape (verified by `validateResumeContent`, then normalized by `normalizeResumeTranslations`):
- `locale` (`'en' | 'id' | 'de'`)
- `strings` — `hero`, `nav`, `section`, `sectionLede`, plus translation keys consumed via `data-i18n="..."` lookups (dot-path resolution)
- `sections` — `experience[]`, `education[]`, `certifications[]`, `impact[]`, `awards[]`, `etc[]`, `testimonials[]`
- `collections` — `skills.strategic[]`, `skills.technical[]`, `languages[]`, etc.
- `downloads.resumeUrl` — must start with `https://`
- `seo.description?` — overrides default per-locale meta description

When adding a new locale you must (a) extend `SUPPORTED_LANGS` in `resume/resume-state.js`, (b) add a matching `<button class="lang-btn" data-lang="...">` in `resume/index.html`, and (c) pass the validator with the same shape.

### 4.4 `content/portfolio/home.json` and `content/portfolio/case-studies.json`
Consumed by the Next.js app. Types in `portfolio-app/content/types.ts`:
- `PortfolioHomeData` — masthead, hero, profile, capabilityClusters, contact
- `CaseStudy` — `slug`, optional `aliases[]`, full editorial copy (problem/intervention/outcome), `impact: ImpactMetric[]`, `narrative: NarrativeSection[]`, `board: BoardPresentation`, `image: EvidenceImage`, optional `testimonial`

Validation rules on case studies (`validateCaseStudies`, `validatePortfolioCaseStudies`):
- `slug` is required and **globally unique**
- `aliases[]` are globally unique and **must not collide with any slug**
- `impact[]` and `narrative[]` are arrays
- `board` and `image` are objects

The `aliases[]` list drives the catch-all redirect route `app/[legacySlug]/page.tsx`, which 308-redirects each alias to `/work/<canonical-slug>/`. Removing an alias breaks back-compat URLs.

---

## 5. Static Site Module Reference

Every JS module is hand-authored ES2022 and meant to run in the browser without transpilation.

### 5.1 `js/site-content.js`
- **`JSON_CACHE`** — module-level Map for `fetchContentJson(path)` (deduplicates network calls; `clearContentCache()` exposed for tests).
- **`fetchContentJson(path)`** — returns parsed JSON. Throws if `!response.ok` or invalid JSON.
- **Loaders**: `loadSiteConfig()`, `loadHomeContent()`, `loadResumeContent(locale)` — each runs the matching validator before returning.
- **`normalizeResumeTranslations(content)`** — flattens `strings` for `data-i18n` lookups.
- **`toAbsoluteUrl(siteUrl, path)`** — safe URL resolution.

### 5.2 `js/site-renderers.js`
- **`escapeHtml(text)`** — minimal HTML-escape; **always use this** when injecting copy into innerHTML strings.
- **`renderFoldersMarkup(folders)`** — produces the home-page accordion.
- **`renderDirectoryUnavailableMarkup()`** — error fallback.
- **`createFooterViewModel(siteConfig, currentPath)` / `renderFooterMarkup(viewModel)` / `applyGlobalFooter(siteConfig, footerElement?, currentPath?)`** — single shared footer; the “current page” link is auto-pruned.

### 5.3 `js/site-seo.js`
- **`applyManagedPageMetadata(siteConfig, pageKey, overrides?)`** — rewrites `<title>`, `<meta name="description">`, canonical, OG, Twitter from `siteConfig.seo.pages[pageKey]`.
- **`buildHomeStructuredData(siteConfig)`** — `Person + WebSite + ProfilePage` JSON-LD graph.
- **`applyStructuredData(scriptId, value)`** — replaces a `<script type="application/ld+json">` payload by id (e.g. `home-structured-data`).

### 5.4 `js/ui-kit.js`
- **`ThemeManager`** — constructor `{ toggleElement, storageKey, iconElement, defaultTheme }`. Toggling sets `data-theme` on `<html>`, persists, dispatches `theme-changed` CustomEvent. Cross-tab sync via `storage`. **Default storage key** for the homepage is `dictuzz-theme`; resume reuses the same key.
- **`updateThemeColor(theme, themeMeta?)`** — keeps `<meta name="theme-color">` in sync with the active theme.
- **`Typer`** — typewriter animation. `new Typer(element, texts: string[], speedMs)`. Has `.stop()`. Owners must stop the previous instance before creating a new one (resume does this on locale switch).

### 5.5 `js/icon-kit.js`
- `ICON_MAP` — minimal SVG paths keyed by name.
- **`upgradeIcons(root = document)`** — walks `[data-icon]` nodes and inflates them into inline SVG; idempotent.

### 5.6 `js/home.js` & `js/terms.js` & `js/404.js`
- `home.js` — orchestrates `loadSiteConfig` + `loadHomeContent`, calls renderers and SEO, sets up theme + clock + “local time/date” widgets, schedules **route prefetching** for `/resume/` + `/portfolio/` based on the connection’s `effectiveType`.
- `terms.js` — minimal: load config, apply metadata, apply footer, upgrade icons.
- `404.js` — self-contained Snake game on `<canvas>`. Tracks score in `localStorage`, randomized death messages. The 404 page is `noindex,nofollow` and is **excluded from the sitemap**.

---

## 6. Portfolio App (`portfolio-app/`) Reference

### 6.1 Routes (App Router)
- `app/page.tsx` → `/portfolio/` — renders `<PortfolioBoard cases={...} home={...} />` (the case-board evidence wall).
- `app/login/page.tsx` → `/portfolio/login/` — passphrase form, posts to `app/api/portfolio-auth/route.ts`.
- `app/api/portfolio-auth/route.ts` — POST handler that compares against `PORTFOLIO_ACCESS_KEY` (env var) and sets the cookie.
- `app/work/[slug]/page.tsx` → `/portfolio/work/<slug>/` — renders `<CaseFilePage caseStudy={...} related={...} />`. `dynamicParams = false` and `generateStaticParams()` enumerates all canonical slugs.
- `app/[legacySlug]/page.tsx` → catch-all that maps each `aliases[]` entry to a 308 redirect to `/work/<canonical>/`. Marked `noIndex` in metadata.
- `app/not-found.tsx` & `app/error.tsx` (if present) — standard Next.js error UI.

### 6.2 Components / hooks
- `components/portfolio/PortfolioBoard.tsx` — thin client wrapper rendering `CaseBoardSection`.
- `components/sections/case-board.tsx` — the big interactive wall: `framer-motion`, `useBoardCamera`, ResizeObserver-driven node measurement, viewport responsive (mobile fallback at `< 768px`, reduced-motion fallback). Uses `BOARD_CONFIG`, `INTRO_NODE`, `CONTACT_NODE` from `config/board.ts`.
- `components/sections/case-card.tsx` — individual evidence card.
- `components/portfolio/CaseFilePage.tsx` — long case dossier (newspaper clipping treatment + chalkboard background).
- `components/ui/*` — small primitives: `chalkboard-bg`, `case-stamp`, `status-stamp`, `newspaper-clipping`, `red-string`, `tape-strip`, `thumbtack`, `intro-card`, `contact-card`, `case-navigator`.
- `hooks/use-board-camera.ts` — encapsulates spring-driven camera (`useSpring`, `useScroll`, `useMotionValueEvent`), waypoint interpolation, idle drift, scroll-driven `activeIndex`.
- `lib/utils.ts` — `cn()` (clsx + tailwind-merge), `lerp`, `clamp01`, `smoothstep`.

### 6.3 SEO / metadata
- `app/layout.tsx` builds `metadata` from `siteConfig.seo.pages.portfolio`, with `metadataBase: siteUrl`. OG image is resolved against `siteUrl`.
- `lib/seo.ts → buildMetadata({ title, description, path, noIndex })` is the helper used by `[slug]` and `[legacySlug]` routes. It composes `${title} · ${siteConfig.profile.title}` for the rendered tab title.

### 6.4 Scripts (`portfolio-app/scripts/`)
- `sync-content.mjs` — copies `/content/` (sibling of the app) into `portfolio-app/generated-content/`. Runs **before** `dev`, `build`, `test`, `typecheck`. Without it, the TS `import` from `generated-content/...` fails.
- `generate-protected-content.mjs` — encrypts `home`, `caseStudies`, `insights` plus per-slug payloads using `PORTFOLIO_ACCESS_CODE`. Output: `public/protected/*.json`. **Required** during `npm run build` if `auth.json` doesn’t already exist; otherwise it is skipped with a log line.
- `publish.mjs` — **disabled.** Throws to make sure no one tries to ship the portfolio as a static export with the cookie middleware in place.

### 6.5 Build pipeline (portfolio)
```
npm run build  # in portfolio-app
  → npm run sync-content      # copy /content into generated-content
  → npm run protect           # encrypt protected payloads (if PORTFOLIO_ACCESS_CODE)
  → next build                # SSR/SSG bundle, basePath /portfolio
```

### 6.6 Testing (portfolio)
- `npm test` runs `tsx --test lib/*.test.ts data/*.test.ts`. There are co-located `.test.ts` files (e.g. content validation, board-case adapter behavior). Add new tests next to the file under test.
- `npm run typecheck` runs `tsc --noEmit` after a `sync-content`.

---

## 7. Design System (Tokens & UI)

Source of truth: `assets/css/tokens.css` (root site) and the `@theme` block at the top of `portfolio-app/app/globals.css` (portfolio).

### 7.1 Root tokens (excerpt — see `assets/css/tokens.css` for the full set)
- **Type scale** (rem-based): `--text-xs` … `--text-6xl`, plus `--text-hero: clamp(3rem, 8vw, 5.9rem)`. Legacy `--font-size-*` aliases exist for compat — prefer `--text-*`.
- **Color scales:** `--color-primary-{50..950}` (gold, base 500), `--color-secondary-{50..950}` (blue, base 500), neutral 0..1000, plus semantic `--color-{success,warning,error,info}-{base,light,dark}`.
- **Surfaces:** `--color-surface-{page,card,elevated,strong,soft,sunken,overlay}`.
- **Text:** `--color-text-{primary,secondary,muted,subtle,disabled,inverse,brand}`.
- **Borders:** `--color-border-{default,strong,subtle,focus,brand}`.
- **Shadows:** `--shadow-sm/md/lg` (single, unified shadow base).
- **Radii:** `--radius-sm: 12px`, `--radius-md: 16px`, `--radius-lg: 22px`, `--radius-xl: 28px`, `--radius-full`.
- **Motion:** `--duration-fast: 160ms`, `--duration-normal: 260ms`, `--duration-slow: 340ms`; easings `--ease-out`, `--ease-soft`.
- **Theme bridge:** `--site-bg`, `--site-surface`, `--site-text`, `--site-text-muted`, `--site-accent`, `--site-accent-gold`, `--site-border`, etc. — these are **the tokens components consume**; the deeper scales above are sources.
- **Dark theme:** scoped under `[data-theme="dark"]` selectors and overrides only the bridge tokens.

### 7.2 Portfolio tokens
The portfolio uses its own token namespace defined in `app/globals.css → @theme`:
- Fonts: `--font-headline` (Playfair Display), `--font-body` (IM Fell English), `--font-mono` (Special Elite), `--font-ui` (Inter).
- Board colors: `--board-bg #1a1f1a`, `--chalk-white #f2ede4`, `--paper-bg #f5efe0`, `--paper-aged #e8dcc8`, `--ink-black #1a1410`, `--red-string #c0392b`, `--stamp-red #8b1a1a`, `--stamp-blue #1a3a8b`, `--yellow-sticky #f9e04b`, etc.
- Spacing: `--space-1: 8px` … (4px-multiple scale).

### 7.3 Component classes (root site)
`assets/css/core.css` ships the shared utility/component set:
- Layout: `.container`, `.flex`, `.flex--center`, `.grid`, `.grid--2`
- Surfaces: `.glass`, `.glass--hover`, `.card`, `.card--interactive`
- Buttons: `.btn` / `.button`, with `--primary`, `--ghost`, `--outline`, `--glow`
- Animation: `.reveal` (+ `.reveal--left`, `.reveal--right`), `.stagger`
- A11y: `.sr-only`, `.focus-ring` / `:focus-visible` styling
- Typography helpers: `.text-{xs..4xl}`, `.text-muted`, `.text-subtle`, `.font-display`, `.font-body`

### 7.4 Brand decisions (must-honor)
From `BRAND_DECISIONS.md`:
1. Type scale collisions resolved (`--text-xl` is no longer the same as `--text-2xl`).
2. Deduplicated footer styles — only `assets/css/core.css` owns the global footer; `css/site.css` defers to it.
3. The 404 page is the single brand exception — keep it loud and weird.
4. Single shadow base + unified z-index ladder.
5. Spacing/radius tokens are rem-based.
6. Body gradient is layered radial+linear (paper-like by day, deep navy at night).
7. Portfolio typography is intentionally different from the rest of the site — do not normalize it.

---

## 8. SEO, Accessibility & Performance Contract

(See `docs/seo.md`, `SEO_CHECKLIST.md`, `SEO_REPORT.md`, `docs/performance.md` for the long form.)

### 8.1 SEO
- Each page has unique title (50–60 chars), unique description (95–160 chars), `author`, `keywords`, canonical, robots meta.
- 404 page is the only `noindex, nofollow` (and is excluded from `sitemap.xml`).
- Open Graph + Twitter Cards filled on every page; OG images 1200×630.
- JSON-LD per page:
  - Home: `Person + WebSite + ProfilePage` (pre-populated in HTML, refreshed at runtime).
  - Resume: `BreadcrumbList` static, `Person + ProfilePage` runtime per locale.
  - Terms: `BreadcrumbList + WebPage`.
  - Portfolio: handled by Next’s `Metadata`.
- Sitemap (`/sitemap.xml`) lists `/`, `/resume/`, `/portfolio/`, `/terms/` only.
- robots.txt disallows `/portfolio-app/`, `/scripts/`, `/tests/`, `/node_modules/`.

### 8.2 Accessibility
- Skip-to-main-content link on every page.
- Single `<h1>` per page; semantic landmarks (`<nav>`, `<main>`, `<footer>`).
- ARIA pressed/expanded states on toggle buttons (theme, mobile menu, language switcher).
- 44px minimum touch targets.
- `prefers-reduced-motion: reduce` removes scroll-smooth, transitions, the resume profile tilt, and forces visible state on `.reveal`.
- High-contrast 2-tone focus ring via box-shadow.

### 8.3 Performance
- Images: WebP for hero/portrait/og where possible; `loading="eager"` + `fetchpriority="high"` for the LCP image, `loading="lazy"` + `decoding="async"` for everything else. `width`/`height` always set to prevent CLS.
- Fonts: non-blocking via `<link rel="preload" as="style" onload="this.rel='stylesheet'">` + `<noscript>` fallback.
- DNS: `dns-prefetch` + `preconnect` for Google Fonts and any CDN used.
- JS: ES modules, no bundler — keep modules small.
- Route prefetch: `js/home.js` opportunistically prefetches `/resume/` and `/portfolio/` based on `navigator.connection.effectiveType`.
- The portfolio app sets `compiler.removeConsole` (excluding `error`/`warn`) in production.
- Reported Lighthouse Performance: 100; LCP/FCP ~228ms.

---

## 9. Testing & Validation

### 9.1 Root tests (`tests/`)
- Runner: `node --test tests/*.test.js` (Node’s built-in test runner; no Mocha/Jest).
- DOM: `happy-dom` (`new Window()` per test) — see `tests/home.test.js` for the canonical setup.
- Tests cover:
  - Home content validation contract (`content.test.js`).
  - Home page bootstrap on success and on each fetch-error mode (non-OK, throw, malformed JSON).
  - Renderers always include the canonical labels (`Portfolio`, `Email`, etc.).
- When writing a new test that re-imports modules, **append a cache-buster** (`?cachebust=${Date.now()}`) and call `clearContentCache()` first — this is the project convention.

### 9.2 Portfolio tests (`portfolio-app/`)
- Runner: `tsx --test lib/*.test.ts data/*.test.ts`.
- Co-locate new tests next to the file under test.
- Always run `npm run sync-content` before tests (the `test` script does this automatically).

### 9.3 Content validator (`scripts/validate-content.mjs`)
Run via `npm run validate:content`. Rejects:
- Missing required fields in `site`, `profile`, `contact`, `home`, `resume/*`, `portfolio/*`.
- Duplicate slugs and duplicate aliases (and aliases that match their own slug).
- Any string anywhere in the JSON containing `[TODO: ...]`.

### 9.4 CI (`.github/workflows/deploy.yml`)
On push to `main` (when paths under `content/`, `js/`, `resume/`, `portfolio-app/`, `index.html`, `terms/`, `package.json`, or the workflow change):
1. Checkout (with credentials persisted).
2. Set up Node 20 + npm cache keyed on `portfolio-app/package-lock.json`.
3. `cd portfolio-app && npm ci`.
4. `npm run validate:content` (root).
5. `cd portfolio-app && npm run typecheck`.
6. `cd portfolio-app && npm run build`.

There is **no** automatic deploy step — GitHub Pages serves whatever is on `main`. The workflow only validates + builds the portfolio app.

---

## 10. Local Development

Node 20+ recommended (matches CI). Repo supports Node 22 too.

```bash
# 1. Static site (root) — http://localhost:8000
npm install        # only installs happy-dom (devDep)
npm run dev        # `npx -y serve . -l 8000 --no-clipboard`

# 2. Portfolio app — http://localhost:3000/portfolio
cd portfolio-app
npm install
npm run dev        # runs sync-content first, then `next dev`

# 3. Tests
npm test                  # root
npm run validate:content  # root
cd portfolio-app
npm test
npm run typecheck
npm run build
```

Environment variables (only used by the portfolio):
- `PORTFOLIO_ACCESS_KEY` — passphrase for the cookie auth route. Defaults to `dictuzzportfolio` if unset (only acceptable for dev).
- `PORTFOLIO_ACCESS_CODE` — used by `generate-protected-content.mjs` to encrypt the static protected payloads. Required during `npm run build` if `public/protected/auth.json` does not already exist.

There is **no** repo-wide `.env`/`.env.example`; the portfolio reads from process env directly.

---

## 11. Git, Branching & PR Conventions

- Default branch: `main`. PRs target `main`.
- Never force-push to `main`. Feature branches may be force-pushed with `--force-with-lease` if needed.
- Branch naming: `devin/<unix-timestamp>-<short-slug>` for AI-authored work; humans use whatever they like.
- Commit style observed in history: imperative, prefix-tagged (`refactor(...)`, `perf(...)`, `fix(board): ...`). Keep commits scoped — refactors and behavior changes should not mix.
- The repo has **no** pre-commit hooks (no `.pre-commit-config.yaml`, no `.husky/`).
- The repo has **no** AGENTS.md or CLAUDE.md (this file is the first), and no `.cursor*` rules.

---

## 12. Editing Recipes

### 12.1 Change a string visible on the homepage or footer
Edit `content/site.json` (profile, contact, footer nav) **and/or** `content/home.json` (folders/items). Run `npm run validate:content` and `npm test`.

### 12.2 Add a resume bullet / role
Edit `content/resume/en.json` (and `id.json`/`de.json` for parity), keeping the same shape. Validator checks `experience[]`, `education[]`, etc. Run `npm run validate:content` then `npm test`.

### 12.3 Add a new locale to the resume
1. Add `content/resume/<lang>.json` with the same shape as `en.json`.
2. Add `<lang>` to `SUPPORTED_LANGS` in `resume/resume-state.js`.
3. Add the language button in `resume/index.html`.
4. Update `validateResumeContent` only if the new locale needs locale-specific keys (rare).

### 12.4 Add a new portfolio case study
1. Append the new entry to `content/portfolio/case-studies.json` (unique `slug`, optional `aliases[]`, full editorial copy and `board` block — see existing entries for shape).
2. If the case maps to an old vanity URL, add it to `aliases[]` so `/portfolio/<old>/` 308-redirects to `/portfolio/work/<slug>/`.
3. Run `npm run validate:content`.
4. Run `cd portfolio-app && npm test && npm run typecheck && npm run build` to verify the route is generated and the encrypted payload regenerates (if `PORTFOLIO_ACCESS_CODE` is set).

### 12.5 Tweak a token (color, spacing, radius)
- Root site: edit `assets/css/tokens.css`. Keep dark-theme overrides in the dedicated `[data-theme="dark"]` blocks. Don’t introduce ad-hoc hex codes in component CSS.
- Portfolio: edit the `@theme` block in `portfolio-app/app/globals.css`.

### 12.6 Add a new icon
Add the SVG path entry to `ICON_MAP` in `js/icon-kit.js`. Reference it in markup with `<i data-icon="my-icon"></i>` (it gets upgraded by `upgradeIcons()`). For the portfolio, prefer composing inline SVG within the React component.

### 12.7 Change the portfolio access passphrase
Set `PORTFOLIO_ACCESS_KEY` in the production environment running the Next app. Do not commit the value. The default `'dictuzzportfolio'` (`lib/auth.ts`) is for local dev only.

---

## 13. Known Gotchas & Anti-Patterns

- **Don’t hand-edit `portfolio/` at the repo root.** It is generated/legacy artifact. The current source is `portfolio-app/`.
- **Don’t inline copy in HTML/TSX.** All editorial copy lives in `content/`. The validator will not catch hard-coded copy, but reviewers will.
- **Don’t bypass the validators.** Both the root validators (`js/site-content.js`) and the portfolio validators (`portfolio-app/lib/content.ts`) duplicate intentionally — they back up CI. Add new fields to **both** when extending the shape.
- **Resume renderers must not throw.** Wrap any new renderer call in `resume/resume.js` inside the existing try/catch list, or it will block everything that comes after it.
- **`Typer` instances must be stopped** before being replaced (the resume locale switch does this — copy that pattern).
- **`themeColorLight`/`themeColorDark` mismatches** between `content/site.json` and the inline `<meta name="theme-color">` in HTML are the most common cause of mobile address-bar color drift. Sync them.
- **`trailingSlash: true`** in the portfolio means every internal Next link should end with `/` (or rely on Next to add it). Mixing trailing-slash styles breaks alias matching.
- **`generated-content/` is regenerated on every script run.** Don’t edit it; edit `/content/` upstream.
- **Sitemap dates are hand-maintained.** Bump them when content changes meaningfully.
- **The 404 page is allowed to break the brand.** Keep its bespoke fonts (`Inter`, `JetBrains Mono`) and dark theming — that’s the deliberate exception.
- **Cookie-protected portfolio cannot be statically exported.** That’s why `publish.mjs` throws. If you need a static portfolio again, you must either remove the cookie middleware or revive the encrypted-payload + client-decrypt path.

---

## 14. Doing Work Here as Claude — A Short Operating Guide

1. **Plan in writing.** Use the in-product planner / TODO list before touching files. Keep it explicit (which files, which validator, which test).
2. **Read `content/` before touching renderers.** The shape almost always answers your question.
3. **Default to JSON edits for copy.** If the change feels like CSS, look in `assets/css/tokens.css` first.
4. **Run the full quality gate locally** before opening a PR:
   ```bash
   npm run validate:content
   npm test
   cd portfolio-app && npm test && npm run typecheck && npm run build
   ```
5. **PRs target `main`** and should be small and focused. Conventional-commit-style titles preferred. The CI workflow only runs on the paths listed in `deploy.yml` — if your change is outside those paths, mention it explicitly so reviewers know why CI is silent.
6. **Don’t add dependencies casually.** The root package has only `happy-dom`; the portfolio is intentionally tight. Justify any new dep in the PR description.
7. **Don’t commit secrets.** `PORTFOLIO_ACCESS_KEY` and `PORTFOLIO_ACCESS_CODE` are environment-only.
8. **When in doubt, mirror an existing pattern.** This codebase is highly consistent — copying a sibling file as a template is almost always safer than inventing.

---

## 15. Where to Look First (Cheat Sheet)

| Question | File |
|---|---|
| What is my name / title / email? | `content/site.json` |
| What links show on the home accordion? | `content/home.json` |
| What does the resume say in Indonesian? | `content/resume/id.json` |
| What case studies are in the portfolio? | `content/portfolio/case-studies.json` |
| How is the home page bootstrapped? | `js/home.js` |
| How is JSON loaded and validated? | `js/site-content.js` |
| How is SEO/JSON-LD applied at runtime? | `js/site-seo.js` and `resume/resume-seo.js` |
| How does the theme toggle work? | `js/ui-kit.js` (`ThemeManager`) |
| What design tokens exist? | `assets/css/tokens.css` (root) + `portfolio-app/app/globals.css` (`@theme`) |
| How is the portfolio protected? | `portfolio-app/proxy.ts` + `app/api/portfolio-auth/route.ts` + `lib/auth.ts` |
| How do I change portfolio routes? | `portfolio-app/app/page.tsx`, `app/work/[slug]/page.tsx`, `app/[legacySlug]/page.tsx` |
| How is content shared into the portfolio? | `portfolio-app/scripts/sync-content.mjs` + `portfolio-app/content/*.ts` + `lib/content.ts` |
| What does CI run? | `.github/workflows/deploy.yml` |
| What is the project history / why was X done? | `REFACTOR_REPORT.md`, `BRAND_DECISIONS.md`, `SEO_REPORT.md`, `SEO_CHECKLIST.md` |

---

_Last updated: 2026-05-02. When you change architecture, content shape, or the quality gate, update this file in the same PR._
