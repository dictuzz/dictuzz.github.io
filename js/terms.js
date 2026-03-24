import { applyGlobalFooter, applyManagedPageMetadata, loadSiteConfig } from './site-content.js';

async function initTermsPage() {
    try {
        const siteConfig = await loadSiteConfig();
        applyManagedPageMetadata(siteConfig, 'terms');
        applyGlobalFooter(siteConfig);

        const brandName = document.getElementById('terms-brand-name');
        if (brandName) {
            brandName.textContent = 'Terms & Conditions';
        }
    } catch (error) {
        console.error('Terms page init error:', error);
    }
}

initTermsPage();
