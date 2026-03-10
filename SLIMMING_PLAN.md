# 📉 SLIMMING PLAN (Rencana Perampingan Repositori)

Dokumen ini berisi hasil audit menyeluruh terhadap repositori `dictuzz.github.io` untuk mengidentifikasi file dan modul yang sudah tidak digunakan (dead code), artefak sisa, dan peluang perampingan struktur.

## 1️⃣ Executive Summary
Repositori saat ini memiliki transisi dari arsitektur *Vanilla HTML/JS/CSS* ke *Next.js (untuk portfolio)*. Dalam proses transisi ini, banyak aset lama (CSS, JS, JSON) yang tertinggal di root folder namun sudah tidak digunakan oleh sistem *runtime* manapun. Selain itu, terdapat folder gambar hasil desain (`/output`) yang memakan ruang hingga ~12MB dan tidak diperlukan untuk *deployment*.

## 2️⃣ Entrypoints & Critical Paths
File-file berikut adalah **Critical Runtime** dan **TIDAK BOLEH** dihapus:
- **Root Entrypoint:** `index.html`, `js/home.js`, `css/home.css`, `css/site.css` (termasuk `css/animations.css` dan `assets/css/tokens.css`).
- **Pages:** `404.html`.
- **Resume System:** `resume/index.html`, `resume/resume.css`, `resume/resume.js`.
- **Shared Logic:** `js/ui-kit.js`, `js/analytics.js` (dipanggil oleh *home* dan *resume*).
- **Portfolio App:** `portfolio-app/` (source code Next.js) dan `portfolio/` (hasil *static export* Next.js yang dibutuhkan GitHub Pages).
- **Konfigurasi System:** `CNAME`, `robots.txt`, `sitemap.xml`, `.gitignore`, `package.json`, dan file konfigurasi *tooling* (Prettier/ESLint).

---

## 3️⃣ Delete Candidates (Kandidat Hapus)

Berikut adalah file-file yang *100% aman* untuk dihapus berdasarkan analisa dependency tree dan *reachability map*.

### 🔴 High Confidence (Aman Dihapus)

#### A. Sisa Arsitektur Vanilla Portfolio (Legacy)
File ini adalah sisa dari sistem portofolio lama sebelum berpindah menggunakan aplikasi Next.js (`portfolio-app`). HTML tidak lagi memanggil file-file ini.
- `css/portfolio.css`
- `css/portfolio-detail.css`
- `js/portfolio.js`
- `js/portfolio-index.js`
- `js/portfolio-detail.js`
- `data/portfolio.json` *(Data sudah dipindah ke `portfolio-app/content/`)*
**Risk:** Low. **Verification:** Jalankan grep pada seluruh folder root, tidak ada file HTML yang meload resource ini.

#### B. Skrip dan Gaya Root yang Terbengkalai
- `script.js` (di root)
- `style.css` (di root)
**Risk:** Low. **Verification:** `index.html` menggunakan `js/home.js` dan `css/home.css` & `css/site.css`. File root `script.js` dan `style.css` sama sekali tidak terhubung ke *entrypoint* manapun dan merupakan *dead code* dengan lebih dari 1.500 baris total.

#### C. Artefak Desain / Screenshot
- `output/` (seluruh folder beserta isinya)
**Risk:** Low. **Verification:** Berisi 16 file PNG screenshot resolusi tinggi dari antarmuka web (seperti `portfolio-home-cleaner-final.png`). File ini tidak dipanggil oleh frontend dan hanya menghabiskan kuota repositori sebesar ~12MB. 

---

## 4️⃣ Merge Candidates (Kandidat Gabung) / Restrukturisasi

1. **Penggabungan `css/home.css` dan `css/site.css`**
   - **Rationale:** Walaupun fungsinya sedikit berbeda (struktur vs halaman utama), ukuran mereka relatif kecil (dibawah 11KB). Menggabungkannya dapat mengurangi satu HTTP request di halaman utama.
   - **Target:** Gabungkan isi `home.css` ke dalam `site.css` dan hapus pemanggilan `<link>` `home.css` di `index.html`.
   - **Risk:** Low. **Verification:** Pastikan tidak ada konflik *CSS specificity* setelah penggabungan.

---

## 5️⃣ Dependency Cleanup & Artefak Build

### Rekomendasi Migrasi Deployment Portfolio (GitHub Actions)
Saat ini folder `portfolio/` (yang berisi file .html, .txt struktur Next.js, dan folder `_next`) di-*commit* secara literal ke repositori. 
- **Saran:** Atur **GitHub Actions** untuk melakukan `npm run build:portfolio` yang otomatis menghasilkan folder root portofolio dan merilisnya ke *gh-pages* branch.
- **Benefit:** Menghilangkan keharusan tracking ratusan file statis (seperti `__next._index.txt`) ke dalam repositori utama, membuat PR/commit jauh lebih rapi.

---

## 6️⃣ Verification Checklist (Opsi Eksekusi)
Jika rekomendasi ini dijalankan, lakukan *smoke testing* berikut:
1. `npm run dev` -- Buka `http://localhost:8000/`.
2. Verifikasi homepage berjalan sempurna tanpa `script.js` dan `style.css`.
3. Verifikasi `/resume/` berjalan sempurna.
4. Verifikasi `/portfolio/` berjalan sempurna tanpa error *missing file* JSON di console.

## 7️⃣ Risks & Rollback Plan
- **Risiko:** Hampir tidak ada, karena file yang dihapus tidak pernah dimuat di DOM maupun proses build.
- **Rollback:** Cukup gunakan git: `git revert HEAD` jika terjadi kesalahan tak terduga setelah penghapusan.
