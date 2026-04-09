# SEO Checklist — dictuzz.me

Quick-reference checklist organized by priority.

---

## 🔴 Critical (Must Fix Immediately)

- [x] Populate all `<title>` tags in HTML source (not just via JS)
- [x] Populate all `<meta name="description">` in HTML source
- [x] Populate all Open Graph tags in HTML source
- [x] Populate all Twitter Card tags in HTML source
- [x] Pre-populate JSON-LD structured data in HTML source
- [x] Fix `terms.js` broken imports (wrong module paths)

## 🟡 Important (Fix Within 1 Week)

- [x] Add `og:image:width` and `og:image:height` to all pages
- [x] Add `og:locale` to resume and terms pages
- [x] Add `rel="noreferrer"` to all external links
- [x] Unblock `/portfolio/` in robots.txt
- [x] Update sitemap.xml with current dates and portfolio entry
- [x] Block dev directories in robots.txt (`/portfolio-app/`, `/scripts/`, `/tests/`)
- [x] Make Font Awesome non-blocking on resume page
- [x] Add `fetchpriority="high"` to hero images (LCP optimization)
- [ ] Replace Google Search Console verification placeholder with real code
- [ ] Submit sitemap to Google Search Console
- [ ] Configure analytics (GA4 measurement ID in `js/analytics.js`)

## 🟢 Nice to Have (Ongoing Improvement)

- [x] Add `dns-prefetch` for third-party domains
- [x] Add skip-to-main-content accessibility link on all pages
- [x] Add BreadcrumbList schema to subpages
- [x] Add image `width`/`height` to prevent CLS on terms page
- [ ] Expand terms page content to 300+ words (see SEO-TODO comments)
- [ ] Create unique OG images per page (currently sharing one)
- [ ] Optimize OG image file size (currently 1MB)
- [ ] Add security headers via Cloudflare or CDN proxy
- [ ] Set up Google Analytics or privacy-friendly alternative
- [ ] Review meta descriptions quarterly
- [ ] Consider adding `hreflang` tags if multilingual pages are added publicly
