# Performance and quality checks

Last reviewed: 2026-11-07

## Delivery model

GitHub Pages serves the checked-in static HTML, CSS, JavaScript, JSON, and image files. The site uses no client framework. The resume and portfolio have deterministic prerender scripts so translated pages have complete HTML before JavaScript runs.

## Existing optimizations

- Page-specific JavaScript keeps unrelated interactions off each route.
- Resume and portfolio locale content is prerendered into crawlable HTML.
- Google Fonts use a non-blocking stylesheet pattern with a no-script fallback.
- The profile photo uses WebP; shared tokens and CSS are reused across site sections.
- Resource search uses a generated index rather than scanning topic pages in the browser.

## Checks

Run the content and route checks locally:

```bash
npm run validate:content
npm test
```

The deployment workflow also checks resume and portfolio prerender freshness, runs axe-core, and runs Lighthouse CI. `npm run test:a11y` and `npm run test:a11y:ci` need the local server at `http://localhost:8000`.

No recent field Core Web Vitals baseline is stored in this repository. Avoid claiming performance scores until a measured report is available.
