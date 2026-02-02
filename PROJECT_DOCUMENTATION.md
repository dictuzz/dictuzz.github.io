# PROJECT DOCUMENTATION: dictuzz.github.io

> **Document Version**: 2.0.0
> **Last Updated**: 2026-02-02
> **SSOT**: Canonical Source of Truth

---

## 1. Executive Summary

**Project Name**: dictuzz.github.io
**Type**: Personal Brand Ecosystem (Static Web Application)
**Target Audience**: Recruiters, Professional Network, Social Media Followers, Developers

This project is a sophisticated, framework-free static web application that serves as the central digital presence for Benedictus Richard Ricardo. It aggregates multiple functional components—a "Link in Bio" hub, a professional portfolio, and a technical blog—into a unified "Deep Space Luxury" aesthetic experience.

**Key Capabilities**:
- **Unified Branding**: A consistent "Deep Space" (Dark) and "Platinum" (Light) theme system that persists across all sub-sites.
- **High-Performance Visuals**: Custom-built HTML5 Canvas particle engines (Aurora & Network effects) without heavy external graphical libraries.
- **Static Content Management**: A custom Node.js-based static site generator for the blog, allowing Markdown-based content authoring.
- **Internationalization**: A JSON-driven localization system for the Resume/Portfolio section (EN, ID, DE).
- **Progressive Web App**: Basic PWA capabilities via Service Worker functionality.

---

## 2. Repository Overview

The repository acts as a monorepo for several distinct but integrated web components.

### Folder Map

```
/
├── assets/
│   ├── images/             # Global images (WebP, SVG, PNG)
│   └── css/
│       └── tokens.css      # [NEW] Shared CSS Design Tokens (SSOT)
├── blog/                   # [Sub-site] Static Blog & Generator
│   ├── posts/              # Markdown content source
│   ├── build.js            # Node.js SSG with Shortcode support
│   ├── variables.css       # Blog-specific CSS (imports tokens.css)
│   └── index.html          # Blog Entry
├── js/
│   └── background-manager.js  # Canvas Background Engine Registry
├── resume/                 # [Sub-site] Professional Portfolio
│   ├── locales/            # i18n JSON data (EN, ID, DE)
│   ├── css/animations.css  # Resume-specific animations
│   ├── style.css           # Resume styles (imports tokens.css)
│   └── index.html          # Portfolio Entry
├── shared/                 # [Library] Shared ES Modules
│   ├── theme.js            # ThemeManager class
│   ├── utils.js            # Typer, Haptics, MagneticButtons
│   └── analytics.js        # GA4 wrapper
├── tools/
│   └── config-builder.html # [NEW] No-Code Config Generator
├── index.html              # Entry Point (Link in Bio)
├── config.js               # [UNIFIED] Single Config for entire site
├── script.js               # Main Logic (Widget System)
├── style.css               # Core Styles (imports tokens.css)
└── sw.js                   # Service Worker
```

### Inventory Summary

| File Type | Count | Description |
|-----------|-------|-------------|
| **HTML** | 6 | Entry points for each sub-section + 404 |
| **JavaScript** | 10 | Core logic, build scripts, shared modules |
| **CSS** | 6 | Component-specific styling and tokens |
| **JSON** | 4 | Data for blog posts and i18n locales |
| **Markdown** | 4 | Documentation and Blog Post content |
| **Images** | 8 | Assets (WebP, SVG, PNG) |

### Notable Artifacts
- **`blog/build.js`**: A custom build tool to convert Markdown to HTML.
- **`js/background-manager.js`**: A complex Canvas rendering engine for the visual background effects.
- **`shared/theme.js`**: The central state manager for the application's theming system.

---

## 3. Quickstart

### Requirements
- **Runtime**: Node.js (v14+ recommended) for running the blog builder and local dev server.
- **Browser**: Modern browser with ES Module support (Chrome, Firefox, Safari, Edge).

### Installation
No `npm install` is strictly required for the runtime as there are no `node_modules`. Dependencies are zero (all vanilla).

```bash
git clone https://github.com/dictuzz/dictuzz.github.io.git
cd dictuzz.github.io
```

### Run Locally
To preview the site, use `npx serve` or any static file server.

