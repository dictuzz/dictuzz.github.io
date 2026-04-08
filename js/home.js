import { ThemeManager, updateThemeColor } from './ui-kit.js';
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
        second: '2-digit',
        hour12: false
    }).format(now);
}

function closeFolder(folder) {
    const trigger = folder.querySelector('.folder__trigger');
    const panel = folder.querySelector('.folder__panel');
    if (!trigger || !panel) return;

    folder.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
}

function openFolder(folder) {
    const trigger = folder.querySelector('.folder__trigger');
    const panel = folder.querySelector('.folder__panel');
    if (!trigger || !panel) return;

    folder.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
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
    } catch {
        accordionContainer.innerHTML = renderDirectoryUnavailableMarkup();
        bindFolderAccordion();
    }
}

initFolders();
updateLocalTime();
window.setInterval(updateLocalTime, 1000);
