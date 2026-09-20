import { ThemeManager, updateThemeColor } from './ui-kit.js';
import { upgradeIcons } from './icon-kit.js';
import {
    loadHomeContent,
    loadSiteConfig
} from './site-content.js';
import {
    applyManagedPageMetadata,
    applyStructuredData,
    buildHomeStructuredData
} from './site-seo.js';
import {
    applyGlobalFooter,
    renderDirectoryUnavailableMarkup,
    renderFoldersMarkup
} from './site-renderers.js';

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

const dateEl = document.getElementById('local-date');
const timeEl = document.getElementById('local-time');
const ROUTE_PREFETCH_CACHE = new Set();
const ASSET_PREFETCH_CACHE = new Set();

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

function canWarmNavigation() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return true;
    if (connection.saveData) return false;
    return !/2g/.test(connection.effectiveType || '');
}

function scheduleIdle(task) {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(task, { timeout: 1600 });
        return;
    }

    window.setTimeout(task, 900);
}

async function warmAsset(url) {
    if (!url || ASSET_PREFETCH_CACHE.has(url)) return;
    ASSET_PREFETCH_CACHE.add(url);

    try {
        await fetch(url, { credentials: 'same-origin', priority: 'low' });
    } catch {
        ASSET_PREFETCH_CACHE.delete(url);
    }
}

function extractWarmableAssets(htmlText, baseUrl) {
    if (!('DOMParser' in window)) return [];

    const parsed = new DOMParser().parseFromString(htmlText, 'text/html');
    const warmable = parsed.querySelectorAll(
        'link[rel="preload"][href], link[rel="modulepreload"][href], link[rel="prefetch"][href], link[rel="stylesheet"][href]'
    );

    return [...warmable]
        .map((asset) => asset.getAttribute('href'))
        .filter(Boolean)
        .map((href) => new URL(href, baseUrl).toString())
        .filter((url) => url.startsWith(window.location.origin))
        .slice(0, 8);
}

async function warmRoute(url) {
    if (!canWarmNavigation() || ROUTE_PREFETCH_CACHE.has(url)) return;
    ROUTE_PREFETCH_CACHE.add(url);

    try {
        const response = await fetch(url, { credentials: 'same-origin', priority: 'low' });
        if (!response.ok) throw new Error('route prefetch failed');

        const html = await response.text();
        const assets = extractWarmableAssets(html, url);

        assets.forEach((assetUrl) => {
            scheduleIdle(() => {
                void warmAsset(assetUrl);
            });
        });
    } catch {
        ROUTE_PREFETCH_CACHE.delete(url);
    }
}

function bindRouteWarmup() {
    const links = [...document.querySelectorAll('a[href="/resume/"], a[href="/portfolio/"]')];
    if (links.length === 0) return;

    links.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;

        const warm = () => {
            void warmRoute(new URL(href, window.location.origin).toString());
        };

        link.addEventListener('pointerenter', warm, { once: true, passive: true });
        link.addEventListener('touchstart', warm, { once: true, passive: true });
        link.addEventListener('focus', warm, { once: true, passive: true });
    });

    scheduleIdle(() => {
        void warmRoute(new URL('/resume/', window.location.origin).toString());
    });
}

function closeFolder(folder) {
    const trigger = folder.querySelector('.folder__trigger');
    const panel = folder.querySelector('.folder__panel');
    if (!trigger || !panel) return;

    folder.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    panel.setAttribute('inert', '');
}

function openFolder(folder) {
    const trigger = folder.querySelector('.folder__trigger');
    const panel = folder.querySelector('.folder__panel');
    if (!trigger || !panel) return;

    folder.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    panel.removeAttribute('inert');
}

function bindFolderAccordion() {
    const folders = [...document.querySelectorAll('[data-folder]')];
    folders.forEach((folder) => {
        const trigger = folder.querySelector('.folder__trigger');
        if (!trigger) return;

        if (trigger.getAttribute('aria-expanded') === 'true') {
            folder.classList.add('is-open');
        } else {
            closeFolder(folder);
        }

        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeFolder(folder);
                return;
            }

            openFolder(folder);
        });
    });
}

function applyHomepageIdentity(siteConfig, homeContent) {
    const nameplate = document.querySelector('.bio-nameplate');
    const title = document.querySelector('.bio-title');
    const subtitle = document.querySelector('.bio-text');
    const statusLabel = document.querySelector('.bio-status span:last-child');
    const avatar = document.querySelector('.bio-avatar img');

    if (nameplate) nameplate.textContent = siteConfig.profile.name;
    if (title) title.textContent = siteConfig.profile.handle;
    if (subtitle) subtitle.textContent = siteConfig.profile.title;
    if (statusLabel) statusLabel.textContent = homeContent.hero.status;
    if (avatar) avatar.setAttribute('alt', siteConfig.profile.name);

    applyManagedPageMetadata(siteConfig, 'home');
    applyStructuredData('home-structured-data', buildHomeStructuredData(siteConfig));
    applyGlobalFooter(siteConfig);
}

async function initFolders() {
    const accordionContainer = document.querySelector('.accordion');
    if (!accordionContainer) return;

    try {
        const [siteConfig, homeContent] = await Promise.all([
            loadSiteConfig(),
            loadHomeContent()
        ]);

        applyHomepageIdentity(siteConfig, homeContent);
        accordionContainer.innerHTML = renderFoldersMarkup(homeContent.folders);
        bindFolderAccordion();
        upgradeIcons(document);
        bindRouteWarmup();
    } catch {
        accordionContainer.innerHTML = renderDirectoryUnavailableMarkup();
        bindFolderAccordion();
        upgradeIcons(document);
        bindRouteWarmup();
    }
}

const LOCAL_TIME_INTERVAL_MS = 60_000;

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.error('ServiceWorker registration failed: ', err);
            });
        });
    }
}

upgradeIcons(document);
initFolders();
updateLocalTime();
registerServiceWorker();
window.setInterval(updateLocalTime, LOCAL_TIME_INTERVAL_MS);

