<div align="center">

# 🔥 dictuzz.github.io

**Personal Portfolio Hub — Link in Bio • Blog • Resume**

[![Live Demo](https://img.shields.io/badge/Live-Demo-8b5cf6?style=for-the-badge)](https://dictuzz.github.io)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?style=for-the-badge&logo=github)](https://pages.github.com)

![Preview](assets/images/dictuzz.webp)

</div>

---

## 🌟 Projects Overview

| Project | Path | Description |
|---------|------|-------------|
| **Link in Bio** | `/` | Premium link hub with glassmorphism & aurora effects |
| **tuzzblog** | `/blog` | Minimalist blog with typography focus |
| **Resume** | `/resume` | Interactive multilingual CV (JSON-driven) |

### ✨ Key Features
- **Brand Identity**: Unified "Fire" logo & Blue Verified Badge across all sites.
- **Config-Driven**: Easily manage links & profile via `config.js`.
- **Performance**: High Lighthouse scores, zero frameworks.

---

## ⚡ Quick Start

```bash
# Clone repository
git clone https://github.com/dictuzz/dictuzz.github.io.git
cd dictuzz.github.io

# Run locally
npx -y serve -l 8000

# Open http://localhost:8000
```

---

## 📝 How to Edit Content

### 1. Link in Bio (Root)

Edit **`config.js`**:

```javascript
const CONFIG_DATA = {
    profile: {
        name: "Your Name",
        tagline: "Your Profession",
        bio: "Your bio here.<br>Use <br> for line breaks."
    },
    links: [
        { label: "My Website", url: "https://...", icon: "fas fa-globe" },
        // Add more links here
    ],
    footer: { year: "2025", text: "@yourname" }
};
```

**Icons:** Use [FontAwesome 6](https://fontawesome.com/icons) class names (e.g., `fab fa-instagram`).

---

### 2. Blog (`/blog`)

**Add a new post:**

1. Create `blog/posts/your-article.md`:
   ```markdown
   ---
   title: Your Article Title
   date: 2025-01-15
   category: Essay
   ---
   
   Your content here in Markdown format...
   ```

2. Run build script:
   ```bash
   cd blog
   node build.js
   ```

3. Posts auto-loaded from `posts.json` — no HTML editing needed!

---

### 3. Resume (`/resume`)

Edit **`resume/locales/en.json`** (or `id.json`, `de.json`):

```json
{
  "hero": { "typing": { "dynamicTexts": ["Role 1", "Role 2"] } },
  "exp": [
    { "date": "2024–Present", "role": "Job Title", "company": "Company" }
  ],
  "proj": [
    { "title": "Project Name", "desc": "Description" }
  ]
}
```

Changes render automatically — no code editing required.

---

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|--------------|
| **Core** | HTML5, Vanilla CSS, Vanilla JavaScript |
| **Styling** | CSS Custom Properties, Glassmorphism, Animations |
| **Icons** | FontAwesome 6 |
| **Fonts** | Inter, Outfit (Google Fonts) |
| **Analytics** | Google Analytics 4 |

> **Zero frameworks.** Pure vanilla code for maximum performance.

---

## 📁 Project Structure

```
dictuzz.github.io/
├── index.html          # Link in Bio page
├── config.js           # ⭐ Edit links & profile here
├── style.css           # Main styles
├── script.js           # Interactions
├── assets/images/      # Avatar, favicon
│
├── blog/               # tuzzblog
│   ├── index.html      # Blog homepage
│   ├── posts.json      # ⭐ Post database (auto-generated)
│   ├── posts/*.md      # ⭐ Write posts here
│   └── build.js        # Markdown → HTML converter
│
├── resume/             # Interactive CV
│   ├── index.html      # Resume page
│   └── locales/*.json  # ⭐ Edit content here
│
├── 404.html            # Custom error page
└── README.md           # This file
```

---

## 📄 License

Open source. Feel free to fork, modify, and use.

---

<div align="center">

**Made with 🔥 by [@dictuzz](https://github.com/dictuzz)**

</div>
