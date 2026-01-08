/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BUSINESS CARD: SCRIPT.JS
 * Extracted from inline HTML for better caching and maintainability
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════
    const THEME_STORAGE_KEY = 'dictuzz-theme';

    // ═══════════════════════════════════════════════════════════════════════
    // SHARE CARD FUNCTION
    // ═══════════════════════════════════════════════════════════════════════
    function shareCard() {
        const shareData = {
            title: 'Benedictus Richard Ricardo',
            text: 'Check out the professional portfolio of Benedictus Richard Ricardo (Dictuzz).',
            url: 'https://dictuzz.github.io/resume/'
        };

        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareData.url);
            alert('Resume URL copied to clipboard: ' + shareData.url);
        }
    }

    // Expose to global for onclick handler
    window.shareCard = shareCard;

    // ═══════════════════════════════════════════════════════════════════════
    // THEME TOGGLER
    // ═══════════════════════════════════════════════════════════════════════
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn?.querySelector('i');

    function getInitialTheme() {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }

    // Initialize theme
    let currentTheme = getInitialTheme();
    applyTheme(currentTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // AMBIENT FLOATING ORBS (Canvas Background)
    // ═══════════════════════════════════════════════════════════════════════
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas?.getContext('2d');
    let width, height;
    let orbs = [];

    if (canvas && ctx) {
        window.addEventListener('resize', resize);

        // Mouse & Touch Interaction
        let mouse = { x: 0, y: 0 };

        function updateMouse(clientX, clientY) {
            mouse.x = (clientX / width) * 2 - 1;
            mouse.y = (clientY / height) * 2 - 1;
            handleTilt(clientX, clientY);
        }

        window.addEventListener('mousemove', e => {
            updateMouse(e.clientX, e.clientY);
        });

        window.addEventListener('touchmove', e => {
            if (e.touches[0]) {
                e.preventDefault();
                updateMouse(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initOrbs();
        }

        class Orb {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 200 + 150;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.color = this.getRandomColor();
                this.angle = Math.random() * Math.PI * 2;
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

                const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
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
            let count = 6;
            for (let i = 0; i < count; i++) {
                orbs.push(new Orb());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';

            for (let i = 0; i < orbs.length; i++) {
                orbs[i].update();
                orbs[i].draw();
            }

            ctx.globalCompositeOperation = 'source-over';
            requestAnimationFrame(animate);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 3D TILT EFFECT
        // ═══════════════════════════════════════════════════════════════════════
        const card = document.querySelector('.business-card');

        function handleTilt(clientX, clientY) {
            if (!card) return;
            const x = (window.innerWidth / 2 - clientX) / 30;
            const y = (window.innerHeight / 2 - clientY) / 30;
            const isFlipped = card.classList.contains('is-flipped');
            let rotateY = isFlipped ? 180 + x : x;
            card.style.transform = `rotateY(${rotateY}deg) rotateX(${y}deg)`;
        }

        document.addEventListener('touchend', () => {
            if (!card) return;
            const isFlipped = card.classList.contains('is-flipped');
            card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
            mouse.x = 0;
            mouse.y = 0;
        });

        document.addEventListener('mouseleave', () => {
            if (!card) return;
            const isFlipped = card.classList.contains('is-flipped');
            card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
            mouse.x = 0;
            mouse.y = 0;
        });

        // ═══════════════════════════════════════════════════════════════════════
        // CARD FLIP HANDLER
        // ═══════════════════════════════════════════════════════════════════════
        if (card) {
            card.addEventListener('click', (e) => {
                // Don't flip if clicking on links or buttons
                if (e.target.closest('a, button')) return;
                card.classList.toggle('is-flipped');
            });
        }

        // Initialize
        resize();
        animate();
    }

})();
