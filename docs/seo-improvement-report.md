# SEO & copy review — dictuzz

**Reviewed:** 2026-11-05  
**Scope:** Home link hub, resume, portfolio and case studies, Resources directory, legal page, metadata, structured data, and sitemap.

## Findings

| Area | Before | Improvement |
|---|---|---|
| Brand and homepage title | The browser/search title led with “Systems Architect & Automation Specialist” and a long performance claim. | The homepage title is now exactly `dictuzz`. `WebSite.name`, Open Graph site name, app name, and homepage social title use the same brand. |
| Search copy | Several titles and descriptions stacked role labels, metrics, and keywords into awkward phrases. | Main page titles are concise. Descriptions explain each page in plain language and retain relevant context. |
| Resources categories | The 24 indexable category pages had titles but no unique descriptions or canonicals. | Every category now has an accurate description, a self-canonical, and social preview metadata. The guide is named “Beginner’s Guide.” |
| Multilingual metadata | Resume titles used the translated job title as a page title; locale selection depended on query parameters and client rendering. | English, Indonesian, and German resume and portfolio pages now have static URLs, localized prerendered content, self-canonicals, and reciprocal `hreflang` links. |
| Sitemap hygiene | The `noindex` search page was included in the sitemap. | It is removed; the sitemap contains 45 indexable pages, including translated resume and portfolio pages, and the sitemap assertion reflects that. |
| Unsupported metadata | `meta keywords` tags were present. | Removed. Google says it does not use this tag for indexing or ranking. |

## Copy direction

The site keeps the root page as a link hub. Its search description now explains that it connects visitors to the portfolio, résumé, and resources. Internal page titles use a simple `Page | dictuzz` pattern. Descriptions focus on the page’s purpose instead of repeating the same job title and metrics everywhere.

Resume and portfolio descriptions were rewritten across all three supported languages. The Resources category copy describes the content visitors will find without promising that every listed service is free, safe, or available in every region.

## Changes applied

- Updated root, resume, portfolio, Resources, terms, and manifest titles and descriptions.
- Added homepage Twitter metadata and completed social preview metadata for resume, portfolio, and resource category pages.
- Updated portfolio locale titles and descriptions in English, Indonesian, and German; refreshed the static HTML through the portfolio prerender script.
- Added static resume routes at `/resume/id/` and `/resume/de/`, with localized HTML, canonical and social metadata, structured data, and language alternates.
- Added static portfolio landing and case-study routes for Indonesian and German; language switches now move to clean routes and localized case links stay within their language.
- Added deterministic prerender commands and CI freshness checks for resume and portfolio HTML.
- Added unique title-supporting descriptions and self-canonicals to 24 Resources category pages.
- Removed `meta keywords`; removed `/resources/search.html` from `sitemap.xml` and updated the sitemap’s last-modified dates; expanded the sitemap to 45 indexable URLs.
- Regenerated the Resources search index after updating the guide label.
- Updated `docs/seo.md` to describe the current implementation and known measurement gaps.

## Current limitations and next priorities

1. **Verify the property in Google Search Console.** The site-specific verification token is not in the repository. Once verified, submit `https://dictuzz.me/sitemap.xml` and check indexing reports.
2. **Measure performance.** There is no current Lighthouse or field Core Web Vitals baseline, so no performance score or ranking effect is claimed.
3. **Strengthen project evidence.** The portfolio still has planned evidence placeholders. Replace them with approved, accurate artifacts and link each claim to what the artifact proves.
4. **Review search results after recrawl.** Search engines may choose different title links and snippets, and updates can take time to appear.

## Reference guidance

- Google recommends concise, descriptive title links and may use multiple page signals: [Title links](https://developers.google.com/search/docs/appearance/title-link).
- Search snippets are generated primarily from page content; a meta description can be used when it better summarizes the page: [Snippets](https://developers.google.com/search/docs/appearance/snippet).
- A consistent `WebSite` structured data name helps Google identify the preferred site name: [Site names](https://developers.google.com/search/docs/appearance/site-names).
- Google does not use the keywords meta tag: [Supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags).
- Canonicals help consolidate duplicate URL signals: [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Metadata improvements make the site clearer to search engines and people, but they do not guarantee rankings or search appearance.
