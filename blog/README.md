# tuzzblog - Blog Template

Template blog minimalis dengan fokus pada tipografi dan keterbacaan.

## 📁 Struktur File

```
blog/
├── index.html        # Halaman daftar pos

├── manifesto.html    # Halaman Manifesto
├── contact.html      # Halaman Kontak
├── styles.css        # Stylesheet utama
├── variables.css     # CSS Custom Properties
├── script.js         # JavaScript
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
date: 2024-12-30
category: Esai
---

Isi artikel Anda di sini menggunakan format Markdown.

## Heading 2

Paragraf biasa dengan **bold** dan *italic*.

- Item list 1
- Item list 2

> Ini adalah blockquote

[Link teks](https://example.com)
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

### 3. Update index.html (Manual)

Untuk saat ini, Anda perlu update daftar pos di `index.html` secara manual atau gunakan data dari `posts.json`.

## 🎨 Customization

### Ganti Logo

Logo sudah menggunakan `../assets/images/favicon.svg`. Untuk mengganti:

1. Ganti file SVG di folder `assets/images/`
2. Atau edit path di setiap file HTML

### Ganti Warna

Edit `variables.css`:

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-heading: #0d0d0d;
  --color-link: #2563eb;
  /* ... */
}
```

### Ganti Font

Edit `variables.css`:

```css
:root {
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

## 📝 Format Markdown yang Didukung

| Syntax | Hasil |
|--------|-------|
| `# Heading 1` | H1 |
| `## Heading 2` | H2 |
| `### Heading 3` | H3 |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `[link](url)` | Link |
| `` `code` `` | Inline code |
| `> quote` | Blockquote |
| `- item` | List |
| `---` | Horizontal rule |

## 🌙 Dark Mode

Dark mode otomatis berdasarkan preferensi sistem. Toggle manual tersedia di header.

## ♿ Aksesibilitas

Template ini mendukung:
- Skip-to-content link
- Landmark ARIA
- Focus states yang jelas
- Kontras warna WCAG AA
- Navigasi keyboard

## 📄 Lisensi

Free to use for personal and commercial projects.

---

Dibuat dengan ❤️ oleh [@dictuzz](https://dictuzz.github.io/resume)
