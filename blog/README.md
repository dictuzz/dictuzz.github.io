# tuzzblog - Deep Space Clean Theme

Template blog minimalis yang mengadopsi estetika **"Deep Space Luxury"** dalam bentuk yang lebih bersih dan fokus pada keterbacaan (Readability-First).

## 🎨 Visual Identity

Blog ini merupakan interpretasi "Clean" dari brand utama:

-   **Tipografi**: 
    -   Headings: **Space Grotesk** (Karakter kuat & modern)
    -   Body: **Inter** (Keterbacaan tinggi)
-   **Warna**:
    -   **Light Mode**: Clean Slate background (`#F1F5F9`) dengan aksen Teal/Cyan (`#008080`).
    -   **Dark Mode**: Deep Space background (`#0A0E17`) senada dengan portofolio utama.
-   **Branding**:
    -   **Logo Api**: Mempertahankan warna asli Orange (`#e25822`) sebagai signature.
    -   **Tombol**: Desain minimalis tanpa gradien berat.

## 📁 Struktur File

```
blog/
├── index.html        # Halaman daftar pos
├── manifesto.html    # Halaman Manifesto
├── contact.html      # Halaman Kontak
├── styles.css        # Stylesheet utama (Layout & Components)
├── variables.css     # ⭐ Theme Tokens (Edit warna/font di sini)
├── script.js         # JavaScript Interactivity
├── build.js          # Script build markdown → HTML
├── posts.json        # Database pos
├── posts/            # Folder file markdown
│   └── *.md          # Tulis blog di sini!
└── README.md         # Dokumentasi ini
```

## 🚀 Cara Publish Blog Baru

### 1. Buat File Markdown

Buat file `.md` baru di folder `posts/`:

```markdown
---
title: Judul Artikel Anda
date: 2025-01-01
category: Esai
---

Isi artikel Anda di sini menggunakan format Markdown.
```

### 2. Jalankan Build Script

```bash
cd blog
node build.js
```

Script akan otomatis:
- ✅ Membaca semua file `.md` di folder `posts/`
- ✅ Generate file `.html` untuk setiap artikel
- ✅ Update `posts.json` dengan metadata

## 🎨 Customization Guide

### Mengganti Tema Warna
Edit `variables.css` untuk mengubah palet warna. Tema saat ini menggunakan sistem **Deep Space Minimal**:

```css
/* Light Theme */
:root {
  --color-bg: #F1F5F9;
  --color-accent: #00F5D4; /* Cyber Cyan */
}

/* Dark Theme */
[data-theme="dark"] {
  --color-bg: #0A0E17; /* Deep Space */
}
```

### Mengganti Logo
Logo ikon api didefinisikan secara inline di HTML untuk presisi warna brand:
`<i class="fa-solid fa-fire site-logo-icon" style="color: #e25822;"></i>`

## 📝 Format Markdown yang Didukung

| Syntax | Hasil |
|--------|-------|
| `# Heading 1` | H1 (Space Grotesk) |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `[link](url)` | Link (Cyan/Teal) |
| `> quote` | Blockquote dengan border |

## 🌙 Dark Mode
Mendukung toggle manual dan deteksi preferensi sistem otomatis.

---
Dibuat dengan ❤️ oleh [@dictuzz](https://dictuzz.github.io)
