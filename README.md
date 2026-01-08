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
| **Business Card** | `/card` | **NEW!** Virtual 3D Interactive Name Card | **Platinum & Deep Space** Dual Theme |
| **Portfolio** | `/resume` | Professional CV & Projects | **Premium High-Tech** with interactive typing hero |
| **tuzzblog** | `/blog` | Personal thoughts & essays | **Clean Minimalist** (Deep Space Light/Dark) |

---

## ✨ Key Features

### 🎨 Design System: "Deep Space" & "Platinum"
A sophisticated dual-theme system applied across the ecosystem:
-   **Dark Mode ("Deep Space")**: 
    -   Background: Cosmic Aurora (Cyan/Purple/Gold)
    -   Card: Glassmorphism with deep blue/black gradients and neon accents.
-   **Light Mode ("Platinum Card")**: 
    -   Background: Clean Cool Silver (`#E2E8F0`)
    -   Card: **Frosted Platinum** finish with matte noise texture, white sheen, and sharp slate typography (`#1A202C`).

### ⚡ Feature Highlights
-   **Interactive Business Card**: 
    -   **Mobile-First 3D Physics**: Fully interactive 3D tilt on **Touch Screens** and Desktop.
    -   **Responsive Geometry**: Card transforms from a widescreen landscape view on desktop to a compact, portrait "held-in-hand" ratio on mobile (`9/15`).
    -   **Dynamic Shine**: Periodic metallic shimmer animation that sweeps across the card surface.
    -   **Resume-Style Avatar**: Pill-shaped avatar with Gold halo and glow effect.
-   **Zero Frameworks**: Pure HTML5/CSS3/JS for instant performance (Lighthouse 100).
-   **Config-Driven**: Centralized `config.js` for managing links and profile data.

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
| **Graphics** | HTML5 Canvas (Ambient Orbs), CSS3D Transforms, SVG Filters (Noise) |
| **Styling** | Modern CSS (Variables, Filters, Grid/Flexbox) |
| **Typeface** | **Outfit** (Headings), **Inter** (Body) |
| **Icons** | FontAwesome 6 |

---

## 📁 Structure

```
dictuzz.github.io/
├── index.html          # Link in Bio (Landing Page)
├── config.js           # ⭐ Edit landing page links here
├── style.css           # Core Design System
├── assets/             # Shared assets (images, fonts)
│
├── card/               # ⭐ NEW: Digital Business Card
│   ├── index.html      # 3D Logic, Canvas, SEO
│   └── style.css       # Platinum/Deep Space Styles
│
├── blog/               # tuzzblog
│   ├── posts/          # Markdown articles
│   └── build.js        # Static Site Generator
│
├── resume/             # Professional Portfolio
│   ├── locales/        # JSON Content (En/Id/De)
│   └── css/tokens.css  # Design Tokens
│
└── README.md           # This file
```

---

<div align="center">

**Made with 🔥 by [@dictuzz](https://github.com/dictuzz)**

</div>
