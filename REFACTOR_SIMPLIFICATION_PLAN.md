# REFACTOR & SIMPLIFICATION PLAN

Berdasarkan audit codebase, proyek ini menggunakan arsitektur statis tanpa framework yang menghasilkan kecepatan tinggi, namun mengorbankan _maintainability_ akibat kompleksitas manual. Rencana ini akan fokus pada penyederhanaan state management dan modernisasi impor JavaScript.

## 1. Hotspot Kompleksitas (Top 3)

1. **`portfolio/js/content-loader.js` (DOM Hydration)**
   - **Masalah**: Membaca JSON via `fetch` lalu menyuntikkannya ke DOM dengan struktur HTML di-_hardcode_ di dalam string JavaScript (`template literals`). Jika terjadi perubahan class HTML, developer harus mencarinya di dalam file JS, bukan di file HTML.
   - **Skor Kompleksitas**: Sangat Tinggi (Brittle).
2. **`portfolio/js/core.js` (Manajemen GSAP & Lenis)**
   - **Masalah**: Mencampur inisialisasi routing (Scroll Spy), deteksi navigasi mundur, inisiasi Lenis, dan animasi `footer`.
   - **Skor Kompleksitas**: Tinggi (Kurang terisolasi / Separation of Concerns lemah).
3. **Duplikasi Data (JSON vs JS Config)**
   - **Masalah**: `resume/` dikontrol oleh `resume/js/config.js` dan sinkronisasi label bahasa lokal, sementara `portfolio/` mengambil data dari `portfolio/data/portfolio.json`. Data seperti daftar media sosial diperbarui di dua tempat terpisah.
   - **Skor Kompleksitas**: Tinggi (rawan tertinggal saat di-_update_).

## 2. Peta Duplikasi (Duplication Map)

- **Elemen Navigasi & Footer**: File `portfolio/links.html` dan `portfolio/index.html` menyuntik `<nav>` menggunakan `content-loader.js`. Sementara `resume/index.html` masih menggunakan tag HTML statis yang berbeda rupa dan struktur (duplikasi identitas *brand*).
- **Theme Variables (CSS)**: Warna dideklarasikan secara mandiri di `portfolio/css/tokens.css` dan `resume/style.css`.
- **Informasi Pribadi**: Teks deskripsi (Bio), URL sosmed, email tersebar berulang dihampir semua entrypoint.

## 3. Proposal Penyederhanaan (Simplification by Module)

### A. Modul Data (Unifikasi Konfigurasi)
- Hapus `portfolio/data/portfolio.json` dan `resume/js/config.js`.
- **Solusi**: Buat satu file eksternal `data/global-config.json` di level root repositori.
- Modifikasi `content-loader.js` (Portfolio) dan `script.js` (Resume) agar melakukan `fetch('../data/global-config.json')`. Ini memastikan "Customization" 100% config-driven. 

### B. Penyederhanaan Logika (Refactor Control Flow `content-loader.js`)
- Menghentikan kebiasaan menyusun tag HTML panjang di dalam JS.
- **Opsi Modern (Tanpa Build Tools)**: Gunakan komponen Web API murni (`Custom Elements`). 
  Misalnya membuat `<site-footer></site-footer>` dan logika rendernya tertutup rapi di dalam class `class SiteFooter extends HTMLElement {...}`.
- Jika Custom Elements terasa rumit, pindahkan _template_ tersebut ke dalam tag `<template id="footer-template">` di `index.html`, lalu biarkan JS mengkloningnya. Ini melepaskan JS dari tugas _styling_ HTML.

### C. Refactor Struktur JavaScript ke ES Modules
- Proyek berjalan pada IIFE pattern: `(function () { ... })();`.
- Alihkan ke native ES Modules dengan mengubah pemanggilan di HTML:
  ```html
  <script type="module" src="js/main.js"></script>
  ```
- Ini akan memungkinkan pola impor deklaratif: `import { initLenis } from './utils/scroll.js'` sehingga `core.js` bebas dari kerumitan.

## 4. Strategi Kustomisasi (Extensibility & Config-driven)

Kode yang ada saat ini perlu diubah untuk mengakomodir konfigurasi kustom bila template ini digunakan oleh pihak lain atau dirombak:
- **Feature Flags**: Tambahkan opsi _toggle_ di JSON (contoh: `"showResumeButton": true`, `"enable3DLoom": true`). Skrip `content-loader.js` cukup mengecek boolean ini dan menghindari me-_render_ `<canvas>` jika Three.js dirasa berat.
- **Config-Driven Constants**: Hapus angka sakti ("Magic constants") seperti kecepatan Lenis (`duration: 1.2`) di `core.js` dan pindahkan ke `global-config.json` bagian `"animations"`.

## 5. Pola Penulisan Kode yang Diusulkan (Do's & Don'ts)

✅ **DO:** 
```javascript
// Menggunakan Web Components untuk menghindari String HTML di dalam JS
class GlobalNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<nav>...</nav>`; // Atau klon dari <template>
  }
}
customElements.define('global-nav', GlobalNav);
```

❌ **DON'T (Yang Saat Ini Digunakan):**
```javascript
// Mencampur data hydration dan panjangnya markup di dalam function procedural
document.getElementById('nav').outerHTML = `<nav>
  <ul><li><a href="${link}">${name}</a></li></ul>
</nav>`;
```

## 6. Roadmap Refactor Transformasi (Tahap ke Tahap)

- **Tahap 1: Safe Refactors (Low Risk)**
  - Pindahkan semua aset statis (gambar, font, resume PDF) ke root `/assets`.
  - Hapus file JS duplikat jika tidak terpanggil.
  - Gabungkan CSS di folder Portfolio menjadi 1-2 file CSS besar agar request lebih efisien.
- **Tahap 2: Medium Risk (ES Modules)**
  - Konversi semua file `js/` dari pola IIFE menjadi `export / import` (ES6 modules).
  - Integrasikan logika `redirect.js` ke dalam bootloader utama.
- **Tahap 3: Risky / Optional (Unified Config & Hydration)**
  - Leburkan `/resume/js/config.js` dan `/portfolio/data/*.json` menjadi satu Single Source of Truth `super-config.json`.
  - Refactor `content-loader.js` untuk menggunakan Web Components (`<global-nav>`, `<global-footer>`) menggantikan injeksi DOM `.outerHTML`.
