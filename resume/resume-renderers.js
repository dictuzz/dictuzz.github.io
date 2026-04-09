import { escapeHtml } from '../js/site-renderers.js';
import { resumeState } from './resume-state.js';


function reobserveAll(container) {
    if (resumeState.revealObserver) {
        container.querySelectorAll('.reveal, .stagger').forEach((element) => resumeState.revealObserver.observe(element));
    }
}

function renderSection(selector, data, templateFn) {
    const container = document.querySelector(selector);
    if (!container || !Array.isArray(data)) return;
    container.innerHTML = data.map(templateFn).join('');
    reobserveAll(container);
}

export function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        const value = key?.split('.').reduce((current, part) => current?.[part], translations);
        if (typeof value === 'string') {
            element.textContent = value;
        }
    });
}

export function renderExperience(items) {
    const sorted = [...items].sort((left, right) => {
        const toEndDate = (item) => {
            if (!item.date) return new Date();
            if (/present|sekarang|heute/i.test(item.date)) return new Date();
            const parts = item.date.replace(/–/g, '-').split('-');
            return parts.length > 1 ? new Date(parts[1].trim()) : new Date();
        };
        return toEndDate(right) - toEndDate(left);
    });

    renderSection('.timeline', sorted, (job) => `
        <div class="timeline__item reveal">
            <div class="timeline__date">${escapeHtml(job.date)}</div>
            <div class="timeline__content glass card">
                <h3>${escapeHtml(job.role)}</h3>
                <h4>${escapeHtml(job.company)}</h4>
                <ul class="timeline__details">
                    ${(job.details || []).map((detail) => `<li>${escapeHtml(detail)}</li>`).join('')}
                </ul>
            </div>
        </div>
    `);
}

export function renderEducation(items) {
    renderSection('#education-list', items, (item) => `
        <div class="edu-card glass glass--hover card reveal">
            <h3>${escapeHtml(item.name)}</h3>
            <p class="edu-card__degree">${escapeHtml(item.degree)}</p>
            <p class="edu-card__date">${escapeHtml(item.date)}</p>
            ${item.focus ? `<p class="edu-card__focus">${escapeHtml(item.focus)}</p>` : ''}
        </div>
    `);
}

export function renderImpact(items) {
    renderSection('.impact__list', items, (item) => `
        <div class="project-card glass glass--hover card reveal">
            <h3 class="project-card__title">${escapeHtml(item.title)}</h3>
            <p class="project-card__desc">${escapeHtml(item.desc)}</p>
        </div>
    `);
}

export function renderCertifications(items) {
    renderSection('#certifications-list', items, (item) => `
        <div class="edu-card glass glass--hover card reveal">
            <h3>${escapeHtml(item.name)}</h3>
            ${item.issuer ? `<p class="edu-card__degree">${escapeHtml(item.issuer)}</p>` : ''}
            ${item.year ? `<p class="edu-card__date">${escapeHtml(item.year)}</p>` : ''}
            ${item.url ? `<p class="edu-card__focus"><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Verify credential</a></p>` : ''}
        </div>
    `);
}

export function renderTestimonials(items) {
    renderSection('#testimonials-list', items, (item) => `
        <article class="testimonial-card glass card reveal">
            <p class="testimonial-card__mark" aria-hidden="true">“</p>
            <blockquote class="testimonial-card__quote">${escapeHtml(item.quote)}</blockquote>
            <p class="testimonial-card__meta">${escapeHtml(item.author)} · ${escapeHtml(item.role)}</p>
            ${item.linkedin ? `<p class="testimonial-card__link"><a href="${escapeHtml(item.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn profile</a></p>` : ''}
        </article>
    `);
}

export function renderList(selector, items) {
    renderSection(selector, items, (item) => `<li>${escapeHtml(item)}</li>`);
}

export function renderSkills(collections, translations) {
    const container = document.getElementById('skills-dynamic-container');
    if (!container) return;
    
    // Clear in case of re-renders
    container.innerHTML = '';

    // Iterate over all skills dynamically without hardcoded keys
    Object.entries(collections.skills).forEach(([key, items]) => {
        const title = translations.skills[key] || key;
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skills__category reveal';
        categoryDiv.innerHTML = `
            <h3 data-skill-heading="${escapeHtml(key)}">${escapeHtml(title)}</h3>
            <div class="tags stagger" id="skills-${escapeHtml(key)}"></div>
        `;
        container.appendChild(categoryDiv);

        renderSection(`#skills-${escapeHtml(key)}`, items, (skill) => `<span class="tag">${escapeHtml(skill.name)}</span>`);
    });

    // Special category for languages
    if (collections.languages) {
        const langTitle = translations.skills.languages || 'Languages';
        const langDiv = document.createElement('div');
        langDiv.className = 'skills__category reveal';
        langDiv.innerHTML = `
            <h3 data-skill-heading="languages">${escapeHtml(langTitle)}</h3>
            <div class="tags stagger" id="skills-languages"></div>
        `;
        container.appendChild(langDiv);

        renderSection('#skills-languages', collections.languages, (item) => `<span class="tag">${escapeHtml(item.label)}</span>`);
    }

    reobserveAll(container);
}

export function renderConnectSection(siteConfig, translations, content) {
    const scheduleLink = document.querySelector('#connect-schedule-link');
    const whatsappLink = document.querySelector('#connect-whatsapp-link');
    const emailLink = document.querySelector('#connect-email-link');
    const linkedinLink = document.querySelector('#connect-linkedin-link');
    const instagramLink = document.querySelector('#connect-instagram-link');
    const githubLink = document.querySelector('#connect-github-link');
    const downloadLink = document.querySelector('#download-cv-link');
    const status = document.querySelector('#hero-status-text');
    const heroRole = document.querySelector('.hero__role [data-i18n="hero.role"]');
    const subtitle = document.querySelector('.hero__subtitle');
    const heroNameLines = document.querySelectorAll('.hero__name-line');

    if (scheduleLink) scheduleLink.href = siteConfig.contact.calendarUrl;
    if (whatsappLink) whatsappLink.href = siteConfig.contact.whatsappUrl;
    if (emailLink) emailLink.href = `mailto:${siteConfig.contact.email}`;
    if (linkedinLink) linkedinLink.href = siteConfig.socials.find((entry) => entry.id === 'linkedin')?.url || '#';
    if (instagramLink) instagramLink.href = siteConfig.socials.find((entry) => entry.id === 'instagram')?.url || '#';
    if (githubLink) githubLink.href = siteConfig.socials.find((entry) => entry.id === 'github')?.url || '#';
    if (downloadLink) {
        downloadLink.href = content.downloads.resumeUrl;
        downloadLink.setAttribute('target', '_blank');
        downloadLink.setAttribute('rel', 'noopener noreferrer');
    }
    if (status) status.textContent = translations.hero.status;
    if (heroRole) heroRole.textContent = translations.hero.role;
    if (subtitle) subtitle.textContent = translations.hero.subtitle;
    if (heroNameLines.length === 3) {
        const [first = '', middle = '', last = ''] = siteConfig.profile.name.toUpperCase().split(' ');
        heroNameLines[0].textContent = first;
        heroNameLines[1].textContent = middle;
        heroNameLines[2].textContent = last;
    }
}
