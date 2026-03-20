/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BENEDICTUS RICHARD RICARDO: Resume v2.0
 * Refactored: 2026-01-08 to use Shared Libraries
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ThemeManager, Typer, updateThemeColor } from '../js/ui-kit.js';

// Shorthand selectors
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// 1. INIT SHARED CORE
// ══════════════════════════════════════════════
let themeManager;

function init() {
    const toggleEl = document.getElementById('theme-toggle');
    const iconEl = document.getElementById('theme-icon');

    themeManager = new ThemeManager({
        toggleElement: toggleEl,
        storageKey: 'dictuzz-theme',
        iconElement: iconEl,
        defaultTheme: 'light'
    });

    updateThemeColor(themeManager.getMode());
}


// 2. LANGUAGE SYSTEM
// ══════════════════════════════════════════════
const DEFAULT_LANG = 'en';
const SUPPORTED_LANGS = ['en', 'id', 'de'];
const LANG_STORAGE_KEY = 'dictuzz-lang';

// Current language data
let currentLang = DEFAULT_LANG;
let langData = null;
let typerInstance = null;

function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

function reobserveAll(container) {
    if (typeof revealObserver !== 'undefined') {
        container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }
}

function toAbsoluteUrl(path) {
    return new URL(path, window.location.origin).toString();
}

function normalizeEntries(data) {
    if (!data) return [];
    return Array.isArray(data) ? data : Object.values(data);
}

function getSectionSnapshot() {
    return Array.from(document.querySelectorAll('main > section[id]')).map((section, index) => ({
        '@type': 'WebPageElement',
        '@id': `${toAbsoluteUrl('/resume/')}#${section.id}`,
        name: section.querySelector('.section__title')?.textContent?.trim() || section.id,
        description: section.querySelector('.section__lede')?.textContent?.trim() || undefined,
        position: index + 1
    }));
}

function updateResumeStructuredData(data, lang) {
    const script = document.getElementById('resume-structured-data');
    if (!script || !data) return;

    const resumeUrl = toAbsoluteUrl('/resume/');
    const personId = `${window.location.origin}/#person`;
    const experience = normalizeEntries(data.exp);
    const education = normalizeEntries(data.edu);
    const certifications = normalizeEntries(data.certifications);
    const impact = normalizeEntries(data.impact);
    const strategic = normalizeEntries(data.skills?.strategic_list);
    const operational = normalizeEntries(data.skills?.operational_list);
    const analytical = normalizeEntries(data.skills?.analytical_list);
    const leadership = normalizeEntries(data.skills?.leadership_list);
    const languages = Object.values(data.skills?.lang || {});
    const sections = getSectionSnapshot();

    const graph = [
        {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': personId,
            name: 'Benedictus Richard Ricardo',
            alternateName: ['dictuzz', 'Benedictus Richard Ricardo dictuzz'],
            jobTitle: data.hero?.role || 'Systems Architect & Automation Specialist',
            url: resumeUrl,
            image: toAbsoluteUrl('/assets/images/Aku.webp'),
            email: 'contact@dictuzz.me',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Bandung',
                addressCountry: 'ID'
            },
            sameAs: [
                'https://linkedin.com/in/dictuzz',
                'https://github.com/dictuzz',
                'https://instagram.com/dictuzz',
                'https://wa.me/6285186888630'
            ],
            knowsAbout: [
                ...(strategic.map(skill => typeof skill === 'string' ? skill : skill.name)),
                ...(operational.map(skill => typeof skill === 'string' ? skill : skill.name)),
                ...(analytical.map(skill => typeof skill === 'string' ? skill : skill.name)),
                ...(leadership.map(skill => typeof skill === 'string' ? skill : skill.name)),
                ...languages
            ],
            alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Universitas Terbuka',
                url: 'https://www.ut.ac.id/'
            },
            description: data.summary?.text || 'Systems Architect & Automation Specialist with experience in workflow automation, KPI governance, reporting systems, and operational leadership.'
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': `${resumeUrl}#profile`,
            url: resumeUrl,
            name: `Benedictus Richard Ricardo Resume (${lang.toUpperCase()})`,
            inLanguage: lang,
            description: data.summary?.text || 'Resume and professional profile for Benedictus Richard Ricardo.',
            mainEntity: { '@id': personId },
            hasPart: sections
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${resumeUrl}#webpage`,
            url: resumeUrl,
            name: document.title,
            inLanguage: lang,
            description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            about: { '@id': personId },
            mainEntity: { '@id': personId },
            breadcrumb: { '@id': `${resumeUrl}#breadcrumb` },
            hasPart: sections
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            '@id': `${resumeUrl}#breadcrumb`,
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: toAbsoluteUrl('/')
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Resume',
                    item: resumeUrl
                }
            ]
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${resumeUrl}#experience-list`,
            name: 'Work Experience',
            numberOfItems: experience.length,
            itemListElement: experience.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Role',
                    roleName: item.role,
                    description: Array.isArray(item.details) ? item.details.join(' ') : '',
                    memberOf: {
                        '@type': 'Organization',
                        name: item.company
                    }
                }
            }))
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${resumeUrl}#education-list-schema`,
            name: 'Education',
            numberOfItems: education.length,
            itemListElement: education.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'EducationalOccupationalCredential',
                    name: item.degree ? `${item.name} - ${item.degree}` : item.name,
                    description: [item.date, item.focus].filter(Boolean).join(' · ')
                }
            }))
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${resumeUrl}#certifications-list-schema`,
            name: 'Certifications and Training',
            numberOfItems: certifications.length,
            itemListElement: certifications.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'EducationalOccupationalCredential',
                    name: item.name,
                    credentialCategory: item.issuer || 'Certification',
                    recognizedBy: item.issuer && !item.issuer.startsWith('[') ? {
                        '@type': 'Organization',
                        name: item.issuer
                    } : undefined
                }
            }))
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${resumeUrl}#impact-list-schema`,
            name: 'Selected Operational Impact',
            numberOfItems: impact.length,
            itemListElement: impact.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: item.title,
                    description: item.desc
                }
            }))
        },
        {
            '@context': 'https://schema.org',
            '@type': 'DefinedTermSet',
            '@id': `${resumeUrl}#skills`,
            name: 'Core Skills and Tools',
            hasDefinedTerm: [
                ...strategic,
                ...operational,
                ...analytical,
                ...leadership
            ].map(skill => ({
                '@type': 'DefinedTerm',
                name: typeof skill === 'string' ? skill : skill.name
            }))
        }
    ];

    script.textContent = JSON.stringify(graph, null, 2);
}

