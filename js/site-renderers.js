import { toAbsoluteUrl } from './site-content.js';

export function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/[&<>"']/g, (match) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[match]));
}

export function renderFoldersMarkup(folders) {
    return folders.map((folder) => `
        <section class="folder card" data-folder>
            <h2 class="folder__heading">
                <button class="folder__trigger" type="button" aria-expanded="${folder.defaultOpen ? 'true' : 'false'}" aria-controls="panel-${escapeHtml(folder.id)}" id="trigger-${escapeHtml(folder.id)}">
                    <span class="folder__label">
                        <span class="folder__icon"><i class="${escapeHtml(folder.icon)}"></i></span>
                        <span class="folder__title-group">
                            <span class="folder__title-row">
                                <span class="folder__title">${escapeHtml(folder.title)}</span>
                                <span class="folder__count">${folder.items.length}</span>
                            </span>
                            <span class="folder__summary">${escapeHtml(folder.summary || '')}</span>
                        </span>
                    </span>
                    <span class="folder__chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
                </button>
            </h2>
            <div class="folder__panel" id="panel-${escapeHtml(folder.id)}" role="region" aria-labelledby="trigger-${escapeHtml(folder.id)}" ${folder.defaultOpen ? '' : 'hidden'}>
                <div class="folder__items">
                    ${folder.items.map((item) => `
                        <a class="folder-link" href="${escapeHtml(item.href)}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>
                            <span class="folder-link__main">
                                <span class="folder-link__icon"><i class="${escapeHtml(item.icon)}" aria-hidden="true"></i></span>
                                <span>${escapeHtml(item.label)}</span>
                            </span>
                            <i class="${item.external ? 'fas fa-arrow-up-right-from-square' : 'fas fa-arrow-right'}" aria-hidden="true"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
        </section>
    `).join('');
}

export function renderDirectoryUnavailableMarkup() {
    return `
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

export function createFooterViewModel(siteConfig, currentPath = window.location.pathname) {
    const footerNav = siteConfig.navigation.footer.map((entry) => ({
        ...entry,
        current: currentPath === entry.href
    }));

    return {
        navigation: footerNav,
        contacts: [
            {
                href: `mailto:${siteConfig.contact.email}`,
                icon: 'fas fa-envelope',
                label: siteConfig.contact.email,
                ariaLabel: 'Email Me'
            },
            {
                href: siteConfig.contact.whatsappUrl,
                icon: 'fab fa-whatsapp',
                label: siteConfig.contact.whatsappLabel,
                ariaLabel: 'WhatsApp',
                external: true
            },
            {
                href: '/terms/',
                icon: 'fas fa-file-contract',
                label: 'Terms',
                current: currentPath === '/terms/'
            }
        ],
        copyright: `© ${new Date().getFullYear()} ${siteConfig.profile.name}. All rights reserved.`,
        motto: siteConfig.profile.motto
    };
}

export function renderFooterMarkup(viewModel) {
    return `
        <nav class="global-footer__nav" aria-label="Global navigation">
            ${viewModel.navigation.map((entry) => `
                <a href="${entry.href}" class="global-footer__link" ${entry.current ? 'aria-current="page"' : ''}>${escapeHtml(entry.label)}</a>
            `).join('')}
        </nav>
        <div class="global-footer__contacts">
            ${viewModel.contacts.map((entry, index) => `
                ${index > 0 ? '<span class="global-footer__divider">&bull;</span>' : ''}
                <a href="${entry.href}" class="global-footer__contact-link" ${entry.external ? 'target="_blank" rel="noopener"' : ''} ${entry.current ? 'aria-current="page"' : ''} aria-label="${escapeHtml(entry.ariaLabel || entry.label)}"><i class="${entry.icon}"></i> ${escapeHtml(entry.label)}</a>
            `).join('')}
        </div>
        <p class="global-footer__copy">
            ${escapeHtml(viewModel.copyright)}
            <span>${escapeHtml(viewModel.motto)}</span>
        </p>
    `;
}

export function applyGlobalFooter(siteConfig, footerElement = document.querySelector('.global-footer'), currentPath) {
    if (!footerElement) return;
    footerElement.innerHTML = renderFooterMarkup(createFooterViewModel(siteConfig, currentPath));
}
