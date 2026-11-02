import {
    loadResumeContent,
    loadSiteConfig,
    normalizeResumeTranslations
} from '../js/site-content.js';
import { DEFAULT_LANG, LANG_STORAGE_KEY, SUPPORTED_LANGS, resumeState } from './resume-state.js';
import { safeStorage } from '../js/ui-kit.js';

export function getInitialLanguage() {
    const urlLang = new URLSearchParams(location.search).get('lang');
    const savedLang = safeStorage.getItem(LANG_STORAGE_KEY);
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
    safeStorage.setItem(LANG_STORAGE_KEY, lang);

    return {
        siteConfig,
        content: resumeContent,
        translations: normalizeResumeTranslations(resumeContent)
    };
}
