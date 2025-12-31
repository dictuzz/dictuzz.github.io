# Benedictus Richard Ricardo - Deep Space Portfolio

A modern, high-performance personal portfolio website designed with a premium **"Deep Space Luxury"** aesthetic. Built to showcase data science projects, leadership experience, and professional skills with a focus on speed, accessibility, and analytics.

![Portfolio Preview](og-image.png)

---

## 🌌 "Deep Space Luxury" Design System

The portfolio is built on a custom design language that combines the mystery of deep space with the precision of cyber aesthetics.

### Color Palette

| Variable | Name | Color | Usage |
|----------|------|-------|-------|
| `--color-bg-base` | **Deep Space** | `#0A0E17` | Infinite background void |
| `--color-bg-surface`| **Surface** | `#121824` | Cards and navigation background |
| `--accent-cyan` | **Cyber Cyan** | `#00F5D4` | Primary actions, links, orbital rings |
| `--accent-purple` | **Electric Purple** | `#7B61FF` | Secondary accents, deep gradients |
| `--accent-gold` | **Luxury Gold** | `#FFB800` | Awards, premium borders, highlights |

### Typography

*   **Display / Headings**: **Outfit** & **Space Grotesk**
    *   Used for Names, Numbers, and Section Titles.
    *   Character: Modern, geometric, authoritative.
*   **Body Copy**: **Inter**
    *   Used for paragraphs and long descriptions.
    *   Character: Neutral, highly legible.

### Key Visuals
*   **Glassmorphism**: Translucent surfaces `rgba(18, 24, 36, 0.7)` with blur.
*   **Neon Glows**: Colored shadows rather than black shadows for depth.
*   **Premium Avatar**: Gold-bordered profile with rotating Cyan orbit.

---

## ⚡ Key Features

### 1. Dynamic Core
*   **JSON-Driven Content**: All text (Experience, Projects, Bio) is separated from code in `locales/en.json` (and `id`, `de`).
*   **Auto-Rendering**: Adding a new project or job experience involves editing a single JSON file; the DOM updates automatically.
*   **Internationalization (i18n)**: Seamlessly supports English, Indonesian, and German with auto-detection of browser language.

### 2. High Performance
*   **Zero Frameworks**: Pure Vanilla JS/CSS ensuring lightning-fast loads.
*   **Critical CSS**: Above-the-fold styles (Hero, Nav) are inlined for instant rendering.
*   **Lazy Loading**: Non-critical assets load asynchronously.

### 3. Smart Analytics
*   **Google Analytics 4**: Tracking of Resume Downloads, Language Switches, and Profile interactions.

---

## 🛠️ Tech Stack

*   **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+).
*   **Architecture**: Fetch API-based i18n, Component Rendering.
*   **Styling**: Vanilla CSS3 (Custom Properties, Glassmorphism, Animations).
*   **Assets**: FontAwesome 6 (Icons), Google Fonts (Outfit, Space Grotesk, Inter).

---

## 🚀 Getting Started

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/dictuzz/dictuzz.github.io.git
    cd dictuzz.github.io/resume
    ```

2.  **Run locally**:
    ```bash
    npx -y serve -l 8000
    ```

3.  **Open**: `http://localhost:8000/resume/`

---

## 📁 Project Structure

```
resume/
├── index.html          # Main HTML structure
├── style.css           # Component styles
├── script.js           # Logic: i18n, Rendering, Animations
├── css/
│   ├── tokens.css      # ⭐ DESIGN TOKENS (Edit colors here)
│   └── animations.css  # Keyframes
├── locales/            # ⭐ CONTENT DATA
│   ├── en.json         # English Data
│   ├── id.json         # Indonesian Data
│   └── de.json         # German Data
├── BRAND_GUIDELINE.md  # Detailed Design Documentation
└── README.md           # This documentation
```

---

## 📝 How to Update Content

### Adding a Job or Project
Open `locales/en.json` (and `id.json`/`de.json`) and add a new object to the array.

**Example (Experience):**
```json
"exp": [
    {
        "date": "Jan 2025 – Present",
        "role": "Data Scientist",
        "company": "Deep Space Corp",
        "details": ["Built AI models", "Improved efficiency by 200%"]
    }
]
```

---

## License
© 2025 Benedictus Richard Ricardo. All Rights Reserved.
