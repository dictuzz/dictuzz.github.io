# dictuzz.github.io: Canonical Technical Documentation

> **Document Version**: 2.0.0  
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
│        │ config.js   │ │ images/ │ │ *.md        │             │
│        └─────────────┘ └─────────┘ └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Independence

Each component (`/`, `/card/`, `/resume/`, `/blog/`) is **self-contained**:
- Own `index.html`, `script.js`, `style.css`
- Can function independently when visited directly
- Shares only configuration and assets

### Cross-Component Concerns

| Concern | Implementation |
|---------|----------------|
| Theme Persistence | `localStorage` key: `dictuzz-theme` |
| Analytics | Shared via `shared/config.js` → `SITE_CONFIG.analytics` |
| Design Tokens | CSS custom properties per component (not shared) |

---

## 3. Technology Stack & Dependencies

### Core Technologies

| Technology | Role | Criticality |
|------------|------|-------------|
| **HTML5** | Structure | Core |
| **CSS3** | Styling, animations, themes | Core |
| **Vanilla JavaScript** | Interactivity | Core |
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
- **No bundler**: Files served as-is

---

## 4. Repository Structure

```
dictuzz.github.io/
├── index.html              # Link in Bio landing page
├── config.js               # Link in Bio configuration (links, profile)
├── script.js               # Main page animations & interactions
├── style.css               # Main page styles (35KB)
├── sw.js                   # Service Worker (PWA support)
├── 404.html                # Custom 404 page
├── og-image.png            # OpenGraph image
│
├── shared/                 # Cross-component shared resources
│   └── config.js           # SITE_CONFIG (analytics, theme, metadata)
│
├── card/                   # Digital Business Card component
│   ├── index.html          # Card HTML structure
│   ├── script.js           # 3D tilt, flip, theme, orb animation
│   ├── style.css           # Card styles (Deep Space/Platinum themes)
│   └── og-image.png        # Card-specific OG image
│
├── resume/                 # Portfolio Resume component
│   ├── index.html          # Resume structure
│   ├── script.js           # i18n, typing animation, theme
│   ├── style.css           # Portfolio styles
│   ├── css/
│   │   └── tokens.css      # Design tokens (colors, spacing, typography)
│   ├── locales/            # Internationalization
│   │   ├── en.json         # English content
│   │   ├── id.json         # Indonesian content
│   │   └── de.json         # German content
│   └── BRAND_GUIDELINE.md  # Design guidelines
│
├── blog/                   # tuzzblog component
│   ├── index.html          # Blog home page
│   ├── script.js           # Theme, menu, post loader
│   ├── styles.css          # Blog styles
│   ├── variables.css       # CSS variables (typography, colors)
│   ├── build.js            # Static site generator (Node.js)
│   ├── posts/              # Markdown source files
│   ├── posts.json          # Post index (auto-generated)
│   ├── rss.xml             # RSS feed (auto-generated)
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

**Purpose**: Central social media hub with animated backgrounds

**Key Files**:
- `index.html` - HTML structure with canvas element
- `config.js` - Profile and links data
- `script.js` - Animation engines and interactions
- `style.css` - Glassmorphism styles

**JavaScript Architecture** (`script.js`):

```
┌─────────────────────────────────────────┐
│           BackgroundManager             │
│  ─────────────────────────────────────  │
│  • Manages dual animation engines       │
│  • Switches based on theme              │
│  • Controls animation loop              │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────┐ ┌────────────────┐ │
│  │ DarkAuroraEngine│ │LightNetworkEng.│ │
│  │                 │ │                │ │
│  │ • AuroraParticle│ │ • Particles    │ │
│  │ • Gradient orbs │ │ • Connections  │ │
│  │ • Screen blend  │ │ • Burst effect │ │
│  └─────────────────┘ └────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Other Features**:
- `initMagneticButtons()` - Hover magnetic effect on links
- `initHaptics()` - Vibration feedback on mobile
- `ThemeManager` - Dark/light mode toggle

---

### 5.2 Digital Business Card (`/card/`)

**Purpose**: Interactive 3D virtual business card

**Key Features**:
- **3D Tilt**: Mouse/touch responsive perspective transforms
- **Flip Animation**: Click to reveal back face with "About Me"
- **Dual Theme**: "Deep Space" (dark) / "Platinum" (light)
- **Share**: Native share API or clipboard fallback

**JavaScript Architecture** (`script.js`):

```javascript
// Main modules:
shareCard()          // Share/copy functionality
getInitialTheme()    // localStorage → default
applyTheme(theme)    // Apply to DOM
Orb class           // Canvas background animation
handleTilt()        // 3D perspective calculation
```

