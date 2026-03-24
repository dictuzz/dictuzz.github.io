import {
    loadResumeContent,
    loadSiteConfig,
    normalizeResumeTranslations
} from '../js/site-content.js';
import { DEFAULT_LANG, LANG_STORAGE_KEY, SUPPORTED_LANGS, resumeState } from './resume-state.js';

export function getInitialLanguage() {
    const urlLang = new URLSearchParams(location.search).get('lang');
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    const browserLang = navigator.language.split('-')[0];

    return SUPPORTED_LANGS.includes(urlLang) ? urlLang
        : SUPPORTED_LANGS.includes(savedLang) ? savedLang
        : SUPPORTED_LANGS.includes(browserLang) ? browserLang
        : DEFAULT_LANG;
}

export async function loadResumePageContent(lang) {
    const [siteConfig, resumeContent] = await Promise.all([
        resumeState.siteConfig ? Promise.resolve(resumeState.siteConfig) : loadSiteConfig(),
        loadResumeContent(lang)
    ]);

    resumeState.siteConfig = siteConfig;
    resumeState.langContent = resumeContent;
    resumeState.currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);

    const url = new URL(location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);

    document.documentElement.lang = lang;

    return {
        siteConfig,
        content: resumeContent,
        translations: normalizeResumeTranslations(resumeContent)
    };
}
