import { ThemeManager } from './ui-kit.js';

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeMeta = document.querySelector('meta[name="theme-color"]');

const heroKickerEl = document.getElementById('portfolio-hero-kicker');
const heroTitleEl = document.getElementById('portfolio-hero-title');
const heroIntroEl = document.getElementById('portfolio-hero-intro');
const heroNoteEl = document.getElementById('portfolio-hero-note');
const statsEl = document.getElementById('portfolio-stats');
const tabsEl = document.getElementById('portfolio-tabs');
const filtersEl = document.getElementById('portfolio-filters');
const listEl = document.getElementById('portfolio-case-list');
const galleryCaptionEl = document.getElementById('portfolio-gallery-caption');
const closingTitleEl = document.getElementById('portfolio-closing-title');
const closingCopyEl = document.getElementById('portfolio-closing-copy');
const closingActionsEl = document.getElementById('portfolio-closing-actions');

const primaryTabs = [
    { id: 'archive', label: 'All Cases' },
    { id: 'lead', label: 'Lead Dossiers' },
    { id: 'recent', label: 'Recent Years' }
];

const state = {
    meta: null,
    projects: [],
    categories: [],
    years: [],
    activeTab: 'archive',
    activeFilter: 'All'
};

const themeManager = new ThemeManager({
    toggleElement: themeToggle,
    iconElement: themeIcon,
    defaultTheme: 'light',
    storageKey: 'dictuzz-theme'
});

function updateThemeColor(theme) {
    if (!themeMeta) return;
    themeMeta.setAttribute('content', theme === 'dark' ? '#121820' : '#f5efe4');
}

updateThemeColor(themeManager.getMode());
window.addEventListener('theme-changed', (event) => {
    updateThemeColor(event.detail?.theme || 'light');
});

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getProjectsForTab() {
    if (state.activeTab === 'lead') {
        return state.projects.filter((project) => project.featured);
    }

    if (state.activeTab === 'recent') {
        return [...state.projects].sort((a, b) => {
            const yearA = Number(a.year) || 0;
            const yearB = Number(b.year) || 0;
            return yearB - yearA || (a.order || 0) - (b.order || 0);
        });
    }

    return [...state.projects].sort((a, b) => Number(b.featured) - Number(a.featured) || (a.order || 0) - (b.order || 0));
}

function getSecondaryFilters() {
    if (state.activeTab === 'recent') {
        return ['All', ...state.years];
    }

    return ['All', ...state.categories];
}

function getFilteredProjects() {
    const tabbed = getProjectsForTab();

    if (state.activeFilter === 'All') {
        return tabbed;
    }

    if (state.activeTab === 'recent') {
        return tabbed.filter((project) => project.year === state.activeFilter);
    }

    return tabbed.filter((project) => project.category === state.activeFilter);
}

function renderHero() {
    if (!state.meta) return;

    heroKickerEl.textContent = state.meta.heroKicker || '';
    heroTitleEl.textContent = state.meta.heroTitle || '';
    heroIntroEl.textContent = state.meta.heroIntro || '';
    heroNoteEl.textContent = state.meta.heroNote || '';
}

function renderStats() {
    const projectCount = state.projects.length;
    const categoryCount = state.categories.length;
    const featuredCount = state.projects.filter((project) => project.featured).length;

    statsEl.innerHTML = `
        <article class="portfolio-stat">
            <span class="portfolio-stat__value">${projectCount}</span>
            <span class="portfolio-stat__label">curated cases</span>
        </article>
        <article class="portfolio-stat">
            <span class="portfolio-stat__value">${categoryCount}</span>
            <span class="portfolio-stat__label">practice tracks</span>
        </article>
        <article class="portfolio-stat">
            <span class="portfolio-stat__value">${featuredCount}</span>
            <span class="portfolio-stat__label">lead dossiers</span>
        </article>
    `;
}

function renderTabs() {
    tabsEl.innerHTML = primaryTabs.map((tab) => `
        <button
            class="portfolio-tab${tab.id === state.activeTab ? ' is-active' : ''}"
            type="button"
            data-tab="${tab.id}"
            aria-pressed="${tab.id === state.activeTab ? 'true' : 'false'}"
        >
            ${escapeHtml(tab.label)}
        </button>
    `).join('');
}

function renderFilters() {
    const filters = getSecondaryFilters();

    filtersEl.innerHTML = filters.map((filter) => `
        <button
            class="portfolio-filter${filter === state.activeFilter ? ' is-active' : ''}"
            type="button"
            data-filter="${escapeHtml(filter)}"
            aria-pressed="${filter === state.activeFilter ? 'true' : 'false'}"
        >
            ${escapeHtml(filter)}
        </button>
    `).join('');
}

