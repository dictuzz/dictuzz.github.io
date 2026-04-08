import { applyGlobalFooter } from '../js/site-renderers.js';
import { loadResumePageContent, getInitialLanguage } from './resume-content-loader.js';
import { initInteractions, initProfileTilt, initRevealObserver, initTheme, updateTyping } from './resume-interactions.js';
import {
    applyTranslations,
    renderCertifications,
    renderConnectSection,
    renderEducation,
    renderExperience,
    renderImpact,
    renderList,
    renderSkills,
    renderTestimonials
} from './resume-renderers.js';
import { updateResumeSeo } from './resume-seo.js';
import { SUPPORTED_LANGS } from './resume-state.js';

async function loadLanguage(lang) {
    try {
        const { siteConfig, content, translations } = await loadResumePageContent(lang);

        renderExperience(content.sections.experience);
        renderEducation(content.sections.education);
        renderCertifications(content.sections.certifications);
        renderImpact(content.sections.impact);
        renderSkills(content.collections, translations);
        renderList('#awards-list', content.sections.awards);
        renderList('#etc-list', content.sections.etc);
        renderTestimonials(content.sections.testimonials);
        applyTranslations(translations);
        renderConnectSection(siteConfig, translations, content);
        updateTyping(content.strings);
        updateResumeSeo(siteConfig, content, lang);
        applyGlobalFooter(siteConfig);

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

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRevealObserver();
    initInteractions();
    initProfileTilt();

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