**CSS Notable Features**:
- `[data-theme="light"]` selector for Platinum mode
- `.is-flipped` class toggles `rotateY(180deg)`
- SVG noise filter for metallic texture

---

### 5.3 Portfolio Resume (`/resume/`)

**Purpose**: Multi-language professional CV

**Key Features**:
- **i18n System**: English, Indonesian, German
- **Typing Animation**: Hero text typewriter effect
- **Theme Toggle**: Dark/light mode
- **Smooth Scroll**: Anchor navigation

**JavaScript Architecture** (`script.js`):

```javascript
// Language System
loadLanguage(lang)       // Fetch JSON, apply translations
applyTranslations(data)  // Update [data-i18n] elements
renderExperience(data)   // Generate timeline HTML
renderProjects(data)     // Generate project cards
renderSkills(data)       // Generate skill tags

// Typer Class
Typer.setTexts(texts)    // Set strings to cycle
Typer.tick()             // Character-by-character animation
```

**Locale Structure** (`locales/*.json`):

```json
{
  "nav": { "about": "About", "experience": "Experience", ... },
  "hero": { "greeting": "Hello, I'm", "typing": ["Data Scientist", "..."] },
  "experience": [{ "title": "...", "company": "...", "bullets": [...] }],
  "projects": [{ "title": "...", "description": "..." }],
  "skills": { "languages": [...], "frameworks": [...] }
}
```

---

### 5.4 tuzzblog (`/blog/`)

**Purpose**: Markdown-to-HTML static blog

**Key Features**:
- **Static Site Generator**: `build.js` compiles markdown to HTML
- **Post Indexing**: Auto-generates `posts.json`
- **RSS Feed**: Auto-generates `rss.xml`
- **Dark/Light Theme**: Synced with ecosystem

**Build System** (`build.js`):

```javascript
// Workflow:
1. parseFrontmatter(content)  // Extract title, date, category
2. markdownToHtml(markdown)   // Convert to HTML
3. generatePostHtml(post)     // Wrap in template
4. build()                    // Write files, update index
5. generateRssXml(posts)      // Create RSS feed
```

**Post Format** (`posts/*.md`):

```markdown
---
title: My Post Title
date: 2026-01-08
category: tech
---

# Content here

Regular markdown content...
```

**JavaScript Modules** (`script.js`):

| Module | Purpose |
|--------|---------|
| `ThemeManager` | Dark/light toggle with localStorage |
| `MobileMenu` | Hamburger menu, focus trap |
| `FormValidation` | Contact form validation |
| `SmoothScroll` | Anchor link scrolling |
| `PostLoader` | Fetch and render posts from `posts.json` |

---

## 6. Design System

### Theme System

**Storage Key**: `dictuzz-theme` (shared across all components)

**Values**: `"dark"` (default) or `"light"`

**CSS Implementation**:

```css
/* Dark theme (default) */
:root {
  --bg-deep: #0A0E17;
  --text-primary: #FFFFFF;
}

/* Light theme */
[data-theme="light"] {
  --bg-deep: #E2E8F0;
  --text-primary: #0F172A;
}
```

### Color Palette

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `--bg-deep` | `#0A0E17` | `#E2E8F0` |
| `--bg-surface` | `#121824` | `#FFFFFF` |
| `--accent-cyan` | `#00F5D4` | `#00F5D4` |
| `--accent-purple` | `#7B61FF` | `#7B61FF` |
| `--accent-gold` | `#FFB800` | `#FFB800` |
| `--text-primary` | `#FFFFFF` | `#0F172A` |

### Typography

| Role | Font |
|------|------|
| Headings | Outfit, Space Grotesk |
| Body | Inter |
| Monospace | Space Mono, Fira Code |

### Naming Conventions

- **Card themes**: "Deep Space" (dark), "Platinum" (light)
- **CSS classes**: BEM-inspired (`.nav__link`, `.card--flipped`)
- **JS classes**: PascalCase (`DarkAuroraEngine`)
- **JS functions**: camelCase (`initMagneticButtons`)

---

## 7. Data Layer & State Flow

### State Overview

This is a **static website** with minimal state:

| State | Storage | Scope |
|-------|---------|-------|
| Theme preference | `localStorage['dictuzz-theme']` | All components |
| Language preference | URL query param `?lang=` | Resume only |
| Card flip state | In-memory (CSS class) | Card only |

### Data Sources

| Data | Source | Format |
|------|--------|--------|
| Profile/Links | `config.js` | JavaScript object |
| Resume content | `resume/locales/*.json` | JSON |
| Blog posts | `blog/posts.json` | JSON (auto-generated) |
| Site config | `shared/config.js` | JavaScript object |

### State Synchronization