function applyRowReveal() {
    const rows = listEl.querySelectorAll('.portfolio-case');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
        rows.forEach((row) => row.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    rows.forEach((row, index) => {
        row.style.setProperty('--row-delay', `${Math.min(index * 35, 240)}ms`);
        observer.observe(row);
    });
}

function renderList() {
    const filtered = getFilteredProjects();
    const countLabel = filtered.length === 1 ? 'case' : 'cases';
    const activeTabLabel = primaryTabs.find((tab) => tab.id === state.activeTab)?.label || 'All Cases';
    galleryCaptionEl.textContent = `${filtered.length} ${countLabel} in ${activeTabLabel}`;

    if (!filtered.length) {
        listEl.innerHTML = `
            <article class="portfolio-empty">
                No dossiers match this archive selection right now.
            </article>
        `;
        return;
    }

    listEl.innerHTML = filtered.map((project, index) => {
        const isLead = project.featured && state.activeFilter === 'All' && index < 2;
        const caseNumber = `Case ${String(project.order || index + 1).padStart(2, '0')}`;
        const summary = project.summary || '';
        const oneLineSummary = summary.includes('. ')
            ? `${summary.split('. ')[0].trim().replace(/\.$/, '')}.`
            : summary;
        const trustSignals = [project.cardRole || project.role, project.client, project.timeframe].filter(Boolean);
        const footerMeta = [project.location, project.status].filter(Boolean).join(' / ');

        return `
            <article class="portfolio-case${isLead ? ' portfolio-case--lead' : ''}">
                <a class="portfolio-case__media" href="/portfolio/${escapeHtml(project.slug)}/" aria-label="Open ${escapeHtml(project.title)} dossier">
                    <img src="${escapeHtml(project.cardImage || project.heroImage)}" alt="${escapeHtml(project.title)} cover image" loading="lazy">
                </a>
                <div class="portfolio-case__body">
                    <div class="portfolio-case__eyebrow">
                        <span class="portfolio-case__case">${escapeHtml(caseNumber)}</span>
                        <span>${escapeHtml(project.category || '')}</span>
                        <span>${escapeHtml(project.year || '')}</span>
                    </div>
                    <h3 class="portfolio-case__title">${escapeHtml(project.title || '')}</h3>
                    <p class="portfolio-case__summary">${escapeHtml(isLead ? (project.strapline || oneLineSummary) : oneLineSummary)}</p>
                    <p class="portfolio-case__role">${escapeHtml(project.cardRole || project.role || '')}</p>
                    <p class="portfolio-case__signals">${trustSignals.map((signal) => `<span>${escapeHtml(signal)}</span>`).join('')}</p>
                    <div class="portfolio-case__footer">
                        <p class="portfolio-case__note">${escapeHtml(footerMeta || 'Structured dossier available')}</p>
                        <a class="portfolio-case__cta" href="/portfolio/${escapeHtml(project.slug)}/">
                            <span>Open dossier</span>
                            <i class="fas fa-arrow-right" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    applyRowReveal();
}

function renderClosing() {
    if (!state.meta) return;

    closingTitleEl.textContent = state.meta.closingTitle || '';
    closingCopyEl.textContent = state.meta.closingCopy || '';

    const actions = [state.meta.closingPrimary, state.meta.closingSecondary]
        .filter(Boolean)
        .map((action, index) => {
            const classes = index === 0 ? 'button' : 'button button--ghost';
            const external = /^https?:/i.test(action.url);
            return `<a class="${classes}" href="${escapeHtml(action.url)}"${external ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(action.label)}</a>`;
        });

    closingActionsEl.innerHTML = actions.join('');
}

function renderAll() {
    renderHero();
    renderStats();
    renderTabs();
    renderFilters();
    renderList();
    renderClosing();
}

function setupReveal() {
    const items = document.querySelectorAll('.portfolio-reveal');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
        });
    }, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' });

    items.forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${index * 60}ms`);
        observer.observe(item);
    });
}

async function loadPortfolio() {
    try {
        const response = await fetch('/data/portfolio.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Portfolio data failed to load: ${response.status}`);
        }

        const payload = await response.json();
        state.meta = payload.meta || {};
        state.projects = [...(payload.projects || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
        state.categories = [...new Set(state.projects.map((project) => project.category).filter(Boolean))];
        state.years = [...new Set(state.projects.map((project) => project.year).filter(Boolean))]
            .sort((a, b) => Number(b) - Number(a));
        renderAll();
        setupReveal();
    } catch (error) {
        console.error(error);
        listEl.innerHTML = '<article class="portfolio-empty">The portfolio could not be loaded right now.</article>';
    }
}

tabsEl?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tab]');
    if (!button) return;

    state.activeTab = button.dataset.tab;
    state.activeFilter = 'All';
    renderTabs();
    renderFilters();
    renderList();
});

filtersEl?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;

    state.activeFilter = button.dataset.filter;
    renderFilters();
    renderList();
});

loadPortfolio();