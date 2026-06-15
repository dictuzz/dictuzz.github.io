import { ThemeManager, updateThemeColor } from '../js/ui-kit.js';
import { upgradeIcons } from '../js/icon-kit.js';
import { loadSiteConfig } from '../js/site-content.js';
import { applyGlobalFooter } from '../js/site-renderers.js';

/* ═══════════════════════════════════════════════════════════
   RESOURCES PAGE — Entry Script
   ═══════════════════════════════════════════════════════════ */

// --- Theme ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeMeta = document.querySelector('meta[name="theme-color"]');

const themeManager = new ThemeManager({
    toggleElement: themeToggle,
    iconElement: themeIcon,
    defaultTheme: 'light',
    storageKey: 'dictuzz-theme'
});

updateThemeColor(themeManager.getMode(), themeMeta);
window.addEventListener('theme-changed', (event) => {
    updateThemeColor(event.detail?.theme || 'light', themeMeta);
});

// --- Mobile Nav ---
const hamburgerBtn = document.getElementById('resources-hamburger');
const mobileNav = document.getElementById('resources-mobile-nav');
const mobileNavClose = document.getElementById('resources-mobile-close');

function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    mobileNavClose?.focus();
}

function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
    hamburgerBtn?.focus();
}

hamburgerBtn?.addEventListener('click', openMobileNav);
mobileNavClose?.addEventListener('click', closeMobileNav);
mobileNav?.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMobileNav();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('is-open')) {
        closeMobileNav();
    }
});

// --- Inject search link into navbar ---
function injectSearchLink() {
    const nav = document.querySelector('.resources-navbar__nav');
    if (!nav) return;
    const existing = nav.querySelector('.resources-navbar__link--search');
    if (existing) return;
    const link = document.createElement('a');
    link.href = '/resources/search.html';
    link.className = 'resources-navbar__link resources-navbar__link--search';
    link.innerHTML = '<i class="i-ph-magnifying-glass-duotone" aria-hidden="true"></i> Search';
    nav.appendChild(link);
}

// --- Ctrl+K shortcut to search ---
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.location.href = '/resources/search.html';
    }
});

// --- Icons + Footer ---
async function init() {
    injectSearchLink();
    upgradeIcons(document);

    try {
        const siteConfig = await loadSiteConfig();
        applyGlobalFooter(siteConfig, document.querySelector('.global-footer'), '/resources/');
    } catch {
        // Footer will show static fallback
    }
}

init();
