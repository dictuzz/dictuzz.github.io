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
| **HTML** | 4 | Entry points for sub-sections + 404 |
| **JavaScript** | 8 | Core logic, shared modules |
| **CSS** | 5 | Component-specific styling and tokens |
| **JSON** | 3 | i18n locales |
| **Markdown** | 3 | Documentation |
| **Images** | 8 | Assets (WebP, SVG, PNG) |

### Notable Artifacts
- **`js/background-manager.js`**: A complex Canvas rendering engine for the visual background effects.
- **`shared/theme.js`**: The central state manager for the application's theming system.

---

## 3. Quickstart

### Requirements
- **Browser**: Modern browser with ES Module support (Chrome, Firefox, Safari, Edge).
- **Node.js**: Optional, only for running local dev server.

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

### Deployment
The project is configured for **GitHub Pages**.
- **Source**: Root directory.
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

    Entry --> Theme
    Entry --> BG
    Entry --> Utils
    Entry --> ConfigMain
    
    Resume --> Theme
    Resume --> Utils
    Resume --> Analytics
```

### Components & Responsibilities

1.  **Link in Bio (`/`)**
    *   **Responsibility**: Landing page, traffic router, visual showcase, interactive widgets.
    *   **Key Files**: `index.html`, `script.js`, `js/background-manager.js`.
    *   **Contracts**: Consumes `config.js` for links data and widgets.

2.  **Portfolio (`/resume/`)**
    *   **Responsibility**: Professional detailed information, multilingual.
    *   **Key Files**: `resume/index.html`, `resume/script.js`, `resume/locales/*.json`.
    *   **Contracts**: URL Query-based language selection (`?lang=id`).

3.  **Shared Library (`/shared/`)**
    *   **Responsibility**: Enforce consistency (Theme, Analytics) and reduce code duplication.
    *   **Key Files**: `theme.js` (State), `analytics.js` (GA4 wrapper).

---

## 5. Deep Module Documentation

### 5.1 Link in Bio (Root `index.html`)
The main entry point. It features a sophisticated dual-background system managed by `BackgroundManager` and a Widget Engine.
- **`script.js`**: Orchestrates `ThemeManager`, `ContentRenderer` (populates DOM from JSON), and `BackgroundManager`.
- **Widget Engine**: Renders interactive blocks within the link list (e.g., Collapsible Contact Form, Email dual-option widget).
- **`js/background-manager.js`**:
    - **Mode 1 (Dark)**: `DarkAuroraEngine` - Particle system with screen blend mode (Canvas).
    - **Mode 2 (Light)**: `LightNetworkEngine` - Constellation network effect with mouse interaction (Canvas).
- **`config.js`**: Contains the raw data for links, profile info, and footer text.

### 5.2 Portfolio / Resume (`resume/`)
A Single Page Application (SPA)-like static page that loads content dynamically based on selected language.
- **Language Loading**: `loadLanguage(lang)` fetches `./locales/{lang}.json` and populates the DOM.
- **DOM Updates**: Uses `renderExperience`, `renderProjects` helper functions to generate HTML from JSON arrays.
- **Typer**: Uses `shared/utils.js` `Typer` class for the hero section typing animation.

### 5.3 Shared Core (`shared/`)
- **`theme.js`**: `ThemeManager` class.
    - Uses `localStorage` key `dictuzz-theme`.
    - Listens to `storage` event to sync theme across tabs instantly.
    - Dispatches `theme-changed` event for Canvas re-rendering.
- **`utils.js`**:
    - `Typer`: Typewriter effect class.
    - `initHaptics`: Adds vibration feedback on mobile.
    - `initMagneticButtons`: 3D hover effect logic.
- **`analytics.js`**: GA4 wrapper that checks `CONFIG_DATA.analytics.enabled` before injecting scripts.

### 5.4 CSS Design Tokens (`assets/css/tokens.css`) [NEW]
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
7. `ContentRenderer` reads `config.js` and injects Profile, Widgets, & Link elements into DOM.

### 6.2 Theme Synchronization Flow
1. User clicks Toggle Button on Tab A.
2. `ThemeManager` updates `localStorage`.
3. `ThemeManager` updates Tab A's DOM (`data-theme`).
4. Tab B (if open) receives `window` `storage` event.
5. Tab B's `ThemeManager` listener fires, updating Tab B's DOM and re-initializing Background Canvas.

---

## 7. Data Model

The application uses JSON files as its database.

### 7.1 Resume Locale Schema (`resume/locales/*.json`)
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
- `links`: Array of objects. Can be standard links or widgets.
  - **Link**: `{ label, url, icon, style, category }`
  - **Widget**: `{ type: "widget", widget: "email" | "meeting", category }`
- `footer`: Copyright text.

### 8.2 Unified Config (`config.js`) [UPDATED]
All configuration is now consolidated in the root `config.js` file (no more `shared/config.js`).
- `analytics`: `{ id: 'G-XXX', enabled: boolean }`
- `theme`: `{ storageKey, default, colors: { primary, secondary }, fonts: { display, body }, background }`
- `layout`: Top-level section array `[{ type: 'hero' }, { type: 'links' }]`. (Note: Widgets are now inside `links`).
- `plugins`: External script loader `[{ src: 'url', async: true }]`

---

## 9. External Integrations

| Service | Type | Usage | Config Location |
|---------|------|-------|-----------------|
| **Google Analytics 4** | Analytics | Pageview/Event tracking | `shared/config.js` |
| **FontAwesome 6** | CDN (CSS) | Icons for buttons/socials | `index.html` (Link tag) |
| **Google Fonts** | CDN (CSS) | Typography (Outfit, Inter) | `index.html` (Link tag) |
| **WhatsApp API** | Link | Direct message link | `config.js` (URL) |
| **Formspree** | API | Contact Form & Email submissions | `script.js` (Implementation) |

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

> [!NOTE]
> WebP format is used for photos to ensure high performance and low bandwidth usage. Ensure any new images are compressed/converted to WebP.

---

## 11. Testing Strategy

Currently, the project relies on **Manual Verification**.

### Recommended Test Plan
1. **Visual Regression**: Check Dark/Light mode on Desktop and Mobile.
2. **Link Validation**: Click all links in `config.js` to ensure they are valid.
3. **Widget Functionality**: Test Form and Email widgets toggle and submission.
4. **Responsive Check**: Verify `index.html` and `resume/index.html` on viewports < 400px (iPhone SE).

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
- ~~Legacy Blog System~~: **RESOLVED** - Migrated to Medium, local blog engine removed.

### Remaining Debt
1.  **Resume Locales**: 3 separate JSON files could be merged into one if HTTP round-trips become a concern.

---

## 15. Unparsed Files (Coverage Notes)

The following files were identified in the inventory but were not deeply analyzed (content read) during this audit, typically because their purpose was inferred from context or they are binary assets.

- **Assets**: `assets/images/*`, `resume/css/*.css` (Tokens/Animations inferred from usage in HTML).
- **Config**: `resume/locales/{id,de}.json` (Inferred schema from `en.json`).

All core Logic, Architecture, and Entry Points **HAVE** been analyzed.

---

## 16. Appendix: Coverage Report

### Summary
- **Total Files Inventory**: ~40 (Reduced after blog removal)
- **Source Code Analysis Coverage**: ~90% (excluding assets)

### Top Critical Files
1.  `index.html` - Main Entry.
2.  `script.js` - Main Logic.
3.  `config.js` - Main Data.
4.  `shared/theme.js` - Core State Manager.
5.  `resume/index.html` - Primary professional display.

### Final Conclusion
The repository is a clean, well-structured static site. It now features an enhanced Widget System while simplifying content management by outsourcing the blog. The codebase is highly maintainable due to its "Zero Framework" approach.
