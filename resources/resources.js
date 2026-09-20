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

// --- Table of Contents ---
function buildToC() {
    const content = document.querySelector('.resources-content');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    const toc = document.createElement('aside');
    toc.className = 'resources-toc';
    
    const title = document.createElement('h4');
    title.textContent = 'On this page';
    toc.appendChild(title);

    const ul = document.createElement('ul');
    
    headings.forEach(heading => {
        if (!heading.id) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + heading.id;
        // Strip the trailing invisible anchor character if present
        a.textContent = heading.textContent.replace('​', '').trim();
        if (heading.tagName === 'H3') {
            a.className = 'toc-h3';
        }
        li.appendChild(a);
        ul.appendChild(li);
    });

    toc.appendChild(ul);
    
    // Insert ToC right after the resources-content
    content.parentNode.insertBefore(toc, content.nextSibling);

    // Active state highlighting using IntersectionObserver
    const links = toc.querySelectorAll('a');
    const observer = new IntersectionObserver((entries) => {
        let activeId = null;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeId = entry.target.id;
            }
        });
        if (activeId) {
            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
            });
        }
    }, { rootMargin: '0px 0px -80% 0px' });

    headings.forEach(h => observer.observe(h));
}

// --- Service Worker ---
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.error('ServiceWorker registration failed: ', err);
            });
        });
    }
}

// --- Icons + Footer ---
async function init() {
    injectSearchLink();
    buildToC();
    registerServiceWorker();
    upgradeIcons(document);

    try {
        const siteConfig = await loadSiteConfig();
        applyGlobalFooter(siteConfig, document.querySelector('.global-footer'), '/resources/');
    } catch {
        // Footer will show static fallback
    }
}

init();

