/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BENEDICTUS RICHARD RICARDO: Portfolio v2.0
 * Refactored: 2026-01-08 to use Shared Libraries
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ThemeManager, Typer } from '../js/ui-kit.js';
import { initAnalytics } from '../js/analytics.js';

// Shorthand selectors
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// 1. INIT SHARED CORE
// ══════════════════════════════════════════════
let themeManager;

function init() {
    if (typeof CONFIG_DATA !== 'undefined') {
        initAnalytics(CONFIG_DATA.analytics);
    }

    // Theme
    const toggleEl = document.getElementById('theme-toggle');
    const iconEl = document.getElementById('theme-icon');
    const storageKey = (typeof CONFIG_DATA !== 'undefined' && CONFIG_DATA.theme)
        ? CONFIG_DATA.theme.storageKey
        : 'dictuzz-theme';

    themeManager = new ThemeManager({
        toggleElement: toggleEl,
        storageKey: storageKey,
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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderExperience(data) {
    const container = $('.timeline');
    if (!container || !Array.isArray(data)) return;

    // Sort by date (most recent first)
    const sorted = [...data].sort((a, b) => {
        const getEnd = d => {
            if (!d.date) return new Date();
            // Check for current role keywords
            if (/present|sekarang|heute/i.test(d.date)) return new Date();
            // Handle both hyphen (-) and en-dash (–)
            const parts = d.date.replace(/–/g, '-').split('-');
            return parts.length > 1 ? new Date(parts[1].trim()) : new Date();
        };
        return getEnd(b) - getEnd(a);
    });

    container.innerHTML = sorted.map(job => `
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
    `).join('');

    // Re-observe new elements
    if (typeof revealObserver !== 'undefined') {
        container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }
}

function renderImpact(data) {
    const container = $('.impact__list');
    if (!container || !Array.isArray(data)) return;

    container.innerHTML = data.map(item => `
        <div class="project-card glass glass--hover card reveal">
            <h3 class="project-card__title">${escapeHtml(item.title)}</h3>
            <p class="project-card__desc">${escapeHtml(item.desc)}</p>
        </div>
    `).join('');

    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function renderSkills(data) {
    const categories = [
        { key: 'strategic_list', id: '#skills-strategic' },
        { key: 'operational_list', id: '#skills-operational' },
        { key: 'analytical_list', id: '#skills-analytical' },
        { key: 'leadership_list', id: '#skills-leadership' }
    ];

    categories.forEach(({ key, id }) => {
        const container = $(id);
        if (!container || !data?.[key]) return;
        container.innerHTML = data[key].map(skill =>
            `<span class="tag">${escapeHtml(skill)}</span>`
        ).join('');
    });
}

function renderEducation(data) {
    const container = $('#education-list');
    if (!container || !data) return;

    container.innerHTML = Object.values(data).map(edu => `
        <div class="edu-card glass glass--hover card reveal">
            <h3>${escapeHtml(edu.name)}</h3>
            <p class="edu-card__degree">${escapeHtml(edu.degree)}</p>
            <p class="edu-card__date">${escapeHtml(edu.date)}</p>
            ${edu.focus ? `<p class="edu-card__focus">${escapeHtml(edu.focus)}</p>` : ''}
        </div>
    `).join('');

    if (typeof revealObserver !== 'undefined') {
        container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }
}

function renderAwards(data) {
    const container = $('#awards-list');
    if (!container || !data) return;

    container.innerHTML = Object.values(data).map(award => `
        <li>${escapeHtml(award)}</li>
    `).join('');
}

function renderEtc(data) {
    const container = $('#etc-list');
    if (!container || !data) return;

    container.innerHTML = Object.values(data).map(item => `
        <li>${escapeHtml(item)}</li>
    `).join('');
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
        renderImpact(langData.impact);
        renderSkills(langData.skills);
        renderAwards(langData.awards);
        renderEtc(langData.etc);
        applyTranslations(langData);
        updateDownloadLink(lang);

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
}

function updateThemeColor(theme) {
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) return;

    themeMeta.setAttribute('content', theme === 'dark' ? '#121820' : '#f5efe4');
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

$$('a[href*="linktr.ee"]').forEach(a => {
    a.addEventListener('click', () => trackEvent('download_cv', { url: a.href }));
});

document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link?.href?.startsWith('http')) return;
    if (!link.href.includes(location.hostname)) {
        trackEvent('outbound_click', { url: link.href });
    }
});


// 7. INITIAL LOAD
// ══════════════════════════════════════════════
let CONFIG_DATA = {};

async function fetchConfig() {
    try {
        const res = await fetch('/data/global-config.json');
        if (res.ok) {
            const data = await res.json();
            CONFIG_DATA = data.resume || {};
        }
    } catch (err) {
        console.error("Config fetch failed:", err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchConfig();
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

    // Feature Flags Check
    if (typeof CONFIG_DATA !== 'undefined' && CONFIG_DATA.features) {
        if (CONFIG_DATA.features.blog === false) {
            const blogLink = document.querySelector('a[href*="blog"]');
            if (blogLink) blogLink.style.display = 'none';
        }
    }
});
