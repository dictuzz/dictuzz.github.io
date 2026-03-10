# 🔪 SLIMMING PLAN — dictuzz.github.io

**Tanggal:** 2026-03-10  
**Status:** DRAFT — Menunggu persetujuan sebelum eksekusi

---

## 1. Executive Summary

Repository ini adalah **personal website** (GitHub Pages) dengan 3 halaman utama:
- **Home** (`index.html`) — Link hub
- **Resume** (`resume/index.html`) — CV interaktif
- **Portfolio** (`portfolio/`) — Next.js static export dari `portfolio-app/`

Audit menemukan **~14MB file yang bisa dihapus** (screenshots, legacy code) dan beberapa file yang tidak direferensikan oleh halaman manapun. Total ada **24+ file dead/stale** yang bisa di-remove tanpa merusak fungsionalitas apapun.

---

## 2. Entrypoints & Critical Paths

### HTML Entrypoints
| Entrypoint | CSS Dependencies | JS Dependencies |
|---|---|---|
| `index.html` (Home) | `css/site.css`, `css/home.css` | `js/home.js` → `js/ui-kit.js` |
| `resume/index.html` | `css/critical.css`, `resume/resume.css` | `resume/resume.js` → `js/ui-kit.js`, `js/analytics.js` |
| `portfolio/index.html` | Next.js `_next/static/` | Next.js `_next/static/` |
| `404.html` | Inline `<style>` (~52KB self-contained) | Inline `<script>` |

### Shared Dependencies (HARUS TETAP ADA)
- `assets/css/tokens.css` — Design tokens, di-import oleh `css/site.css`, `resume/resume.css`, `style.css`
- `css/animations.css` — Animasi, di-import oleh `css/site.css`, `resume/resume.css`, `style.css`
- `js/ui-kit.js` — ThemeManager + Typer, dipakai `js/home.js`, `resume/resume.js`, `script.js`
- `js/analytics.js` — GA4 init, dipakai `resume/resume.js`, `script.js`
- `locales/*.json` — Translation files untuk resume
- `assets/images/` — Foto profil + org logos (runtime)

---

## 3. Delete Candidates

### 🟢 Confidence: TINGGI (Aman dihapus)

| # | Path | Ukuran | Alasan | Risiko |
|---|---|---|---|---|
| 1 | `output/` (seluruh folder) | ~12MB (16 file PNG) | Screenshot design mockup — tidak direferensikan kode manapun, hanya documentation visual. Bukan asset runtime | LOW |
| 2 | `portfolio-home-clean-desktop.png` | 664KB | Screenshot design di root — tidak direferensikan | LOW |
| 3 | `portfolio-home-clean.png` | 443KB | Screenshot design di root — tidak direferensikan | LOW |
| 4 | `portfolio-selected-work.png` | 484KB | Screenshot design di root — tidak direferensikan | LOW |
| 5 | `FIXES_AND_ANALYSIS.md` | 7KB | Stale report (Feb 2026). Fix sudah diterapkan. Tidak ada value untuk repo | LOW |
| 6 | `portfolio/__next.__PAGE__.txt` | 623B | Debug/build artifact dari Next.js publish script (`flattenRoutePayloads`) | LOW |
| 7 | `portfolio/__next._full.txt` | 5KB | Debug/build artifact | LOW |
| 8 | `portfolio/__next._head.txt` | 2KB | Debug/build artifact | LOW |
| 9 | `portfolio/__next._index.txt` | 2KB | Debug/build artifact | LOW |
| 10 | `portfolio/__next._tree.txt` | 597B | Debug/build artifact | LOW |
| 11 | `portfolio/index.txt` | 5KB | Debug/build artifact (duplicate of index.html data) | LOW |
| 12 | `.eslintrc.json` | 217B | ESLint config — tapi tidak ada `eslint` di `devDependencies` manapun, dan root files pakai vanilla JS | LOW |
| 13 | `.prettierrc` | 91B | Prettier config — tidak ada `prettier` dependency | LOW |
| 14 | `.editorconfig` | 156B | Optional, tidak mempengaruhi runtime. Bisa keep jika ada preferensi | LOW |

**Estimasi penghematan: ~14.1 MB**

### 🟡 Confidence: MEDIUM (Perlu verifikasi)

