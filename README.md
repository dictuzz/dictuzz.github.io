<div align="center">

# 🔥 dictuzz.github.io

**The Digital Universe of Benedictus Richard Ricardo**
Link in Bio • Deep Space Portfolio • Minimalist Blog

[![Live Demo](https://img.shields.io/badge/Live-Demo-00F5D4?style=for-the-badge&logoColor=black)](https://dictuzz.github.io)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?style=for-the-badge&logo=github)](https://pages.github.com)
[![Documentation](https://img.shields.io/badge/Docs-DOCUMENTATION.md-7B61FF?style=for-the-badge)](./DOCUMENTATION.md)
[![Config Builder](https://img.shields.io/badge/Tool-Config_Builder-orange?style=for-the-badge)](./tools/config-builder.html)

![Preview](assets/images/dictuzz.webp)

</div>

---

## 🌌 Project Overview

This repository hosts a comprehensive personal brand ecosystem, unified by the **"Deep Space Luxury"** design language. It is designed to be a **Single Source of Truth** for your digital presence, fully configurable via a single JSON file.

| Component | Path | Description | Visual Style |
|-----------|------|-------------|--------------|
| **Link in Bio** | `/` | Central hub with dynamic widgets and links | **Glassmorphism** on Aurora/Network |
| **Portfolio** | `/resume/` | Multi-language professional CV | **Premium High-Tech** with typing animation |
| **tuzzblog** | `/blog/` | Markdown-based personal blog | **Clean Minimalist** with theme sync |

> 📚 **For detailed technical documentation, see [`DOCUMENTATION.md`](./DOCUMENTATION.md)**

---

## ✨ features

### 🎨 Fully Customizable Engine
Control everything from `config.js`:
- **Theme System**: Define your own Brand Colors (`primary`, `secondary`) and Fonts.
- **Background Engine**: Switch visual effects (`aurora`, `network`, `static`) instantly.
- **Widget Layout**: Reorder your page structure (Hero -> Bio -> Links -> Form) via config array.

### ⚡ Feature Highlights
- **Unified Configuration**: One file (`config.js`) controls all sub-sites.
- **Feature Flags**: Toggle sections (Blog/Resume) on or off globally.
- **Extensible**:
  - **Plugins**: Inject 3rd party scripts (Analytics, Chat) via config.
  - **Widgets**: Add Contact Forms (Formspree) or Raw HTML blocks easily.
- **Multi-Language Resume**: `/resume/?lang=id` or auto-detect.
- **Static Blog Generator**: Markdown files → HTML with Shortcode support (`{{ youtube }}`, `{{ alert }}`).

---

## 🚀 Quick Start

### 1. easy Configuration (No Code)
Open [`tools/config-builder.html`](./tools/config-builder.html) in your browser to generate your `config.js` visually!

### 2. Manual Setup
```bash
# Clone repository
git clone https://github.com/dictuzz/dictuzz.github.io.git
cd dictuzz.github.io

# Run locally (requires Node.js)
npx -y serve -l 8000
```

### 3. Build Blog
```bash
# Only needed when adding new .md posts
node blog/build.js
```

---

## 🛠️ Configuration Guide (`config.js`)

The entire site is driven by `config.js` in the root directory.

### Basic Branding
```javascript
const CONFIG_DATA = {
    siteTitle: "@dictuzz | Portfolio",
    theme: {
        colors: { primary: "#00F5D4", secondary: "#7B61FF" },
        fonts: { display: "Outfit", body: "Inter" },
        background: "aurora" // or 'network', 'static'
    },
    // ...
};
```

### Widget Layout System
Define the order of sections on your landing page:
```javascript
layout: [
    { type: "hero" },
    { type: "bio" },
    { type: "links" },
    { 
        type: "contact", 
        config: { url: "https://formspree.io/f/..." } 
    }
]
```

### Feature Flags
Disable sections you don't need:
```javascript
features: {
    blog: false,   // Hides Blog link from Resume
    resume: true
}
```

---

## 📁 Repository Structure

```
dictuzz.github.io/
├── config.js               # ⭐ SINGLE SOURCE OF TRUTH (Edit this!)
├── index.html              # Entry point (Widget Engine)
├── script.js               # Core Logic & Renderer
├── tools/
│   └── config-builder.html # 🛠️ GUI Config Generator
├── js/
│   └── background-manager.js # Visual Effect Registry
├── resume/                 # Professional Portfolio SPA
├── blog/
│   ├── build.js            # Generator Script
│   └── posts/              # Your Markdown Articles
└── assets/                 # Images & Icons
```

---

<div align="center">

**Made with 🔥 by [@dictuzz](https://github.com/dictuzz)**
*Last updated: February 2026*

</div>
