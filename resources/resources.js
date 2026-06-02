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

// --- Icons + Footer ---
async function init() {
    upgradeIcons(document);

    try {
        const siteConfig = await loadSiteConfig();
        applyGlobalFooter(siteConfig, document.querySelector('.global-footer'), '/resources/');
    } catch {
        // Footer will show static fallback
    }
}

init();
