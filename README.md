# dictuzz.me

Personal website for **Benedictus Richard Ricardo** (`dictuzz`), a Route-to-Market Analyst focused on reporting automation, operational governance, and process design.

The repository is a static site built with semantic HTML, shared CSS, and vanilla JavaScript. It has no framework runtime; deterministic scripts prerender localized resume and portfolio pages before deployment. GitHub Pages serves the checked-in site files.

Public surfaces:

- **Root homepage** (`/`): link hub with categorized folder-style navigation
- **Resume** (`/resume/`): long-form professional profile with i18n data (EN/ID/DE) and dynamic ATS PDF generation
- **Portfolio** (`/portfolio/`): _The Operational Record_ — an NYT-inspired editorial magazine portfolio with a landing edition and four case-file articles
- **Resources** (`/resources/`): static resource index with individual `.html` topic pages
- **Terms** (`/terms/`): shared legal page
- **404** (`/404.html`): custom 404 page (deliberate retro arcade aesthetic exception)

## Architecture

The repo is a hand-written static site:

### Core pages and shells

- [`/index.html`](./index.html): homepage / link hub
- [`/resume/index.html`](./resume/index.html): resume page shell
- [`/portfolio/index.html`](./portfolio/index.html): editorial portfolio landing (_The Operational Record_)
- [`/portfolio/cases/<slug>/index.html`](./portfolio/cases): one long-form article per case file
- [`/resources/index.html`](./resources/index.html): resource index; topic pages live as `resources/<topic>.html`
- [`/terms/index.html`](./terms/index.html): terms page
- [`/404.html`](./404.html): custom 404

### Stylesheets

- [`/assets/css/tokens.css`](./assets/css/tokens.css): shared design tokens (Fraunces + Manrope, light/dark colors, spacing, type, and motion)
- [`/assets/css/core.css`](./assets/css/core.css): shared utilities, drafting grid, focus treatments, and footer
- [`/css/site.css`](./css/site.css): homepage layout + shared layer
- [`/resume/resume.css`](./resume/resume.css): complete resume styles (base, nav, hero, sections, timeline, contact, print)
- [`/portfolio/portfolio.css`](./portfolio/portfolio.css): editorial / magazine layout for the portfolio
- [`/css/404.css`](./css/404.css): 404 arcade page

### Scripts

- [`/js/home.js`](./js/home.js): homepage interactions (theme, time, folders)
- [`/js/site-content.js`](./js/site-content.js): shared content validators
- [`/js/site-renderers.js`](./js/site-renderers.js): shared HTML rendering helpers (footer, folders)
- [`/js/site-seo.js`](./js/site-seo.js), [`/js/ui-kit.js`](./js/ui-kit.js), [`/js/icon-kit.js`](./js/icon-kit.js): shared utilities
- [`/resume/resume.js`](./resume/resume.js): resume rendering and locale switching
- [`/portfolio/portfolio.js`](./portfolio/portfolio.js): portfolio enhancements (theme, edition strap, scroll progress, footer, reveal)
- [`/js/terms.js`](./js/terms.js): terms page
- [`/js/404.js`](./js/404.js): 404 arcade

### Shared content layer

All copy, profile data, and SEO defaults live as JSON in `/content/`:

- [`/content/site.json`](./content/site.json): identity, contact, footer, SEO defaults
- [`/content/home.json`](./content/home.json): homepage folders and link groups
- [`/content/resume/{en,id,de}.json`](./content/resume): resume content per locale
- [`/content/portfolio/locales/{en,id,de}.json`](./content/portfolio/locales): runtime portfolio content and case-file copy

The portfolio runtime reads locale JSON from `/content/portfolio/locales/`. Static HTML shells and case pages still contain crawler-friendly defaults, so content changes that affect visible portfolio copy should keep both the locale JSON and static HTML fallbacks aligned.

## Positioning and Brand

Canonical positioning used across the site:

- Name: Benedictus Richard Ricardo
- Handle: dictuzz
- Title: Route-to-Market Analyst

Brand direction:

- Homepage uses the editorial bio-card system
- Resume uses the editorial portfolio shell
- Portfolio uses an NYT-inspired editorial magazine treatment built on the same Fraunces + Manrope type system
- 404 is the only deliberate aesthetic break (retro arcade)

## Development

Serve the static site locally:

```bash
npm install
npm run dev
```

Default local URL:

```text
http://localhost:8000
```

Most HTML, CSS, JavaScript, and JSON changes appear immediately while serving the site. Changes to resume or portfolio source content require regenerating their checked-in HTML before commit.

## Scripts

Defined in [`/package.json`](./package.json):

- `npm run dev`: serve the static site locally
- `npm run build:resume`: prerender English, Indonesian, and German resume pages
- `npm run build:portfolio`: prerender localized portfolio pages and case studies
- `npm run validate:content`: validate all shared content contracts and portfolio locale schemas
- `npm test`: run automated test suite (links, search index, sitemap, portfolio, and content validation)
- `npm run test:a11y`: run axe-core accessibility audit (WCAG 2.1 AA)
- `npm run test:a11y:ci`: run Lighthouse CI against local server with budget assertions
- `npm run build:icons`: compile icon SVG bundles from Iconify sources
- `npm run build:search-index`: build search index from resource HTML files
- `npm run update:fmhy`: update the Resources topic pages from their upstream source, then rebuild the search index

## Testing

```bash
npm run validate:content
npm test
```

Before committing content changes, run the matching prerender command and verify its freshness with `--check`:

```bash
npm run build:resume
npm run build:portfolio
node scripts/prerender_resume.mjs --check
python scripts/prerender_portfolio.py --check
```

## Deployment

The current GitHub Action in [`/.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) checks resume and portfolio prerender freshness, validates shared content, runs the test suite, then runs axe and Lighthouse checks. GitHub Pages serves the checked-in site (`.nojekyll` is present, `CNAME` is `dictuzz.me`).

## SEO and Crawl Notes

- Homepage, resume, portfolio (and per-case-file URLs), resources index, and terms are included in [`/sitemap.xml`](./sitemap.xml)
- [`/robots.txt`](./robots.txt) allows the public site and disallows `/scripts/`, `/tests/`, `/node_modules/`
- Homepage metadata includes `Person`, `WebSite`, and `ProfilePage` schema; portfolio includes `CollectionPage` + `ItemList`; case files include `Article` schema

## Repository Guidance

- Treat [`/content`](./content) and the shared source files as canonical; regenerate localized resume and portfolio HTML after changing their content or templates
- For resource topic edits, rebuild `search-index.json` so search results stay current
- For homepage rendering logic, use [`/js/home.js`](./js/home.js) and [`/js/site-content.js`](./js/site-content.js)
- For resume rendering logic, use [`/resume`](./resume)
- For portfolio rendering, use [`/portfolio`](./portfolio)
- For editor-facing guidance, see [`/docs/content-editing-guide.md`](./docs/content-editing-guide.md)
- For visual decisions and shared tokens, see [`/design.md`](./design.md)

## License

Copyright © 2026 Benedictus Richard Ricardo. All rights reserved.