function renderSection(selector, data, templateFn) {
    const container = $(selector);
    if (!container || !data) return;
    if (Array.isArray(data) && data.length === 0) return;
    
    const items = Array.isArray(data) ? data : Object.values(data);
    container.innerHTML = items.map(templateFn).join('');
    reobserveAll(container);
}

function renderExperience(data) {
    if (!Array.isArray(data)) return;
    const sorted = [...data].sort((a, b) => {
        const getEnd = d => {
            if (!d.date) return new Date();
            if (/present|sekarang|heute/i.test(d.date)) return new Date();
            const parts = d.date.replace(/–/g, '-').split('-');
            return parts.length > 1 ? new Date(parts[1].trim()) : new Date();
        };
        return getEnd(b) - getEnd(a);
    });

    renderSection('.timeline', sorted, job => `
        <div class="timeline__item reveal">
            <div class="timeline__date">${escapeHtml(job.date)}</div>
            <div class="timeline__content glass card">
                <h3>${escapeHtml(job.role)}</h3>
                <h4>${escapeHtml(job.company)}</h4>
                <ul class="timeline__details">
                    ${job.details && Array.isArray(job.details)
            ? job.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')
            : ''}
                </ul>
            </div>
        </div>
    `);
}

function renderImpact(data) {
    renderSection('.impact__list', data, item => `
        <div class="project-card glass glass--hover card reveal">
            <h3 class="project-card__title">${escapeHtml(item.title)}</h3>
            <p class="project-card__desc">${escapeHtml(item.desc)}</p>
        </div>
    `);
}

function renderSkills(data) {
    const categories = [
        { key: 'strategic_list', id: '#skills-strategic' },
        { key: 'operational_list', id: '#skills-operational' },
        { key: 'analytical_list', id: '#skills-analytical' },
        { key: 'leadership_list', id: '#skills-leadership' }
    ];

    categories.forEach(({ key, id }) => {
        if (!data?.[key]) return;
        renderSection(id, data[key], skill => `<span class="tag">${escapeHtml(typeof skill === 'string' ? skill : skill.name)}</span>`);
    });
}

function renderCertifications(data) {
    renderSection('#certifications-list', data, item => `
        <div class="edu-card glass glass--hover card reveal">
            <h3>${escapeHtml(item.name)}</h3>
            <p class="edu-card__degree">${escapeHtml(item.issuer)}</p>
            <p class="edu-card__date">${escapeHtml(item.year)}</p>
            ${item.url ? `<p class="edu-card__focus"><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Verify credential</a></p>` : ''}
        </div>
    `);
}

function renderTestimonials(data) {
    renderSection('#testimonials-list', data, item => `
        <article class="testimonial-card glass card reveal">
            <p class="testimonial-card__mark" aria-hidden="true">“</p>
            <blockquote class="testimonial-card__quote">${escapeHtml(item.quote)}</blockquote>
            <p class="testimonial-card__meta">${escapeHtml(item.author)} · ${escapeHtml(item.role)}</p>
            ${item.linkedin ? `<p class="testimonial-card__link"><a href="${escapeHtml(item.linkedin)}" target="_blank" rel="noopener">LinkedIn profile</a></p>` : ''}
        </article>
    `);
}

function renderEducation(data) {
    renderSection('#education-list', data, edu => `
        <div class="edu-card glass glass--hover card reveal">
            <h3>${escapeHtml(edu.name)}</h3>
            <p class="edu-card__degree">${escapeHtml(edu.degree)}</p>
            <p class="edu-card__date">${escapeHtml(edu.date)}</p>
            ${edu.focus ? `<p class="edu-card__focus">${escapeHtml(edu.focus)}</p>` : ''}
        </div>
    `);
}

