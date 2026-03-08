import { ThemeManager } from './ui-kit.js';

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeMeta = document.querySelector('meta[name="theme-color"]');

const heroKickerEl = document.getElementById('portfolio-hero-kicker');
const heroTitleEl = document.getElementById('portfolio-hero-title');
const heroIntroEl = document.getElementById('portfolio-hero-intro');
const heroNoteEl = document.getElementById('portfolio-hero-note');
const statsEl = document.getElementById('portfolio-stats');
const featuredGridEl = document.getElementById('portfolio-featured-grid');
const filtersEl = document.getElementById('portfolio-filters');
const gridEl = document.getElementById('portfolio-grid');
const galleryCaptionEl = document.getElementById('portfolio-gallery-caption');
const closingTitleEl = document.getElementById('portfolio-closing-title');
const closingCopyEl = document.getElementById('portfolio-closing-copy');
const closingActionsEl = document.getElementById('portfolio-closing-actions');

const state = {
    meta: null,
    projects: [],
    categories: [],
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

function getFilteredProjects() {
    if (state.activeFilter === 'All') {
        return state.projects;
    }

    return state.projects.filter((project) => project.category === state.activeFilter);
}

function renderHero() {
    if (!state.meta) {
        return;
    }

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
            <strong>${projectCount}<small>case studies</small></strong>
        </article>
        <article class="portfolio-stat">
            <strong>${categoryCount}<small>practice areas</small></strong>
        </article>
        <article class="portfolio-stat">
            <strong>${featuredCount}<small>featured projects</small></strong>
        </article>
    `;
}

function renderFeatured() {
    const featured = state.projects.filter((project) => project.featured).slice(0, 2);

    featuredGridEl.innerHTML = featured.map((project) => `
        <a class="portfolio-feature-card" href="/portfolio/${escapeHtml(project.slug)}/">
            <div class="portfolio-feature-card__media">
                <img src="${escapeHtml(project.heroImage || project.cardImage)}" alt="${escapeHtml(project.title)} featured image" loading="lazy">
            </div>
            <div class="portfolio-feature-card__body">
                <div class="portfolio-feature-card__eyebrow">
                    <span>${escapeHtml(project.category)}</span>
                    <span>${escapeHtml(project.year)}</span>
                </div>
                <h3 class="portfolio-feature-card__title">${escapeHtml(project.title)}</h3>
                <p class="portfolio-feature-card__summary">${escapeHtml(project.strapline)}</p>
                <div class="portfolio-feature-card__footer">
                    <span>${escapeHtml(project.client)}</span>
                    <span class="portfolio-feature-card__cta">Open Case Study <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
                </div>
            </div>
        </a>
    `).join('');
}

function renderFilters() {
    const filters = ['All', ...state.categories];

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

function renderGrid() {
    const filtered = getFilteredProjects();
    const countLabel = filtered.length === 1 ? 'project' : 'projects';
    galleryCaptionEl.textContent = `${filtered.length} ${countLabel} in view`;

    if (!filtered.length) {
        gridEl.innerHTML = `
            <article class="portfolio-empty">
                No projects match this category yet.
            </article>
        `;
        return;
    }

    gridEl.innerHTML = filtered.map((project) => `
        <a class="portfolio-tile" href="/portfolio/${escapeHtml(project.slug)}/">
            <div class="portfolio-tile__media">
                <img src="${escapeHtml(project.cardImage || project.heroImage)}" alt="${escapeHtml(project.title)} cover image" loading="lazy">
            </div>
            <div class="portfolio-tile__body">
                <div class="portfolio-tile__eyebrow">
                    <span>${escapeHtml(project.category)}</span>
                    <span>${escapeHtml(project.year)}</span>
                </div>
                <h3 class="portfolio-tile__title">${escapeHtml(project.title)}</h3>
                <p class="portfolio-tile__summary">${escapeHtml(project.summary)}</p>
                <div class="portfolio-tile__footer">
                    <span>${escapeHtml(project.status)}</span>
                    <span class="portfolio-tile__cta">Open <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
                </div>
            </div>
        </a>
    `).join('');
}

function renderClosing() {
    if (!state.meta) {
        return;
    }

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
    renderFeatured();
    renderFilters();
    renderGrid();
    renderClosing();
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
        renderAll();
    } catch (error) {
        console.error(error);
        featuredGridEl.innerHTML = '<article class="portfolio-empty">The portfolio preview could not be loaded right now.</article>';
        gridEl.innerHTML = '<article class="portfolio-empty">Please try again shortly.</article>';
    }
}

filtersEl?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) {
        return;
    }

    state.activeFilter = button.dataset.filter;
    renderFilters();
    renderGrid();
});

loadPortfolio();
