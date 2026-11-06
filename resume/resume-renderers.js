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

const MONTH_INDEX = {
    jan: 0, feb: 1, mar: 2, mrz: 2, apr: 3, may: 4, mai: 4, mei: 4,
    jun: 5, jul: 6, aug: 7, agu: 7, sep: 8, oct: 9, okt: 9,
    nov: 10, dec: 11, des: 11, dez: 11
};

function parseExperienceEndDate(dateStr) {
    if (!dateStr) return 0;
    if (/present|sekarang|heute/i.test(dateStr)) return Infinity;
    const parts = dateStr.split(/[–—\-]/);
    const endSegment = parts[parts.length - 1].trim();
    if (/present|sekarang|heute/i.test(endSegment)) return Infinity;

    const yearMatch = endSegment.match(/\b(19\d\d|20\d\d)\b/);
    if (!yearMatch) return 0;
    const year = parseInt(yearMatch[1], 10);

    const monthMatch = endSegment.match(/[a-zA-Z]{3,}/);
    let month = 0;
    if (monthMatch) {
        const key = monthMatch[0].toLowerCase().slice(0, 3);
        if (key in MONTH_INDEX) {
            month = MONTH_INDEX[key];
        }
    }
    return new Date(Date.UTC(year, month, 1)).getTime();
}

