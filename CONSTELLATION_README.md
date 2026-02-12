# Constellation Link-in-Bio

## Overview

This is a complete re-architecture of the link-in-bio experience using force-directed graph physics and spatial navigation.

**Core Concept:** Links are nodes in a constellation. Users navigate by exploring spatial relationships, not scrolling through lists.

---

## File Structure

```
constellation.html          Main page (NEW)
data/
  └── links.json           Content data structure
css/
  ├── constellation-reset.css      CSS reset
  ├── constellation-base.css       Typography, colors, layout
  ├── constellation-nodes.css      Node styling
  ├── constellation-polish.css     Loading, tooltips
  └── constellation-fallback.css   Reduced motion layout
js/
  ├── physics-engine.js            Custom force-directed simulation
  ├── animations.js                WAAPI animation wrappers
  ├── accessibility.js             Keyboard nav, ARIA announcements
  ├── polish.js                    Loading & tooltip utilities
  └── constellation.js             Main initialization
```

---

## How to Test

### 1. Open the Page
Open `constellation.html` in a modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### 2. Test Full Experience
- **Hover over domain nodes** (Data Science, Creative, Leadership) to expand clusters
- **Hover over satellite nodes** to see tooltips
- **Watch ambient drift** - nodes breathe and shift subtly
- **Observe connection lines** - they curve and glow on interaction

### 3. Test Keyboard Navigation
- **Tab** between domain nodes
- **Enter/Space** to expand cluster
- **Arrow keys** to move between domains
- **Tab** into expanded cluster to navigate satellite nodes
- **Escape** to collapse cluster

### 4. Test Accessibility
- **Enable screen reader** (NVDA/JAWS/VoiceOver)
- Navigate through semantic structure
- Listen for ARIA announcements on cluster expand/collapse

### 5. Test Reduced Motion
- **Enable OS setting:** `prefers-reduced-motion: reduce`
- Page should show fallback accordion layout
- No physics, no animations, full functionality

### 6. Test Mobile
- Open on iOS/Android device
- Touch targets should be comfortable (48px+)
- Layout should adapt to smaller viewport

---

## Updating Content

Edit `data/links.json` to change:
- Identity info (name, tagline, avatar)
- Domain categories
- Links within each domain

HTML structure will auto-populate from JSON (or can be manually updated in constellation.html).

---

## Design Philosophy

### What This IS:
- Force-directed graph as navigation system
- Physics simulation revealing spatial relationships
- Progressive disclosure through interaction
- Accessibility-first progressive enhancement

### What This IS NOT:
- A Linktree clone
- A generic link grid
- Decorative animations without purpose
- Visual over function

---

## Performance

### Optimizations:
- Viewport culling (only render visible nodes)
- RequestAnimationFrame throttling
- GPU-accelerated transforms
- Canvas for connection lines (DOM kept light)
- Lazy loading physics engine

### Targets:
- First Contentful Paint: <1s
- Time to Interactive: <2s
- 60fps during physics simulation
- Works on devices with 4+ CPU cores

---

## Browser Support

**Full Experience:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Chrome Android 90+
- iOS Safari 14+

**Fallback Experience:**
- Any modern browser with JS disabled
- Browsers with prefers-reduced-motion enabled
- Screen readers (semantic HTML fallback)

---

## Critical Success Factors

1. **Motion must feel confident, not gimmicky**
   - Watch for: Nodes bouncing excessively, chaotic drift
   - Tune: Damping, impulse force, spring strength

2. **Physics must add value, not complexity**
   - Watch for: Users confused by spatial layout
   - Fallback: Add subtle onboarding hint on first visit

3. **Accessibility must be full-featured**
   - Test: Complete all tasks with keyboard only
   - Test: Navigate with screen reader without frustration

---

## Known Risks

### 1. Orbital Layout Could Feel Like Radial Menu
**Mitigation:** Randomization added, physics breaks symmetry
**Monitor:** User testing for "feels like context menu" feedback

### 2. Connection Lines Could Be Visual Noise
**Mitigation:** Lines serve purpose (show relationships), brighten on interaction
**Monitor:** Eye tracking to see if users ignore them

### 3. Complexity Might Overwhelm Users
**Mitigation:** Progressive disclosure, loading state, clear focus indicators
**Monitor:** Bounce rate, time to first click

---

## Next Steps

### Immediate:
1. Test on actual devices (not just desktop browser)
2. Get user feedback on spatial navigation intuitiveness
3. A/B test against simple list version

### Future Enhancements:
1. Add search/filter (type to highlight matching nodes)
2. Add "Recent" cluster (dynamic based on user activity)
3. Add smooth camera pan/zoom for mobile
4. Add WebGL shader effects on connections (if performance allows)

---

## Contact

Built for: dictuzz
Concept: Data Scientist portfolio as navigable knowledge graph
Implementation: Custom physics engine, vanilla JS, semantic HTML

---

## License

This implementation is custom for dictuzz.me
Code patterns may be reused, but do not clone wholesale.
