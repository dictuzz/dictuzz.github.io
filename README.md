<div align="center">

# 🔥 dictuzz.github.io

**The Digital Universe of Benedictus Richard Ricardo**
Link in Bio • Deep Space Portfolio • Interactive Card • Minimalist Blog

[![Live Demo](https://img.shields.io/badge/Live-Demo-00F5D4?style=for-the-badge&logoColor=black)](https://dictuzz.github.io)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?style=for-the-badge&logo=github)](https://pages.github.com)

![Preview](assets/images/dictuzz.webp)

</div>

---

## 🌌 Project Overview

This repository hosts a comprehensive personal brand ecosystem, unified by the **"Deep Space Luxury"** design language.

| Component | Path | Description | Visual Style |
|-----------|------|-------------|--------------|
| **Link in Bio** | `/` | Central hub for all social links with *Categorized Tabs* | **Glassmorphism** cards on Deep Space gradient |
| **Business Card** | `/card` | **NEW!** Virtual 3D Interactive Name Card | **Ambient Orbs** with 3D Flip & Tilt Effect |
| **Portfolio** | `/resume` | Professional CV & Projects | **Premium High-Tech** with interactive typing hero |
| **tuzzblog** | `/blog` | Personal thoughts & essays | **Clean Minimalist** (Deep Space Light/Dark) |

---

## ✨ Key Features

### 🎨 Brand Identity: "Deep Space Luxury"
A cohesive design system applied across all sub-projects:
-   **Primary Colors**: Deep Space (`#0A0E17`), Surface (`#121824`)
-   **Accents**: Cyan (`#00F5D4`), Electric Purple (`#7B61FF`), Luxury Gold (`#FFB800`)
-   **Typography**: **Outfit** & **Space Grotesk** (Headings), **Inter** (Body)
-   **Signature**: Golden-bordered Avatar & Cyan Orbit Ring

### ⚡ Technical Highlights
-   **Zero Frameworks**: Pure HTML5, CSS3, and Vanilla JavaScript for maximum performance (Lighthouse 100).
-   **Interactive Business Card**: 
    -   **3D Tilt & Flip**: CSS3D transformations for realistic physics.
    -   **Ambient Background**: Canvas-based "Aurora" orb animation (no heavy libraries).
    -   **Theme Support**: Seamless Dark/Light mode toggle.
-   **Smart Link Pages**: 
    -   **Categorization**: JavaScript automatically groups links into tabs (Socials, Contact, Content).
    -   **Config-Driven**: Edit `config.js` to manage all links in one place.
-   **Performant**: Critical CSS inlining and optimized assets.

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/dictuzz/dictuzz.github.io.git
cd dictuzz.github.io

# Run locally (requires Node.js)
npx -y serve -l 8000

# Open http://localhost:8000
# Card: http://localhost:8000/card/
# Resume: http://localhost:8000/resume/
```

---

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|--------------|
| **Core** | HTML5, Vanilla CSS, Vanilla JavaScript |
| **Graphics** | HTML5 Canvas (Animations), CSS3D Transforms |
| **Styling** | CSS Custom Properties (Variables), Glassmorphism, CSS Grid/Flexbox |
| **Fonts** | Outfit, Space Grotesk, Inter (Google Fonts) |
| **Icons** | FontAwesome 6 |
| **Analytics** | Google Analytics 4 (Lazy-loaded) |

---

## 📁 Structure

```
dictuzz.github.io/
├── index.html          # Link in Bio (Landing Page)
├── config.js           # ⭐ Edit landing page links here
├── style.css           # Deep Space Design System
├── assets/             # Shared assets (images, fonts)
│
├── card/               # ⭐ NEW: Digital Business Card
│   ├── index.html      # 3D Card logic & Canvas
│   └── style.css       # Card-specific Glassmorphism
│
├── blog/               # tuzzblog
│   ├── posts/          # Markdown articles
│   └── build.js        # Static Site Generator script
│
├── resume/             # Professional Portfolio
│   ├── locales/        # JSON Content (En/Id/De)
│   └── css/tokens.css  # Core Design Tokens
│
└── README.md           # This file
```

---

<div align="center">

**Made with 🔥 by [@dictuzz](https://github.com/dictuzz)**

</div>
