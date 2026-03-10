import { ThemeManager } from './ui-kit.js';

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

new ThemeManager({
    toggleElement: themeToggle,
    iconElement: themeIcon,
    defaultTheme: 'light',
    storageKey: 'dictuzz-theme'
});

const folders = [...document.querySelectorAll('[data-folder]')];
const dateEl = document.getElementById('local-date');
const timeEl = document.getElementById('local-time');

function getLocalTimeZone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Bangkok';
    } catch {
        return 'Asia/Bangkok';
    }
}

function updateLocalTime() {
    if (!dateEl || !timeEl) return;

    const timeZone = getLocalTimeZone();
    const now = new Date();

    dateEl.textContent = new Intl.DateTimeFormat(undefined, {
        timeZone,
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(now);

    timeEl.textContent = new Intl.DateTimeFormat(undefined, {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(now);
}

function closeFolder(folder) {
    const trigger = folder.querySelector('.folder__trigger');
    const panel = folder.querySelector('.folder__panel');
    if (!trigger || !panel) return;

    folder.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
}

function openFolder(folder) {
    const trigger = folder.querySelector('.folder__trigger');
    const panel = folder.querySelector('.folder__panel');
    if (!trigger || !panel) return;

    folder.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
}

folders.forEach((folder) => {
    const panel = folder.querySelector('.folder__panel');
    if (panel) panel.hidden = false;

    closeFolder(folder);

    const trigger = folder.querySelector('.folder__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        folders.forEach((item) => closeFolder(item));

        if (!isExpanded) {
            openFolder(folder);
        }
    });
});

const defaultFolder = document.querySelector('#trigger-links')?.closest('[data-folder]');
if (defaultFolder) {
    openFolder(defaultFolder);
}

updateLocalTime();
window.setInterval(updateLocalTime, 60000);

// ═══════════════════════════════════════════════════
// LANGUAGE SYSTEM
// ═══════════════════════════════════════════════════
const SUPPORTED_LANGS = ['en', 'id', 'de'];
const DEFAULT_LANG = 'en';
const LANG_STORAGE_KEY = 'dictuzz-lang';

function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}

async function loadLanguage(lang) {
    try {
        const res = await fetch(`/locales/${lang}.json`);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();

        // Apply translations
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const value = getNestedValue(data, el.dataset.i18n);
            if (value && typeof value === 'string') {
                el.textContent = value;
            }
        });

        // Save preference
        localStorage.setItem(LANG_STORAGE_KEY, lang);
        document.documentElement.lang = lang;

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    } catch (err) {
        console.warn('Language load error:', err);
        if (lang !== DEFAULT_LANG) loadLanguage(DEFAULT_LANG);
    }
}

// Language button handlers
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang && SUPPORTED_LANGS.includes(lang)) {
            loadLanguage(lang);
        }
    });
});

// Determine initial language
const urlLang = new URLSearchParams(location.search).get('lang');
const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
const browserLang = navigator.language.split('-')[0];

const initLang = SUPPORTED_LANGS.includes(urlLang) ? urlLang
    : SUPPORTED_LANGS.includes(savedLang) ? savedLang
        : SUPPORTED_LANGS.includes(browserLang) ? browserLang
            : DEFAULT_LANG;

if (initLang !== DEFAULT_LANG) {
    loadLanguage(initLang);
} else {
    // Mark EN as active (default)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === 'en');
    });
}
