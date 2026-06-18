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

export function renderExperience(items, selector = '#experience .timeline') {
    const sorted = [...items].sort((left, right) => {
        const toEndDate = (item) => {
            if (!item.date) return new Date();
            if (/present|sekarang|heute/i.test(item.date)) return new Date();
            const parts = item.date.replace(/–/g, '-').split('-');
            return parts.length > 1 ? new Date(parts[1].trim()) : new Date();
        };
        return toEndDate(right) - toEndDate(left);
    });

    renderSection(selector, sorted, (job) => `
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
    const heroDownloadLink = document.querySelector('#hero-download-cv-link');
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
    
    // Setup ATS CV download button
    if (downloadLink) {
        downloadLink.href = '#';
        downloadLink.removeAttribute('target');
        downloadLink.removeAttribute('rel');
        downloadLink.onclick = (e) => {
            e.preventDefault();
            generateATSResume(content, translations, siteConfig);
        };
        const cvText = downloadLink.querySelector('[data-i18n="connect.cv"]');
        if (cvText && translations.connect && translations.connect.cv) {
            cvText.textContent = translations.connect.cv;
        }
    }
    // Setup Hero ATS CV download button
    if (heroDownloadLink) {
        heroDownloadLink.href = '#';
        heroDownloadLink.onclick = (e) => {
            e.preventDefault();
            generateATSResume(content, translations, siteConfig);
        };
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

export function generateATSResume(content, translations, siteConfig) {
    const lang = content.locale || 'en';
    const name = siteConfig.profile.name || "Benedictus Richard Ricardo";
    const email = siteConfig.contact.email || "contact@dictuzz.me";
    const website = siteConfig.site.siteUrl || "https://dictuzz.me";
    const whatsappUrl = siteConfig.contact.whatsappUrl || "";
    let phone = "(+62) 851-8688-8630";
    if (whatsappUrl.includes('wa.me/')) {
        const num = whatsappUrl.split('wa.me/')[1];
        if (num && num.length > 9) {
            phone = `(+${num.substring(0,2)}) ${num.substring(2,5)}-${num.substring(5,9)}-${num.substring(9)}`;
        }
    }

    const t = translations.section || {}; 
    const heroRole = translations.hero?.role || content.strings?.hero?.role || '';
    const summaryText = content.sections?.summary?.text || '';

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${name} — Resume</title>
<style>
  body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #000; max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
  h1 { font-size: 22pt; margin: 0 0 4px; }
  h2 { font-size: 13pt; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 18px 0 8px; text-transform: uppercase; }
  h3 { font-size: 11pt; margin: 8px 0 2px; }
  p, li { margin: 2px 0; }
  ul { padding-left: 20px; }
  .contact { font-size: 10pt; color: #333; }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-date { font-style: italic; font-size: 10pt; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<h1>${name}</h1>
<p class="contact">${email} · ${website} · ${phone}</p>
<p><em>${heroRole}</em></p>
<p>${summaryText}</p>

<h2>${t.experience || 'WORK EXPERIENCE'}</h2>
${(content.sections.experience || []).map(e => `
<div class="entry">
  <div class="entry-header"><h3>${e.role} — ${e.company}</h3><span class="entry-date">${e.date}</span></div>
  <ul>${(e.details || []).map(b => `<li>${b}</li>`).join('')}</ul>
</div>`).join('')}

<h2>${t.education || 'EDUCATION'}</h2>
${(content.sections.education || []).map(e => `
<div class="entry">
  <div class="entry-header"><h3>${e.name} — ${e.degree}</h3><span class="entry-date">${e.date}</span></div>
  <ul><li>${e.focus}</li></ul>
</div>`).join('')}

<h2>${t.impact || 'IMPACT'}</h2>
${(content.sections.impact || []).map(i => `
<div class="entry">
  <h3>${i.title}</h3>
  <p>${i.desc}</p>
</div>`).join('')}

<h2>${t.volunteering || 'VOLUNTEERING & COMMUNITY'}</h2>
${(content.sections.volunteering || []).map(v => `
<div class="entry">
  <div class="entry-header"><h3>${v.role} — ${v.company}</h3><span class="entry-date">${v.date}</span></div>
  <ul>${(v.details || []).map(b => `<li>${b}</li>`).join('')}</ul>
</div>`).join('')}

<h2>${t.skills || 'SKILLS'}</h2>
${Object.entries(content.collections.skills || {}).map(([key, items]) => {
    const catName = translations.skills?.[key] || key;
    return `<p><strong>${catName}:</strong> ${items.map(i => i.name).join(', ')}</p>`;
}).join('')}

<h2>${translations.skills?.languages || 'Languages'}</h2>
${(content.collections.languages || []).map(l => `<p>${l.label}</p>`).join('')}

<h2>${t.certifications || 'CERTIFICATIONS'}</h2>
<ul>${(content.sections.certifications || []).map(c => `<li>${c.name}</li>`).join('')}</ul>
</body>
</html>`;

    const w = window.open('', '_blank');
    if (w) {
        w.document.write(html);
        w.document.close();
        setTimeout(() => w.print(), 500);
    } else {
        console.warn('Popup blocked: Could not open ATS resume window.');
    }
}
