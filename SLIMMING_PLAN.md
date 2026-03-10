# SLIMMING & SIMPLIFICATION PLAN

## 1. Executive Summary

Berdasarkan hasil audit menyeluruh pada repository `dictuzz.github.io`, ditemukan beberapa area redundansi, file mati (dead code), dan inkonsistensi desain sistem secara global yang berpotensi menghambat pemeliharaan (*maintainability*) ke depan. Rencana perampingan ini akan mengurangi ukuran file statis, menyingkirkan inkonsistensi yang tidak perlu, dan menyederhanakan arsitektur proyek.

## 2. Entrypoints & Critical Paths

- **Root Web Entrypoint:** `index.html` → Memanggil `css/site.css` & `js/home.js`.
- **Resume Entrypoint:** `resume/index.html` → Memanggil `css/critical.css`, `resume/resume.css`, dan `resume/resume.js`.
- **Portfolio App (Next.js):** Konfigurasi via `portfolio-app/package.json` yang saat di-build mengekspor hasil statis ke folder `portfolio/` (melalui script `scripts/publish.mjs`).

## 3. Delete Candidates

Rekomendasi file/folder yang siap dan aman untuk dihapus demi perampingan:

### High Confidence (Tingkat Keamanan Tinggi)
1. **`css/animations.css`**
   - **Tipe:** File Unused.
   - **Bukti Alasan:** Tidak dihubungkan pada link tag di satupun entri utama (`index.html` maupun `resume/index.html`), dan tidak pula dipanggil menggunakan `@import` dalam CSS layer manapun.
   - **Langkah Verifikasi:** `grep -r "animations.css" .` kembali kosong atau hanya di Markdown teks.

2. **Dokumen Markdown Perencanaan Lama** (`FIXES_AND_ANALYSIS.md`)
   - **Tipe:** Stale documentation.
   - **Bukti Alasan:** Peninggalan sesi pengembangan sebelumnya. Informasi kunci mengenai bug telah diterapkan. Dapat dihapus setelah referensi terangkum penuh di dokumen standar ini.

### Medium Confidence
1. **`portfolio/` (Direktori Build Hasil Akhir di Repo)**
   - **Tipe:** Build artifacts committed to repo.
   - **Bukti Alasan:** Direktori ini selalu dibuat ulang secara *force* oleh fungsi build `publish.mjs` di dalam workspace Next.js. Hal ini menandakan folder ini adalah hasil luaran (dist file); *best practice*-nya folder ini dimasukkan ke `.gitignore` lalu biarkan GitHub Actions mempublikasikan build akhirnya ke GitHub Pages.
   - **Risiko:** Apabila didelete tanpa mengatur siklus CI/CD (GitHub Actions), laman fitur `/portfolio` akan 404 pada production.
   - **Mitigasi:** Atur aksi otomatis deploy GitHub (GitHub Pages action), dan hapus komitan build statis lokal.

## 4. Merge Candidates

1. **Tokens CSS (`assets/css/tokens.css` dan `portfolio-app/styles/tokens.css`)**
   - **Status:** Terdapat duplikasi *design token*.
   - **Rencana Penggabungan (Merge):** Modul dari `portfolio-app/styles/tokens.css` digabungkan menggunakan Single Source of Truth ke direktori level root `assets/css/tokens.css`, lalu diimpor oleh Next.js untuk mencegah inkonsistensi pemodifikasian styling.
   - **Risiko:** Medium. Dapat memutus styling build portfolio. Perlu mengatur sinkronisasinya di `next.config.ts`.

2. **Penggabungan `css/site.css` dan `resume/resume.css`**
   - **Review Singkat:** Terdapat terlalu banyak duplikasi modul `.glass`, `.card`, dan `.btn`. File-file tersebut layak dikecilkan menjadi satu `shared-utilities.css`.
   - Konsep lengkap terbahas dalam Rencana Refaktor Penyederhanaan (`REFACTOR_SIMPLIFICATION_PLAN.md`).

## 5. Dependency Cleanup

- File dan direktori Next.js dalam `portfolio-app` terpelihara dengan baik; namun `node_modules` wajib tidak di-*commit* (saat ini aman melalui `.gitignore`).
- Semua asset gambar di direktori induk dipakai dan saling memanggil di struktur DOM. Resolusi dan gambar cukup rapi.

## 6. Suggested Folder Restructure (Before / After)

### Before:
```text
/
├── assets/
│   ├── css/tokens.css
├── css/
│   ├── animations.css (unused)
│   ├── critical.css
│   ├── site.css
├── portfolio/ (build output)
├── portfolio-app/
│   ├── styles/tokens.css (duplikat)
│   └── scripts/publish.mjs
├── resume/
│   ├── resume.css
│   └── resume.js
└── index.html
```

### Proposed After:
```text
/
├── assets/
│   ├── styles/
│   │   ├── core.css (gabungan critical, shared utils)
│   │   ├── tokens.css (SSOT)
├── js/
│   ├── core.js (modul global)
├── portfolio-app/
│   └── (merujuk ke tokens.css root)
├── resume/
│   └── (Hanya berisi html unik)
└── index.html
```

## 7. Verification Checklist

- [ ] Lakukan penghapusan file `animations.css` secara manual.
- [ ] Verifikasi halaman beranda beroperasi secara mulus (Visual Test).
- [ ] Pastikan script build portfolio dapat mengambil token desain CSS yang absolut tanpa kesalahan (Build verifikasi).
- [ ] Tahan modifikasi terhadap `portfolio/` statis hingga workflow CI/CD GitHub terpasang pada repository.

## 8. Risks & Rollback Plan

- **Risiko Utama:** Build Next.js (`portfolio-app`) pecah jika root referensi CSS dipindahkan.
- **Rollback Plan:**
   1. Buat branch git temporer. Segala percobaan delete/merge dijalankan pada branch itu.
   2. Apabila UI situs hancur saat dites lokal, batalkan branch dan kembali ke root repositori aslinya tanpa kerusakan.
