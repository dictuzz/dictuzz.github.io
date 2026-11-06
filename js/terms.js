import { loadSiteConfig } from './site-content.js?v=v11';
import { applyManagedPageMetadata } from './site-seo.js?v=v3';
import { applyGlobalFooter } from './site-renderers.js';

async function initTermsPage() {
    try {
        const siteConfig = await loadSiteConfig();
        applyManagedPageMetadata(siteConfig, 'terms', {
            imagePath: '/og-image.png',
            imageAlt: 'Illustrated profile card for Benedictus Richard Ricardo, with dictuzz branding and the tagline Automate, Create, Solve.'
        });
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