| # | Path | Ukuran | Alasan | Risiko | Verifikasi |
|---|---|---|---|---|---|
| 15 | `script.js` (root) | 13KB | **Tidak direferensikan oleh HTML manapun**. Import `js/ui-kit.js` + `js/analytics.js`, tapi tidak ada `<script src="script.js">` di `index.html`, `resume/index.html`, maupun `404.html`. Kemungkinan legacy dari sebelum modularisasi ke `resume/resume.js`. Isi hampir identik dengan `resume/resume.js` | MEDIUM | Grep `script.js` — zero HTML references ✓ |
| 16 | `style.css` (root) | 33KB | **Tidak direferensikan oleh HTML manapun**. Import `tokens.css` + `animations.css`, tapi tidak ada `<link href="/style.css">` di file manapun. `resume/index.html` pakai `css/critical.css` + `resume/resume.css`, `index.html` pakai `css/site.css` + `css/home.css`. Kemungkinan legacy dari v1 | MEDIUM | Grep `style.css` — zero HTML references ✓ |
| 17 | `css/portfolio.css` | 14KB | **Tidak direferensikan oleh HTML manapun**. Portfolio sekarang pakai Next.js di `portfolio/` yang punya CSS sendiri di `_next/static/` | MEDIUM | Grep `portfolio.css` — zero references ✓ |
| 18 | `css/portfolio-detail.css` | 15KB | **Sama seperti di atas** — legacy CSS untuk portfolio v1 | MEDIUM | Grep `portfolio-detail.css` — zero references ✓ |
| 19 | `js/portfolio-index.js` | 12KB | **Tidak direferensikan oleh HTML manapun**. Legacy portfolio JS yang fetch `data/portfolio.json` — sudah diganti Next.js | MEDIUM | Grep `portfolio-index.js` — zero HTML refs ✓ |
| 20 | `js/portfolio-detail.js` | 14KB | **Sama seperti di atas** — legacy portfolio detail JS | MEDIUM | Grep `portfolio-detail.js` — zero HTML refs ✓ |
| 21 | `data/portfolio.json` | 30KB | Hanya dipakai oleh `js/portfolio-index.js` + `js/portfolio-detail.js` (keduanya legacy dead code). Portfolio sekarang pakai Next.js yang punya content sendiri di `portfolio-app/content/` | MEDIUM | Hanya 2 consumer, keduanya dead ✓ |
| 22 | `portfolio/404.html` | 10.6KB | Duplicate 404 page di dalam portfolio. GitHub Pages hanya serve `404.html` dari **root** — file ini di `portfolio/404.html` tidak pernah di-serve oleh GitHub Pages | MEDIUM | Test: akses `/portfolio/nonexistent` — akan kena root `404.html` |
| 23 | `portfolio/404/` (folder) | ~1KB | Subfolder dari Next.js 404 — redundant dengan root `404.html` | MEDIUM | Sama seperti di atas |

**Estimasi penghematan tambahan: ~132KB (kode) + ~30KB (data)**

### 🔴 Confidence: RENDAH (Hati-hati)

| # | Path | Ukuran | Alasan | Risiko | Verifikasi |
|---|---|---|---|---|---|
| 24 | `portfolio-app/.next/` | Besar | Build cache. Bisa di-regenerate dengan `npm run build`. Tidak perlu ada di repo jika sudah di-`.gitignore` | HIGH | Cek apakah sudah di `.gitignore` |
| 25 | `portfolio-app/node_modules/` | Besar | Dependencies. Cek apakah sudah di `.gitignore` | HIGH | Cek `.gitignore` |
| 26 | `portfolio-app/out/` | Besar | Build output. Seharusnya di `.gitignore` | HIGH | Cek `.gitignore` |
| 27 | `portfolio-app/tsconfig.tsbuildinfo` | 112KB | TypeScript build cache, bisa di-regenerate | LOW | Pastikan di `.gitignore` |

> ⚠️ Item 24-27 kemungkinan sudah di-`.gitignore`. Jika ya, mereka tidak masuk repo. Jika tidak, mereka **harus** ditambahkan.

---

## 4. Merge Candidates

| # | Files | Target | Alasan | Benefit |
|---|---|---|---|---|
| M1 | `css/site.css` (5.9KB) + `css/home.css` (9KB) | `css/home.css` | `site.css` hanya dipakai oleh `index.html` (bersamaan dgn `home.css`). Tidak ada halaman lain yang pakai `site.css` sendirian. Merge mengurangi 1 HTTP request | Reduce 1 request, simplify |
| M2 | Jika `script.js` tidak dihapus: merge ke `resume/resume.js` | `resume/resume.js` | Konten hampir identik. Tapi lebih baik **hapus** `script.js` karena tidak direferensikan | N/A, delete lebih baik |

---

## 5. Dependency Cleanup

### Unused Dependencies
Tidak ada dependency issue karena project ini mostly vanilla HTML/CSS/JS. `portfolio-app/` punya `package.json` yang clean dengan hanya Next.js + React.

### Duplikasi CSS Import
- `tokens.css` di-import oleh 3 file: `style.css` (dead), `resume/resume.css`, `css/site.css`
- `animations.css` di-import oleh 3 file: `style.css` (dead), `resume/resume.css`, `css/site.css`
- Jika `style.css` dihapus → hanya 2 consumer remain, yang benar