function renderAwards(data) {
    renderSection('#awards-list', data, award => `<li>${escapeHtml(award)}</li>`);
}

function renderEtc(data) {
    renderSection('#etc-list', data, item => `<li>${escapeHtml(item)}</li>`);
}


function applyTranslations(data) {
    $$('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const value = getNestedValue(data, key);
        if (value && typeof value === 'string') {
            el.textContent = value;
        }
    });
}

async function loadLanguage(lang) {
    try {
        const res = await fetch(`/locales/${lang}.json`);
        if (!res.ok) throw new Error('Failed to load');

        const rawText = await res.text();
        langData = JSON.parse(rawText.replace(/^\uFEFF/, ''));
        currentLang = lang;

        // Save language preference to localStorage
        localStorage.setItem(LANG_STORAGE_KEY, lang);

        // Update URL with language parameter for sharing
        const url = new URL(location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
        renderExperience(langData.exp);
        renderEducation(langData.edu);
        renderCertifications(langData.certifications);
        renderImpact(langData.impact);
        renderSkills(langData.skills);
        renderAwards(langData.awards);
        renderEtc(langData.etc);
        renderTestimonials(langData.testimonials);
        applyTranslations(langData);
        updateDownloadLink(lang);
        updateResumeStructuredData(langData, lang);

        // Update typing animation
        if (langData.hero?.typing) {
            $('#typing-static').textContent = langData.hero.typing.staticText || '';
            const typingEl = $('#typing-dynamic');

            if (typingEl) {
                // Stop existing typer if any
                if (typerInstance) {
                    typerInstance.stop();
                }

                // Clear element
                typingEl.textContent = '';

                // Create new typer with fresh start (speed 80ms per character - readable pace)
                typerInstance = new Typer(typingEl, langData.hero.typing.dynamicTexts, 80);
            }
        }

        // Update active lang button
        $$('.lang-btn').forEach(btn => {
            const isActive = btn.dataset.lang === lang;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });

        document.documentElement.lang = lang;

    } catch (err) {
        console.error('Language load error:', err);
        if (lang !== DEFAULT_LANG) loadLanguage(DEFAULT_LANG);
    }
}

function updateDownloadLink(lang) {
    const link = $('#download-cv-link');
    if (!link) return;

    const urls = {
        'id': 'https://rxresu.me/me.richardricardo/id',
        'en': 'https://rxresu.me/me.richardricardo/en',
        'de': 'https://rxresu.me/me.richardricardo/de'
    };

    link.href = urls[lang] || urls['en'];
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
}



// Language button handlers
$$('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang && SUPPORTED_LANGS.includes(lang)) {
            loadLanguage(lang);
        }
    });
});

// 3. INTERSECTION OBSERVER: Reveal animations
// ══════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('active');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

$$('.reveal, .stagger').forEach(el => revealObserver.observe(el));

// 4. UI INTERACTIONS
// ══════════════════════════════════════════════

// Image Protection
document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// Smooth Scroll
$$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = $(a.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            $('.nav__links')?.classList.remove('open');
            $('.nav__toggle')?.classList.remove('active');
        }
    });
});

// Mobile Nav
$('.nav__toggle')?.addEventListener('click', () => {
    const toggle = $('.nav__toggle');
    const links = $('.nav__links');
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
});

// Scroll Spy
const sections = $$('section[id]');
const navLinks = $$('.nav__link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (scrollY >= top) current = section.id;
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}, { passive: true });

window.addEventListener('theme-changed', (event) => {
    updateThemeColor(event.detail?.theme || 'light');
});


// 5. 3D AVATAR TILT
// ══════════════════════════════════════════════
function initProfileTilt() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || 'ontouchstart' in window) return;

    const avatar = $('.hero__photo-wrapper');
    const container = $('.hero__container');
    if (!avatar || !container) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        avatar.style.transform = `perspective(1000px) rotateY(${x * 0.025}deg) rotateX(${-y * 0.025}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        avatar.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        avatar.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => { avatar.style.transition = ''; }, 800);
    });
}
initProfileTilt();


// 6. TRACKING HELPERS (Using shared global gtag if avail)
// ══════════════════════════════════════════════
function trackEvent(name, params = {}) {
    if (typeof window.gtag !== 'undefined') window.gtag('event', name, params);
}

document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link?.href?.startsWith('http')) return;
    if (!link.href.includes(location.hostname)) {
        trackEvent('outbound_click', { url: link.href });
    }
});



// 7. INITIAL LOAD
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    init();

    const urlLang = new URLSearchParams(location.search).get('lang');
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    const browserLang = navigator.language.split('-')[0];

    // Priority: URL param > Saved preference > Browser lang > Default
    const initLang = SUPPORTED_LANGS.includes(urlLang) ? urlLang
        : SUPPORTED_LANGS.includes(savedLang) ? savedLang
        : SUPPORTED_LANGS.includes(browserLang) ? browserLang
        : DEFAULT_LANG;

    loadLanguage(initLang);
});
