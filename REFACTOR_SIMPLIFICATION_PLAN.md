# REFACTOR & SIMPLIFICATION PLAN

## 1. Executive Summary

Dokumen ini merangkum area kompleksitas tertinggi dan duplikasi kode di dalam repositori. Fokus utamanya adalah menyatukan styling, memastikan modul-modul dapat dikelola dari satu sumber kebenaran (Single Source of Truth), dan memisahkan data keras (hardcoded data) menjadi arsitektur berbasis konfigurasi.

## 2. Complexity Hotspots (Titik Berat Kompleksitas)

1. **Sinkronisasi Desain (Styling) Frontend**
   - Terdapat variabel CSS global (`:root`) yang di-hardcode ganda di file `css/site.css` dan `css/critical.css`. Perubahan satu warna tema (misal `--site-bg`) membutuhkan pengubahan di dua hingga tiga file berbeda.
   
2. **Duplikasi Komponen UI Dasar**
   - Kelas utilitas seperti `.card`, `.glass`, dan `.btn` ditulis ulang secara terpisah di `css/site.css` dan `resume/resume.css`.

3. **Data Konten Hardcoded di HTML**
   - File `resume/index.html` berisi lebih dari 500 baris kode yang memuat komponen secara statis (seperti bagian 'Experience', 'Education', dan 'Skills'). Meskipun halaman beranda (`index.html`) sudah menggunakan pola yang baik melalui `data/links.json`, halaman resume belum menerapkannya.

4. **Sistem Terjemahan (i18n)**
   - Saat ini terjemahan menggunakan fetch dari `/locales/*.json`. Walaupun sudah dimodularisasi dengan elegan di `js/ui-kit.js`, strukturnya dapat lebih dipermudah penyebutannya jika ditransfer ke kerangka framework ketika Next.js (`portfolio-app`) diintegrasikan penuh.

5. **Manajemen Animasi**
   - Animasi kompleks yang membaur dengan struktur utama menyebabkan file HTML membengkak dengan definisi SVG sebaris (inline SVG) dan fungsional animasi yang redundan.

## 3. Duplication Map

- **Tokens:**
  - `assets/css/tokens.css` (Global root) vs `portfolio-app/styles/tokens.css` (Next.js app). Ini membingungkan karena terdapat dua referensi token desain.
- **CSS Utility Classes:**
  - `css/site.css` vs `css/critical.css` vs `resume/resume.css`. Ketiganya memiliki deklarasi ulang untuk komponen `.btn`, `.reveal`, dan utilitas `.glass`.

## 4. Simplification Proposals (by module)

### A. Modul CSS / Styling
- **Langkah:** Ekstrak seluruh variabel root, definisi grid, dan utilitas dasar (.glass, .btn, .card) menjadi satu file `core-ui.css`.
- **Rasional:** Satu perubahan warna / padding akan langsung teraplikasi secara persisten pada halaman `/`, `/resume`, dan desain sistem.

### B. Modul Konten Resume (HTML -> JSON)
- **Langkah:** Ekstraksi "Education", "Experience", "Skills" dan "Awards" dari `resume/index.html` ke dalam `data/resume.json`.
- **Rasional:** Ketika pengguna ingin menambah pengalaman baru, mereka tidak perlu mencari elemen spesifik di barisan DOM berukuran 500+ baris; cukup mengubah JSON ringkas.

## 5. Customization Strategy (Config-driven)

Demi memastikan kapabilitas *"plug-and-play"*, arsitektur berbasis konfigurasi (config-driven) akan direplikasi di seluruh aplikasi Vanilla JS.
- **`data/links.json`** -> Telah diterapkan di beranda (berhasil dengan baik).
- **`data/resume.json`** -> (Usulan baru) untuk menyimpan rekam jejak.
- **`data/portfolio.json`** -> Untuk portofolio jika di-ekstrak keluar dari kerangka SSG Next.js di masa mendatang.

## 6. Proposed Code Patterns

*Do:*
```css
/* Menggunakan referensi satu token variabel global */
.card {
    background: var(--surface-primary);
    border-radius: var(--radius-lg);
}
```

*Don't:*
```css
/* Mengulang pewarnaan statis dan radius */
.edu-card {
    background: linear-gradient(180deg, rgba(255,255,255,0.72), ...);
    border-radius: 28px;
}
```

## 7. Step-by-step Refactor Roadmap

### Phase 1: Safe & High ROI Refactors (Minggu 1)
- Konsolidasi file CSS Tokens (`assets/css/tokens.css` vs `portfolio-app/styles/tokens.css`).
- Pembersihan file zombie yang dicantumkan pada *Slimming Plan*.

### Phase 2: Medium Effort, High Impact (Minggu 2)
- Ekstraksi `site.css` dan `resume.css` ke dalam lapisan `base.css` + `components.css` (terutama untuk utilitas *glassmorphism* dan kancing aksi). 
- Modifikasi HTML untuk mengambil komponen utama dari stylesheet gabungan.

### Phase 3: Risky / Optional (Minggu 3-4)
- Ekstrasi hardcoded DOM resume ke dalam `data/resume.json`.
- Penggantian `resume.js` untuk membuat modul rendering asinkron dari DOM berbasis fragmen.
