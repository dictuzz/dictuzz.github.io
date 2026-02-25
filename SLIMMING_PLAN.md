# EXECUTIVE SUMMARY
Repositori `dictuzz.github.io` ini terdiri dari dua modul besar yang saat ini terpisah namun melayani tujuan yang saling tumpang tindih: `portfolio/` (untuk landing page sinematik & link tree) dan `resume/` (aplikasi CV statis). Saat ini terdapat fragmentasi yang cukup besar pada aset rupa (CSS), skrip (JS), dan manajemen aset statis (gambar). Rencana ini bertujuan memusatkan aset, menghapus duplikasi yang tidak perlu, dan menyederhanakan arsitektur pengiriman file dengan tetap mempertahankan performa "Liquid Motion".

## 1. Entrypoints & Critical Paths
Berikut adalah entrypoints (titik masuk) utama pada runtime (production):
1. **`portfolio/links.html`**: Entrypoint utama (Tujuan redirect dari root `index.html`) - Berperan sebagai Link in Bio.
2. **`portfolio/index.html`**: Halaman portfolio utama (Cinematic Core).
3. **`resume/index.html`**: Halaman resume informatif.

*Catatan: Repositori dijalankan secara statis tanpa build step (hanya perlu `npx serve`).*

## 2. Kandidat Penghapusan (Delete Candidates)

### High Confidence (Sangat Aman Dihapus / Dipindah)
- **`portfolio/assets/images/` & `resume/assets/images/` (Duplikasi Aset)**
  - **Fakta**: Terdapat duplikasi foto (contoh: `dictuzz.webp` dan `Aku.webp` atau gambar lain) yang terpisah di dua folder.
  - **Alasan**: Pemisahan folder aset membuat beban repositori membengkak dan sulit dikelola.
  - **Tindakan**: Hapus kedua folder internal tersebut dan pindahkan semua isinya ke satu folder root terpusat `/assets/images/`.
  - **Risiko**: Rendah.
  - **Verifikasi**: Lakukan tes muat gambar di browser setelah path HTML diperbarui.

### Medium Confidence (Perlu Review)
- **Root `index.html`**
  - **Fakta**: File ini (345 bytes) hanya berisi `<meta http-equiv="refresh" content="0; url=portfolio/links.html">`.
  - **Alasan**: Jika menggunakan GitHub Pages dengan custom domain, file ini menahan 1 ekstra HTTP request.
  - **Tindakan**: Hapus dan buat aturan static routing langsung ke portfolio jika memungkinkan, ATAU pertahankan jika GitHub Pages memerlukan entrypoint root mutlak.
  - **Risiko**: Menengah (Bisa merusak indexing SEO sementara waktu).
  - **Verifikasi**: Cek Google Search Console setelah implementasi.

### Low Confidence (Pertimbangkan Kembali Sesuai Kebutuhan)
- **`portfolio/js/redirect.js`**
  - **Fakta**: Hanya berisi logika canonical root `dictuzz.me`.
  - **Alasan**: Jika aturan ini bisa diatur via konfigurasi DNS / GitHub Pages CNAME enforce HTTPs, JS tidak diperlukan lagi.
  - **Risiko**: Menengah. Mengandalkan JS redirect sering kali telat dibanding redirect server.

## 3. Kandidat Penggabungan (Merge Candidates)

### Penggabungan Fragmentasi CSS (Portfolio)
- **Target Merge**: `animations.css`, `base.css`, `bio.css`, `curtain.css`, `footer.css`, `glass-menu.css`, `proof.css`, `signal.css`, `style.css`, `text-page.css`, `thread.css`, `tokens.css`.
- **Target Path Baru**: `portfolio/css/portfolio.bundle.css`
- **Alasan**: Pemuatan 12 file CSS terpisah sangat rawan terhadap latency HTTP request (walaupun menggunakan HTTP/2). Mengingat tidak ada build step, semua file bisa disambung (concatenate) menjadi satu atau dua file (`core.css` dan `pages.css`).
- **Risiko & Verifikasi**: Rendah. Pastikan urutan (cascade) terjaga (mulai dari `base.css`, `tokens.css`, lalu ke komponen).

### Penggabungan Fragmentasi JS (Portfolio)
- **Target Merge**: `curtain.js`, `proof.js`, `thread.js`, `signal.js`, `core.js`.
- **Target Path Baru**: `portfolio/js/main.js` atau dibiarkan menggunakan sistem import modul ES6 `<script type="module">`.
- **Alasan**: Banyak skrip kecil (< 10kb) yang dipanggil via `<script defer>`. Daripada menggunakan struktur manual IIFE berulang, gabungkan mereka untuk mengurangi waterfall requests.

## 4. Pembersihan Dependensi (Dependency Cleanup)
- Vendor scripts (`gsap.min.js`, `lenis.min.js`, `three.min.js`) sudah tersusun baik dengan fallback CDN -> Lokal.
- **Rekomendasi**: Tidak ada dependensi usang (unused) di root tingkat atas yang perlu dibersihkan karena proyek ini framework-free.

## 5. Usulan Restrukturisasi Folder (Tree Sebelum -> Sesudah)

**Sebelum Rekomendasi:**
```
/
├── index.html
├── portfolio/
│   ├── css/ (12 files)
│   ├── js/ (10 files)
│   ├── data/ (portfolio.json, links.json)
│   └── assets/
└── resume/
    ├── css/
    ├── js/ (config.js, etc)
    └── assets/
```

**Sesudah Rekomendasi:**
```
/
├── index.html
├── assets/ (Global pool: images, fonts, shared media)
├── config/
│   └── data.json (Single Source of Truth config untuk Resume + Portfolio)
├── portfolio/
│   ├── css/bundle.css
│   └── js/main.js
└── resume/
    ├── css/style.css
    └── js/script.js
```

## 6. Checklist Verifikasi & Rollback
- **Langkah Verifikasi**:
  1. Jalankan `npx http-server -p 3000`.
  2. Buka DevTools -> Network Tab -> Pastikan 0 request yang menghasilkan status 404.
  3. Tes "Liquid scroll" Lenis di portfolio (pastikan GSAP berjalan).
- **Rencana Rollback**:
  - Buat branch `chore/slimming-2026` sebelum manipulasi file.
  - Jangan push ke main sebelum manual testing komplit.
