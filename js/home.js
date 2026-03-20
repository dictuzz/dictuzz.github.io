import { ThemeManager, updateThemeColor } from './ui-kit.js';

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

async function initFolders() {
    const accordionContainer = document.querySelector('.accordion');
    if (!accordionContainer) return;

    try {
        const response = await fetch('/data/links.json');
        if (!response.ok) throw new Error('Failed to load links config');
        const configFolders = await response.json();

        accordionContainer.innerHTML = configFolders.map(folder => `
            <section class="folder card" data-folder>
                <h2 class="folder__heading">
                    <button class="folder__trigger" type="button" aria-expanded="${folder.defaultOpen ? 'true' : 'false'}" aria-controls="panel-${folder.id}" id="trigger-${folder.id}">
                        <span class="folder__label">
                            <span class="folder__icon"><i class="${folder.icon}"></i></span>
                            <span class="folder__title-group">
                                <span class="folder__title-row">
                                    <span class="folder__title">${folder.title}</span>
                                    <span class="folder__count">${folder.items.length}</span>
                                </span>
                                <span class="folder__summary">${folder.summary || ''}</span>
                            </span>
                        </span>
                        <span class="folder__chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
                    </button>
                </h2>
                <div class="folder__panel" id="panel-${folder.id}" role="region" aria-labelledby="trigger-${folder.id}" ${folder.defaultOpen ? '' : 'hidden'}>
                    <div class="folder__items">
                        ${folder.items.map(item => `
                            <a class="folder-link" href="${item.href}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>
                                <span class="folder-link__main">
                                    <span class="folder-link__icon"><i class="${item.icon}" aria-hidden="true"></i></span>
                                    <span>${item.label}</span>
                                </span>
                                <i class="${item.external ? 'fas fa-arrow-up-right-from-square' : 'fas fa-arrow-right'}" aria-hidden="true"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </section>
        `).join('');

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

    } catch (error) {
        accordionContainer.innerHTML = `
            <section class="folder card is-open" data-folder>
                <h2 class="folder__heading">
                    <button class="folder__trigger" type="button" aria-expanded="true">
                        <span class="folder__label">
                            <span class="folder__icon"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i></span>
                            <span class="folder__title-group">
                                <span class="folder__title-row">
                                    <span class="folder__title">Directory unavailable</span>
                                </span>
                                <span class="folder__summary">Core routes are still available below.</span>
                            </span>
                        </span>
                    </button>
                </h2>
                <div class="folder__panel" role="region">
                    <div class="folder__items">
                        <a class="folder-link" href="/resume/">
                            <span class="folder-link__main">
                                <span class="folder-link__icon"><i class="fas fa-file-lines" aria-hidden="true"></i></span>
                                <span>Resume</span>
                            </span>
                            <i class="fas fa-arrow-right" aria-hidden="true"></i>
                        </a>
                        <a class="folder-link" href="mailto:contact@dictuzz.me">
                            <span class="folder-link__main">
                                <span class="folder-link__icon"><i class="fas fa-envelope" aria-hidden="true"></i></span>
                                <span>Email</span>
                            </span>
                            <i class="fas fa-arrow-right" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }
}

initFolders();

updateLocalTime();
window.setInterval(updateLocalTime, 1000);

