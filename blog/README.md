# tuzzblog - Deep Space Clean Theme

A minimalist blog template adopting the **"Deep Space Luxury"** aesthetic in a clean, readability-focused form.

> Part of the [dictuzz.github.io](https://dictuzz.github.io) ecosystem

---

## 🎨 Visual Identity

The blog is a "Clean Minimalist" interpretation of the main brand:

### Typography
- **Headings**: **Space Grotesk** (Modern, geometric)
- **Body**: **Inter** (High readability)
- **Monospace**: **Space Mono** / Fira Code

### Color Scheme

| Mode | Background | Accent | Link |
|------|------------|--------|------|
| **Light** | `#E2E8F0` (Slate) | `#00F5D4` (Cyan) | `#008080` (Teal) |
| **Dark** | `#0A0E17` (Deep Space) | `#00F5D4` (Cyan) | `#00F5D4` (Cyan) |

### Theme Synchronization

The blog uses the shared theme key `dictuzz-theme` in `localStorage`, ensuring theme consistency across all ecosystem components:

```javascript
ThemeManager.STORAGE_KEY = 'dictuzz-theme';
```

If you toggle the theme on the main page, the blog will automatically use the same theme.

---

## 📁 File Structure

```
blog/
├── index.html        # Post listing page
├── manifesto.html    # Manifesto page
├── contact.html      # Contact form page
├── styles.css        # Main stylesheet (Layout & Components)
├── variables.css     # ⭐ Theme Tokens (Edit colors/fonts here)
├── script.js         # JavaScript (Theme, Menu, PostLoader)
├── build.js          # Markdown → HTML build script
├── posts.json        # Post database (auto-generated)
├── rss.xml           # RSS feed (auto-generated)
├── posts/            # Markdown source files
│   └── *.md          # Write blog posts here!
└── README.md         # This documentation
```

---

## 🚀 Publishing a New Post

### 1. Create Markdown File

Create a new `.md` file in the `posts/` folder:

```markdown
---
title: Your Post Title
date: 2026-01-08
category: Tech
---

Your article content in Markdown format.

## Heading Example

Regular paragraph text with **bold** and *italic*.
```

### 2. Run Build Script

```bash
cd blog
node build.js
```

The script will automatically:
- ✅ Parse all `.md` files in `posts/`
- ✅ Generate `.html` files for each article
- ✅ Update `posts.json` with metadata
- ✅ Regenerate `rss.xml` feed

### 3. Commit & Push

```bash
git add .
git commit -m "Add new blog post"
git push
```

---

## 🎨 Customization

### Editing Theme Colors

Modify `variables.css` to change the color palette:

```css
/* Light Theme */
:root {
  --color-bg: #E2E8F0;        /* Slate background */
  --color-accent: #00F5D4;    /* Cyber Cyan */
  --color-link: #008080;      /* Teal for readability */
}

/* Dark Theme */
[data-theme="dark"] {
  --color-bg: #0A0E17;        /* Deep Space */
  --color-link: #00F5D4;      /* Cyan */
}
```

### Style Variations

The blog supports style variations via `data-style` attribute:

| Style | Effect |
|-------|--------|
| `serif` | Classic serif typography |
| `high-contrast` | Accessibility-focused |

---

## 📝 Supported Markdown Syntax

| Syntax | Result |
|--------|--------|
| `# Heading 1` | H1 heading (Space Grotesk) |
| `## Heading 2` | H2 heading |
| `**bold**` | **Bold text** |
| `*italic*` | *Italic text* |
| `[link](url)` | Hyperlink (Cyan/Teal) |
| `> quote` | Blockquote with accent border |
| `` `code` `` | Inline code |
| ```` ```lang ```` | Fenced code block |
| `- item` | Bullet list |
| `1. item` | Numbered list |

---

## 🌙 Dark Mode

- **Manual Toggle**: Click the sun/moon icon in the header
- **System Detection**: Respects `prefers-color-scheme` on first visit
- **Persistence**: Saved to `localStorage['dictuzz-theme']`
- **Ecosystem Sync**: Shared with main page, card, and resume

---

## JavaScript Modules

The `script.js` contains these modules:

| Module | Purpose |
|--------|---------|
| `ThemeManager` | Dark/light toggle with localStorage |
| `MobileMenu` | Hamburger menu with focus trap |
| `FormValidation` | Contact form validation |
| `SmoothScroll` | Smooth anchor scrolling |
| `PostLoader` | Fetches and renders posts from `posts.json` |

---

Made with ❤️ by [@dictuzz](https://dictuzz.github.io)

*Last updated: January 2026*
