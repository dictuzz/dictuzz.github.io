# 🔧 REFACTOR & SIMPLIFICATION PLAN — dictuzz.github.io

**Tanggal:** 2026-03-10  
**Status:** DRAFT — Menunggu persetujuan

---

## 1. Complexity Hotspots (Top 10)

| # | File | Lines | Masalah | Severity |
|---|---|---|---|---|
| 1 | `404.html` | 1481 | **Seluruh CSS + JS inline** dalam satu file HTML. 52KB monolith. Sulit di-maintain dan di-cache | 🔴 HIGH |
| 2 | `resume/resume.css` | ~33KB | File CSS tunggal yang sangat besar, mencakup hero, nav, sections, responsive, animations | 🟡 MEDIUM |
| 3 | `resume/resume.js` | 372 | Duplikasi logika dari `script.js`. Language system, UI interactions, theme, analytics, semuanya dalam satu file | 🟡 MEDIUM |
| 4 | `script.js` | 371 | **Duplikat** dari `resume/resume.js` — hampir identik tapi TIDAK dipakai | 🟡 MEDIUM |
| 5 | `style.css` | 1249 | **Dead code** — 33KB CSS yang tidak direferensikan HTML manapun | 🟡 MEDIUM |
| 6 | `css/critical.css` | ~18KB | "Critical CSS" yang seharusnya kecil (above-the-fold), tapi cukup besar | 🟡 MEDIUM |
| 7 | `js/portfolio-index.js` | ~12KB | Legacy portfolio JS — dead code, tapi pattern-nya bisa dicek | 🟢 LOW |
| 8 | `js/portfolio-detail.js` | ~14KB | Legacy portfolio detail JS — dead code | 🟢 LOW |
| 9 | `js/home.js` | ~2.5KB | Clean dan kecil — no issues | ✅ OK |
| 10 | `js/ui-kit.js` | ~9KB | Shared utilities — well-structured | ✅ OK |

---

## 2. Duplication Map

### 2.1 `script.js` ↔ `resume/resume.js` (DUPLIKASI BESAR)

Kedua file memiliki **struktur dan logika hampir identik**:
- Sama-sama import `ThemeManager`, `Typer` dari `js/ui-kit.js`
- Sama-sama import `initAnalytics` dari `js/analytics.js`
- Sama-sama punya language system (`loadLanguage`, `applyTranslations`, `renderExperience`, `renderImpact`, `renderSkills`)
- Sama-sama punya scroll spy, mobile nav, 3D avatar tilt, tracking helpers, config fetch

**Rekomendasi:** Hapus `script.js`. `resume/resume.js` adalah versi aktif yang sebenarnya dipakai.

### 2.2 CSS Token/Animation Imports

`tokens.css` dan `animations.css` di-import oleh 3 tempat:
- `style.css` (DEAD → akan dihapus)
- `resume/resume.css`
- `css/site.css`

Setelah `style.css` dihapus, tinggal 2 consumer — ini sudah sesuai.

### 2.3 `data/portfolio.json` ↔ `portfolio-app/content/`

Data portfolio ada di 2 tempat:
- `data/portfolio.json` (legacy, dipakai oleh dead JS files)
- `portfolio-app/content/` (current, dipakai Next.js app)

**Rekomendasi:** Hapus `data/portfolio.json` (+ foldernya jika kosong).

---

## 3. Simplification Proposals (by Module)

### 3.1 Home Page (`index.html` + `css/` + `js/`)

**Status saat ini:** Sudah cukup clean setelah refactor. `index.html` hanya 252 baris.

**Rekomendasi:**
- Merge `css/site.css` ke dalam `css/home.css` — kurangi 1 HTTP request
- Pastikan `js/home.js` tidak import module yang tidak diperlukan

### 3.2 Resume Page (`resume/`)

**Status saat ini:** Fungsional tapi `resume.css` terlalu besar (33KB) dan `resume.js` cukup complex.

**Rekomendasi:**
- **Pisahkan** `resume.css` menjadi:
  - `resume/resume-base.css` — layout, typography dasar
  - `resume/resume-components.css` — individual section styles
  - Atau biarkan jika split tidak diinginkan (trade-off: 1 large file vs multiple small files)
- Remove fetch ke `/data/global-config.json` yang file-nya **tidak ada** — sia-sia network request

### 3.3 404 Page

**Status saat ini:** 52KB monolith dengan semua CSS + JS inline. Cyberpunk theme.

**Rekomendasi:**
- **Keep as-is** — 404 page HARUS self-contained karena tidak bisa bergantung pada external CSS/JS (jika ada CDN issue). Inline adalah praktek yang benar.
- Tapi bisa di-minify untuk mengurangi ukuran.

### 3.4 Portfolio (Next.js)

**Status saat ini:** Clean Next.js app di `portfolio-app/`, output ke `portfolio/`.

**Rekomendasi:**
- Hapus `__next.*.txt` dari `portfolio/` — ini artifact dari `publish.mjs` `flattenRoutePayloads()` function
- **Fix** `publish.mjs` agar tidak lagi generate `__next.*.txt` files — atau masukkan logic cleanup

---

## 4. Customization Strategy (Config-Driven)