```
┌─────────────────────────────────────────────────────┐
│                   localStorage                       │
│                                                     │
│   Key: 'dictuzz-theme'                              │
│   Values: 'dark' | 'light'                          │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │ LiB  │  │ Card │  │Resume│  │ Blog │           │
│  │      │  │      │  │      │  │      │           │
│  │ R/W  │  │ R/W  │  │ R/W  │  │ R/W  │           │
│  └──────┘  └──────┘  └──────┘  └──────┘           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

All components read/write to the same key, ensuring theme consistency.

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

### Configuration Schema

**`config.js`**:

```javascript
const CONFIG_DATA = {
  profile: {
    avatar: "path/to/image.webp",
    name: "Display Name",
    tagline: "Short description",
    bio: ""
  },
  links: [
    {
      label: "Button Label",
      url: "https://...",
      icon: "fab fa-icon",
      style: "primary" | "secondary",
      category: "Contact" | "Content" | "Socials"
    }
  ],
  footer: {
    year: "2025",
    copyright: "© 2025 ..."
  }
};
```

**`shared/config.js`**:

```javascript
const SITE_CONFIG = {
  analytics: {
    id: 'G-XXXXXXXXXX',
    enabled: true
  },
  theme: {
    storageKey: 'dictuzz-theme',
    default: 'dark'
  },
  site: {
    name: 'dictuzz',
    url: 'https://dictuzz.github.io',
    author: 'Your Name'
  }
};
```

### Local Development

```bash
# Start local server
npx -y serve -l 8000

# Build blog posts
cd blog
node build.js
```

---

## 9. Extension & Maintenance Guide

### Adding a New Social Link

1. Open `config.js`
2. Add entry to `links` array:
   ```javascript
   {
     label: "My New Link",
     url: "https://example.com",
     icon: "fab fa-twitter",
     style: "secondary",
     category: "Socials"
   }
   ```
3. Refresh page

### Adding a New Blog Post

1. Create `blog/posts/my-post.md`:
   ```markdown
   ---
   title: My Post Title
   date: 2026-01-15
   category: tech
   ---
   
   Content here...
   ```
2. Run: `cd blog && node build.js`
3. Commit generated HTML and updated `posts.json`

### Adding a New Language (Resume)

1. Create `resume/locales/xx.json` (copy structure from `en.json`)
2. Add language to `SUPPORTED_LANGS` in `resume/script.js`
3. Add language button in `resume/index.html`

### Modifying Theme Colors

1. Edit CSS variables in respective files:
   - Resume: `resume/css/tokens.css`
   - Blog: `blog/variables.css`
   - Card: `card/style.css`
   - Main: `style.css`
2. Maintain consistency for `--bg-deep` light mode value (`#E2E8F0`)

### Safe Areas for Refactoring

- Animation engine implementations (Aurora, Network)
- Individual component styles
- Blog build script internals

### Fragile Areas (Handle with Care)

- Theme storage key (`'dictuzz-theme'`) - used by all components
- `data-theme` attribute - CSS selectors depend on it
- Canvas element IDs - referenced by JavaScript

---

## 10. Known Debts & Risks

### Technical Debt

| Issue | Impact | Effort |
|-------|--------|--------|
| No CSS preprocessing | Duplication across components | Medium |
| No shared component library | Styles not DRY | Medium |
| Blog build is manual | Requires `node build.js` | Low |
| No automated tests | Risk of regressions | Medium |

### Architectural Smells

- **Style duplication**: Each component has its own complete stylesheet
- **Design tokens not shared**: `tokens.css` and `variables.css` define similar values
- **No build system**: Files served as-is without minification

### Security Considerations

- **No sensitive data**: All content is public
- **External CDN risk**: Google Fonts, FontAwesome could be unavailable
- **Analytics**: User tracking (can be disabled via `SITE_CONFIG.analytics.enabled`)

### Browser Compatibility

- **Modern browsers only**: Uses CSS custom properties, Canvas, ES6+
- **No IE11 support**: Intentional
- **Reduced motion**: Respects `prefers-reduced-motion` media query

---

## Appendix: Quick Reference

### Key Selectors

| Selector | Purpose |
|----------|---------|
| `[data-theme="light"]` | Light mode styles |
| `[data-theme="dark"]` | Dark mode styles (default) |
| `.is-flipped` | Card flip state |
| `[data-i18n="key"]` | i18n translation targets |

### Key localStorage Keys

| Key | Values | Components |
|-----|--------|------------|
| `dictuzz-theme` | `'dark'` \| `'light'` | All |

### Key JavaScript Globals

| Variable | Location | Purpose |
|----------|----------|---------|
| `CONFIG_DATA` | `config.js` | Link in Bio data |
| `SITE_CONFIG` | `shared/config.js` | Analytics, theme config |
| `BackgroundManager` | `script.js` | Animation controller |

---

**End of Documentation**
