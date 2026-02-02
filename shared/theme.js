/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED: THEME MANAGER
 * Centralized logic for Dark/Light mode synchronization
 * ═══════════════════════════════════════════════════════════════════════════
 */

export class ThemeManager {
    constructor(options = {}) {
        const themeConfig = (typeof CONFIG_DATA !== 'undefined' && CONFIG_DATA.theme) ? CONFIG_DATA.theme : {};

        this.storageKey = options.storageKey || themeConfig.storageKey || 'dictuzz-theme';
        this.defaultTheme = options.defaultTheme || themeConfig.default || 'dark';
        this.iconElement = options.iconElement || null;
        this.toggleElement = options.toggleElement || null;

        this.init();
    }

    init() {
        // 1. Resolve initial theme
        const stored = localStorage.getItem(this.storageKey);
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let isDark;

        if (stored) {
            isDark = stored === 'dark';
        } else {
            // If no storage, use system preference or default
            isDark = this.defaultTheme === 'dark' ? systemDark !== false : false;
            // Fallback if system preference is not available/relevant, rely on default
            if (this.defaultTheme === 'dark' && stored === null && !systemDark) isDark = true;
        }

        this.apply(isDark ? 'dark' : 'light');

        // 2. Bind toggle click if element provided
        if (this.toggleElement) {
            this.toggleElement.addEventListener('click', () => this.toggle());
        }

        // 3. Listen for storage changes (cross-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.apply(e.newValue);
            }
        });
    }

    toggle() {
        const current = this.getMode();
        const next = current === 'dark' ? 'light' : 'dark';
        this.apply(next);
        this.animateIcon();
    }

    getMode() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    apply(theme) {
        // Update DOM
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (this.iconElement) {
                this.iconElement.className = 'fas fa-moon';
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (this.iconElement) {
                this.iconElement.className = 'fas fa-sun';
            }
        }

        // Persist
        localStorage.setItem(this.storageKey, theme);

        // Broadcast event for Canvas engines to react
        window.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: theme }
        }));
    }

    animateIcon() {
        if (!this.iconElement) return;

        // Simple rotation animation
        this.iconElement.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        this.iconElement.style.transform = 'rotate(180deg) scale(0.5)';

        setTimeout(() => {
            this.iconElement.style.transform = 'rotate(0deg) scale(1)';
            // Icon class is swapped in Apply()
        }, 150);
    }
}
