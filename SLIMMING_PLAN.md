# SLIMMING PLAN: dictuzz.github.io

> **Status**: DRAFT PROPOSAL
> **Objective**: Reduce repository size, cognitive load, and fragmentation.

## 1. Executive Summary

The repository is currently a "Monorepo of Eras":
-   **Era 1**: `resume/` (v2.0, Data-Driven, SPA-like)
-   **Era 2**: Root `index.html` (Link in Bio, Widget System)
-   **Era 3**: `portfolio/` (v3.0, Liquid Motion, Cinematic)

**Recommendation**: Consolidate into a cohesive "Hub & Spoke" model. The `resume` folder contains 80% of the duplication (styles, scripts, assets) but serves a distinct purpose (Text-heavy CV vs Cinematic Portfolio).

We will **NOT** delete `resume` yet, but we will **Freeze** it and move shared assets to root.

## 2. Entrypoints & Critical Paths

| Type | Path | Role | Status |
| :--- | :--- | :--- | :--- |
| **Root** | `index.html` | Traffic Router / Link in Bio | **CRITICAL** |
| **Portfolio** | `portfolio/*.html` | Main Visual Showcase (v3) | **CRITICAL** |
| **Resume** | `resume/index.html` | Text-Based CV (v2) | **LEGACY (Keep)** |
| **Config** | `config.js` | Global Data Store | **CRITICAL** |
| **Shared** | `shared/theme.js` | State Management | **CRITICAL** |

## 3. Delete Candidates

### High Confidence (Safe to Delete)

1.  **`resume/css/tokens.css`**
    -   **Reason**: Duplicate of `assets/css/tokens.css`.
    -   **Action**: Delete and point `resume/style.css` to `../../assets/css/tokens.css`.
    -   **Risk**: Low.

2.  **`resume/Aku.webp` & `resume/og-image.png`**
    -   **Reason**: Duplicates or scalable to Global Assets.
    -   **Action**: Move to `assets/images/` and update references.
    -   **Risk**: Low.

3.  **`portfolio/js/core.js`**
    -   **Reason**: Contains `Loader` and `Lenis` setup found elsewhere.
    -   **Action**: Merge into `portfolio/js/main.js` or `shared/utils.js`.
    -   **Risk**: Medium (Need to check import order).

4.  **`resume/index.html` Inline Styles**
    -   **Reason**: Contains 800+ lines of inline CSS (Tokens, Reset, Animations).
    -   **Action**: Extract to `resume/style.css` (or delete if duplicates).
    -   **Risk**: Low.

### Medium Confidence

1.  **`resume/script.js` (Partial)**
    -   **Reason**: Heavy duplication of `Typer`, `ThemeManager` calls.
    -   **Action**: Refactor to use `shared/` modules exclusively.

## 4. Merge Candidates

1.  **Unified Utility Library**
    -   **Source**: `script.js` (inline logic) + `portfolio/js/core.js` + `shared/utils.js`
    -   **Target**: `shared/ui-kit.js`
    -   **Benefit**: Single source for "Magnetic Button", "Tilt", "Spotlight".

2.  **Global Asset Store**
    -   **Source**: `resume/images/*` + `portfolio/assets/*`
    -   **Target**: `assets/images/`
    -   **Benefit**: One folder to rule them all.

## 5. Folder Restructure Proposal

```diff
/
├── assets/
│   ├── css/
│   │   ├── tokens.css      # SSOT
+   │   ├── global.css      # Reset + Base
│   └── images/             # All WebP/SVG here
├── config.js
├── index.html
├── portfolio/              # Cinematic Site
│   ├── css/                # Component styles
│   ├── js/                 # Component logic
│   └── [html files]
├── resume/                 # Text Site
│   ├── locales/            # JSON Data
-   ├── css/                # DELETE (Use global + 1 local file)
-   ├── script.js           # REFACTOR (Slim down)
│   └── index.html
└── shared/
    ├── theme.js
    ├── analytics.js
    └── ui-kit.js           # NEW: Merged Utils
```

## 6. Verification Checklist

-   [ ] `npx serve` works.
-   [ ] `/` loads Link in Bio (Widgets functional).
-   [ ] `/portfolio/` loads Cinematic Intro (Loom).
-   [ ] `/resume/` loads CV and switches languages (EN/ID/DE).
-   [ ] Theme toggle works across all 3 sub-sites.
