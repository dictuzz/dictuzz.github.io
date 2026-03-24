# dictuzz.me

Personal website for **Benedictus Richard Ricardo** (`dictuzz`), positioned as a **Systems Architect & Automation Specialist**.

The repository currently contains three public-facing surfaces and one protected portfolio source app:

- Root homepage: link hub with categorized folder-style navigation
- Resume: long-form professional profile with i18n data
- Terms page: shared legal page
- Portfolio source app: Next.js app with cookie-based access control

## Current Architecture

### 1. Root static site

The root of the repository is a lightweight static site built with semantic HTML, shared CSS, and vanilla JavaScript.

Relevant paths:

- [`/index.html`](./index.html): main homepage / link hub
- [`/resume/index.html`](./resume/index.html): resume page shell
- [`/terms/index.html`](./terms/index.html): terms page
- [`/404.html`](./404.html): custom 404 page
- [`/css/site.css`](./css/site.css): root homepage and shared footer styling
- [`/resume/resume.css`](./resume/resume.css): resume styling
- [`/js/home.js`](./js/home.js): homepage interactions
- [`/resume/resume.js`](./resume/resume.js): resume rendering and locale switching
- [`/assets/css/tokens.css`](./assets/css/tokens.css): shared token foundation
- [`/assets/css/core.css`](./assets/css/core.css): shared utilities

### 2. Shared content layer

The repo is now content-driven from a centralized `/content` tree.

Relevant paths:

- [`/content/site.json`](./content/site.json): shared identity, contact, footer, and SEO defaults
- [`/content/home.json`](./content/home.json): homepage folders and link groups
- [`/content/resume/en.json`](./content/resume/en.json): resume content in English
- [`/content/resume/id.json`](./content/resume/id.json): resume content in Indonesian
- [`/content/resume/de.json`](./content/resume/de.json): resume content in German
- [`/content/portfolio/home.json`](./content/portfolio/home.json): portfolio board intro/contact content
- [`/content/portfolio/case-studies.json`](./content/portfolio/case-studies.json): portfolio case-study source

### 3. Portfolio source app

The editable portfolio lives in [`/portfolio-app`](./portfolio-app) and is built with:

- Next.js `16.1.6`
- React `19.2.4`
- TypeScript `5.9.3`
- Framer Motion

Important notes:

- The portfolio app uses `basePath: '/portfolio'`
- The app now depends on **runtime middleware/cookie auth**
- Static export publishing is intentionally disabled

Relevant paths:

- [`/portfolio-app/app`](./portfolio-app/app): routes and layout
- [`/portfolio-app/content`](./portfolio-app/content): typed content adapters
- [`/portfolio-app/data`](./portfolio-app/data): board presentation adapter
- [`/portfolio-app/lib/content.ts`](./portfolio-app/lib/content.ts): validated portfolio content repository
- [`/portfolio-app/lib/auth.ts`](./portfolio-app/lib/auth.ts): auth helpers
- [`/portfolio-app/proxy.ts`](./portfolio-app/proxy.ts): request protection
- [`/portfolio-app/app/api/portfolio-auth/route.ts`](./portfolio-app/app/api/portfolio-auth/route.ts): login handler
- [`/portfolio-app/app/login/page.tsx`](./portfolio-app/app/login/page.tsx): portfolio login page
- [`/portfolio-app/scripts/publish.mjs`](./portfolio-app/scripts/publish.mjs): intentionally throws because static publishing is disabled

### 4. Public `/portfolio` mirror

The root [`/portfolio`](./portfolio) folder is no longer the editable portfolio source.

Current status:

- It acts as a **locked public placeholder**
- Old public payloads were neutralized to avoid leaking protected content
- Do not use `/portfolio` as the source of truth for portfolio development

## Positioning and Brand

Canonical positioning used across the site:

- Name: Benedictus Richard Ricardo
- Handle: dictuzz
- Title: Systems Architect & Automation Specialist

Brand direction:

- Homepage and resume use the shared editorial serif/sans system
- Portfolio uses its own detective-board treatment
- 404 uses the same detective-family mood instead of the removed cyberpunk identity

## Development

### Root site

Serve the root static site locally:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:8000
```

### Portfolio app

Run the protected Next.js app locally:

```bash
cd portfolio-app
npm install
npm run dev
```

Default local URL:

```text
http://localhost:3000/portfolio/
```

To use portfolio auth locally, set:

```bash
PORTFOLIO_ACCESS_KEY=your-secret-passphrase
```

On PowerShell:

```powershell
$env:PORTFOLIO_ACCESS_KEY="your-secret-passphrase"
npm run dev
```

## Scripts

### Root scripts

Defined in [`/package.json`](./package.json):

- `npm run dev`: serve the root static site
- `npm run dev:portfolio`: start the portfolio app
- `npm run build:portfolio`: build the portfolio app
- `npm run publish:portfolio`: calls the disabled publish script
- `npm run validate:content`: validate all shared content contracts
- `npm test`: run root tests

### Portfolio app scripts

Defined in [`/portfolio-app/package.json`](./portfolio-app/package.json):

- `npm run dev`: copy shared tokens and run Next dev server
- `npm run build`: copy tokens, generate protected content, build app
- `npm run test`: run portfolio unit tests
- `npm run typecheck`: run TypeScript checks
- `npm run publish`: disabled static publish step

## Testing

Root tests:

```bash
npm run validate:content
npm test
```

Portfolio app tests:

```bash
cd portfolio-app
npm test
npm run typecheck
```

## Deployment Status

The current GitHub Action in [`/.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) only validates the portfolio app by installing dependencies, typechecking, and building.

It does **not** deploy a protected runtime host.

That means:

- The root static site can be served as-is
- The real protected portfolio must be deployed separately to a runtime-capable host
- The root `/portfolio` directory should be treated as a locked placeholder, not a live protected app

## SEO and Crawl Notes

- Homepage, resume, and terms are included in [`/sitemap.xml`](./sitemap.xml)
- [`/robots.txt`](./robots.txt) currently disallows `/portfolio/`
- Homepage metadata includes `Person`, `WebSite`, and `ProfilePage` schema

## Repository Guidance

- Prefer editing source files, not generated or placeholder output
- For content changes, start with [`/content`](./content)
- For homepage rendering logic, use [`/js/home.js`](./js/home.js) and [`/js/site-content.js`](./js/site-content.js)
- For resume rendering logic, use [`/resume`](./resume)
- For portfolio behavior, work inside [`/portfolio-app`](./portfolio-app)
- For editor-facing guidance, see [`/docs/content-editing-guide.md`](./docs/content-editing-guide.md)

## License

Copyright © 2026 Benedictus Richard Ricardo. All rights reserved.
