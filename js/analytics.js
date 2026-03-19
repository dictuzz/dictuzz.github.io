/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED: ANALYTICS
 * Google Analytics 4 Initialization
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function initAnalytics(config) {
    // 1. Try argument
    // 2. Try global CONFIG_DATA
    const cfg = config || (typeof CONFIG_DATA !== 'undefined' ? CONFIG_DATA.analytics : null);

    if (!cfg || !cfg.enabled || !cfg.id) {
        return;
    }

    const analyticsId = cfg.id;

    // Prevent double injection
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${analyticsId}"]`)) {
        return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }

    // Make gtag available globally for manual event tracking if needed
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', analyticsId);

    console.log(`Analytics: Initialized ${analyticsId}`);
}
