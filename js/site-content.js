const JSON_CACHE = new Map();
const TODO_PATTERN = /\[TODO:[^\]]+\]/i;

function isObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function toAbsoluteUrl(siteUrl, path = '') {
    return new URL(path, siteUrl).toString();
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

function checkSchema(data, schema, path = 'root', issues = []) {
    if (schema === 'string') {
        if (typeof data !== 'string' || data.trim() === '') issues.push(`${path} is required`);
    } else if (schema === 'email') {
        if (typeof data !== 'string' || !data.includes('@')) issues.push(`${path} is required`);
    } else if (schema === 'url') {
        if (typeof data !== 'string' || !data.startsWith('http')) issues.push(`${path} is required`);
    } else if (schema === 'array') {
        if (!Array.isArray(data)) issues.push(`${path} must be an array`);
    } else if (schema === 'object') {
        if (!isObject(data)) issues.push(`${path} is required`);
    } else if (schema === 'array_optional') {
        if (data !== undefined && !Array.isArray(data)) issues.push(`${path} must be an array`);
    } else if (isObject(schema)) {
        if (!isObject(data)) {
            issues.push(`${path} must be an object`);
        } else {
            for (const [key, expected] of Object.entries(schema)) {
                checkSchema(data[key], expected, path === 'root' ? key : `${path}.${key}`, issues);
            }
        }
    } else if (Array.isArray(schema) && schema.length === 1) {
        if (!Array.isArray(data)) {
            issues.push(`${path} must be an array`);
        } else {
            data.forEach((item, index) => checkSchema(item, schema[0], `${path}[${index}]`, issues));
        }
    }
    return issues;
}

const SHARED_CONFIG_SCHEMA = {
    site: { siteUrl: 'string' },
    profile: { name: 'string', handle: 'string', title: 'string' },
    contact: { email: 'email', whatsappUrl: 'url' },
    socials: 'array',
    navigation: { footer: 'array' },
    seo: { pages: 'object' }
};

const HOME_CONTENT_SCHEMA = {
    folders: [{
        id: 'string',
        title: 'string',
        items: [{
            label: 'string',
            href: 'string'
        }]
    }]
};

const RESUME_CONTENT_SCHEMA = {
    locale: 'string',
    strings: { hero: { role: 'string' } },
    sections: {
        summary: { text: 'string' },
        experience: 'array',
        education: 'array',
        impact: 'array',
        certifications: 'array_optional',
        testimonials: 'array_optional',
        awards: 'array_optional',
        etc: 'array_optional'
    },
    collections: 'object',
    downloads: { resumeUrl: 'url' }
};

export function validateSharedSiteConfig(raw) {
    const issues = checkSchema(raw, SHARED_CONFIG_SCHEMA);
    if (issues.length > 0) throw new Error(`Invalid shared site config:\n- ${issues.join('\n- ')}`);
    return raw;
}

export function validateHomeContent(raw) {
    const issues = checkSchema(raw, HOME_CONTENT_SCHEMA, 'home');
    if (issues.length > 0) throw new Error(`Invalid home content:\n- ${issues.join('\n- ')}`);
    return raw;
}

export function validateResumeContent(raw) {
    const issues = checkSchema(raw, RESUME_CONTENT_SCHEMA, 'resume');
    if (issues.length > 0) throw new Error(`Invalid resume locale content:\n- ${issues.join('\n- ')}`);
    return raw;
}

export async function fetchContentJson(path) {
    if (JSON_CACHE.has(path)) return JSON_CACHE.get(path);

    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to load content from ${path}`);

    const text = await response.text();
    const cleanText = text.replace(/^\uFEFF/, '');
    
    const issues = [];
    const parsed = JSON.parse(cleanText, (key, value) => {
        if (typeof value === 'string' && TODO_PATTERN.test(value)) {
            issues.push(`Key '${key}' contains a TODO placeholder`);
        }
        return value;
    });

    if (issues.length > 0) {
        throw new Error(`Content at ${path} contains unresolved TODO placeholders:\n- ${issues.join('\n- ')}`);
    }

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
