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
- `downloads`: (Obsolete/Usang) Tidak lagi digunakan karena sekarang menggunakan generator ATS PDF dinamis berbasis data JSON.

Jika menambah locale baru, gunakan shape file resume yang sama persis.

## Ubah portfolio

- [`/content/portfolio/locales/en.json`](../content/portfolio/locales/en.json)
- [`/content/portfolio/locales/id.json`](../content/portfolio/locales/id.json)
- [`/content/portfolio/locales/de.json`](../content/portfolio/locales/de.json)
  Untuk copy runtime portfolio, landing edition, dan case-file content per bahasa.
- [`/content/portfolio/home.json`](../content/portfolio/home.json)
  Legacy dataset untuk intro board, capability clusters, dan dispatch/contact card.
- [`/content/portfolio/case-studies.json`](../content/portfolio/case-studies.json)
  Legacy structured dataset untuk seluruh case study, alias slug, impact metric, board presentation, image, dan narrative.

Menambah case baru perlu tiga langkah: tambahkan HTML shell di `/portfolio/cases/<slug>/index.html`, tambahkan content per bahasa di `/content/portfolio/locales/*.json`, lalu sinkronkan legacy dataset jika masih ingin mempertahankan validasi case-study lama.

## Ubah resources

- [`/resources/index.html`](../resources/index.html)
- [`/resources/*.html`](../resources)

Halaman resources adalah file HTML statis. Link antar topik harus memakai bentuk `/resources/<topic>.html#anchor`, bukan `/resources/<topic>/#anchor`, karena tidak ada folder `index.html` per topik.

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
