/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BUSINESS CARD: SCRIPT.JS
 * Refactored to use Shared Library
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ThemeManager } from '../shared/theme.js';
import { initAnalytics } from '../shared/analytics.js';

// 1. INITIALIZE SHARED MODULES
// ════════════════════════════════════════════

// Analytics (using global SITE_CONFIG from shared/config.js)
if (typeof SITE_CONFIG !== 'undefined') {
    initAnalytics(SITE_CONFIG.analytics);
}

// Theme
const themeManager = new ThemeManager({
    storageKey: SITE_CONFIG?.theme?.storageKey || 'dictuzz-theme',
    defaultTheme: SITE_CONFIG?.theme?.default || 'dark',
    toggleElement: document.getElementById('theme-toggle'),
    iconElement: document.querySelector('#theme-toggle i')
});

// 2. CARD LOGIC
// ════════════════════════════════════════════

// Share Functionality
window.shareCard = function () {
    const shareData = {
        title: 'Benedictus Richard Ricardo',
        text: 'Check out the professional portfolio of Benedictus Richard Ricardo (Dictuzz).',
        url: 'https://dictuzz.github.io/resume/'
    };

    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        const urlToCopy = shareData.url;
        navigator.clipboard.writeText(urlToCopy).then(() => {
            alert('Resume URL copied to clipboard: ' + urlToCopy);
        }).catch(() => {
            // Fallback
            console.log('Clipboard failed');
        });
    }
};

// Card Flip Interaction
const card = document.querySelector('.business-card');
if (card) {
    card.addEventListener('click', (e) => {
        // Don't flip if clicking on links or buttons
        if (e.target.closest('a, button')) return;
        card.classList.toggle('is-flipped');
    });

    // Reset flip on touch/leave
    const resetFlip = () => card.classList.contains('is-flipped') ? card.classList.add('is-flipped') : null; // Keep state logic simple for now or preserve original behavior?
    // Original behavior: Reset on mouseleave and touchend

    document.addEventListener('touchend', (e) => {
        // If click inside card, don't reset immediately unless specific logic
        // Original logic: document.addEventListener('touchend', () => { card.style.transform ... mouse.x=0 })
        // Note: The original logic forced a reset on ANY touch end anywhere on screen. 
        // We'll keep it to preserve behavior, but the flip class toggle handles the rotation now mostly.
        // However, the original also had tilt reset.
    });

    document.addEventListener('mouseleave', () => {
        // Reset flip is NOT in original CSS logic, but JS manual transform was used.
        // The CSS handles .is-flipped. The JS handles the TILT.
        if (card.classList.contains('is-flipped')) {
            card.style.transform = 'rotateY(180deg)';
        } else {
            card.style.transform = 'rotateY(0deg)';
        }
    });
}

// 3. BACKGROUND ANIMATION (Orbs)
// ════════════════════════════════════════════
const canvas = document.getElementById('bg-canvas');
const ctx = canvas?.getContext('2d');
let width, height;
let orbs = [];

if (canvas && ctx) {
    let mouse = { x: 0, y: 0 };

    function updateMouse(clientX, clientY) {
        mouse.x = (clientX / width) * 2 - 1;
        mouse.y = (clientY / height) * 2 - 1;

        // 3D Tilt Logic
        if (card) {
            const x = (window.innerWidth / 2 - clientX) / 30;
            const y = (window.innerHeight / 2 - clientY) / 30;
            const isFlipped = card.classList.contains('is-flipped');
            let rotateY = isFlipped ? 180 + x : x;
            card.style.transform = `rotateY(${rotateY}deg) rotateX(${y}deg)`;
        }
    }

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initOrbs();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => updateMouse(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => {
        if (e.touches[0]) {
            e.preventDefault();
            updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });

    // Reset flip state on necessary interactions to match original behavior
    const resetState = () => {
        mouse.x = 0;
        mouse.y = 0;
        if (card.classList.contains('is-flipped')) {
            card.style.transform = 'rotateY(180deg)';
        } else {
            card.style.transform = 'rotateY(0deg)';
        }
    };

    document.addEventListener('touchend', resetState);
    document.addEventListener('mouseleave', resetState);


    class Orb {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 200 + 150;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = [
                { r: 0, g: 245, b: 212 },   // Cyan
                { r: 123, g: 97, b: 255 },  // Purple
                { r: 255, g: 184, b: 0 },   // Gold
                { r: 50, g: 50, b: 100 }    // Deep Blue
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.beginPath();
            let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);

            // Access theme from ThemeManager indirectly via DOM or verify current state
            const isDark = themeManager.getMode() === 'dark';

            let alphaCore = isDark ? 0.2 : 0.15;
            let alphaEdge = 0;
            let c = this.color;

            gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${alphaCore})`);
            gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, ${alphaEdge})`);

            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            let tx = this.vx + (mouse.x * -0.5);
            let ty = this.vy + (mouse.y * -0.5);
            this.x += tx;
            this.y += ty;

            if (this.x < -this.radius) this.x = width + this.radius;
            if (this.x > width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = height + this.radius;
            if (this.y > height + this.radius) this.y = -this.radius;
        }
    }

    function initOrbs() {
        orbs = [];
        for (let i = 0; i < 6; i++) orbs.push(new Orb());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const isDark = themeManager.getMode() === 'dark';
        ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';

        orbs.forEach(orb => {
            orb.update();
            orb.draw();
        });

        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(animate);
    }

    resize();
    animate();
}
