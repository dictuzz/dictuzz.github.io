const JSON_CACHE = new Map();
const TODO_PATTERN = /\[TODO:[^\]]+\]/i;

function isObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toAbsoluteUrl(siteUrl, path = '') {
    return new URL(path, siteUrl).toString();
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

function collectTodoStrings(value, path = 'root', issues = []) {
    if (typeof value === 'string' && TODO_PATTERN.test(value)) {
        issues.push(`${path} contains a TODO placeholder`);
        return issues;
    }

    if (Array.isArray(value)) {
        value.forEach((entry, index) => collectTodoStrings(entry, `${path}[${index}]`, issues));
        return issues;
    }

    if (isObject(value)) {
        Object.entries(value).forEach(([key, entry]) => collectTodoStrings(entry, `${path}.${key}`, issues));
    }

    return issues;
}

function assert(condition, message, issues) {
    if (!condition) {
        issues.push(message);
    }
}

export function validateSharedSiteConfig(raw) {
    const issues = [];

    assert(isObject(raw), 'Site config must be an object', issues);
    assert(isObject(raw?.site), 'site config is required', issues);
    assert(isObject(raw?.profile), 'profile config is required', issues);
    assert(isObject(raw?.contact), 'contact config is required', issues);
    assert(Array.isArray(raw?.socials), 'socials must be an array', issues);
    assert(Array.isArray(raw?.navigation?.footer), 'navigation.footer must be an array', issues);
    assert(isObject(raw?.seo?.pages), 'seo.pages is required', issues);

    assert(typeof raw?.site?.siteUrl === 'string' && raw.site.siteUrl.length > 0, 'site.siteUrl is required', issues);
    assert(typeof raw?.profile?.name === 'string' && raw.profile.name.length > 0, 'profile.name is required', issues);
    assert(typeof raw?.profile?.handle === 'string' && raw.profile.handle.length > 0, 'profile.handle is required', issues);
    assert(typeof raw?.profile?.title === 'string' && raw.profile.title.length > 0, 'profile.title is required', issues);
    assert(typeof raw?.contact?.email === 'string' && raw.contact.email.includes('@'), 'contact.email is required', issues);
    assert(typeof raw?.contact?.whatsappUrl === 'string' && raw.contact.whatsappUrl.startsWith('https://'), 'contact.whatsappUrl is required', issues);

    collectTodoStrings(raw, 'site', issues);

    if (issues.length > 0) {
        throw new Error(`Invalid shared site config:\n- ${issues.join('\n- ')}`);
    }

    return raw;
}

export function validateHomeContent(raw) {
    const issues = [];

    assert(isObject(raw), 'Home content must be an object', issues);
    assert(Array.isArray(raw?.folders), 'home.folders must be an array', issues);

    raw?.folders?.forEach((folder, folderIndex) => {
        assert(typeof folder?.id === 'string' && folder.id.length > 0, `folders[${folderIndex}].id is required`, issues);
        assert(typeof folder?.title === 'string' && folder.title.length > 0, `folders[${folderIndex}].title is required`, issues);
        assert(Array.isArray(folder?.items), `folders[${folderIndex}].items must be an array`, issues);

        folder?.items?.forEach((item, itemIndex) => {
            assert(typeof item?.label === 'string' && item.label.length > 0, `folders[${folderIndex}].items[${itemIndex}].label is required`, issues);
            assert(typeof item?.href === 'string' && item.href.length > 0, `folders[${folderIndex}].items[${itemIndex}].href is required`, issues);
        });
    });

    collectTodoStrings(raw, 'home', issues);

    if (issues.length > 0) {
        throw new Error(`Invalid home content:\n- ${issues.join('\n- ')}`);
    }

    return raw;
}

function validateResumeArrayCollection(collection, path, issues) {
    assert(Array.isArray(collection), `${path} must be an array`, issues);
}

export function validateResumeContent(raw) {
    const issues = [];

    assert(isObject(raw), 'Resume locale content must be an object', issues);
    assert(typeof raw?.locale === 'string' && raw.locale.length > 0, 'resume.locale is required', issues);
    assert(isObject(raw?.strings), 'resume.strings is required', issues);
    assert(isObject(raw?.sections), 'resume.sections is required', issues);
    assert(isObject(raw?.collections), 'resume.collections is required', issues);
    assert(isObject(raw?.downloads), 'resume.downloads is required', issues);

    validateResumeArrayCollection(raw?.sections?.experience, 'resume.sections.experience', issues);
    validateResumeArrayCollection(raw?.sections?.education, 'resume.sections.education', issues);
    validateResumeArrayCollection(raw?.sections?.impact, 'resume.sections.impact', issues);
    validateResumeArrayCollection(raw?.sections?.certifications ?? [], 'resume.sections.certifications', issues);
    validateResumeArrayCollection(raw?.sections?.testimonials ?? [], 'resume.sections.testimonials', issues);
    validateResumeArrayCollection(raw?.sections?.awards ?? [], 'resume.sections.awards', issues);
    validateResumeArrayCollection(raw?.sections?.etc ?? [], 'resume.sections.etc', issues);

    assert(typeof raw?.strings?.hero?.role === 'string' && raw.strings.hero.role.length > 0, 'resume.strings.hero.role is required', issues);
    assert(typeof raw?.sections?.summary?.text === 'string' && raw.sections.summary.text.length > 0, 'resume.sections.summary.text is required', issues);
    assert(typeof raw?.downloads?.resumeUrl === 'string' && raw.downloads.resumeUrl.startsWith('https://'), 'resume.downloads.resumeUrl is required', issues);

    collectTodoStrings(raw, `resume.${raw?.locale || 'unknown'}`, issues);

    if (issues.length > 0) {
        throw new Error(`Invalid resume locale content:\n- ${issues.join('\n- ')}`);
    }

    return raw;
}

export async function fetchContentJson(path) {
    if (JSON_CACHE.has(path)) {
        return JSON_CACHE.get(path);
    }

    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Failed to load content from ${path}`);
    }

    const text = await response.text();
    const parsed = JSON.parse(text.replace(/^\uFEFF/, ''));
    JSON_CACHE.set(path, parsed);
    return parsed;
}

export function clearContentCache() {
    JSON_CACHE.clear();
}

export async function loadSiteConfig() {
    return validateSharedSiteConfig(await fetchContentJson('/content/site.json'));
}

export async function loadHomeContent() {
    return validateHomeContent(await fetchContentJson('/content/home.json'));
}

export async function loadResumeContent(locale) {
    return validateResumeContent(await fetchContentJson(`/content/resume/${locale}.json`));
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (match) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[match]));
}

export function renderFoldersMarkup(folders) {
    return folders.map((folder) => `
        <section class="folder card" data-folder>
            <h2 class="folder__heading">
                <button class="folder__trigger" type="button" aria-expanded="${folder.defaultOpen ? 'true' : 'false'}" aria-controls="panel-${escapeHtml(folder.id)}" id="trigger-${escapeHtml(folder.id)}">
                    <span class="folder__label">
                        <span class="folder__icon"><i class="${escapeHtml(folder.icon)}"></i></span>
                        <span class="folder__title-group">
                            <span class="folder__title-row">
                                <span class="folder__title">${escapeHtml(folder.title)}</span>
                                <span class="folder__count">${folder.items.length}</span>
                            </span>
                            <span class="folder__summary">${escapeHtml(folder.summary || '')}</span>
                        </span>
                    </span>
                    <span class="folder__chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
                </button>
            </h2>
            <div class="folder__panel" id="panel-${escapeHtml(folder.id)}" role="region" aria-labelledby="trigger-${escapeHtml(folder.id)}" ${folder.defaultOpen ? '' : 'hidden'}>
                <div class="folder__items">
                    ${folder.items.map((item) => `
                        <a class="folder-link" href="${escapeHtml(item.href)}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>
                            <span class="folder-link__main">
                                <span class="folder-link__icon"><i class="${escapeHtml(item.icon)}" aria-hidden="true"></i></span>
                                <span>${escapeHtml(item.label)}</span>
                            </span>
                            <i class="${item.external ? 'fas fa-arrow-up-right-from-square' : 'fas fa-arrow-right'}" aria-hidden="true"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
        </section>
    `).join('');
}

export function renderDirectoryUnavailableMarkup() {
    return `
        <section class="folder card is-open" data-folder>
            <h2 class="folder__heading">
                <button class="folder__trigger" type="button" aria-expanded="true">
                    <span class="folder__label">
                        <span class="folder__icon"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i></span>
                        <span class="folder__title-group">
                            <span class="folder__title-row">
                                <span class="folder__title">Directory unavailable</span>
                            </span>
                            <span class="folder__summary">Core routes are still available below.</span>
                        </span>
                    </span>
                </button>
            </h2>
            <div class="folder__panel" role="region">
                <div class="folder__items">
                    <a class="folder-link" href="/resume/">
                        <span class="folder-link__main">
                            <span class="folder-link__icon"><i class="fas fa-file-lines" aria-hidden="true"></i></span>
                            <span>Resume</span>
                        </span>
                        <i class="fas fa-arrow-right" aria-hidden="true"></i>
                    </a>
                    <a class="folder-link" href="mailto:contact@dictuzz.me">
                        <span class="folder-link__main">
                            <span class="folder-link__icon"><i class="fas fa-envelope" aria-hidden="true"></i></span>
                            <span>Email</span>
                        </span>
                        <i class="fas fa-arrow-right" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </section>
    `;
}

export function createFooterViewModel(siteConfig, currentPath = window.location.pathname) {
    const footerNav = siteConfig.navigation.footer.map((entry) => ({
        ...entry,
        current: currentPath === entry.href
    }));

    return {
        navigation: footerNav,
        contacts: [
            {
                href: `mailto:${siteConfig.contact.email}`,
                icon: 'fas fa-envelope',
                label: siteConfig.contact.email,
                ariaLabel: 'Email Me'
            },
            {
                href: siteConfig.contact.whatsappUrl,
                icon: 'fab fa-whatsapp',
                label: siteConfig.contact.whatsappLabel,
                ariaLabel: 'WhatsApp',
                external: true
            },
            {
                href: '/terms/',
                icon: 'fas fa-file-contract',
                label: 'Terms',
                current: currentPath === '/terms/'
            }
        ],
        copyright: `© ${new Date().getFullYear()} ${siteConfig.profile.name}. All rights reserved.`,
        motto: siteConfig.profile.motto
    };
}

export function renderFooterMarkup(viewModel) {
    return `
        <nav class="global-footer__nav" aria-label="Global navigation">
            ${viewModel.navigation.map((entry) => `
                <a href="${entry.href}" class="global-footer__link" ${entry.current ? 'aria-current="page"' : ''}>${escapeHtml(entry.label)}</a>
            `).join('')}
        </nav>
        <div class="global-footer__contacts">
            ${viewModel.contacts.map((entry, index) => `
                ${index > 0 ? '<span class="global-footer__divider">&bull;</span>' : ''}
                <a href="${entry.href}" class="global-footer__contact-link" ${entry.external ? 'target="_blank" rel="noopener"' : ''} ${entry.current ? 'aria-current="page"' : ''} aria-label="${escapeHtml(entry.ariaLabel || entry.label)}"><i class="${entry.icon}"></i> ${escapeHtml(entry.label)}</a>
            `).join('')}
        </div>
        <p class="global-footer__copy">
            ${escapeHtml(viewModel.copyright)}
            <span>${escapeHtml(viewModel.motto)}</span>
        </p>
    `;
}

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
    setMetaAttribute('meta[name="keywords"]', 'content', siteConfig.seo.keywords[pageKey] || siteConfig.seo.keywords.home || '');
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
    setMetaAttribute('meta[name="twitter:creator"]', 'content', siteConfig.seo.twitterCreator);
}

export function applyGlobalFooter(siteConfig, footerElement = document.querySelector('.global-footer'), currentPath) {
    if (!footerElement) return;
    footerElement.innerHTML = renderFooterMarkup(createFooterViewModel(siteConfig, currentPath));
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
            description: `Homepage and professional directory for ${siteConfig.profile.name}, ${siteConfig.profile.title}.`,
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

export function normalizeResumeTranslations(content) {
    return {
        hero: content.strings.hero,
        nav: content.strings.nav,
        section: content.strings.section,
        sectionLede: content.strings.sectionLede,
        summary: content.sections.summary,
        skills: {
            ...content.strings.skills,
            lang: content.collections.languages.reduce((accumulator, item) => {
                accumulator[item.id] = item.label;
                return accumulator;
            }, {})
        },
        connect: content.strings.connect
    };
}

export function translateValue(content, key) {
    return getNestedValue(normalizeResumeTranslations(content), key);
}
