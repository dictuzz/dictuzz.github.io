function toAbsoluteUrl(siteUrl, path) {
    return new URL(path, siteUrl).toString();
}

function normalizeEntries(data) {
    return Array.isArray(data) ? data : [];
}

function getSectionSnapshot(siteUrl) {
    return Array.from(document.querySelectorAll('main > section[id]')).map((section, index) => ({
        '@type': 'WebPageElement',
        '@id': `${toAbsoluteUrl(siteUrl, '/resume/')}#${section.id}`,
        name: section.querySelector('.section__title')?.textContent?.trim() || section.id,
        description: section.querySelector('.section__lede')?.textContent?.trim() || undefined,
        position: index + 1
    }));
}

export function updateResumeSeo(siteConfig, content, lang) {
    const pageSeo = siteConfig.seo.pages.resume;
    const title = `${siteConfig.profile.name} — ${siteConfig.profile.title}`;
    const description = content.seo?.description || pageSeo.description;
    const resumeUrl = toAbsoluteUrl(siteConfig.site.siteUrl, '/resume/');
    const personId = `${siteConfig.site.siteUrl}/#person`;
    const sections = getSectionSnapshot(siteConfig.site.siteUrl);

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', resumeUrl);
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', pageSeo.ogType);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', resumeUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', toAbsoluteUrl(siteConfig.site.siteUrl, siteConfig.profile.image.resumeOg));
    document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content', siteConfig.profile.image.alt);
    document.querySelector('meta[property="og:site_name"]')?.setAttribute('content', siteConfig.site.name);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', toAbsoluteUrl(siteConfig.site.siteUrl, siteConfig.profile.image.resumeOg));
    document.querySelector('meta[name="twitter:image:alt"]')?.setAttribute('content', siteConfig.profile.image.alt);
    document.querySelector('meta[name="twitter:creator"]')?.setAttribute('content', siteConfig.seo.twitterCreator);

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
            '@id': `${resumeUrl}#profile`,
            url: resumeUrl,
            name: `${siteConfig.profile.name} Resume (${lang.toUpperCase()})`,
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
