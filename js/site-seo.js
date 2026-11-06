import { toAbsoluteUrl } from './site-content.js';

function setMetaAttribute(selector, attribute, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.setAttribute(attribute, value);
    }
}

export function applyManagedPageMetadata(siteConfig, pageKey, overrides = {}) {
    const pageSeo = siteConfig.seo.pages[pageKey];
    if (!pageSeo) return;

    const title = overrides.title || pageSeo.title;
    const description = overrides.description || pageSeo.description;
    const absoluteUrl = toAbsoluteUrl(siteConfig.site.siteUrl, overrides.path || pageSeo.path);
    const imagePath = overrides.imagePath || (pageKey === 'resume' ? siteConfig.profile.image.resumeOg : siteConfig.profile.image.og);
    const absoluteImage = toAbsoluteUrl(siteConfig.site.siteUrl, imagePath);

    document.title = title;
    setMetaAttribute('meta[name="description"]', 'content', description);
    setMetaAttribute('meta[name="author"]', 'content', siteConfig.profile.name);
    setMetaAttribute('meta[name="theme-color"]', 'content', siteConfig.site.themeColorLight);
    setMetaAttribute('link[rel="canonical"]', 'href', absoluteUrl);

    setMetaAttribute('meta[property="og:type"]', 'content', pageSeo.ogType || 'website');
    setMetaAttribute('meta[property="og:url"]', 'content', absoluteUrl);
    setMetaAttribute('meta[property="og:title"]', 'content', title);
    setMetaAttribute('meta[property="og:description"]', 'content', description);
    setMetaAttribute('meta[property="og:image"]', 'content', absoluteImage);
    setMetaAttribute('meta[property="og:image:alt"]', 'content', siteConfig.profile.image.alt);
    setMetaAttribute('meta[property="og:site_name"]', 'content', siteConfig.site.name);

    setMetaAttribute('meta[name="twitter:card"]', 'content', pageKey === 'terms' ? 'summary' : 'summary_large_image');
    setMetaAttribute('meta[name="twitter:url"]', 'content', absoluteUrl);
    setMetaAttribute('meta[name="twitter:title"]', 'content', title);
    setMetaAttribute('meta[name="twitter:description"]', 'content', description);
    setMetaAttribute('meta[name="twitter:image"]', 'content', absoluteImage);
    setMetaAttribute('meta[name="twitter:image:alt"]', 'content', siteConfig.profile.image.alt);
    setMetaAttribute('meta[name="twitter:creator"]', 'content', siteConfig.seo.twitterCreator || '');
}

export function buildHomeStructuredData(siteConfig) {
    const homeUrl = toAbsoluteUrl(siteConfig.site.siteUrl, '/');
    const personId = `${homeUrl}#person`;

    return [
        {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': personId,
            name: siteConfig.profile.name,
            alternateName: [siteConfig.profile.handle, `${siteConfig.profile.name} ${siteConfig.profile.handle}`],
            jobTitle: siteConfig.profile.title,
            description: siteConfig.profile.longDescription,
            url: homeUrl,
            image: toAbsoluteUrl(siteConfig.site.siteUrl, siteConfig.profile.image.portrait),
            email: siteConfig.contact.email,
            nationality: 'Indonesian',
            address: {
                '@type': 'PostalAddress',
                addressLocality: siteConfig.profile.location.city,
                addressCountry: siteConfig.profile.location.countryCode
            },
            sameAs: siteConfig.socials.map((entry) => entry.url).concat(siteConfig.contact.whatsappUrl),
            knowsAbout: siteConfig.profile.knowsAbout
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${homeUrl}#website`,
            name: siteConfig.site.name,
            alternateName: siteConfig.profile.name,
            url: homeUrl,
            publisher: {
                '@id': personId
            }
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': `${homeUrl}#profile`,
            url: homeUrl,
            name: `${siteConfig.profile.name} (${siteConfig.profile.handle})`,
            description: `Portfolio, résumé, and curated resources by ${siteConfig.profile.name}.`,
            mainEntity: {
                '@id': personId
            },
            isPartOf: {
                '@id': `${homeUrl}#website`
            }
        }
    ];
}

export function applyStructuredData(scriptId, value) {
    const script = document.getElementById(scriptId);
    if (!script) return;
    script.textContent = JSON.stringify(value, null, 2);
}
