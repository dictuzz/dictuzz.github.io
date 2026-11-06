import { applyGlobalFooter } from '../js/site-renderers.js';
import { upgradeIcons } from '../js/icon-kit.js';
import { loadResumePageContent, getInitialLanguage } from './resume-content-loader.js?v=v10';
import { initInteractions, initProfileTilt, initRevealObserver, initTheme, updateTyping } from './resume-interactions.js';
import {
    applyTranslations,
    renderCertifications,
    renderConnectSection,
    renderEducation,
    renderExperience,
    renderImpact,
    renderList,
    renderSkills
} from './resume-renderers.js?v=v5';
import { updateResumeSeo } from './resume-seo.js?v=v11';
import { SUPPORTED_LANGS } from './resume-state.js';

function resumePath(lang) {
    return lang === 'en' ? '/resume/' : `/resume/${lang}/`;
}

function portfolioPath(lang) {
    return lang === 'en' ? '/portfolio/' : `/portfolio/${lang}/`;
}

async function loadLanguage(lang) {
    try {
        const { siteConfig, content, translations } = await loadResumePageContent(lang);

        // Each renderer is isolated — a failure in one must not block the rest.
        const renderers = [
            () => renderExperience(content.sections.experience, '#experience .timeline'),
            () => renderExperience(content.sections.volunteering, '#volunteering-list'),
            () => renderEducation(content.sections.education),
            () => renderCertifications(content.sections.certifications, translations),
            () => renderImpact(content.sections.impact),
            () => renderSkills(content.collections, translations),
            () => renderList('#awards-list', content.sections.awards),
            () => applyTranslations(translations),
            () => renderConnectSection(siteConfig, translations, content),
            () => updateTyping(content.strings),
            () => updateResumeSeo(siteConfig, content, lang),
            () => applyGlobalFooter(siteConfig),
            () => applyResumeFooter(translations, lang)
        ];

        for (const render of renderers) {
            try { render(); } catch (err) { console.error('Renderer error:', err); }
        }

        // Single source of truth for document language and URL
        document.documentElement.lang = lang;
        const currentUrl = new URL(location);
        if (currentUrl.pathname !== resumePath(lang) || currentUrl.searchParams.has('lang')) {
            currentUrl.pathname = resumePath(lang);
            currentUrl.searchParams.delete('lang');
            window.history.replaceState({}, '', currentUrl);
        }

        upgradeIcons(document);

        document.querySelectorAll('.lang-btn').forEach((button) => {
            const isActive = button.dataset.lang === lang;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive);
        });
    } catch (error) {
        console.error('Language load error:', error);
        if (lang !== 'en') {
            loadLanguage('en');
        }
    }
}

function applyResumeFooter(translations, lang) {
    const labels = translations.footer;
    if (!labels) return;
    const links = [
        ['/', labels.home], [resumePath(lang), labels.resume], [portfolioPath(lang), labels.portfolio],
        ['/resources/', labels.resources], ['/terms/', labels.terms]
    ];
    links.forEach(([href, label]) => {
        const selector = href === '/terms/' ? '.global-footer__link[href$="/terms/"]' : `.global-footer__link[href="${href}"]`;
        const link = document.querySelector(selector);
        if (link) link.textContent = label;
    });
    document.querySelector('.global-footer__nav')?.setAttribute('aria-label', labels.navLabel);
    document.querySelector('.global-footer__contact-link[href^="mailto:"]')?.setAttribute('aria-label', labels.emailAria);
    const copy = document.querySelector('.global-footer__copy');
    const rightsNode = [...(copy?.childNodes || [])].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes('©'));
    if (rightsNode) rightsNode.textContent = `\n            © ${new Date().getFullYear()} Benedictus Richard Ricardo. ${labels.allRights}\n            `;
    const role = document.querySelector('.global-footer__copy span');
    if (role) role.textContent = translations.hero.role;
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRevealObserver();
    initInteractions();
    initProfileTilt();
    upgradeIcons(document);

    document.querySelectorAll('.lang-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            if (lang && SUPPORTED_LANGS.includes(lang)) {
                loadLanguage(lang);
            }
        });
    });

    loadLanguage(getInitialLanguage());
});