### 4.1 Yang Sudah Config-Driven ✅
- **Language:** `locales/*.json` — 3 bahasa (en, id, de) via JSON
- **Theme:** `ThemeManager` di `ui-kit.js` — dark/light toggle
- **Portfolio content:** Managed via `portfolio-app/content/` + `portfolio-app/lib/`
- **CV download links:** Hardcoded per-language di `resume.js` tapi bisa di-config

### 4.2 Yang Masih Hardcoded ⚠️
| Area | Hardcoded Di | Rekomendasi |
|---|---|---|
| Contact info (email, WA, calendar link) | `index.html`, `resume/index.html` | Pindahkan ke `data/site-config.json` |
| Social links (LinkedIn, IG, FB, etc) | `index.html`, `resume/index.html` | Pindahkan ke `data/site-config.json` |
| CV download URLs | `resume/resume.js` (ln 200-204) | Pindahkan ke `locales/*.json` atau config |
| GA4 Measurement ID | `resume/index.html` (inline script) | Bisa extract ke config |
| Color palette | `assets/css/tokens.css` | Sudah di satu tempat ✅, tapi bisa dibuat multi-theme |

### 4.3 Rekomendasi: `data/site-config.json`

Buat satu file config untuk data yang sering berubah:

```json
{
  "contact": {
    "email": "contact@dictuzz.me",
    "whatsapp": "6285186888630",
    "calendar": "https://calendar.app.google/39u2qGH6ybaFenhdA"
  },
  "social": {
    "linkedin": "https://linkedin.com/in/dictuzz",
    "github": "https://github.com/dictuzz",
    "instagram": "https://instagram.com/dictuzz"
  },
  "analytics": {
    "ga4_id": "G-PJMTM772L5"
  }
}
```

**Benefit:** Update sekali, apply di semua halaman via JS fetch.

---

## 5. Proposed Code Patterns

### ✅ DO: Single Source of Truth
```javascript
// GOOD: Satu config file, fetch sekali
const config = await fetch('/data/site-config.json').then(r => r.json());
document.querySelectorAll('[data-href="email"]').forEach(el => {
    el.href = `mailto:${config.contact.email}`;
});
```

### ❌ DON'T: Hardcode di Multiple Places
```html
<!-- BAD: Email di-hardcode di index.html DAN resume/index.html -->
<a href="mailto:contact@dictuzz.me">Email</a>
<!-- Kalau ganti email, harus edit 2 file -->
```

### ✅ DO: Handle Missing Config Gracefully
```javascript
// GOOD: Seperti yang sudah dilakukan di resume.js
async function fetchConfig() {
    try {
        const res = await fetch('/data/site-config.json');
        if (res.ok) return await res.json();
    } catch (err) {
        console.warn("Config not found, using defaults");
    }
    return {}; // fallback to defaults
}
```

### ❌ DON'T: Fetch File yang Tidak Ada
```javascript
// BAD: Fetch /data/global-config.json yang tidak exist
// Ini yang terjadi sekarang di resume.js
const res = await fetch('/data/global-config.json'); // 404 every time
```

---

## 6. Step-by-Step Refactor Roadmap

### Phase 1: Safe Refactors (Risiko Rendah) 🟢

1. **Hapus dead files** (sesuai SLIMMING_PLAN.md):
   - `script.js`, `style.css`
   - `css/portfolio.css`, `css/portfolio-detail.css`
   - `js/portfolio-index.js`, `js/portfolio-detail.js`
   - `data/portfolio.json`
   - `output/` folder
   - Root screenshot PNGs
   - `FIXES_AND_ANALYSIS.md`
   - `portfolio/__next.*.txt`, `portfolio/index.txt`

2. **Hapus config files tanpa tools**:
   - `.eslintrc.json`, `.prettierrc`

3. **Merge CSS**:
   - `css/site.css` → merge into `css/home.css`
   - Update `index.html` untuk hanya load `css/home.css`

4. **Fix phantom config fetch**:
   - Remove atau update `fetchConfig()` di `resume/resume.js` yang fetch `/data/global-config.json` (file tidak ada)

### Phase 2: Medium Refactors (Perlu Testing) 🟡

5. **Buat `data/site-config.json`**:
   - Pindahkan contact info, social links, GA4 ID ke config
   - Update `index.html` dan `resume/index.html` untuk fetch config

6. **Fix portfolio publish script**:
   - Update `portfolio-app/scripts/publish.mjs` untuk tidak generate `__next.*.txt` files
   - Atau tambahkan cleanup step

7. **Update `.gitignore` portfolio-app**:
   - Pastikan `.next/`, `node_modules/`, `out/`, `tsconfig.tsbuildinfo` di-ignore

### Phase 3: Risky / Optional 🔴

8. **Modularisasi `resume.css`**:
   - Split menjadi per-section CSS files
   - Trade-off: lebih organized tapi lebih banyak HTTP requests
   - Skip jika HTTP/2 sudah di-enable (multiplexing)

9. **Minify `404.html`**:
   - Compress inline CSS/JS
   - Bisa kurangi dari 52KB → ~30KB
   - Risiko: harder to maintain

10. **i18n untuk home page**:
    - Saat ini `index.html` hanya English
    - Resume page support 3 bahasa
    - Tambahkan language support ke home? (scope besar)

---

> **Prioritas tertinggi:** Phase 1 items 1-4. Ini semua safe, zero-risk, dan immediately mengurangi clutter.
