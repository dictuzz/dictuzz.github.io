# SEO Implementation

## Meta Tags
- Every page has a unique `<title>` (50–60 chars) and `<meta name="description">` (120–160 chars).
- Canonical URL (`<link rel="canonical">`) is set on every indexable page.
- The `<html>` element uses `lang="en"` on all pages.

## Open Graph & Twitter Cards
- OG tags (`og:type`, `og:url`, `og:title`, `og:description`, `og:image`) on `/`, `/resume/`, `/terms/`.
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) on `/`, `/resume/`, `/terms/`.
- Portfolio (`/portfolio/`) uses `noindex, nofollow` — OG tags present but intentionally generic.
- OG images use `.png` format for maximum social platform compatibility.

## Structured Data (JSON-LD)
| Page | Schema Types |
|------|-------------|
| `/` | `Person`, `WebSite` |
| `/resume/` | `Person` (with `jobTitle`, `alumniOf`, `knowsAbout`) |

## Sitemap
- Located at `/sitemap.xml`, referenced from `/robots.txt`.
- Includes all indexable pages with `<lastmod>` dates.
- Portfolio subpages included despite noindex (can be removed if needed).

## robots.txt
- Allows all crawlers (`Allow: /`).
- References sitemap URL.

## 404 Page
- Marked with `<meta name="robots" content="noindex, nofollow">` to prevent indexing.

## Core Web Vitals
- LCP: ~228 ms ✅
- FCP: ~228 ms ✅
- See `docs/performance.md` for full metrics.
