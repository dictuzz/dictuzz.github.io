# dictuzz.me

Personal website for **Benedictus Richard Ricardo** (`dictuzz`), positioned as a **Systems Architect & Automation Specialist**.

The repository is now a single static site built with semantic HTML, shared CSS, and vanilla JavaScript — no build step, no framework runtime. GitHub Pages serves the repo as-is.

Public surfaces:

- **Root homepage** (`/`): link hub with categorized folder-style navigation
- **Resume** (`/resume/`): long-form professional profile with i18n data (EN/ID/DE)
- **Portfolio** (`/portfolio/`): _The Operational Record_ — an NYT-inspired editorial magazine portfolio with a landing edition and four case-file articles
- **Terms** (`/terms/`): shared legal page
- **404** (`/404.html`): custom 404 page (deliberate retro arcade aesthetic exception)

## Architecture

The repo is a hand-written static site:

### Core pages and shells

- [`/index.html`](./index.html): homepage / link hub
- [`/resume/index.html`](./resume/index.html): resume page shell
- [`/portfolio/index.html`](./portfolio/index.html): editorial portfolio landing (_The Operational Record_)
- [`/portfolio/cases/<slug>/index.html`](./portfolio/cases): one long-form article per case file
- [`/terms/index.html`](./terms/index.html): terms page
- [`/404.html`](./404.html): custom 404

### Stylesheets

- [`/assets/css/tokens.css`](./assets/css/tokens.css): canonical design tokens (Fraunces + Manrope, light/dark, spacing, color, type scale)
- [`/assets/css/core.css`](./assets/css/core.css): shared utilities (footer, glass, etc.)
- [`/css/site.css`](./css/site.css): homepage layout + shared layer
- [`/css/critical.css`](./css/critical.css): resume above-the-fold critical CSS
- [`/resume/resume.css`](./resume/resume.css): resume layout
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
- [`/content/portfolio/case-studies.json`](./content/portfolio/case-studies.json): canonical portfolio case-study source
- [`/content/portfolio/home.json`](./content/portfolio/home.json): portfolio intro / contact content

The portfolio HTML is rendered statically from this JSON. Update the JSON when you also update the HTML — both are validated together.

## Positioning and Brand

Canonical positioning used across the site:

- Name: Benedictus Richard Ricardo
- Handle: dictuzz
- Title: Systems Architect & Automation Specialist

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

There is no separate build step. Editing HTML / CSS / JS / JSON updates the site directly.

## Scripts

Defined in [`/package.json`](./package.json):

- `npm run dev`: serve the static site
- `npm run validate:content`: validate all shared content contracts (TODO placeholders, slug uniqueness, required fields)
- `npm test`: run root tests (Node `--test` runner)

## Testing

```bash
npm run validate:content
npm test
```

## Deployment

The current GitHub Action in [`/.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) validates content and runs root tests on push to `main` and on PRs. GitHub Pages serves the entire repo as-is (`.nojekyll` is present, `CNAME` is `dictuzz.me`).

## SEO and Crawl Notes

- Homepage, resume, portfolio (and per-case-file URLs), and terms are included in [`/sitemap.xml`](./sitemap.xml)
- [`/robots.txt`](./robots.txt) allows the public site and disallows `/scripts/`, `/tests/`, `/node_modules/`
- Homepage metadata includes `Person`, `WebSite`, and `ProfilePage` schema; portfolio includes `CollectionPage` + `ItemList`; case files include `Article` schema

## Repository Guidance

- Prefer editing source files in place; the site has no generator
- For content changes that affect copy, start with [`/content`](./content), then update the corresponding HTML if it is statically rendered
- For homepage rendering logic, use [`/js/home.js`](./js/home.js) and [`/js/site-content.js`](./js/site-content.js)
- For resume rendering logic, use [`/resume`](./resume)
- For portfolio rendering, use [`/portfolio`](./portfolio)
- For editor-facing guidance, see [`/docs/content-editing-guide.md`](./docs/content-editing-guide.md)

## License

Copyright © 2026 Benedictus Richard Ricardo. All rights reserved.
