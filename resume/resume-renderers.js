function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/[&<>"']/g, (match) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match]));
}

function reobserveAll(container) {
    if (typeof window.__resumeRevealObserver !== 'undefined') {
        container.querySelectorAll('.reveal').forEach((element) => window.__resumeRevealObserver.observe(element));
    }
}

function renderSection(selector, data, templateFn) {
    const container = $(selector);
    if (!container || !Array.isArray(data)) return;
    container.innerHTML = data.map(templateFn).join('');
    reobserveAll(container);
}

export function applyTranslations(translations) {
    $$('[data-i18n]').forEach((element) => {
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
            ${item.url ? `<p class="edu-card__focus"><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Verify credential</a></p>` : ''}
        </div>
    `);
}

export function renderTestimonials(items) {
    renderSection('#testimonials-list', items, (item) => `
        <article class="testimonial-card glass card reveal">
            <p class="testimonial-card__mark" aria-hidden="true">“</p>
            <blockquote class="testimonial-card__quote">${escapeHtml(item.quote)}</blockquote>
            <p class="testimonial-card__meta">${escapeHtml(item.author)} · ${escapeHtml(item.role)}</p>
            ${item.linkedin ? `<p class="testimonial-card__link"><a href="${escapeHtml(item.linkedin)}" target="_blank" rel="noopener">LinkedIn profile</a></p>` : ''}
        </article>
    `);
}

export function renderList(selector, items) {
    renderSection(selector, items, (item) => `<li>${escapeHtml(item)}</li>`);
}

export function renderSkills(collections, translations) {
    const categories = [
        { key: 'strategic', id: '#skills-strategic' },
        { key: 'operational', id: '#skills-operational' },
        { key: 'analytical', id: '#skills-analytical' },
        { key: 'leadership', id: '#skills-leadership' }
    ];

    categories.forEach(({ key, id }) => {
        renderSection(id, collections.skills[key], (skill) => `<span class="tag">${escapeHtml(skill.name)}</span>`);
    });

    renderSection('#skills-languages', collections.languages, (item) => `<span class="tag">${escapeHtml(item.label)}</span>`);

    const labels = {
        strategic: translations.skills.strategic,
        operational: translations.skills.operational,
        analytical: translations.skills.analytical,
        leadership: translations.skills.leadership,
        languages: translations.skills.languages
    };

    Object.entries(labels).forEach(([key, value]) => {
        const heading = document.querySelector(`[data-skill-heading="${key}"]`);
        if (heading) heading.textContent = value;
    });
}

export function renderConnectSection(siteConfig, translations, content) {
    const scheduleLink = $('#connect-schedule-link');
    const whatsappLink = $('#connect-whatsapp-link');
    const emailLink = $('#connect-email-link');
    const linkedinLink = $('#connect-linkedin-link');
    const instagramLink = $('#connect-instagram-link');
    const githubLink = $('#connect-github-link');
    const downloadLink = $('#download-cv-link');
    const status = $('#hero-status-text');
    const heroRole = $('.hero__role [data-i18n="hero.role"]');
    const subtitle = $('.hero__subtitle');
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
        downloadLink.setAttribute('rel', 'noopener');
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
