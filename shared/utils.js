/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED: UTILITIES
 * Common interactions and effects
 * ═══════════════════════════════════════════════════════════════════════════
 */

// 1. TYPING ANIMATION (Typewriter)
export class Typer {
    constructor(el, texts, speed = 50) {
        if (!el) return;
        this.el = el;
        this.texts = texts;
        this.speed = speed;
        this.start();
    }

    async start() {
        this.el.textContent = '';
        this.el.style.opacity = '1';

        // Initial delay
        await new Promise(r => setTimeout(r, 600));

        // If simple string
        if (typeof this.texts === 'string') {
            await this.type(this.texts);
            return;
        }

        // If array, we could implement cycling here if needed later
    }

    async type(text) {
        for (let i = 0; i < text.length; i++) {
            this.el.textContent += text[i];
            const randomSpeed = this.speed + (Math.random() * 20 - 10);
            await new Promise(r => setTimeout(r, randomSpeed));
        }
    }
}

// 2. HAPTICS
export function initHaptics() {
    if (!('vibrate' in navigator)) return;

    document.addEventListener('click', (e) => {
        if (e.target.closest('.link-button, .social-link, #theme-toggle, button, a')) {
            navigator.vibrate(5);
        }
    });
}

// 3. MAGNETIC BUTTONS (3D Hover)
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
