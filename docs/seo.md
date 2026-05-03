# SEO Implementation

Last updated: 2026-04-09

## Architecture

This is a static HTML site with JavaScript modules that dynamically enhance page content at runtime. SEO metadata is **dual-implemented**:

1. **HTML source (primary)** — All `<title>`, `<meta>`, Open Graph, Twitter Card, and JSON-LD tags contain real values in the static HTML. This ensures crawlers that do not execute JavaScript (Facebook, Twitter/X, LinkedIn, most bots) see complete metadata.

2. **JavaScript runtime (secondary)** — The `js/site-seo.js` and `resume/resume-seo.js` modules update meta tags dynamically from `content/site.json` and locale-specific content files. This enables language switching on the resume page without breaking the static defaults.

## Meta Tags

Every page has:
- Unique, descriptive `<title>` (50–60 characters)
- Unique `<meta name="description">` (95–160 characters, keyword-rich)
- `<meta name="author">` with full name
- `<meta name="keywords">` with page-specific keywords
- `<meta name="robots">` with `index, follow` (except 404 page: `noindex, nofollow`)
- `<link rel="canonical">` with absolute URL
- `<meta name="google-site-verification">` placeholder (needs real code)

## Open Graph & Twitter Cards

| Page | og:type | og:image | twitter:card |
|------|---------|----------|--------------|
| `/` | website | `/og-image.png` | summary_large_image |
| `/resume/` | profile | `/assets/images/resume-og-image.png` | summary_large_image |
| `/terms/` | website | `/og-image.png` | summary |
| `/portfolio/` | website | (Next.js managed) | summary_large_image |

All OG images include `og:image:width` (1200) and `og:image:height` (630). All pages include `og:locale` (en_US) and `og:site_name` (dictuzz).

## Structured Data (JSON-LD)

| Page | Schema Types | Delivery |
|------|-------------|----------|
| `/` | `Person`, `WebSite`, `ProfilePage` | Pre-populated in HTML, updated by JS |
| `/resume/` | `BreadcrumbList` (static), `Person`, `ProfilePage` (JS) | Hybrid |
| `/terms/` | `BreadcrumbList`, `WebPage` | Static HTML |
| `/portfolio/` | `CollectionPage`, `ItemList` | Static HTML |
| `/portfolio/cases/<slug>/` | `Article` | Static HTML |

### Person Schema (Homepage)
Includes: name, alternateName, jobTitle, description, url, image, email, nationality, address, sameAs (7 social profiles + WhatsApp), knowsAbout (6 skills).

### Person Schema (Resume)
Extended with: alumniOf, detailed knowsAbout from skills collections, section-level hasPart.

## Sitemap

- Located at `/sitemap.xml`, referenced from `/robots.txt`
- Includes: `/`, `/resume/`, `/portfolio/`, all `/portfolio/cases/<slug>/`, `/terms/`
- Each entry has `<lastmod>`, `<changefreq>`, and `<priority>`
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
- Font Awesome loads non-blocking via `media="print"` + `onload` pattern
- Google Fonts load non-blocking with same pattern
- `dns-prefetch` added for all third-party domains
- `preconnect` for font and CDN providers
- All images have explicit `width`/`height` to prevent CLS

## Accessibility (SEO Impact)

- Skip-to-main-content link on all pages
- ARIA labels on all interactive elements
- Proper heading hierarchy (single H1 per page)
- `lang="en"` on all `<html>` elements
- Form controls and buttons have descriptive labels/aria-labels

## External Link Policy

All external links (`target="_blank"`) include `rel="noopener noreferrer"` for security. This is enforced in:
- Static HTML templates
- `js/site-renderers.js` (dynamic folder items and footer contacts)
- `resume/resume-renderers.js` (dynamic resume content)

## 404 Page

- Marked with `<meta name="robots" content="noindex, nofollow">`
- Not included in sitemap
- Has descriptive title and meta description for user experience

## Core Web Vitals Baseline

- LCP: ~228 ms ✅
- FCP: ~228 ms ✅
- See `docs/performance.md` for full metrics.