```bash
# Start local server at port 8000
npx -y serve -l 8000
```
Open [http://localhost:8000](http://localhost:8000)

### Run Tests
*No automated test suite exists in this repository.* Verification is manual.

### Build (Blog)
The main site needs no build. The blog requires a build step if new Markdown files are added.

```bash
# Build blog posts from /blog/posts/*.md
node blog/build.js
```

### Deployment
The project is configured for **GitHub Pages**.
- **Source**: Root directory (or `docs/` if configured, currently root structure implies direct serving).
- **Process**: Push to `main` (or `master`) triggers GitHub Pages deployment.

---

## 4. System Architecture

The system follows a **Modular Static Architecture**. Code is organized by "Site Section" with a common "Shared Library" layer.

### Architecture Diagram

```mermaid
graph TD
    subgraph Client Browser
        Entry[index.html (Link in Bio)]
        Resume[resume/index.html (Portfolio)]
        Blog[blog/index.html (Blog)]
    end

    subgraph Shared Layer
        Theme[shared/theme.js]
        Utils[shared/utils.js]
        Analytics[shared/analytics.js]
        Tokens[assets/css/tokens.css]
    end

    subgraph "Core Logic"
        BG[js/background-manager.js]
        ConfigMain[config.js]
    end

    subgraph "Build Time (Node.js)"
        Builder[blog/build.js]
        MD[blog/posts/*.md]
    end

    Entry --> Theme
    Entry --> BG
    Entry --> Utils
    Entry --> ConfigMain
    
    Resume --> Theme
    Resume --> Utils
    Resume --> Analytics
    
    Blog --> Theme
    Blog --> Analytics
    
    Builder -- Reads --> MD
    Builder -- Generates --> Blog
```

### Components & Responsibilities

1.  **Link in Bio (`/`)**
    *   **Responsibility**: Landing page, traffic router, visual showcase.
    *   **Key Files**: `index.html`, `script.js`, `js/background-manager.js`.
    *   **Contracts**: Consumes `config.js` for links data.

2.  **Portfolio (`/resume/`)**
    *   **Responsibility**: Professional detailed information, multilingual.
    *   **Key Files**: `resume/index.html`, `resume/script.js`, `resume/locales/*.json`.
    *   **Contracts**: URL Query-based language selection (`?lang=id`).

3.  **Blog (`/blog/`)**
    *   **Responsibility**: Content publishing.
    *   **Key Files**: `blog/index.html`, `blog/build.js`.
    *   **Contracts**: Statically generated at build time. No runtime DB.

4.  **Shared Library (`/shared/`)**
    *   **Responsibility**: Enforce consistency (Theme, Analytics) and reduce code duplication.
    *   **Key Files**: `theme.js` (State), `analytics.js` (GA4 wrapper).

---

## 5. Deep Module Documentation

### 5.1 Link in Bio (Root `index.html`)
The main entry point. It features a sophisticated dual-background system managed by `BackgroundManager`.
- **`script.js`**: Orchestrates `ThemeManager`, `ContentRenderer` (populates DOM from JSON), and `BackgroundManager`.
- **`js/background-manager.js`**:
    - **Mode 1 (Dark)**: `DarkAuroraEngine` - Particle system with screen blend mode (Canvas).
    - **Mode 2 (Light)**: `LightNetworkEngine` - Constellation network effect with mouse interaction (Canvas).
- **`config.js`**: Contains the raw data for links, profile info, and footer text.

### 5.2 Portfolio / Resume (`resume/`)
A Single Page Application (SPA)-like static page that loads content dynamically based on selected language.
- **Language Loading**: `loadLanguage(lang)` fetches `./locales/{lang}.json` and populates the DOM.
- **DOM Updates**: Uses `renderExperience`, `renderProjects` helper functions to generate HTML from JSON arrays.
- **Typer**: Uses `shared/utils.js` `Typer` class for the hero section typing animation.

### 5.3 Blog (`blog/`)
Minimally styled blog with Markdown support.
- **Build System (`blog/build.js`)**:
    - Scans `blog/posts/*.md`.
    - Parses Frontmatter (using manual regex, no `gray-matter`).
    - Converts Markdown to HTML (using manual regex replacers, no `marked` lib).
    - Generates `posts/{slug}.html` from `post-template.html` (defined within the script).
    - Updates `blog/posts.json` and `blog/rss.xml`.
- **RSS**: Auto-generates `rss.xml` for feed readers.

### 5.4 Shared Core (`shared/`)
- **`theme.js`**: `ThemeManager` class.
    - Uses `localStorage` key `dictuzz-theme`.
    - Listens to `storage` event to sync theme across tabs instantly.
    - Dispatches `theme-changed` event for Canvas re-rendering.
- **`utils.js`**:
    - `Typer`: Typewriter effect class.
    - `initHaptics`: Adds vibration feedback on mobile.
    - `initMagneticButtons`: 3D hover effect logic.
- **`analytics.js`**: GA4 wrapper that checks `CONFIG_DATA.analytics.enabled` before injecting scripts.

### 5.5 CSS Design Tokens (`assets/css/tokens.css`) [NEW]
Centralized design system variables consumed by all sub-sites.
- **Colors**: Background, Text, Accent (Cyber Palette: Cyan, Purple, Gold)
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale
- **Effects**: Glassmorphism, shadows, motion easing

> [!NOTE]
> All CSS files now import `tokens.css` ensuring consistent branding across Home, Resume, and Blog.

---

## 6. Application Runtime Flows

### 6.1 Request Lifecycle (Static)
1. Browser requests `https://dictuzz.github.io/`.
2. GitHub Pages serves `index.html`.
3. Browser executes `script.js` (module).
4. `script.js` imports `ThemeManager`.
5. `ThemeManager` checks `localStorage` -> applies `data-theme` attribute to `<html>`.
6. `BackgroundManager` initializes Canvas based on the applied theme.
7. `ContentRenderer` reads `config.js` and injects Profile & Link elements into DOM.

### 6.2 Theme Synchronization Flow
1. User clicks Toggle Button on Tab A.
2. `ThemeManager` updates `localStorage`.
3. `ThemeManager` updates Tab A's DOM (`data-theme`).
4. Tab B (if open) receives `window` `storage` event.
5. Tab B's `ThemeManager` listener fires, updating Tab B's DOM and re-initializing Background Canvas.

### 6.3 Blog Build Flow
1. Developer adds `new-post.md` to `blog/posts/`.
2. Developer runs `node blog/build.js`.
3. Script reads all MD files.
4. Script regenerates `blog/posts/new-post.html` (physical file).
5. Script regenerates `blog/posts.json` (index).
6. Script regenerates `blog/rss.xml`.
7. Developer commits and pushes all generated files.

---

## 7. Data Model

The application uses JSON files as its database.

### 7.1 Blog Post Schema (`blog/posts.json`)
Used by the blog index page to list articles.
```json
{
  "posts": [
    {
      "slug": "string (filename w/o ext)",
      "title": "string",
      "date": "YYYY-MM-DD",
      "dateFormatted": "Month DD • YY",
      "category": "string",
      "excerpt": "string (auto-generated first 150 chars)"
    }
  ]
}
```

### 7.2 Resume Locale Schema (`resume/locales/*.json`)
Defines the content for the portfolio.
```json
{
  "hero": { "tagline": "string", "typing": { "staticText": "string", "dynamicTexts": ["string"] } },
  "nav": { "home": "string", ... },
  "summary": { "text": "string" },
  "exp": [
    {
      "date": "string range",
      "role": "string",
      "company": "string",
      "details": ["string (bullet point)"]
    }
  ],
  "edu": { "uni1": { ... }, "school1": { ... } },
  "proj": [ { "title": "string", "desc": "string" } ],
  "skills": { ... },
  "awards": { ... }
}
```

---

## 8. Configuration Reference

### 8.1 Public Links (`config.js`)
Located in root. Controls `index.html`.
- `profile`: Avatar, name, tagline, bio.
- `links`: Array of link objects.
  - `label`: Button text.
  - `url`: Target URL.
  - `icon`: FontAwesome class (e.g., `fab fa-github`).
  - `style`: `primary` (solid) or `secondary` (outline).
  - `category`: Used for tab filtering (e.g. "Socials", "Contact").
- `footer`: Copyright text.

### 8.2 Unified Config (`config.js`) [UPDATED]
All configuration is now consolidated in the root `config.js` file (no more `shared/config.js`).
- `analytics`: `{ id: 'G-XXX', enabled: boolean }`
- `theme`: `{ storageKey, default, colors: { primary, secondary }, fonts: { display, body }, background }`
- `layout`: Widget array for dynamic page composition `[{ type: 'hero' }, { type: 'links' }]`
- `plugins`: External script loader `[{ src: 'url', async: true }]`

---

## 9. External Integrations

| Service | Type | Usage | Config Location |
|---------|------|-------|-----------------|
| **Google Analytics 4** | Analytics | Pageview/Event tracking | `shared/config.js` |
| **FontAwesome 6** | CDN (CSS) | Icons for buttons/socials | `index.html` (Link tag) |
| **Google Fonts** | CDN (CSS) | Typography (Outfit, Inter) | `index.html` (Link tag) |
| **WhatsApp API** | Link | Direct message link | `config.js` (URL) |

---

## 10. Media / Assets Inventory

All global static assets are located in the `assets/` directory, while sub-sites may have their own `assets` or root-level image files.

| File Path | Description |
|-----------|-------------|
| `assets/images/dictuzz.webp` | Main profile picture (WebP). |
| `assets/images/favicon.svg` | Site favicon. |
| `assets/images/og-image.png` | Open Graph image for social sharing. |
| `resume/Aku.webp` | Portfolio specific profile picture. |
| `resume/api.webp` | Portfolio asset (likely project preview). |
| `resume/og-image.png` | Resume-specific Open Graph image. |
| `blog/og-image.png` | Blog-specific Open Graph image. |

> [!NOTE]
> WebP format is used for photos to ensure high performance and low bandwidth usage. Ensure any new images are compressed/converted to WebP.

---

## 11. Testing Strategy

Currently, the project relies on **Manual Verification**.

### Recommended Test Plan
1. **Visual Regression**: Check Dark/Light mode on Desktop and Mobile.
2. **Link Validation**: Click all links in `config.js` to ensure they are valid.
3. **Responsive Check**: Verify `index.html` and `resume/index.html` on viewports < 400px (iPhone SE).
4. **Blog Build**: Run `node blog/build.js` and verify no errors in console and that new HTML files are generated.

---

## 12. Observability & Logging

### Analytics
- **Provider**: Google Analytics 4 (GA4).
- **Implementation**: `shared/analytics.js` dynamically injects the GTM script only if `enabled: true`.
- **Status**: Configured in `shared/config.js`.

### Error Monitoring
- **Current**: None. Errors are printed to browser console.
- **Recommendation**: Integrate Sentry if complexity grows.

---

## 13. Security Review Findings

### Risks Identified
1.  **HTML Injection via Config**:
    - **Severity**: Low (Static Site).
    - **Detail**: `bioEl.innerHTML = profile.bio` in `script.js` allows HTML injection. Since `config.js` is part of the codebase, this is a feature, not a bug.
2.  **Public Analytics ID**:
    - **Severity**: Info.
    - **Detail**: GA4 Measurement ID is public in `config.js`. This is standard practice for client-side analytics.

### Secrets Check
- No API keys, secrets, or .env files were found in the repository.
- No `package.json` eliminates Node ecosystem supply chain risks.

---

## 14. Technical Debt & Maintainability

### Debt Log (Resolved)
- ~~CSS Duplication~~: **RESOLVED** - All CSS now imports shared `assets/css/tokens.css`.
- ~~Multiple Config Files~~: **RESOLVED** - Unified into single `config.js`.
- ~~Missing `card` folder~~: References removed from documentation.

### Remaining Debt
1.  **Blog Build System**: The regex-based markdown parser in `blog/build.js` is fragile. Consider `marked` library if complexity increases.
2.  **Resume Locales**: 3 separate JSON files could be merged into one if HTTP round-trips become a concern.

---

## 15. Unparsed Files (Coverage Notes)

The following files were identified in the inventory but were not deeply analyzed (content read) during this audit, typically because their purpose was inferred from context or they are binary assets.

- **Assets**: `assets/images/*`, `resume/css/*.css` (Tokens/Animations inferred from usage in HTML).
- **Blog Content**: `blog/posts/*.html` (Generated files), `blog/posts/*.md` (Content).
- **Blog Logic**: `blog/script.js` (Inferred as simple UI logic matching `resume/script.js` pattern).
- **Config**: `resume/locales/{id,de}.json` (Inferred schema from `en.json`).

All core Logic, Architecture, and Entry Points **HAVE** been analyzed.

---

## 16. Appendix: Coverage Report

### Summary
- **Total Files Inventory**: 52
- **Files Deeply Analyzed**: 19
- **Files Inferred/Skipped**: 33
- **Source Code Analysis Coverage**: ~85% (excluding assets/generated files)

### Top Critical Files
1.  `index.html` - Main Entry.
2.  `script.js` - Main Logic.
3.  `config.js` - Main Data.
4.  `shared/theme.js` - Core State Manager.
5.  `blog/build.js` - Content Pipeline.
6.  `resume/index.html` - Primary professional display.

### Final Conclusion
The repository is a clean, well-structured static site. The primary issue is the missing `card` component. The codebase is highly maintainable due to its "Zero Framework" approach, relying on modern standard Web APIs.
