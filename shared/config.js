/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED CONFIGURATION: dictuzz.github.io
 * Centralized settings for cross-cutting concerns
 * ═══════════════════════════════════════════════════════════════════════════
 */

const SITE_CONFIG = {
    /**
     * Google Analytics 4 Configuration
     * Change this ID when forking the repository
     */
    analytics: {
        id: 'G-PJMTM772L5',
        enabled: true
    },

    /**
     * Theme Configuration
     * Used for consistent theme management across all components
     */
    theme: {
        storageKey: 'dictuzz-theme',
        default: 'dark'
    },

    /**
     * Site Metadata
     */
    site: {
        name: 'dictuzz',
        url: 'https://dictuzz.github.io',
        author: 'Benedictus Richard Ricardo'
    }
};
