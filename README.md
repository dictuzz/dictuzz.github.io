<div align="center">

# 🔥 dictuzz.github.io

**The Digital Universe of Benedictus Richard Ricardo**
Link in Bio • Deep Space Portfolio • Interactive Card • Minimalist Blog

[![Live Demo](https://img.shields.io/badge/Live-Demo-00F5D4?style=for-the-badge&logoColor=black)](https://dictuzz.github.io)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?style=for-the-badge&logo=github)](https://pages.github.com)
[![Documentation](https://img.shields.io/badge/Docs-DOCUMENTATION.md-7B61FF?style=for-the-badge)](./DOCUMENTATION.md)

![Preview](assets/images/dictuzz.webp)

</div>

---

## 🌌 Project Overview

This repository hosts a comprehensive personal brand ecosystem, unified by the **"Deep Space Luxury"** design language.

| Component | Path | Description | Visual Style |
|-----------|------|-------------|--------------|
| **Link in Bio** | `/` | Central hub with categorized social links | **Glassmorphism** on Aurora gradient |
| **Business Card** | `/card/` | Interactive 3D virtual name card | **Platinum & Deep Space** Dual Theme |
| **Portfolio** | `/resume/` | Multi-language professional CV | **Premium High-Tech** with typing animation |
| **tuzzblog** | `/blog/` | Markdown-based personal blog | **Clean Minimalist** with theme sync |

> 📚 **For detailed technical documentation, see [`DOCUMENTATION.md`](./DOCUMENTATION.md)**

---

## ✨ Key Features

### 🎨 Unified Design System

A sophisticated dual-theme system synchronized across all components:

| Theme | Name | Background | Style |
|-------|------|------------|-------|
| **Dark** | "Deep Space" | Aurora gradient (`#0A0E17`) | Cyan/Purple/Gold neon glows |
| **Light** | "Platinum" | Cool silver (`#E2E8F0`) | Frosted glass, slate typography |

**Theme Sync**: Toggle once, applied everywhere via shared `localStorage` key.

### ⚡ Feature Highlights

- **Interactive Business Card** `/card/`
  - 3D tilt on mouse/touch
  - Flip animation (front/back)
  - Native share API support
  
- **Animated Backgrounds** `/`
  - Dark: Aurora orb particles
  - Light: Constellation network
  
- **Multi-Language Resume** `/resume/`
  - English, Indonesian, German
  - JSON-driven content
  
- **Static Blog** `/blog/`
  - Markdown → HTML build
  - Auto RSS feed generation

### 🏗️ Technical Excellence

- **Zero Frameworks**: Pure HTML5/CSS3/JS
- **Config-Driven**: Edit `config.js` for links, `shared/config.js` for site settings
- **Performance**: Lighthouse 100 target
- **PWA Support**: Service Worker enabled

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/dictuzz/dictuzz.github.io.git
cd dictuzz.github.io

# Run locally (requires Node.js)
npx -y serve -l 8000

# Open in browser
# Main:   http://localhost:8000
# Card:   http://localhost:8000/card/
# Resume: http://localhost:8000/resume/
# Blog:   http://localhost:8000/blog/
```

### Build Blog Posts

```bash
cd blog
node build.js
```

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Core** | HTML5, Vanilla CSS, Vanilla JavaScript (ES6+) |
| **Graphics** | HTML5 Canvas (Aurora/Network), CSS 3D Transforms, SVG Filters |
| **Styling** | CSS Custom Properties, Glassmorphism, Grid/Flexbox |
| **Typography** | Outfit (Headings), Inter (Body), Space Grotesk |
| **Icons** | FontAwesome 6 |
| **Analytics** | Google Analytics 4 (optional, configurable) |

---

## 📁 Repository Structure

```
dictuzz.github.io/
├── index.html              # Link in Bio landing page
├── config.js               # ⭐ Profile & links configuration
├── script.js               # Main page animations (Aurora/Network)
├── style.css               # Core design system
├── sw.js                   # Service Worker (PWA)
│
├── shared/                 # Cross-component shared resources
│   └── config.js           # ⭐ Site-wide settings (analytics, theme)
│
├── card/                   # Digital Business Card
│   ├── index.html          # Card structure
│   ├── script.js           # 3D tilt, flip, orb animation
│   └── style.css           # Deep Space/Platinum themes
│
├── resume/                 # Professional Portfolio
│   ├── index.html          # Resume layout
│   ├── script.js           # i18n, typing animation
│   ├── style.css           # Portfolio styles
│   ├── css/tokens.css      # Design tokens
│   └── locales/            # en.json, id.json, de.json
│
├── blog/                   # tuzzblog
│   ├── index.html          # Blog home
│   ├── script.js           # Theme, post loader
│   ├── styles.css          # Blog styling
│   ├── variables.css       # Theme variables
│   ├── build.js            # Static site generator
│   └── posts/              # Markdown articles
│
├── assets/images/          # Shared images
├── DOCUMENTATION.md        # 📚 Full technical documentation
└── README.md               # This file
```

---

## ⚙️ Configuration

### Adding Social Links

Edit `config.js`:

```javascript
links: [
  {
    label: "My New Link",
    url: "https://example.com",
    icon: "fab fa-twitter",
    style: "secondary",
    category: "Socials"
  }
]
```

### Site Settings

Edit `shared/config.js`:

```javascript
const SITE_CONFIG = {
  analytics: { id: 'G-XXXXXXXXXX', enabled: true },
  theme: { storageKey: 'dictuzz-theme', default: 'dark' },
  site: { name: 'dictuzz', url: 'https://dictuzz.github.io' }
};
```

---

## 📚 Documentation

For comprehensive technical documentation including architecture, component deep-dives, and extension guides, see:

**[📄 DOCUMENTATION.md](./DOCUMENTATION.md)**

---

<div align="center">

**Made with 🔥 by [@dictuzz](https://github.com/dictuzz)**

*Last updated: January 2026*

</div>
