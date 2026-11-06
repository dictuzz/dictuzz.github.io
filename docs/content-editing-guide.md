# Content Editing Guide

Semua source edit utama sekarang berada di folder [`/content`](../content).

## Ubah data global sekali saja

- [`/content/site.json`](../content/site.json)
  Untuk nama, title, email, WhatsApp, calendar link, socials, footer nav, dan SEO global.

## Ubah homepage

- [`/content/home.json`](../content/home.json)
  Untuk folder links, urutan item, summary per folder, dan status label homepage.

## Ubah resume

- [`/content/resume/en.json`](../content/resume/en.json)
- [`/content/resume/id.json`](../content/resume/id.json)
- [`/content/resume/de.json`](../content/resume/de.json)

Struktur resume dipisah menjadi:

- `strings`: label UI, copy navigasi, CTA
- `sections`: pengalaman, pendidikan, impact, awards, dll
- `collections`: skills dan languages
- `seo`: deskripsi halaman resume

Jika menambah locale baru, gunakan shape file resume yang sama persis.

## Ubah portfolio

- [`/content/portfolio/locales/en.json`](../content/portfolio/locales/en.json)
- [`/content/portfolio/locales/id.json`](../content/portfolio/locales/id.json)
- [`/content/portfolio/locales/de.json`](../content/portfolio/locales/de.json)
  Untuk copy runtime portfolio, landing edition, dan case-file content per bahasa.
Menambah case study baru:
1. Tambahkan HTML shell di `/portfolio/cases/<slug>/index.html`
2. Tambahkan content per bahasa di `/content/portfolio/locales/{en,id,de}.json`
3. Jalankan `npm run build:portfolio` untuk menghasilkan prerender statis dan Schema.org Article metadata
4. Jalankan `npm run validate:content` dan `npm test` untuk memverifikasi validitas schema dan routing

## Ubah resources

- [`/resources/index.html`](../resources/index.html)
- [`/resources/*.html`](../resources)

Halaman resources adalah file HTML statis. Link antar topik harus memakai bentuk `/resources/<topic>.html#anchor`, bukan `/resources/<topic>/#anchor`, karena tidak ada folder `index.html` per topik.
Setelah mengubah atau memperbarui halaman topik, jalankan `npm run build:search-index` agar pencarian mengikuti konten terbaru.

## Sebelum commit

Jika mengubah sumber resume atau portfolio, jalankan generator yang sesuai lalu periksa hasilnya:

```bash
npm run build:resume
npm run build:portfolio
node scripts/prerender_resume.mjs --check
python scripts/prerender_portfolio.py --check
npm run validate:content
npm test
```

## Quality gate

Jalankan:

```bash
npm run validate:content
npm test
```

Validator akan menolak:

- field wajib yang kosong
- slug atau alias yang bentrok
- placeholder `[TODO: ...]`
- shape content yang tidak sesuai kontrak
