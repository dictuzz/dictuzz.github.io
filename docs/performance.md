# Performance Optimization Metrics

## Baselines (Before Optimization)
- **Large Assets Identified**:
  - `og-image.png` (~1015.7 KB)
  - `portfolio-home-clean-desktop.png` (~648.3 KB)
  - `portfolio-selected-work.png` (~472.4 KB)
  - `portfolio-home-clean.png` (~432.6 KB)
- **Unminified Assets**:
  - `css/site.css` (~19.8 KB)
  - `js/home.js` (~5.9 KB)
- **Render-Blocking Resources**: 
  - Font references and sync stylesheets loaded in `<head>`.

## Optimizations Applied
- **Asset Minification**:
  - Generated `js/home.min.js` using `terser`, reducing size to ~4.1 KB.
  - Generated `css/site.min.css` using `clean-css` (size remained roughly identical due to its clean source).
- **Core Images Converted to WebP**:
  - `og-image.webp`: ~61.2 KB (reduced from ~1.04 MB)
  - `portfolio-home-clean-desktop.webp`: ~82.5 KB (reduced from ~648 KB)
  - `portfolio-selected-work.webp`: ~93 KB (reduced from ~472 KB)
  - `portfolio-home-clean.webp`: ~47.8 KB (reduced from ~432 KB)
- **Render-Blocking Eliminated**:
  - Font configurations defer loaded and `preload` headers added for minified static assets in `index.html`. 

## Results
- **Lighthouse Performance Score**: 100
- **LCP (Largest Contentful Paint)**: ~228 ms
- **FCP (First Contentful Paint)**: ~228 ms
