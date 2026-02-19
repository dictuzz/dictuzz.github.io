# PROJECT DOCUMENTATION: dictuzz.github.io

> **Document Version**: 3.0.0
> **Last Updated**: 2026-02-12
> **SSOT**: Canonical Source of Truth

---

## 1. Executive Summary

**Project Name**: dictuzz.github.io
**Type**: Personal Brand Ecosystem (Static Web Application)
**Target Audience**: Recruiters, Professional Network, Social Media Followers, Developers

This project is a sophisticated, framework-free static web application that serves as the central digital presence for Benedictus Richard Ricardo. It aggregates multiple functional components into a unified ecosystem using a **Hybrid Architecture**:

1.  **Link in Bio (Root)**: A custom-built "Deep Space Luxury" hub using `spatial.js` and `custom-animations.css`.
2.  **Liquid Motion Portfolio (`/portfolio`)**: A cinematic, Awwwards-caliber showcase of work using advanced WebGL/GSAP animations.
3.  **Legacy Resume (`/resume`)**: A localized, data-driven CV powered by `config.js`.

**Key Capabilities**:
-   **Cinematic Experience**: The new Portfolio module features "Liquid Motion" design, 3D particle systems (`Three.js`), and scroll-driven narratives (`GSAP ScrollTrigger`).
-   **Hybrid Static Architecture**: Combines bespoke high-performance landing pages with a config-driven SPA for easier resume management.
-   **High Performance**: Optimized assets (WebP, lazy loading), deferred scripts, and GPU-accelerated animations.

---

## 2. Repository Overview

### Folder Map

```
/
├── assets/                 # Shared Global Assets (Tokens, Images)
├── config.js               # Root Configuration (Links, Profile)
├── index.html              # [Root] Main Portfolio SPA
├── links.html              # Link in Bio
├── 404.html                # Custom 404 Page (Experiment Lab)
├── css/                    # Modular styles for Portfolio
│   ├── base.css            # Reset & Global Styles
│   ├── curtain.css         # Act I Styles
│   ├── proof.css           # Act II Styles
│   ├── thread.css          # Act III Styles
│   └── signal.css          # Act IV Styles
├── js/                     # Modular logic files
│   ├── core.js             # Shared Utilities (Nav, Lenis)
│   ├── curtain-loom.js     # Three.js Particle System
│   ├── curtain.js          # Act I Logic
│   ├── proof.js            # Act II Logic
│   ├── thread.js           # Act III Logic
│   └── signal.js           # Act IV Logic
└── resume/                 # Localized Data-driven CV
```

---

## 3. Sub-Site: Liquid Motion Portfolio (Root `/`)

**Version 3.0 (2026)** introduces a single-page application (SPA) focused on narrative and motion. All acts are contained within `index.html`.

### 3.1 Architecture: The "Four Acts"
The simple single-page structure uses scroll-driven narrative stages:

1.  **Act I: The Curtain**
    -   **Concept**: "The Digital Loom" - 60,000 particles weaving the name.
    -   **Tech**: Three.js (BufferGeometry), Custom Shaders.
    -   **Interaction**: Mouse repulsion, Scroll-to-exit narrative.
    -   **Key Feature**: Particles morph from chaos to text, then fly up and vanish to reveal the tagline.

2.  **Act II: The Proof**
    -   **Concept**: "The Investigation Board" - A massive 300vw x 300vh grid.
    -   **Tech**: GSAP Layout, ScrollTrigger.
    -   **Interaction**: Scroll pans/zooms across the board to visit evidence cards.
    -   **Key Feature**: "Dossier View" - Clicking a card opens a detailed modal.

3.  **Act III: The Thread (`thread.html`)**
    -   **Concept**: "The Manifesto" - Editorial typography.
    -   **Tech**: Scramble Text, Opacity Masks.
    -   **Key Feature**: "Karaoke Reader" - Active reading line lights up (100% opacity) while context dims (20%).

4.  **Act IV: The Signal (`signal.html`)**
    -   **Concept**: "The Connection" - Minimal contact interface.

### 3.2 Technology Stack (Portfolio)
-   **Three.js**: WebGL rendering for the Curtain.
-   **GSAP (GreenSock)**: Complex timelines, ScrollTrigger, Flip.
-   **Lenis**: Smooth momentum scrolling (essential for the "Liquid" feel).
-   **Canvas API**: Used for 2D sampling of font data to drive 3D particles.

---

## 4. Sub-Site: Link in Bio (`/links.html`)

The `links.html` page serves as a high-impact traffic router and branding statement.

-   **Architecture**: Custom HTML5/CSS3.
-   **Visuals**:
    -   **Background**: "Deep Space" particle orbs (CSS/SVG).
    -   **Animations**: Custom `custom-animations.css` for staggered entry, icon layers, and hover effects.
    -   **Interactivity**: `bio.js` handles interactions.
-   **Config**: Driven by `links-data.js`.

---

## 5. Shared Core & Config

### 5.1 Configuration (`config.js`)
The `config.js` file primarily drives the **Resume (`/resume/`)** application.
-   **Profile**: Name, Bio, Avatar (used by Resume).
-   **Links**: Array of social links (used by Resume).
-   **Theme**: Default colors and fonts (used by Resume).

> **Note**: The Root and Portfolio sites utilize their own internal configs and CSS variables for specific cinematic effects.

### 5.2 Design Tokens (`assets/css/tokens.css`)
Centralized CSS variables used mainly by the Root and Resume sites. The Portfolio site uses its own bespoke variable system (`portfolio/css/style.css`) to maintain a distinct "Luxury" visual identity (`#ffd700` Gold, `#ba0000` Red).

---

## 6. Development Workflow

### Installation
No `npm install` required for runtime. Zero dependencies.

1.  **Clone**: `git clone https://github.com/dictuzz/dictuzz.github.io.git`
2.  **Run**: `npx serve .` (Standard static file server).
3.  **Visit**: `http://localhost:3000/portfolio/` (or root).

### Deployment
-   **GitHub Pages**: Auto-deploys on push to `main`.
-   **No Build Step**: Files are served as-is.

---

## 7. Performance Strategy

### Portfolio Optimization
-   **Lazy Loading**: investigation board images use `loading="lazy"`.
-   **Prioritization**: Hero assets use `fetchpriority="high"`.
-   **Defer Execution**: All heavy JS (`main.js`, `three.js`) is deferred to unblock First Paint.
-   **Geometry Caching**: Layout thrashing (read/write cycles) is minimized by caching element coordinates on `mouseenter` instead of `mousemove`.
-   **WebGL Attributes**: Canvas uses `alpha: true`, `antialias: true` only where necessary.

---

## 8. Future Roadmap

-   [x] **Custom Footer Text**: Implemented in Root site.
-   [x] **Icon Animations**: Added "Layer Group" animation in Root.
-   [ ] **Mobile Optimization (Portfolio)**: Refine the 300vh scroll tracks for touch devices.
-   [ ] **Merge Systems**: Eventually unify `resume` and `portfolio` data sources.
-   [ ] **Blog Integration**: Potentially fetch Medium posts dynamically via API.

---

> **Note**: This documentation supercedes previous versions. Access specific sub-site documentation in their respective directories/READMEs if available.