export function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        const value = key?.split('.').reduce((current, part) => current?.[part], translations);
        if (typeof value === 'string') {
            if (value.includes('<') || value.includes('&')) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

export function renderExperience(items, selector = '#experience .timeline') {
    const sorted = [...items].sort((left, right) => {
        return parseExperienceEndDate(right.date) - parseExperienceEndDate(left.date);
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

export function renderCertifications(items, translations = {}) {
    renderSection('#certifications-list', items, (item) => `
        <div class="edu-card glass glass--hover card reveal">
            <h3>${escapeHtml(item.name)}</h3>
            ${item.issuer ? `<p class="edu-card__degree">${escapeHtml(item.issuer)}</p>` : ''}
            ${item.year ? `<p class="edu-card__date">${escapeHtml(item.year)}</p>` : ''}
            ${item.url ? `<p class="edu-card__focus"><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(translations.certifications?.verify || 'Verify credential')}</a></p>` : ''}
        </div>
    `);
}

export function renderList(selector, items) {
    renderSection(selector, items, (item) => `<li>${escapeHtml(item)}</li>`);
}

export function renderSkills(collections, translations) {
    const container = document.getElementById('skills-dynamic-container');
    if (!container) return;
    
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
    const canvaLink = document.querySelector('#download-canva-link');
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

    // Update Canva / Visual Resume Link based on language
    if (canvaLink) {
        const canvaUrls = {
            en: 'https://canva.link/benedictus-richard-ricardo-en',
            id: 'https://canva.link/benedictus-richard-ricardo-id',
            de: 'https://canva.link/benedictus-richard-ricardo-de'
        };
        const lang = content.locale || 'en';
        canvaLink.href = content.visualCvUrl || canvaUrls[lang] || canvaUrls.en;
    }
    
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
    const linkedinUrl = (siteConfig.socials || []).find(s => s.id === 'linkedin')?.url || '';
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
    const esc = (value) => escapeHtml(String(value ?? ''));

        const contactParts = [email, phone, website, linkedinUrl].filter(Boolean);

    const html = `<!DOCTYPE html>
<html lang="${esc(lang)}">
<head>
<meta charset="UTF-8">
<title>${esc(name)} | Resume</title>
<style>
  body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.45; color: #000; max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
  h1 { font-size: 20pt; margin: 0 0 2px; letter-spacing: 0.5px; }
  .role { font-size: 11pt; font-style: italic; margin: 0 0 4px; color: #333; }
  h2 { font-size: 11.5pt; font-weight: bold; border-bottom: 1px solid #555; padding-bottom: 2px; margin: 16px 0 6px; text-transform: uppercase; letter-spacing: 0.3px; }
  h3 { font-size: 11pt; margin: 6px 0 1px; font-weight: bold; }
  p, li { margin: 2px 0; }
  ul { padding-left: 18px; margin: 2px 0 0; }
  .contact { font-size: 9.5pt; color: #444; margin: 0 0 6px; }
  .summary { margin: 4px 0 0; }
  .entry { margin-bottom: 10px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; }
  .entry-title { margin: 6px 0 1px; font-weight: bold; font-size: 11pt; }
  .entry-org { font-weight: normal; }
  .entry-date { font-size: 9.5pt; color: #444; white-space: nowrap; }
  .skills-line { margin: 2px 0; }
  .cert-item { margin: 1px 0; }
  .print-btn { display: block; margin: 0 0 18px; padding: 10px 16px; font: inherit; cursor: pointer; }
  @media print { body { padding: 0.4in; } .print-btn { display: none; } }
</style>
</head>
<body>

<button type="button" class="print-btn" onclick="window.print()">Print / Save as PDF</button>

<h1>${esc(name)}</h1>
<p class="contact">${esc(contactParts.join('  |  '))}</p>
<p class="role">${esc(heroRole)}</p>
<p class="summary">${esc(summaryText)}</p>

<h2>${esc(t.experience || 'WORK EXPERIENCE')}</h2>
${(content.sections.experience || []).map(e => `
<div class="entry">
  <div class="entry-header">
    <p class="entry-title">${esc(e.role)}, <span class="entry-org">${esc(e.company)}</span></p>
    <span class="entry-date">${esc(e.date)}</span>
  </div>
  <ul>${(e.details || []).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
</div>`).join('')}

<h2>${esc(t.education || 'EDUCATION')}</h2>
${(content.sections.education || []).map(e => `
<div class="entry">
  <div class="entry-header">
    <p class="entry-title">${esc(e.name)}, <span class="entry-org">${esc(e.degree)}</span></p>
    <span class="entry-date">${esc(e.date)}</span>
  </div>${e.focus ? `
  <p>${esc(e.focus)}</p>` : ''}
</div>`).join('')}

<h2>${esc(t.impact || 'SELECTED OPERATIONAL IMPACT')}</h2>
${(content.sections.impact || []).map(i => `
<div class="entry">
  <p class="entry-title">${esc(i.title)}</p>
  <p>${esc(i.desc)}</p>
</div>`).join('')}

<h2>${esc(t.volunteering || 'VOLUNTEERING & COMMUNITY')}</h2>
${(content.sections.volunteering || []).map(v => `
<div class="entry">
  <div class="entry-header">
    <p class="entry-title">${esc(v.role)}, <span class="entry-org">${esc(v.company)}</span></p>
    <span class="entry-date">${esc(v.date)}</span>
  </div>
  <ul>${(v.details || []).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
</div>`).join('')}

<h2>${esc(t.skills || 'CORE SKILLS & TOOLS')}</h2>
${Object.entries(content.collections.skills || {}).map(([key, items]) => {
    const catName = translations.skills?.[key] || key;
    return `<p class="skills-line"><strong>${esc(catName)}:</strong> ${esc(items.map(i => i.name).join(', '))}</p>`;
}).join('')}

<h2>${esc(translations.skills?.languages || 'Languages')}</h2>
<p>${esc((content.collections.languages || []).map(l => l.label).join('  |  '))}</p>

<h2>${esc(t.certifications || 'CERTIFICATIONS & TRAINING')}</h2>
<ul>${(content.sections.certifications || []).map(c => {
    const parts = [c.name, c.issuer, c.year].filter(Boolean);
    return `<li class="cert-item">${esc(parts.join(', '))}</li>`;
}).join('')}</ul>

${(content.sections.awards || content.collections?.awards || []).length > 0 ? `
<h2>${esc(t.awards || 'AWARDS & RECOGNITION')}</h2>
<ul>${(content.sections.awards || content.collections?.awards || []).map(a => {
    if (typeof a === 'string') return `<li>${esc(a)}</li>`;
    return `<li>${esc(a.name || a)}</li>`;
}).join('')}</ul>` : ''}

</body>
</html>`;

    const filename = `${name.replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '')}-Resume-${lang.toUpperCase()}.html`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const printWindow = window.open(url, '_blank');
    if (printWindow) {
        printWindow.addEventListener('load', () => {
            try { printWindow.focus(); printWindow.print(); } catch {  }
        }, { once: true });
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } else {
        // Pop-up blocked: deliver the same document as a download instead of failing silently.
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1_000);
    }
}
