# SEO implementation

Last updated: 2026-11-05

## Metadata

- Each indexable page has a clear title, a page-specific description, and a self-referencing canonical URL.
- The homepage title is the site name: `dictuzz`. Internal titles use a short page label followed by the site name.
- Descriptions summarize the page in natural language. Search engines can still generate snippets from page content.
- The site does not use `meta keywords`; Google does not use that tag for indexing or ranking.
- Open Graph and Twitter metadata are present on the homepage, primary pages, portfolio cases, and resource categories.
- Category pages under `/resources/` each have their own description and canonical URL.

## Multilingual pages

The resume and portfolio use English, Indonesian, and German content. Each language has a crawlable static URL: `/resume/`, `/resume/id/`, `/resume/de/`, `/portfolio/`, `/portfolio/id/`, and `/portfolio/de/`. Portfolio case studies have matching language routes beneath `/portfolio/{id|de}/cases/`. Every localized page has a self-canonical and reciprocal `hreflang` links. Runtime language changes update the URL, document language, title, description, social metadata, and structured data. Legacy `?lang=` links remain readable and are normalized to the matching route.

## Structured data

The homepage publishes `Person`, `WebSite`, and `ProfilePage` JSON-LD. The `WebSite.name` is `dictuzz`. The resume publishes profile data and the portfolio publishes collection or article data. Structured data helps search engines interpret page details; it does not guarantee a special search result.

## Sitemap and crawling

- `/sitemap.xml` contains the 45 indexable canonical pages, including all localized resume and portfolio routes.
- `/resources/search.html` remains `noindex, follow` and is excluded from the sitemap.
- `/404.html`, scripts, tests, and dependencies are excluded from the sitemap.
- `/robots.txt` points to the sitemap.

## Measurement and remaining work

Google Search Console ownership verification is not configured because the property-specific token is not available in the repository. Add the token from Search Console before verifying the domain or submitting the sitemap. No Lighthouse or field Core Web Vitals measurement is recorded; see `docs/performance.md` before making performance claims.

SEO metadata is only a foundation. Keep portfolio descriptions aligned with real, verifiable work, replace approved evidence placeholders when artifacts are ready, and review Search Console impressions and queries after Google recrawls the pages.
