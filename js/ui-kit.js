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

// 3. HAPTICS
// ══════════════════════════════════════════════
export function initHaptics() {
    if (!('vibrate' in navigator)) return;

    document.addEventListener('click', (e) => {
        if (e.target.closest('.link-button, .social-link, #theme-toggle, button, a')) {
            navigator.vibrate(5);
        }
    });
}

// 4. MAGNETIC BUTTONS (3D Hover)
// ══════════════════════════════════════════════
export function initMagneticButtons(selector = '.link-button') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || 'ontouchstart' in window) return;

    const buttons = document.querySelectorAll(selector);

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px) rotateX(${-y * 0.1}deg) rotateY(${x * 0.1}deg)`;

            // Optional: Move children slightly for depth
            const children = btn.children;
            for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains('no-magnet')) continue;
                children[i].style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
                children[i].style.transition = 'none';
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            const children = btn.children;
            for (let i = 0; i < children.length; i++) {
                children[i].style.transform = '';
                children[i].style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            }
        });
    });
}