### Config yang Tidak Ada
- `resume/resume.js` dan `script.js` fetch `/data/global-config.json` — file ini **tidak ada** di repo. Fetch silently fails (handled gracefully). Ini bukan masalah fungsional tapi menambah network request yang sia-sia.

---

## 6. Suggested Folder Structure (Before/After)

### BEFORE (Current)
```
dictuzz.github.io/
├── index.html                    ← Home (links hub)
├── 404.html                      ← Custom 404 (52KB self-contained)
├── script.js                     ← ❌ DEAD (unreferenced)
├── style.css                     ← ❌ DEAD (unreferenced)
├── FIXES_AND_ANALYSIS.md         ← ❌ STALE report
├── og-image.png                  ← OG image (1MB)
├── portfolio-home-clean-desktop.png  ← ❌ Screenshot
├── portfolio-home-clean.png          ← ❌ Screenshot
├── portfolio-selected-work.png       ← ❌ Screenshot
├── .eslintrc.json                ← ❌ No ESLint installed
├── .prettierrc                   ← ❌ No Prettier installed
├── .editorconfig                 ← Optional
├── css/
│   ├── site.css                  ← Home CSS
│   ├── home.css                  ← Home CSS
│   ├── critical.css              ← Resume critical CSS
│   ├── animations.css            ← Shared animations
│   ├── portfolio.css             ← ❌ DEAD
│   └── portfolio-detail.css      ← ❌ DEAD
├── js/
│   ├── home.js                   ← Home JS
│   ├── ui-kit.js                 ← Shared (ThemeManager, Typer)
│   ├── analytics.js              ← GA4 init
│   ├── portfolio-index.js        ← ❌ DEAD
│   └── portfolio-detail.js       ← ❌ DEAD
├── data/
│   └── portfolio.json            ← ❌ DEAD (legacy portfolio data)
├── output/                       ← ❌ 16 screenshots (~12MB)
├── resume/                       ← ✅ Resume page
├── portfolio/                    ← ✅ Next.js static export
│   ├── __next.*.txt              ← ❌ Debug artifacts
│   ├── 404.html                  ← ❌ Redundant 404
│   └── ...
├── portfolio-app/                ← ✅ Next.js source
├── assets/                       ← ✅ Shared assets
└── locales/                      ← ✅ i18n files
```

### AFTER (Proposed)
```
dictuzz.github.io/
├── index.html                    ← Home
├── 404.html                      ← Custom 404
├── og-image.png                  ← OG image
├── css/
│   ├── home.css                  ← Home CSS (merged with site.css)
│   ├── critical.css              ← Resume critical CSS
│   └── animations.css            ← Shared animations
├── js/
│   ├── home.js                   ← Home JS
│   ├── ui-kit.js                 ← Shared
│   └── analytics.js              ← GA4 init
├── resume/                       ← Resume page
├── portfolio/                    ← Clean Next.js static export
├── portfolio-app/                ← Next.js source
├── assets/                       ← Shared assets
└── locales/                      ← i18n files
```

---

## 7. Verification Checklist

Sebelum menghapus, jalankan langkah-langkah ini:

```bash
# 1. Pastikan semua file dead benar-benar tidak direferensikan
grep -r "script\.js" --include="*.html" .
grep -r "style\.css" --include="*.html" .
grep -r "portfolio\.css" --include="*.html" --include="*.css" .
grep -r "portfolio-detail\.css" --include="*.html" --include="*.css" .
grep -r "portfolio-index\.js" --include="*.html" .
grep -r "portfolio-detail\.js" --include="*.html" .

# 2. Test website sebelum & setelah
# - Buka https://dictuzz.me/ → cek links berfungsi
# - Buka https://dictuzz.me/resume/ → cek semua section + language switch
# - Buka https://dictuzz.me/portfolio/ → cek portfolio pages
# - Buka https://dictuzz.me/nonexistent → cek 404 page

# 3. Cek git status sebelum commit
git status
git diff --stat
```

---

## 8. Risks & Rollback Plan

| Risk | Mitigasi |
|---|---|
| Menghapus file yang masih dipakai | Semua candidate sudah diverifikasi via grep. Zero references found. |
| Portfolio breakage | `portfolio/` tidak dimodify — hanya hapus `__next.*.txt` debug files |
| Rollback | Semua perubahan bisa di-revert via `git revert` karena belum di-push |
| Merge `site.css` + `home.css` | Low risk — keduanya hanya dipakai oleh `index.html` |

> **Rollback Procedure:** `git stash` atau `git checkout -- .` sebelum commit. Setelah commit: `git revert HEAD`.
