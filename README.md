# Benedictus Richard Ricardo - Personal Ecosystem

A modern, high-performance personal ecosystem featuring a premium **"Deep Space Luxury"** design language. Built to showcase data science expertise, leadership experience, and professional case studies.

🌐 **Live at:** [dictuzz.me](https://dictuzz.me)

---

## 🏛️ Architecture Overview

The repository utilizes a dual-architecture approach optimized for maximum performance on simple pages, and rich interactivity for case studies:

### 1. Root Hub & Resume (Vanilla JS/CSS)
- **Framework-free:** Built entirely with Semantic HTML, lightweight Vanilla CSS (`/css`), and modular JavaScript (`/js`).
- **Locales & i18n:** Driven by `/locales/*.json` (En/Id/De) with a custom lightning-fast parser in `js/ui-kit.js`.
- **Target:** The root Link Hub (`/index.html`) and Resume dossier (`/resume/`).
- **Key Modules:** `ThemeManager` and `Typer` classes for deep ecosystem integration.

### 2. Private Portfolio (Next.js Application)
- **Framework:** Next.js App Router (React + TypeScript).
- **Source:** `/portfolio-app/` directory.
- **Output:** Statically exported (SSG) to the root `/portfolio/` directory.
- **Content:** Fully configuration-driven via `/portfolio-app/content/*.ts` (no CMS overhead).

> **Note:** Do NOT manually edit files inside the `/portfolio/` directory. It is an auto-generated static export from `/portfolio-app`. To make changes to the portfolio, edit the source in `/portfolio-app` and run the build script.

---

## 🌌 Design System: Deep Space Luxury

The design system is managed globally via `/assets/css/tokens.css` to ensure seamless thematic synchronization between the Vanilla stack and the Next.js portfolio.

### Core Tokens
| Token | Name | Value | Usage |
|-------|------|-------|-------|
| `--bg-deep` | **Deep Space** | `#0A0E17` | Background (dark) |
| `--bg-surface` | **Surface** | `#121824` | Cards, navigation |
| `--accent-cyan` | **Cyber Cyan** | `#00F5D4` | Primary brand accent |
| `--accent-gold` | **Luxury Gold** | `#FFB800` | Secondary & highlights |

*Full branding guidelines can be found in `BRAND_IDENTITY.md`.*

---

## 🛠️ Local Development

### 1. Running the Root Hub & Resume
```bash
# Serve the static files from the root directory
npx serve . -l 8000
```
Then visit `http://localhost:8000/` or `http://localhost:8000/resume/`.

### 2. Developing the Next.js Portfolio
```bash
# Navigate to the Next.js source app
cd portfolio-app
npm install
npm run dev
```
Then visit `http://localhost:3000/portfolio/`.

### 3. Publishing Portfolio Updates
```bash
# Compile and export Next.js app to the /portfolio/ root folder
npm run build:portfolio
npm run publish:portfolio
```

---

## � Codebase Audit & Refactoring Plans

We routinely audit this repository for architectural simplifications and dead-code removal. Please refer to the latest architectural plans:
- [SLIMMING_PLAN.md](./SLIMMING_PLAN.md): Identifies legacy code, unused build artifacts, and safe-deletion targets (e.g., legacy root vanilla portfolio scripts).
- [REFACTOR_SIMPLIFICATION_PLAN.md](./REFACTOR_SIMPLIFICATION_PLAN.md): Strategic roadmap for transitioning hardcoded HTML into a config-driven format and setting up CI/CD GitHub Actions.

---

## 📝 License

© 2026 Benedictus Richard Ricardo. All Rights Reserved.
