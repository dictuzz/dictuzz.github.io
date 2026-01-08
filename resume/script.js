/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BENEDICTUS RICHARD RICARDO: Portfolio v2.0
 * Minimalist JavaScript Core (<2KB minified)
 * Performance-optimized, Zero Dependencies
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Shorthand selectors
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// Default language
const DEFAULT_LANG = 'en';
const SUPPORTED_LANGS = ['en', 'id', 'de'];

// Current language data
let currentLang = DEFAULT_LANG;
let langData = null;

// ═══════════════════════════════════════════════════════════════════════════
// 0. THEME TOGGLE: Dark/Light Mode
// ═══════════════════════════════════════════════════════════════════════════
function initTheme() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

// Initialize theme immediately to prevent flash
initTheme();

// Bind theme toggle button
document.addEventListener('DOMContentLoaded', () => {
    $('.theme-toggle')?.addEventListener('click', toggleTheme);
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. INTERSECTION OBSERVER: Reveal animations
// ═══════════════════════════════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('active');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

$$('.reveal, .stagger').forEach(el => revealObserver.observe(el));

// IMAGE PROTECTION
document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════════════════
$$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = $(a.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile nav
            $('.nav__links')?.classList.remove('open');
            $('.nav__toggle')?.classList.remove('active');
        }
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. MOBILE NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
$('.nav__toggle')?.addEventListener('click', () => {
    const toggle = $('.nav__toggle');
    const links = $('.nav__links');
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. SCROLL SPY: Active nav state
// ═══════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════
// 5. TYPING ANIMATION
// ═══════════════════════════════════════════════════════════════════════════
class Typer {
    constructor(el) {
        this.el = el;
        this.texts = [];
        this.idx = 0;
        this.char = 0;
        this.deleting = false;
        this.timeout = null;
    }

    setTexts(texts) {
        this.texts = texts || [];
        this.idx = 0;
        this.char = 0;
        this.deleting = false;
        if (this.timeout) clearTimeout(this.timeout);
        if (this.texts.length) this.tick();
    }

    tick() {
        const text = this.texts[this.idx];

        if (this.deleting) {
            this.char--;
        } else {
            this.char++;
        }

        this.el.textContent = text.slice(0, this.char);

        let delay = this.deleting ? 30 : 80;

        if (!this.deleting && this.char === text.length) {
            delay = 2000;
            this.deleting = true;
        } else if (this.deleting && this.char === 0) {
            this.deleting = false;
            this.idx = (this.idx + 1) % this.texts.length;
            delay = 500;
        }

        this.timeout = setTimeout(() => this.tick(), delay);
    }
}

const typingEl = $('#typing-dynamic');
const typer = typingEl ? new Typer(typingEl) : null;

// ═══════════════════════════════════════════════════════════════════════════
// 6. LANGUAGE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
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
        const getEnd = d => d.date.includes('Present') || d.date.includes('Sekarang') || d.date.includes('Heute')
            ? new Date() : new Date(d.date.split('–')[1]?.trim());
        return getEnd(b) - getEnd(a);
    });

    container.innerHTML = sorted.map(job => `
        <div class="timeline__item reveal">
            <div class="timeline__date">${escapeHtml(job.date)}</div>
            <div class="timeline__content glass card">
                <h3>${escapeHtml(job.role)}</h3>
                <h4>${escapeHtml(job.company)}</h4>
                <ul class="timeline__details">
                    ${job.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    // Re-observe new elements
    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function renderProjects(data) {
    const container = $('.projects__list');
    if (!container || !Array.isArray(data)) return;

    container.innerHTML = data.map(proj => `
        <div class="project-card glass glass--hover card reveal">
            <h3 class="project-card__title">${escapeHtml(proj.title)}</h3>
            <p class="project-card__desc">${escapeHtml(proj.desc)}</p>
        </div>
    `).join('');

    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function renderSkills(data) {
    const container = $('#skills-technical');
    if (!container || !data?.technical_list) return;

    container.innerHTML = data.technical_list.map(skill =>
        `<span class="tag">${escapeHtml(skill)}</span>`
    ).join('');
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
        const res = await fetch(`./locales/${lang}.json`);
        if (!res.ok) throw new Error('Failed to load');

        langData = await res.json();
        currentLang = lang;

        // Update content
        renderExperience(langData.exp);
        renderProjects(langData.proj);
        renderSkills(langData.skills);
        applyTranslations(langData);

        // Update typing animation
        if (typer && langData.hero?.typing) {
            $('#typing-static').textContent = langData.hero.typing.staticText || '';
            typer.setTexts(langData.hero.typing.dynamicTexts);
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

// Language button handlers
$$('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang && SUPPORTED_LANGS.includes(lang)) {
            loadLanguage(lang);
        }
    });
});

// Initial load
const urlLang = new URLSearchParams(location.search).get('lang');
const browserLang = navigator.language.split('-')[0];
const initLang = SUPPORTED_LANGS.includes(urlLang) ? urlLang
    : SUPPORTED_LANGS.includes(browserLang) ? browserLang
        : DEFAULT_LANG;

loadLanguage(initLang);

// ═══════════════════════════════════════════════════════════════════════════
// 7. ANALYTICS (if gtag exists)
// ═══════════════════════════════════════════════════════════════════════════
function trackEvent(name, params = {}) {
    if (typeof gtag !== 'undefined') gtag('event', name, params);
}

// Track CV downloads
$$('a[href*="linktr.ee"]').forEach(a => {
    a.addEventListener('click', () => trackEvent('download_cv', { url: a.href }));
});

// Track outbound links
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link?.href?.startsWith('http')) return;
    if (!link.href.includes(location.hostname)) {
        trackEvent('outbound_click', { url: link.href });
    }
});
// ═══════════════════════════════════════════════════════════════════════════
// 8. 3D AVATAR TILT (Ported from Main Site)
// ═══════════════════════════════════════════════════════════════════════════
function initProfileTilt() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || 'ontouchstart' in window) return;

    const avatar = $('.hero__photo-wrapper');
    const container = $('.hero__container'); // Use container for interaction zone
    if (!avatar || !container) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Vanilla JS Tilt
        // Reduced rotation slightly for the larger hero section feel
        avatar.style.transform = `perspective(1000px) rotateY(${x * 0.05}deg) rotateX(${-y * 0.05}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        avatar.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        avatar.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => { avatar.style.transition = ''; }, 800);
    });
}

// Init Tilt
initProfileTilt();
