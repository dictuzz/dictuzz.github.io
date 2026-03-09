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
    const video = project.video || { type: 'standby' };

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
        <div class="portfolio-detail-video__standby">
            <span class="portfolio-detail-video__badge">
                <i class="fas fa-clapperboard" aria-hidden="true"></i>
                <span>${escapeHtml(video.label || 'Walkthrough sequence queued')}</span>
            </span>
            <p class="portfolio-detail-video__note">${escapeHtml(video.note || 'A narrated walkthrough can be slotted in here once media is finalized.')}</p>
        </div>
    `;
}

function renderFactItem(label, value) {
    return `
        <dl class="portfolio-detail-fact">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value || 'N/A')}</dd>
        </dl>
    `;
}

function renderListBlock(title, items = []) {
    if (!items.length) return '';

    return `
        <div class="portfolio-detail-list">
            <h3>${escapeHtml(title)}</h3>
            <ul>
                ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
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
        <section class="portfolio-detail-related portfolio-reveal">
            <p class="portfolio-detail-kicker">Related Cases</p>
            <h2>Adjacent dossiers worth reviewing next.</h2>
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

function applyReveal() {
    const blocks = detailRoot.querySelectorAll('.portfolio-reveal');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
        blocks.forEach((block) => block.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

    blocks.forEach((block, index) => {
        block.style.setProperty('--reveal-delay', `${Math.min(index * 55, 220)}ms`);
        observer.observe(block);
    });
}

function renderDetail(project, projects) {
    updateDocumentMeta(project);
    const caseNumber = `Case ${String(project.order || 0).padStart(2, '0')}`;
    const topLine = [project.category, project.year].filter(Boolean).join(' / ');

    detailRoot.innerHTML = `
        <a class="portfolio-detail-back portfolio-reveal" href="/portfolio/">
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
            <span>Back to portfolio</span>
        </a>

        <section class="portfolio-detail-hero portfolio-reveal">
            <figure class="portfolio-detail-hero__media">
                <img src="${escapeHtml(project.heroImage || project.cardImage)}" alt="${escapeHtml(project.title)} hero image" loading="eager">
            </figure>
            <div class="portfolio-detail-hero__copy">
                <p class="portfolio-detail-kicker">${escapeHtml(caseNumber)} / ${escapeHtml(topLine)}</p>
                <h1 class="portfolio-detail-title">${escapeHtml(project.title)}</h1>
                <p class="portfolio-detail-strapline">${escapeHtml(project.strapline || '')}</p>
                <p class="portfolio-detail-summaryline">${escapeHtml(project.summary || '')}</p>
                <dl class="portfolio-detail-identity">
                    <div class="portfolio-detail-identity__item">
                        <dt>Role</dt>
                        <dd>${escapeHtml(project.role)}</dd>
                    </div>
                    <div class="portfolio-detail-identity__item">
                        <dt>Client or Context</dt>
                        <dd>${escapeHtml(project.client)}</dd>
                    </div>
                    <div class="portfolio-detail-identity__item">
                        <dt>Timeframe</dt>
                        <dd>${escapeHtml(project.timeframe)}</dd>
                    </div>
                    <div class="portfolio-detail-identity__item">
                        <dt>Location</dt>
                        <dd>${escapeHtml(project.location)}</dd>
                    </div>
                </dl>
            </div>
        </section>

        <section class="portfolio-detail-evidence portfolio-reveal" aria-label="Project evidence">
            ${(project.metrics || []).map((metric) => `
                <article class="portfolio-detail-metric">
                    <strong>${escapeHtml(metric.value)}</strong>
                    <span>${escapeHtml(metric.label)}</span>
                </article>
            `).join('')}
        </section>

        <section class="portfolio-detail-dossier portfolio-reveal">
            <article class="portfolio-detail-block portfolio-detail-block--wide">
                <p class="portfolio-detail-kicker">Overview</p>
                <h2>What this engagement was built to change.</h2>
                <p>${escapeHtml(project.overview)}</p>
            </article>
            <article class="portfolio-detail-block">
                <p class="portfolio-detail-kicker">Challenge</p>
                <h2>The operating pressure at the start.</h2>
                <p>${escapeHtml(project.challenge)}</p>
            </article>
            <article class="portfolio-detail-block">
                <p class="portfolio-detail-kicker">Approach</p>
                <h2>How the work was sequenced and led.</h2>
                <p>${escapeHtml(project.approach)}</p>
            </article>
            <article class="portfolio-detail-block portfolio-detail-block--wide">
                <p class="portfolio-detail-kicker">Solution</p>
                <h2>What the final operating design delivered.</h2>
                <p>${escapeHtml(project.solution)}</p>
            </article>
        </section>

        <section class="portfolio-detail-ledger portfolio-reveal">
            <div class="portfolio-detail-ledger__intro">
                <p class="portfolio-detail-kicker">Identity Facts</p>
                <h2>Compact dossier metadata for faster evaluation.</h2>
            </div>
            <div class="portfolio-detail-ledger__grid">
                <div class="portfolio-detail-facts">
                    ${renderFactItem('Project type', project.category)}
                    ${renderFactItem('Status', project.status)}
                    ${renderFactItem('Primary role', project.role)}
                    ${renderFactItem('Delivery window', project.timeframe)}
                    ${renderFactItem('Location', project.location)}
                </div>
                <div class="portfolio-detail-lists">
                    ${renderListBlock('Scope', project.scope)}
                    ${renderListBlock('Services', project.services)}
                    ${renderListBlock('Tools', project.tools)}
                </div>
            </div>
        </section>

        <section class="portfolio-detail-outcomes portfolio-reveal">
            <div>
                <p class="portfolio-detail-kicker">Outcomes</p>
                <h2>Evidence of what improved after implementation.</h2>
            </div>
            <div class="portfolio-detail-outcomes__grid">
                <ul>
                    ${(project.outcomes || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
                ${project.quote ? `
                    <figure class="portfolio-detail-quote">
                        <blockquote>${escapeHtml(project.quote.text)}</blockquote>
                        <figcaption class="portfolio-detail-quote-source">${escapeHtml(project.quote.author)} / ${escapeHtml(project.quote.role)}</figcaption>
                    </figure>
                ` : ''}
            </div>
        </section>

        <section class="portfolio-detail-gallery portfolio-reveal">
            <p class="portfolio-detail-kicker">Media Gallery</p>
            <h2>Supporting visuals from the engagement.</h2>
            <div class="portfolio-detail-gallery__grid">
                ${(project.gallery || []).map((image) => `
                    <figure class="portfolio-detail-gallery__item">
                        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy">
                        <figcaption class="portfolio-detail-gallery__caption">${escapeHtml(image.caption)}</figcaption>
                    </figure>
                `).join('')}
            </div>
        </section>

        <section class="portfolio-detail-video portfolio-reveal">
            <p class="portfolio-detail-kicker">Walkthrough</p>
            <h2>Narrated sequence and implementation walkthrough.</h2>
            ${renderVideo(project)}
        </section>

        ${renderRelated(project, projects)}
    `;

    applyReveal();
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