import { ThemeManager } from './ui-kit.js';

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const detailRoot = document.getElementById('portfolio-detail-root');
const slug = document.body.dataset.portfolioSlug;

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

function updateDocumentMeta(project) {
    document.title = `${project.title} | Benedictus Richard Ricardo`;

    const description = project.seoDescription || project.summary || '';
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');

    if (descriptionMeta) descriptionMeta.setAttribute('content', description);
    if (ogTitle) ogTitle.setAttribute('content', `${project.title} | Benedictus Richard Ricardo`);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (twitterTitle) twitterTitle.setAttribute('content', `${project.title} | Benedictus Richard Ricardo`);
    if (twitterDescription) twitterDescription.setAttribute('content', description);
}

function renderVideo(project) {
    const video = project.video || { type: 'placeholder' };

    if (video.type === 'embed' && video.url) {
        return `
            <div class="portfolio-detail-video__frame">
                <iframe src="${escapeHtml(video.url)}" title="${escapeHtml(project.title)} walkthrough" loading="lazy" allowfullscreen></iframe>
            </div>
        `;
    }

    if (video.type === 'file' && video.url) {
        const poster = video.poster ? ` poster="${escapeHtml(video.poster)}"` : '';
        return `
            <div class="portfolio-detail-video__frame">
                <video controls preload="metadata"${poster}>
                    <source src="${escapeHtml(video.url)}" type="${escapeHtml(video.mimeType || 'video/mp4')}">
                </video>
            </div>
        `;
    }

    return `
        <div class="portfolio-detail-video__placeholder">
            <span class="portfolio-detail-video__badge">
                <i class="fas fa-clapperboard" aria-hidden="true"></i>
                <span>${escapeHtml(video.label || 'Walkthrough slot ready')}</span>
            </span>
            <p class="portfolio-detail-video__note">${escapeHtml(video.note || 'A walkthrough can be added here when media is ready.')}</p>
        </div>
    `;
}

function renderRelated(project, projects) {
    const relatedProjects = (project.related || [])
        .map((relatedSlug) => projects.find((entry) => entry.slug === relatedSlug))
        .filter(Boolean);

    if (!relatedProjects.length) {
        return '';
    }

    return `
        <section class="portfolio-detail-related">
            <p class="portfolio-detail-kicker">Related Case Studies</p>
            <h2>Where this project connects next.</h2>
            <div class="portfolio-detail-related__grid">
                ${relatedProjects.map((related) => `
                    <a class="portfolio-related-card" href="/portfolio/${escapeHtml(related.slug)}/">
                        <div class="portfolio-related-card__media">
                            <img src="${escapeHtml(related.cardImage || related.heroImage)}" alt="${escapeHtml(related.title)} preview image" loading="lazy">
                        </div>
                        <div class="portfolio-related-card__body">
                            <span class="portfolio-related-card__eyebrow">${escapeHtml(related.category)}</span>
                            <h3 class="portfolio-related-card__title">${escapeHtml(related.title)}</h3>
                            <p class="portfolio-related-card__summary">${escapeHtml(related.summary)}</p>
                        </div>
                    </a>
                `).join('')}
            </div>
        </section>
    `;
}

