/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED: ANALYTICS
 * Google Analytics 4 Initialization
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function initAnalytics(config) {
    if (!config || !config.enabled || !config.id) {
        return;
    }

    const analyticsId = config.id;

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

    // Make gtag available globally for manual event tracking
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', analyticsId);
}

