# REFACTOR & SIMPLIFICATION PLAN: dictuzz.github.io

> **Status**: DRAFT PROPOSAL
> **Objective**: Reduce code complexity and improve extensibility.

## 1. Complexity Hotspots

1.  **`script.js` (Root)**
    -   **Issue**: Manual DOM hydration (`hydrateStatic`, `renderLayout`, `renderHero`) mixed with Widget logic.
    -   **Fix**: Extract `ContentRenderer` into `shared/renderer.js`.

2.  **`resume/script.js`**
    -   **Issue**: Parallel implementation of `loadLanguage`, `renderExperience` etc.
    -   **Fix**: Move generic list rendering to a shared helper or use a lightweight templating pattern.

3.  **`timeline` Logic (Curtain)**
    -   **Issue**: Hardcoded scroll values (`startOutput`, `endOutput`).
    -   **Fix**: Use `data-attributes` or a config object for timeline checkpoints.

## 2. Duplication Map

| Logic | Locations | Recommendation |
| :--- | :--- | :--- |
| **Typewriter** | `script.js` (inline), `shared/utils.js` | Use `shared/utils.js` exclusively. |
| **Theme Toggle** | `script.js`, `resume/script.js`, `shared/theme.js` | `shared/theme.js` handles state, but UI binding is repeated. Create `ThemeUI.init()`. |
| **Magnetic Button** | `script.js`, `shared/utils.js` | Dedupe. |
| **Analytics** | `script.js`, `resume/script.js`, `shared/analytics.js` | Fine as is (Centralized). |

## 3. Customization Strategy (Config-Driven)

The site is already 80% config-driven via `config.js`. To reach 100%:

1.  **Theme Config**:
    Move colors/fonts from CSS Variables to `config.js` and inject them via JS (completed in `script.js`, needs porting to `portfolio/`).

2.  **Toggle Features**:
    Add `features` flag to `config.js`:
    ```javascript
    features: {
      enableBlog: false,
      enablePortfolioV3: true,
      enableResumeV2: true
    }
    ```

## 4. Refactor Roadmap

### Phase 1: The "Great Merge" (Safe)
-   [ ] Move `resume/Aku.webp` -> `assets/images/`.
-   [ ] Move `portfolio/assets/*` -> `assets/images/portfolio/`.
-   [ ] Refactor `resume/style.css` to import `assets/css/tokens.css`.
-   [ ] Delete `resume/css/tokens.css`.

### Phase 2: Shared Library Expansion (Medium)
-   [ ] Create `shared/ui-kit.js`.
    -   Move `initMagneticButtons` here.
    -   Move `initSpotlights` here.
    -   Move `initProfileTilt` here.
-   [ ] Refactor `script.js` to import these from `ui-kit.js`.
-   [ ] Refactor `resume/script.js` to import these from `ui-kit.js`.

### Phase 3: Logic Simplification (High)
-   [ ] Extract `ContentRenderer` from `script.js` into `js/renderer.js`.
    -   Pass `CONFIG_DATA` as argument.
    -   Make it pure function-like.
-   [ ] Standardize `portfolio/` to read `CONFIG_DATA` (currently it has hardcoded texts in `curtain.js`).

## 5. Practical Pattern Example

**Bad (Current)**:
```javascript
// script.js
function initSpotlights() { ... }
// resume/script.js
// ... duplicate code ...
```

**Good (Proposed)**:
```javascript
// shared/ui-kit.js
export const UX = {
  haptics: () => { ... },
  magnetic: (selector) => { ... },
  spotlight: (selector) => { ... }
};

// script.js
import { UX } from './shared/ui-kit.js';
UX.magnetic('.btn');
```
