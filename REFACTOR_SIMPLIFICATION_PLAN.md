# 🛠️ REFACTOR & SIMPLIFICATION PLAN

Dokumen ini menguraikan langkah-langkah restrukturisasi kode dan abstraksi logika agar `dictuzz.github.io` lebih *maintainable*, *modular*, dan mendukung penyesuaian (kustomisasi) berjangka panjang.

## 1️⃣ Executive Summary
Repositori secara struktural sudah cukup dalam kondisi yang baik (terutama di bagian aplikasi React Next.js via `portfolio-app`), namun *vanilla website* di luar Next.js masih banyak mengandalkan *hardcoded DOM manipulation* dan duplikasi markup. Fokus penyederhanaan adalah memindahkan beban konfigurasi situs dari *Hardcoded HTML* ke struktur pendorong berbasis *Data/Config*.

## 2️⃣ Complexity Hotspots (Titik Kompleksitas)

1. **Hardcoded HTML Links & Data (`index.html` dan `resume/index.html`)**
   - Semua folder link (Portofolio, Email, WhatsApp, Socials, dsb) diurutkan secara hardcode. 
   - *Masalah:* Menambah 1 link baru atau mengubah URL menuntut pencarian ke dalam ~300 baris HTML rawan *typo*.
   - *Solusi:* Implementasi **Config-Driven Pattern** untuk render komponen.

2. **Pengulangan Bahasa/Lokalisasi (i18n)**
   - Saat ini terjemahan difetch dan diparsing di `locales/*.json`, yang diproses melalui fungsi buatan sendiri di dalam modul lokal. Pengecekan *state* masih tergantung pada DOM (`data-i18n` attributes). 
   - Walau fungsional, rentan terhadap kehilangan konteks saat HTML berubah.

---

## 3️⃣ Duplication Map (Peta Duplikasi)

1. Root UI Kit vs Resume Kit
   - Interaksi UI dasar (animasi *ThemeManager* dan *Typer*) sudah diekstraksi ke `js/ui-kit.js`, yang merupakan langkah bagus. Namun, inisiasi dan event-listener masih diduplikasi masing-masing di `js/home.js` dan `resume/resume.js`.

---

## 4️⃣ Simplification Proposals (Proposal Penyederhanaan Modul)

### A. Ekstraksi Konfigurasi Navigasi & Sosial (Config-Driven Pattern)
**Module:** `index.html` (Home Links Folder)
- **Problem:** Terdapat lebih dari 15 tag `<a>` dengan konfigurasi identik namun data berbeda (Icon, Text, URL) diletakkan *hardcoded* HTML.
- **Proposal:** 
  Buat file `data/links.json` atau konstanta `CONFIG.links` di JavaScript.
  Render HTML secara dinamis melaui Vanilla JS (menggunakan `document.createElement` / `template literals`).
- **Benefit:** Mempermudah update bagi non-developer, HTML jauh lebih kecil, mendukung penambahan struktur tanpa edit `index.html`.

### B. Simplify CSS Layout Variables
**Module:** `assets/css/tokens.css`
- **Problem:** Terdapat deklarasi multi-layer color (`--accent-blue`, `--accent-gold`) tetapi ada elemen di CSS (mis. class `.tag` / efak latar) yang masih memakai *inline rgba* atau *hardcoded gradient* (misal: `linear-gradient(90deg, var(--accent-gold), var(--accent-cyan))`).
- **Proposal:** Ekstraksi pola ini spesifik ke `mixins` atau *Semantic CSS Variables* agar semua shadow dan efek glow merujuk langsung ke *theme manager*, mempermudah penerapan *Full Dark Mode* tanpa ada artefak warna bocor.

---

## 5️⃣ Customization Strategy (Strategi Kustomisasi Tingkat Lanjut)

Untuk memastikan situs gampang dimodifikasi di kemudian hari (misal, ingin berganti tema atau struktur link), lakukan implementasi **Plugin-style Registry (Lightweight)**:

1. **Global `app.config.js`**
   - Buat satu file konfigurasi universal di root (di-load paling awal oleh browser).
   - Isi file mengontrol: Link sosmed, fitur on/off (contoh: aktif/matikan lokalisasi), dan flag *Open to Work/Hiring*.
   - Dengan ini, perubahan utama pada profil pengguna dapat diselesaikan dalam hitungan detik.

2. **Aplikasi Next.js (`portfolio-app`)**
   - Aplikasi portofolio saat ini sudah mengikuti arsitektur TS yang baik di `portfolio-app/content/` (menggunakan `types.ts` dan array constants). **Pertahankan** pola ini, karena sangat modular dan sesuai dengan target *SSG (Static Site Generation)*.

---

## 6️⃣ Step-by-Step Refactor Roadmap

### Phase 1: Safe Deletion & Code Trimming (Safe / Prioritas Utama)
- Terapkan temuan pada `SLIMMING_PLAN.md`.
- Hapus >1.500 baris kode mati (dead code) dari `style.css`, `script.js`, dan sisa-sisa folder portfolio lama (`js/portfolio.js`, dll.).
- Hapus folder gambar mockup eksperimental / *build artifacts* dari direktori `output/`.

### Phase 2: Structural Simplification (Medium Risk)
- Buat file `data/links.json` (atau konstanta spesifik global).
- Refactor `js/home.js` agar me-*render* blok `<section class="folder card">` berdasarkan JSON tersebut, menggantikan statis HTML `index.html`.
- Migrasi *hardcoded inline gradient styling* di CSS menjadi *CSS Variables* murni di `tokens.css`.

### Phase 3: Deployment Overhaul (Risky / Optional)
- Implementasikan GitHub Actions `.github/workflows/deploy.yml` untuk portofolio.
- Hapus direktori hasil compile `portfolio/` dari *source control* (`.gitignore`).
- Otomatisasi deploy aplikasi Next.js langsung ke cabang `gh-pages` agar repositori *master/main* murni hanya kode sumber, tidak ada artefak kompilasi minified yang berantakan.
