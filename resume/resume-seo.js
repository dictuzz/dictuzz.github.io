import { toAbsoluteUrl } from '../js/site-content.js?v=v11';

function normalizeEntries(data) {
    return Array.isArray(data) ? data : [];
}

function getSectionSnapshot(pageUrl) {
    return Array.from(document.querySelectorAll('main > section[id]')).map((section, index) => ({
        '@type': 'WebPageElement',
        '@id': `${pageUrl}#${section.id}`,
        name: section.querySelector('.section__title')?.textContent?.trim() || section.id,
        description: section.querySelector('.section__lede')?.textContent?.trim() || undefined,
        position: index + 1
    }));
}

export function updateResumeSeo(siteConfig, content, lang) {
    const pageSeo = siteConfig.seo.pages.resume;
    const titles = {
        en: 'Resume | Benedictus Richard Ricardo | dictuzz',
        id: 'Resume | Benedictus Richard Ricardo | dictuzz',
        de: 'Lebenslauf | Benedictus Richard Ricardo | dictuzz'
    };
    const title = titles[lang] || titles.en;
    const description = content.seo?.description || pageSeo.description;
    const resumePath = lang === 'en' ? '/resume/' : `/resume/${lang}/`;
    const resumeUrl = toAbsoluteUrl(siteConfig.site.siteUrl, resumePath);
    const currentUrl = resumeUrl;
    const personId = `${siteConfig.site.siteUrl}/#person`;
    const sections = getSectionSnapshot(currentUrl);
    const languageUrls = {
        en: toAbsoluteUrl(siteConfig.site.siteUrl, '/resume/'),
        id: toAbsoluteUrl(siteConfig.site.siteUrl, '/resume/id/'),
        de: toAbsoluteUrl(siteConfig.site.siteUrl, '/resume/de/'),
        'x-default': toAbsoluteUrl(siteConfig.site.siteUrl, '/resume/')
    };



    // Update og:locale to standard valid BCP-47 / OpenGraph values
    const ogLocales = { en: 'en_US', id: 'id_ID', de: 'de_DE' };
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', ogLocales[lang] || 'en_US');

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', currentUrl);
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
        const language = link.getAttribute('hreflang');
        if (language && languageUrls[language]) link.setAttribute('href', languageUrls[language]);
    });
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', pageSeo.ogType);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', currentUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    const resumeImages = {
        en: '/og-image.png',
        id: '/og-image.png',
        de: '/og-image.png'
    };
    const resumeImage = toAbsoluteUrl(siteConfig.site.siteUrl, resumeImages[lang] || resumeImages.en);
    const imageAlt = {
        en: 'Illustrated profile card for Benedictus Richard Ricardo, with dictuzz branding and the tagline Automate, Create, Solve.',
        id: 'Kartu profil ilustrasi Benedictus Richard Ricardo dengan identitas dictuzz dan slogan Automate, Create, Solve.',
        de: 'Illustrierte Profilkarte von Benedictus Richard Ricardo mit dictuzz-Markenzeichen und dem Motto Automate, Create, Solve.'
    }[lang] || 'Professional resume card for Benedictus Richard Ricardo.';
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', resumeImage);
    document.querySelector('meta[property="og:image:type"]')?.setAttribute('content', 'image/png');
    document.querySelector('meta[property="og:image:width"]')?.setAttribute('content', '1200');
    document.querySelector('meta[property="og:image:height"]')?.setAttribute('content', '630');
    document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content', imageAlt);
    document.querySelector('meta[property="og:site_name"]')?.setAttribute('content', siteConfig.site.name);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:url"]')?.setAttribute('content', currentUrl);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', resumeImage);
    document.querySelector('meta[name="twitter:image:alt"]')?.setAttribute('content', imageAlt);
    document.querySelector('meta[name="twitter:creator"]')?.setAttribute('content', siteConfig.seo.twitterCreator || '');

    const graph = [
        {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': personId,
            name: siteConfig.profile.name,
            alternateName: [siteConfig.profile.handle, `${siteConfig.profile.name} ${siteConfig.profile.handle}`],
            jobTitle: content.strings.hero.role,
            url: resumeUrl,
            image: toAbsoluteUrl(siteConfig.site.siteUrl, siteConfig.profile.image.portrait),
            email: siteConfig.contact.email,
            address: {
                '@type': 'PostalAddress',
                addressLocality: siteConfig.profile.location.city,
                addressCountry: siteConfig.profile.location.countryCode
            },
            sameAs: siteConfig.socials.map((entry) => entry.url).concat(siteConfig.contact.whatsappUrl),
            knowsAbout: [
                ...normalizeEntries(content.collections.skills.strategic).map((entry) => entry.name),
                ...normalizeEntries(content.collections.skills.operational).map((entry) => entry.name),
                ...normalizeEntries(content.collections.skills.analytical).map((entry) => entry.name),
                ...normalizeEntries(content.collections.skills.leadership).map((entry) => entry.name),
                ...normalizeEntries(content.collections.languages).map((entry) => entry.label)
            ],
            alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: siteConfig.profile.alumniOf.name,
                url: siteConfig.profile.alumniOf.url
            },
            description
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': `${currentUrl}#profile`,
            url: currentUrl,
            name: title,
            inLanguage: lang,
            description,
            mainEntity: { '@id': personId },
            hasPart: sections
        }
    ];

    const script = document.getElementById('resume-structured-data');
    if (script) {
        script.textContent = JSON.stringify(graph, null, 2);
    }
}
