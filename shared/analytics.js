/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED: ANALYTICS
 * Google Analytics 4 Initialization
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function initAnalytics(config) {
    if (!config || !config.enabled || !config.id) {
        console.warn('Analytics: Disabled or Missing ID');
        return;
    }

    // Prevent double injection
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${config.id}"]`)) {
        return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }

    // Make gtag available globally for manual event tracking if needed
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', config.id);

    console.log(`Analytics: Initialized ${config.id}`);
}
