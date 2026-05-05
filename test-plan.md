# Test plan — PR #31 (neobrutalism redesign)

## What changed (user-visible)

Pure visual redesign of the entire static site. No behavioral changes, no content changes, no HTML structure changes. The redesign replaces the previous warm-cream/gold editorial look with a Gen Z neobrutalism system:

- New cream-butter base (`#FFF8E7`) with ink (`#0A0A0A`) borders and accents
  (yellow `#FFE066`, hot pink `#FF6B9D`, cyan, lime, purple, orange).
- Display font Archivo Black (chunky/uppercase), body Space Grotesk, mono JetBrains Mono.
- Hard offset shadows `4px 4px 0 0` / `8px 8px 0 0` (no blur anywhere).
- 3–4px solid ink borders on cards, buttons, nav, photos.
- Cards / buttons "press to paper" on `:active` (shadow collapses to 0).
- Sticker-style rotated kicker labels (±2°).
- Marquee ticker strip at top of the homepage.
- Dot-grid background pattern on every page.
- 404 page: glitch text in a yellow sticker block with pink hard-offset shadow,
  and the snake game canvas re-skinned with the neobrutalism palette
  (orange head, alternating pink/purple body, yellow `404` obstacle blocks).

## Primary flow (must prove neobrutalism actually rendered)

Walk through the four main pages on `localhost:8000` and verify the chunky borders + hard shadows + new fonts + marquee + theme-color sync are real.

### Test A — Homepage (`/`)
1. Load `/`.
2. **Assertion A1**: Page renders with cream/butter background (the fixed dot-grid pattern is visible behind content).
3. **Assertion A2**: A pink horizontal marquee strip is present at the very top, scrolling the text "★ AVAILABLE FOR WORK ★ BANDUNG · INDONESIA ★ SYSTEMS ARCHITECT ★ …" in JetBrains Mono uppercase. The marquee animates left over time (verify by waiting ~2s and checking the visible substring shifts).
4. **Assertion A3**: The bio card is a paper-white block with a thick black (`#0A0A0A`) border AND a hard offset shadow that sits to the bottom-right with no blur. In the browser inspector, the card's computed `box-shadow` matches `Npx Npx 0px 0px rgb(10, 10, 10)` — the `0px 0px` is the spread/blur, which proves "no blur".
5. **Assertion A4**: The brand wordmark "dictuzz" renders in Archivo Black (`computedStyle.fontFamily` contains `Archivo Black`). The status pill underneath shows "AVAILABLE" inside a lime sticker with a thick border and a small pixel-style square dot to its left.
6. **Assertion A5**: Clicking the theme toggle (top-right of the bio card) flips the page to dark theme; the `<meta name="theme-color">` updates to `#1A1A1A`. Toggling back, it returns to `#FFE066`. Check via `document.querySelector('meta[name=theme-color]').content`.

### Test B — Resume page (`/resume/`)
1. Load `/resume/`.
2. **Assertion B1**: The fixed top nav has a yellow (`#FFE066`) background, a thick ink border, and a hard offset shadow (no blur). The active link (e.g. "HOME") has a pink fill with thick ink border around it.
3. **Assertion B2**: The hero name "BENEDICTUS RICHARD RICARDO" is in Archivo Black, all caps. The middle line "RICHARD" sits inside a yellow rectangle with a thick black border and a hard offset shadow, slightly rotated.
4. **Assertion B3**: The portrait photo has a thick black border and a hard offset shadow; behind it, a pink offset rectangle is visible.
5. **Assertion B4**: The 3 hero stats (`12+`, `34`, `1000+`) render as three colored cards (yellow, cyan, lime) — each with thick black border and hard offset shadow.

### Test C — Portfolio (`/portfolio/`)
1. Load `/portfolio/`.
2. **Assertion C1**: The top bar has a yellow background, thick ink border, and a "DICTUZZ" wordmark followed by a chip "THE OPERATIONAL RECORD" with thick border.
3. **Assertion C2**: The masthead heading "THE OPERATIONAL RECORD" renders in Archivo Black, all caps, line-broken across two lines.
4. **Assertion C3**: The "Lead Story" kicker is a pink rotated sticker tag with a thick black border (visible rotation, ±2°).
5. **Assertion C4**: Hover on the dispatch card "Lead Story" → the card translates `(-2px, -2px)` and shadow grows. Verify visually that the card actually moves up-left on hover (not staying static and not just changing color).
6. **Assertion C5**: Switch language with the EN/ID/DE buttons in the header → the typography credit string in the masthead changes correspondingly: EN = "Set in Archivo Black", ID = "Disusun dengan Archivo Black", DE = "Gesetzt in Archivo Black".

### Test D — 404 page (`/404`)
1. Load `/404`.
2. **Assertion D1**: The glitch "404" text sits inside a yellow sticker block with thick black border, slightly rotated. A pink+ink hard-offset shadow is visible behind the "404".
3. **Assertion D2**: "PAGE NOT FOUND" subheadline is in Archivo Black, uppercase.
4. **Assertion D3**: The CTA "START GAME" is a pink chunky button with thick ink border and hard offset shadow. Below it, two `Arrow keys` / `WASD` kbd chips render as yellow blocks with thick borders.
5. **Assertion D4**: Click "START GAME" → snake game canvas appears with cream background, dot-grid lines, an orange snake head, a yellow square food token (with hard offset shadow), and obstacles drawn as pink pill blocks containing the "404" text in Archivo Black/black ink. Move the snake one step (press right arrow once) and verify the head moves one cell.

## Pass / fail criteria summary

- Every assertion above must be verifiable from a single screenshot or a 2-frame comparison. Each one would visibly fail if the redesign were incomplete (e.g. if shadows still had blur, the marquee was missing, or `theme-color` didn't sync).

## Out of scope (intentionally not tested)

- Cross-browser pixel diffs (Safari / Firefox)
- Performance / Lighthouse scores
- Accessibility audit beyond visual contrast
- Print stylesheet
- Each individual portfolio case file (only the index is checked; cases share the same CSS)
