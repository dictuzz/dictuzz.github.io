<div align="center">

# 🔥 dictuzz.github.io

**The Digital Universe of Benedictus Richard Ricardo**
Link in Bio • Deep Space Portfolio • Minimalist Blog

[![Live Demo](https://img.shields.io/badge/Live-Demo-00F5D4?style=for-the-badge&logoColor=black)](https://dictuzz.github.io)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?style=for-the-badge&logo=github)](https://pages.github.com)

![Preview](assets/images/dictuzz.webp)

</div>

---

## 🌌 Project Overview

This repository hosts a comprehensive personal brand ecosystem, unified by the **"Deep Space Luxury"** design language.

| Component | Path | Description | Visual Style |
|-----------|------|-------------|--------------|
| **Link in Bio** | `/` | Central hub for all social links | **Glassmorphism** cards on Deep Space gradient |
| **Portfolio** | `/resume` | Professional CV & Projects | **Premium High-Tech** with interactive typing hero |
| **tuzzblog** | `/blog` | Personal thoughts & essays | **Clean Minimalist** (Deep Space Light/Dark) |

---

## ✨ Key Features

### 🎨 Brand Identity: "Deep Space Luxury"
A cohesive design system applied across all three sub-projects:
-   **Primary Colors**: Deep Space (`#0A0E17`), Surface (`#121824`)
-   **Accents**: Cyan (`#00F5D4`), Electric Purple (`#7B61FF`), Luxury Gold (`#FFB800`)
-   **Typography**: **Space Grotesk** (Headings) & **Inter** (Body)
-   **Signature**: Golden-bordered Avatar & Cyan Orbit Ring

### ⚡ Technical Highlights
-   **Zero Frameworks**: Pure HTML5, CSS3, and Vanilla JavaScript for maximum performance (Lighthouse 100).
-   **Config-Driven**: 
    -   Root: Edit `config.js` to update links.
    -   Resume: Edit `locales/*.json` to update CV content.
    -   Blog: Edit `posts/*.md` to publish articles.
-   **Performant**: Critical CSS inlining for instant FCP (First Contentful Paint).

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/dictuzz/dictuzz.github.io.git
cd dictuzz.github.io

# Run locally (requires Node.js)
npx -y serve -l 8000

# Open http://localhost:8000
```

---

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|--------------|
| **Core** | HTML5, Vanilla CSS, Vanilla JavaScript |
| **Styling** | CSS Custom Properties (Variables), Glassmorphism, CSS Grid/Flexbox |
| **Fonts** | Space Grotesk, Outfit, Inter (Google Fonts) |
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
├── blog/               # tuzzblog
│   ├── posts/          # ⭐ Markdown articles
│   ├── variables.css   # Clean/Minimal Theme Tokens
│   └── build.js        # Static Site Generator script
│
├── resume/             # Professional Portfolio
│   ├── locales/        # ⭐ JSON Content (En/Id/De)
│   ├── css/tokens.css  # Core Design Tokens
│   └── BRAND_GUIDELINE.md # Official Design Documentation
│
└── README.md           # This file
```

---

<div align="center">

**Made with 🔥 by [@dictuzz](https://github.com/dictuzz)**

</div>
