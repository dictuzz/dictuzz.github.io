# SEO Implementation

Last updated: 2026-11-02

## Architecture

This is a static HTML site with JavaScript modules that dynamically enhance page content at runtime. SEO metadata is **dual-implemented**:

1. **HTML source (primary)** — All `<title>`, `<meta>`, Open Graph, Twitter Card, and JSON-LD tags contain real values in the static HTML. This ensures crawlers that do not execute JavaScript (Facebook, Twitter/X, LinkedIn, most bots) see complete metadata.

2. **JavaScript runtime (secondary)** — The `js/site-seo.js` and `resume/resume-seo.js` modules update meta tags dynamically from `content/site.json` and locale-specific content files. This enables language switching on the resume page without breaking the static defaults.

The portfolio landing page and the four case files are prerendered in English by `scripts/prerender_portfolio.py` before deploy. That script fills the `data-*` placeholders and the `application/ld+json` slot from `content/portfolio/locales/en.json`, so no-JS crawlers get the full issue and `portfolio.js` only replaces it when the visitor picks another language. CI runs `python3 scripts/prerender_portfolio.py --check` and fails when the checked-in HTML is stale.

## Meta Tags

Every page has:
- Unique, descriptive `<title>` (50–60 characters)
- Unique `<meta name="description">` (95–160 characters, keyword-rich)
- `<meta name="author">` with full name
- `<meta name="keywords">` with page-specific keywords
- `<meta name="robots">` with `index, follow` (except 404 page: `noindex, nofollow`)
- `<link rel="canonical">` with absolute URL
- `<meta name="google-site-verification">` placeholder (needs real code)

### Hreflang Configuration

The resume page (`/resume/`) serves multilingual content across three locales. It declares bidirectional alternate hreflang links:
- `en`: `https://dictuzz.me/resume/?lang=en`
- `id`: `https://dictuzz.me/resume/?lang=id`
- `de`: `https://dictuzz.me/resume/?lang=de`
- `x-default`: `https://dictuzz.me/resume/`

## Open Graph & Twitter Cards

| Page | og:type | og:image | twitter:card |
|------|---------|----------|--------------|
| `/` | website | `/og-image.png` | summary_large_image |
| `/resume/` | profile | `/assets/images/resume-og-image.png` | summary_large_image |
| `/terms/` | website | `/og-image.png` | summary |
| `/portfolio/` | website | `/og-image.png` plus case-specific images | summary_large_image |

All OG images include `og:image:width` (1200) and `og:image:height` (630). All pages include `og:locale` (en_US) and `og:site_name` (dictuzz).

## Structured Data (JSON-LD)

| Page | Schema Types | Delivery |
|------|-------------|----------|
| `/` | `Person`, `WebSite`, `ProfilePage` | Pre-populated in HTML, updated by JS |
| `/resume/` | `BreadcrumbList` (static), `Person`, `ProfilePage` (JS) | Hybrid |
| `/terms/` | `BreadcrumbList`, `WebPage` | Static HTML |
| `/portfolio/` | `CollectionPage`, `ItemList` | Static HTML (prerendered), updated by JS |
| `/portfolio/cases/<slug>/` | `Article` | Static HTML (prerendered), updated by JS |

### Person Schema (Homepage)
Includes: name, alternateName, jobTitle, description, url, image, email, nationality, address, sameAs (7 social profiles + WhatsApp), knowsAbout (6 skills).

### Person Schema (Resume)
Extended with: alumniOf, detailed knowsAbout from skills collections, section-level hasPart.

## Sitemap

- Located at `/sitemap.xml`, referenced from `/robots.txt`
- Includes: `/`, `/resume/`, `/portfolio/`, all 4 `/portfolio/cases/<slug>/`, `/resources/`, `/resources/search.html`, all 24 `/resources/<topic>.html` pages, and `/terms/` (34 pages total)
- Each entry has `<lastmod>`, `<changefreq>`, and `<priority>`
- `<lastmod>` reflects verified commit history per file from git.
- Excludes: `/404.html`, `/scripts/`, `/tests/`

## robots.txt

```
User-agent: *
Allow: /
Disallow: /scripts/
Disallow: /tests/
Disallow: /node_modules/

Sitemap: https://dictuzz.me/sitemap.xml
```

## Performance Optimizations (SEO Impact)

- Hero images use `fetchpriority="high"` and `loading="eager"` for LCP
- Google Fonts load non-blocking with same pattern
- `dns-prefetch` added for all third-party domains
- `preconnect` for font and CDN providers
- All images have explicit `width`/`height` to prevent CLS

## Accessibility (SEO Impact)

- Skip-to-main-content link on all pages
- ARIA labels on all interactive elements
- Proper heading hierarchy (single H1 per page)
- Static HTML defaults to `lang="en"`; runtime language switching updates localized resume and portfolio content.
- Form controls and buttons have descriptive labels/aria-labels

## External Link Policy

All newly authored external links (`target="_blank"`) should include `rel="noopener noreferrer"`. The renderers that create links at runtime already do:

- `js/site-renderers.js` (dynamic folder items and footer contacts)
- `resume/resume-renderers.js` (dynamic resume content)
- `portfolio/portfolio.js` (contact actions)

This is **not** yet true for the hand-written resource pages under `resources/`: roughly 4,000 `target="_blank"` anchors there have no `rel` attribute (mostly `rel="nofollow"` variants or none). `noopener` is implicit for modern browsers, but the attribute is still expected. Treat this as an open cleanup item rather than an enforced invariant.

## 404 Page

- Marked with `<meta name="robots" content="noindex, nofollow">`
- Not included in sitemap
- Has descriptive title and meta description for user experience

## Core Web Vitals Baseline

No Lighthouse or field measurement is recorded in this repository, and CI does not run Lighthouse against the public pages yet. The previous "LCP ~228 ms / FCP ~228 ms" figures were not reproducible and have been removed. See `docs/performance.md` for the current checks and the open follow-up to record real metrics.