function renderDetail(project, projects) {
    updateDocumentMeta(project);

    detailRoot.innerHTML = `
        <a class="portfolio-detail-back" href="/portfolio/">
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
            <span>Back to gallery</span>
        </a>

        <section class="portfolio-detail-hero">
            <div class="portfolio-detail-hero__copy">
                <p class="portfolio-detail-kicker">${escapeHtml(project.category)} / ${escapeHtml(project.year)}</p>
                <h1 class="portfolio-detail-title">${escapeHtml(project.title)}</h1>
                <p class="portfolio-detail-strapline">${escapeHtml(project.strapline)}</p>
            </div>
            <figure class="portfolio-detail-hero__media">
                <img src="${escapeHtml(project.heroImage || project.cardImage)}" alt="${escapeHtml(project.title)} hero image" loading="eager">
            </figure>
        </section>

        <section class="portfolio-detail-metrics" aria-label="Project metrics">
            ${(project.metrics || []).map((metric) => `
                <article class="portfolio-detail-metric">
                    <strong>${escapeHtml(metric.value)}</strong>
                    <span>${escapeHtml(metric.label)}</span>
                </article>
            `).join('')}
        </section>

        <section class="portfolio-detail-summary">
            <p class="portfolio-detail-kicker">Overview</p>
            <h2>${escapeHtml(project.summary)}</h2>
            <p>${escapeHtml(project.overview)}</p>
        </section>

        <section class="portfolio-detail-facts">
            <p class="portfolio-detail-kicker">Role and Scope</p>
            <div class="portfolio-detail-facts__grid">
                <dl class="portfolio-detail-fact">
                    <dt>Client</dt>
                    <dd>${escapeHtml(project.client)}</dd>
                </dl>
                <dl class="portfolio-detail-fact">
                    <dt>Location</dt>
                    <dd>${escapeHtml(project.location)}</dd>
                </dl>
                <dl class="portfolio-detail-fact">
                    <dt>Role</dt>
                    <dd>${escapeHtml(project.role)}</dd>
                </dl>
                <dl class="portfolio-detail-fact">
                    <dt>Timeframe</dt>
                    <dd>${escapeHtml(project.timeframe)}</dd>
                </dl>
            </div>
            <div class="portfolio-detail-chip-group">
                ${(project.scope || []).map((item) => `<span class="portfolio-detail-chip">${escapeHtml(item)}</span>`).join('')}
            </div>
            <div class="portfolio-detail-chip-group">
                ${(project.tools || []).map((item) => `<span class="portfolio-detail-chip">${escapeHtml(item)}</span>`).join('')}
            </div>
        </section>

        <section class="portfolio-detail-section portfolio-detail-section--split">
            <div>
                <p class="portfolio-detail-kicker">Challenge</p>
                <h2>The tension that needed to be resolved.</h2>
                <p>${escapeHtml(project.challenge)}</p>
            </div>
            <div>
                <p class="portfolio-detail-kicker">Approach</p>
                <h2>The design logic behind the solution.</h2>
                <p>${escapeHtml(project.approach)}</p>
            </div>
        </section>

        <section class="portfolio-detail-section">
            <p class="portfolio-detail-kicker">Solution</p>
            <h2>What the final system was built to do.</h2>
            <p>${escapeHtml(project.solution)}</p>
        </section>

        <section class="portfolio-detail-section portfolio-detail-section--split">
            <div>
                <p class="portfolio-detail-kicker">Services</p>
                <div class="portfolio-detail-chip-group">
                    ${(project.services || []).map((item) => `<span class="portfolio-detail-chip">${escapeHtml(item)}</span>`).join('')}
                </div>
            </div>
            <div>
                <p class="portfolio-detail-kicker">Outcomes</p>
                <div class="portfolio-detail-chip-group">
                    ${(project.outcomes || []).map((item) => `<span class="portfolio-detail-chip">${escapeHtml(item)}</span>`).join('')}
                </div>
            </div>
        </section>

        <section class="portfolio-detail-gallery">
            <p class="portfolio-detail-kicker">Visual Gallery</p>
            <div class="portfolio-detail-gallery__grid">
                ${(project.gallery || []).map((image) => `
                    <figure class="portfolio-detail-gallery__item">
                        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy">
                        <figcaption class="portfolio-detail-gallery__caption">${escapeHtml(image.caption)}</figcaption>
                    </figure>
                `).join('')}
            </div>
        </section>

        <section class="portfolio-detail-video">
            <p class="portfolio-detail-kicker">Walkthrough</p>
            ${renderVideo(project)}
        </section>

        <section class="portfolio-detail-quote">
            <p class="portfolio-detail-kicker">Client Perspective</p>
            <blockquote>${escapeHtml(project.quote?.text || '')}</blockquote>
            <cite>${escapeHtml(project.quote?.author || '')} / ${escapeHtml(project.quote?.role || '')}</cite>
        </section>

        ${renderRelated(project, projects)}
    `;
}

async function loadPortfolioDetail() {
    try {
        const response = await fetch('/data/portfolio.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Portfolio data failed to load: ${response.status}`);
        }

        const payload = await response.json();
        const projects = payload.projects || [];
        const project = projects.find((entry) => entry.slug === slug);

        if (!project) {
            detailRoot.innerHTML = '<article class="portfolio-detail-empty">This case study could not be found.</article>';
            return;
        }

        renderDetail(project, projects);
    } catch (error) {
        console.error(error);
        detailRoot.innerHTML = '<article class="portfolio-detail-empty">The case study is unavailable right now. Please try again shortly.</article>';
    }
}

loadPortfolioDetail();
