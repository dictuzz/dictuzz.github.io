# Performance Notes

Last updated: 2026-06-02

## Current Shape

The site is served directly from GitHub Pages with no build step. Performance-sensitive files are the static HTML shells, shared CSS, vanilla JavaScript modules, JSON content, and images committed in the repo.

## Active Optimizations

- Critical homepage assets are preloaded in `index.html`.
- Google Fonts are loaded with the non-blocking `media="print"` and `onload` pattern.
- Core images use modern formats where available, including `assets/images/Aku.webp`.
- JavaScript is split by surface: homepage, resume, portfolio, resources, terms, and 404 each load only their own entry module.
- Shared content is centralized in JSON and cached by `js/site-content.js` during runtime fetches.

## Current Checks

Run:

```bash
npm run validate:content
npm test
npm run test:a11y
npm run test:a11y:ci
```

These automated checks run on Node `--test` and CI actions:
- `validate:content`: validates shared site, home, resume, and portfolio locale schemas.
- `tests/links.test.js`: verifies all internal routes and anchors resolve to existing elements across all 34 HTML files.
- `tests/search-index.test.js`: verifies search index data, targets, and checks for entity leaks.
- `tests/sitemap.test.js`: verifies 34 pages with valid `<lastmod>`.
- `tests/portfolio.test.js`: verifies static case article prerendering and Schema.org metadata.
- `test:a11y` & `test:a11y:ci`: evaluates WCAG 2.1 AA via axe and runs Lighthouse CI assertions against `.lighthouse-budget.json` / `lighthouserc.json` (min 98% accessibility, 90% category budgets).

## Known Follow-Up

- Add a pre-commit size budget check for uncompressed images.
- Periodically verify real device Core Web Vitals via Chrome UX Report / Search Console.
