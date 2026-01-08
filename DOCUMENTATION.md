# dictuzz.github.io: Canonical Technical Documentation

> **Document Version**: 2.1.0
> **Last Updated**: 2026-01-08
> **Target Audience**: Senior Full-Stack Developers, AI Systems

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architectural Overview](#2-architectural-overview)
3. [Technology Stack & Dependencies](#3-technology-stack--dependencies)
4. [Repository Structure](#4-repository-structure)
5. [Component Deep Dives](#5-component-deep-dives)
6. [Design System](#6-design-system)
7. [Data Layer & State Flow](#7-data-layer--state-flow)
8. [Configuration & Environment](#8-configuration--environment)
9. [Extension & Maintenance Guide](#9-extension--maintenance-guide)
10. [Known Debts & Risks](#10-known-debts--risks)

---

## 1. Project Overview

### What Is This?

A **personal brand ecosystem** consisting of four interconnected web components, unified by the "Deep Space Luxury" design language. The project is a static website hosted on GitHub Pages.

### Core Components

| Component | Path | Purpose |
|-----------|------|---------|
| **Link in Bio** | `/` | Social link aggregator with animated backgrounds |
| **Digital Business Card** | `/card/` | Interactive 3D virtual business card |
| **Portfolio Resume** | `/resume/` | Multi-language professional CV |
| **tuzzblog** | `/blog/` | Markdown-based minimalist blog |

### Target Users

- **Primary**: Recruiters, collaborators, and social media visitors
- **Secondary**: Developers who want to fork/customize this template

### Core Constraints

- **Zero Frameworks**: Pure HTML5/CSS3/JavaScript (no React, Vue, etc.)
- **Static Hosting**: GitHub Pages only (no server-side processing)
- **Performance**: Lighthouse 100 target
- **Accessibility**: Reduced motion support, keyboard navigation

### Non-Goals

- Server-side rendering
- Dynamic database connections
- User authentication
- Comment systems

---

## 2. Architectural Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Pages (CDN)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│   │  index   │  │   card   │  │  resume  │  │   blog   │      │
│   │  (LiB)   │  │          │  │          │  │          │      │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│        │             │             │             │              │
│        └──────┬──────┴──────┬──────┴──────┬──────┘              │
│               │             │             │                     │
│        ┌──────▼──────┐ ┌────▼────┐ ┌──────▼──────┐             │
│        │ shared/     │ │ assets/ │ │ blog/posts/ │             │
│        │ libs & cfg  │ │ images/ │ │ *.md        │             │
│        └─────────────┘ └─────────┘ └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Shared Core (New in v2.0)

A `shared/` directory now houses common logic to reduce duplication:

- **`shared/theme.js`**: `ThemeManager` class for dark/light toggling and persistence.
- **`shared/utils.js`**: `Typer` (typewriter effect), `initHaptics`, `initMagneticButtons`.
- **`shared/analytics.js`**: Centralized GA4 wrapper.
- **`shared/config.js`**: Ecosystem-wide configuration (Analytics ID, etc.).

### Component Independence

Each component (`/`, `/card/`, `/resume/`, `/blog/`) is **semi-independent**:
- Own `index.html`, `style.css`
- **Imports** shared logic via ES Modules (`<script type="module">`)
- Can function independently when visited directly

### Cross-Component Concerns

| Concern | Implementation |
|---------|----------------|
| Theme Persistence | `localStorage` key: `dictuzz-theme` (managed by `ThemeManager`) |
| Analytics | Shared via `shared/analytics.js` + `shared/config.js` |
| Design Tokens | CSS custom properties per component (mostly independent) |

---

## 3. Technology Stack & Dependencies

### Core Technologies

| Technology | Role | Criticality |
|------------|------|-------------|
| **HTML5** | Structure | Core |
| **CSS3** | Styling, animations, themes | Core |
| **Vanilla JavaScript (ES6+)** | Interactivity, Modules | Core |
| **HTML5 Canvas** | Background animations (Aurora, Network) | Core |

### External Dependencies

| Dependency | Source | Purpose | Replaceable? |
|------------|--------|---------|--------------|
| **Google Fonts** | CDN | Typography (Outfit, Inter, Space Grotesk) | Yes |
| **FontAwesome 6** | CDN | Icons | Yes |
| **Google Analytics 4** | CDN | Analytics | Yes (optional) |

### Development Tools

| Tool | Purpose |
|------|---------|
| `npx serve` | Local development server |
| `node blog/build.js` | Blog static site generator |

### Known Limitations

- **No NPM dependencies**: Intentional for simplicity
- **No TypeScript**: Plain JavaScript only
- **No bundler**: Files served as-is (ES Modules used natively)

---

## 4. Repository Structure

```
dictuzz.github.io/
├── index.html              # Link in Bio landing page
├── config.js               # Link in Bio configuration (links, profile)
├── script.js               # Main entry point (Module)
├── style.css               # Main page styles (35KB)
├── sw.js                   # Service Worker (PWA support)
├── 404.html                # Custom 404 page
├── og-image.png            # OpenGraph image
│
├── js/                     # Root-level scripts
│   └── background-manager.js # Extracted animation engines
│
├── shared/                 # SHARED LIBRARY (v2.0)
│   ├── config.js           # SITE_CONFIG (analytics, theme, metadata)
│   ├── theme.js            # ThemeManager class
│   ├── utils.js            # Typer, Haptics, Magnetic
│   └── analytics.js        # GA4 init
│
├── card/                   # Digital Business Card component
│   ├── index.html          # HTML (Imports shared libs)
│   ├── script.js           # Refactored script
│   ├── style.css           # Card styles
│   └── og-image.png        # Card-specific OG image
│
├── resume/                 # Portfolio Resume component
│   ├── index.html          # HTML (Imports shared libs)
│   ├── script.js           # Refactored script
│   ├── style.css           # Portfolio styles
│   ├── css/
│   │   └── tokens.css      # Design tokens
│   ├── locales/            # Internationalization
│   │   ├── en.json
│   │   ├── id.json
│   │   └── de.json
│   └── BRAND_GUIDELINE.md  # Design guidelines
│
├── blog/                   # tuzzblog component
│   ├── index.html          # HTML (Imports shared libs)
│   ├── script.js           # Refactored script
│   ├── styles.css          # Blog styles
│   ├── variables.css       # CSS variables
│   ├── build.js            # Static site generator (Node.js)
│   ├── posts/              # Markdown source files
│   ├── posts.json          # Post index
│   ├── rss.xml             # RSS feed
│   ├── contact.html        # Contact form page
│   └── manifesto.html      # Manifesto page
│
└── assets/
    └── images/             # Shared image assets
```

### Where to Put What

| Content Type | Location |
|--------------|----------|
| New social link | `config.js` → `links` array |
| New blog post | `blog/posts/*.md` → run `node blog/build.js` |
| Resume content | `resume/locales/*.json` |
| Shared config | `shared/config.js` |
| Component-specific styles | Respective `style.css` file |

---

## 5. Component Deep Dives

### 5.1 Link in Bio (`/`)

**Purpose**: Central social media hub with animated backgrounds.

**JavaScript Architecture**:
- **`script.js`**: Main entry. Initializes `ThemeManager`, `ContentRenderer`, and imports `BackgroundManager`.
- **`js/background-manager.js`**: Contains `DarkAuroraEngine` and `LightNetworkEngine`.
- **`config.js`**: Data source.

### 5.2 Digital Business Card (`/card/`)

**Purpose**: Interactive 3D virtual business card.

**Refactor Note**:
- Imports `ThemeManager` from `../shared/theme.js`.
- Imports `initAnalytics` from `../shared/analytics.js`.
- Preserves 3D tilt and flip logic in component script but delegates theme handling.

### 5.3 Portfolio Resume (`/resume/`)

**Purpose**: Multi-language professional CV.

**Refactor Note**:
- Imports `Typer` from `../shared/utils.js`.
- Imports `ThemeManager` from `../shared/theme.js`.
- Preserves unique i18n logic (`loadLanguage`).

### 5.4 tuzzblog (`/blog/`)

**Purpose**: Markdown-to-HTML static blog.

**Refactor Note**:
- Imports `ThemeManager`.
- Builds statically but runs client-side JS for interaction (menus, forms).

---

## 6. Design System

### Theme System

**Storage Key**: `dictuzz-theme` (managed by `ThemeManager`)

**Values**: `"dark"` (default) or `"light"`

**CSS Implementation**:
- Components listen for `data-theme` attribute on `<html>`.
- `ThemeManager` updates this attribute and dispatches `theme-changed` event.

### Color Palette

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `--bg-deep` | `#0A0E17` | `#E2E8F0` |
| `--bg-surface` | `#121824` | `#FFFFFF` |
| `--accent-cyan` | `#00F5D4` | `#00F5D4` |
| `--text-primary` | `#FFFFFF` | `#0F172A` |

---

## 7. Data Layer & State Flow

### State Overview

| State | Storage | Scope |
|-------|---------|-------|
| Theme preference | `localStorage['dictuzz-theme']` | All components |
| Language preference | URL query param `?lang=` | Resume only |
| Card flip state | In-memory (CSS class) | Card only |

### Synchronization

`ThemeManager` ensures that if one tab changes the theme (via `localStorage` event), others update safely.

---

## 8. Configuration & Environment

### Main Configuration Files

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `config.js` | Link in Bio profile and links | Often |
| `shared/config.js` | Analytics ID, theme defaults | Rarely |
| `resume/locales/*.json` | Resume content | Sometimes |

### Environment Variables

None. All configuration is in JavaScript files.

---

## 9. Extension & Maintenance Guide

### Adding a New Social Link
1. Edit `config.js`.

### Adding a New Blog Post
1. Add `.md` in `blog/posts/`.
2. Run `node blog/build.js`.

### Modifying Shared Logic
1. Edit `shared/utils.js` or `shared/theme.js`.
2. Since ES Modules are used, no build step is needed. Just refresh.

---

## 10. Known Debts & Risks

### Technical Debt (v2.1 Status)

| Issue | Impact | Status |
|-------|--------|--------|
| **Code Duplication** | Logic shared across files | **RESOLVED** (Shared Libs) |
| No CSS preprocessing | Duplication across components | Open (Medium) |
| Hardcoded Analytics ID | Scattered IDs | **RESOLVED** (`shared/config.js`) |
| Monolithic `script.js` | Hard to maintain | **RESOLVED** (Modules) |

### Architectural Smells

- **Style duplication**: CSS is still largely component-specific. Consider a `shared/tokens.css` in future phases.

### Security Considerations

- **No sensitive data**: All content is public.
- **Analytics**: Can be disabled via `SITE_CONFIG.analytics.enabled`.

---

**End of Documentation**
