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
```

These checks validate content contracts and the homepage rendering paths. They do not currently run Lighthouse or asset-budget checks.

## Known Follow-Up

- Add an automated link/asset audit for internal routes and anchors.
- Add a size budget for large images before committing new assets.
- Re-run Lighthouse after any major visual or image change and record fresh metrics here.
