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
- `downloads`: link resume eksternal

Jika menambah locale baru, gunakan shape file resume yang sama persis.

## Ubah portfolio

- [`/content/portfolio/home.json`](../content/portfolio/home.json)
  Untuk intro board, capability clusters, dan dispatch/contact card.
- [`/content/portfolio/case-studies.json`](../content/portfolio/case-studies.json)
  Untuk seluruh case study, alias slug, impact metric, board presentation, image, dan narrative.

Menambah case baru cukup dengan menambahkan object baru yang valid ke array `case-studies`.

## Quality gate

Jalankan:

```bash
npm run validate:content
npm test
cd portfolio-app
npm test
npm run typecheck
```

Validator akan menolak:

- field wajib yang kosong
- slug atau alias yang bentrok
- placeholder `[TODO: ...]`
- shape content yang tidak sesuai kontrak
