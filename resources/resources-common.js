import { ThemeManager, updateThemeColor } from '../js/ui-kit.js';
import { loadSiteConfig } from '../js/site-content.js';
import { applyGlobalFooter } from '../js/site-renderers.js';

export function bindThemeToggle() {
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

    return themeManager;
}

export function bindMobileNav() {
    const hamburger = document.getElementById('resources-hamburger');
    const mobileNav = document.getElementById('resources-mobile-nav');
    const closeBtn = document.getElementById('resources-mobile-close');

    if (!hamburger || !mobileNav) return;

    const open = () => {
        mobileNav.classList.add('is-open');
        mobileNav.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Close navigation menu');
        document.body.style.overflow = 'hidden';
        closeBtn?.focus();
    };

    const close = () => {
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        document.body.style.overflow = '';
        hamburger.focus();
    };

    hamburger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
        if (!mobileNav.classList.contains('is-open')) return;
        if (e.key === 'Escape') {
            close();
        } else if (e.key === 'Tab') {
            const focusable = mobileNav.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) close();
    });
}

export function bindSearchShortcuts(onSearchFocus) {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (typeof onSearchFocus === 'function') {
                onSearchFocus();
            } else {
                window.location.href = '/resources/search.html';
            }
        }
    });
}

export async function initSharedFooter(currentPath = '/resources/') {
    try {
        const siteConfig = await loadSiteConfig();
        applyGlobalFooter(siteConfig, document.querySelector('.global-footer'), currentPath);
    } catch {
        // Fallback footer already in static HTML
    }
}

