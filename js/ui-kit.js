import { upgradeIcons } from './icon-kit.js';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED: UI KIT
 * Centralized UI Logic (Theme, Typing, Interactions)
 * Consolidates previous theme.js and utils.js
 * ═══════════════════════════════════════════════════════════════════════════
 */

// 1. THEME MANAGER
// ══════════════════════════════════════════════
export class ThemeManager {
    constructor(options = {}) {
        this.storageKey = options.storageKey || 'dictuzz-theme';
        this.defaultTheme = options.defaultTheme || 'dark';
        this.iconElement = options.iconElement || null;
        this.toggleElement = options.toggleElement || null;

        this.init();
    }

    init() {
        // 1. Resolve initial theme
        const stored = localStorage.getItem(this.storageKey);
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Priority: stored preference > system preference > default theme
        const isDark = stored
            ? stored === 'dark'
            : (systemDark || this.defaultTheme === 'dark');

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
                this.iconElement.className = 'i-ph-moon-duotone';
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (this.iconElement) {
                this.iconElement.className = 'i-ph-sun-duotone';
            }
        }

        if (this.iconElement) {
            upgradeIcons(this.iconElement.parentElement || document);
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

export function updateThemeColor(theme, themeMeta = document.querySelector('meta[name="theme-color"]')) {
    if (!themeMeta) return;
    themeMeta.setAttribute('content', theme === 'dark' ? '#121820' : '#f5efe4');
}

// 2. TYPING ANIMATION (Typewriter)
// ══════════════════════════════════════════════
export class Typer {
    constructor(el, texts, speed = 50) {
        if (!el) return;

        // Stop any existing Typer on this element
        if (el._typer) {
            el._typer.stop();
        }

        this.el = el;
        this.texts = texts;
        this.speed = speed;
        this.isRunning = true;
        this.el._typer = this; // Store reference for cleanup
        this.start();
    }

    stop() {
        this.isRunning = false;
        if (this.el) {
            this.el.textContent = '';
        }
    }

    async start() {
        this.el.textContent = '';
        this.el.style.opacity = '1';

        // Initial delay
        await new Promise(r => setTimeout(r, 600));
        if (!this.isRunning) return;

        // If simple string
        if (typeof this.texts === 'string') {
            await this.type(this.texts);
            return;
        }

        // If array, cycle through texts
        if (Array.isArray(this.texts)) {
            let i = 0;
            while (this.isRunning) {
                const text = this.texts[i];
                await this.type(text);
                if (!this.isRunning) break;

                // Wait before deleting
                await new Promise(r => setTimeout(r, 2000));
                if (!this.isRunning) break;

                // Delete
                await this.delete();
                if (!this.isRunning) break;

                // Next string
                i = (i + 1) % this.texts.length;

                // Pause before typing next
                await new Promise(r => setTimeout(r, 500));
            }
        }
    }

    async type(text) {
        if (!this.isRunning) return;

        let currentText = '';
        for (let i = 0; i < text.length; i++) {
            if (!this.isRunning) {
                this.el.textContent = '';
                return;
            }

            currentText += text[i];
            this.el.textContent = currentText;
            const randomSpeed = this.speed + (Math.random() * 20 - 10);
            await new Promise(r => setTimeout(r, randomSpeed));
        }
    }

    async delete() {
        if (!this.isRunning) return;

        // Get current text length
        const fullText = this.el.textContent || '';
        let textLength = fullText.length;

        for (let i = textLength; i > 0; i--) {
            if (!this.isRunning) {
                this.el.textContent = '';
                return;
            }

            // Build text from scratch based on what we're deleting
            this.el.textContent = fullText.substring(0, i - 1);
            await new Promise(r => setTimeout(r, 30));
        }
    }
}

