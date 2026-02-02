/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BACKGROUND MANAGER & ENGINES
 * Extracted from root script.js
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CONFIG = {
    // Dark Mode: Aurora
    aurora: {
        colors: [
            { r: 120, g: 0, b: 255 },   // Deep Violet
            { r: 0, g: 200, b: 255 },   // Cyan
            { r: 50, g: 0, b: 150 }     // Blue-ish
        ],
        count: 8
    },

    // Light Mode: Network (Constellation)
    network: {
        colors: ["rgba(230, 238, 247, 0.8)", "rgba(223, 231, 238, 0.8)"],
        lineColor: "rgba(200, 210, 220, 0.4)",
        count: { desktop: 120, tablet: 60, mobile: 30 },
        connectDist: 80
    }
};

// ENGINES registry is defined at the end of the file after class definitions

export const BackgroundManager = {
    activeEngine: null,
    animationId: null,
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,

    init() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        this.canvas = document.getElementById('ambient-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            } else {
                if (!this.animationId && this.activeEngine) {
                    this.loop();
                }
            }
        });

        // Listen for theme changes from ThemeManager
        window.addEventListener('theme-changed', (e) => {
            this.setMode(e.detail.theme);
        });
    },

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        if (this.activeEngine) this.activeEngine.resize(this.width, this.height);
    },

    setMode(mode) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.activeEngine && this.activeEngine.destroy) this.activeEngine.destroy();
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Registry Lookup
        // 1. Check Config override
        let engineKey = mode === 'light' ? 'network' : 'aurora';

        if (typeof CONFIG_DATA !== 'undefined' && CONFIG_DATA.theme && CONFIG_DATA.theme.background) {
            const bgConfig = CONFIG_DATA.theme.background;
            // Only override if the config explicitly opts out of the default mode-switching behavior
            // OR if we want to force a specific engine regardless of mode.
            // For now, let's allow 'static' to override everything, but otherwise respect mode defaults
            if (bgConfig === 'static') {
                engineKey = 'static';
            } else if (bgConfig !== 'aurora' && bgConfig !== 'network') {
                // If user put a custom engine name
                if (ENGINES[bgConfig]) engineKey = bgConfig;
            }
        }

        const EngineClass = ENGINES[engineKey] || ENGINES['static'];
        this.activeEngine = new EngineClass(this.ctx, this.width, this.height);

        this.loop();
    },

    loop() {
        this.animationId = requestAnimationFrame(this.loop.bind(this));
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.activeEngine) this.activeEngine.update();
    }
};

let mouse = { x: -500, y: -500 };

/* ═══ ENGINE 1: DARK AURORA ═══ */
class DarkAuroraEngine {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.particles = [];
        this.init();
        this.ctx.globalCompositeOperation = 'screen';
    }

    init() {
        for (let i = 0; i < CONFIG.aurora.count; i++) {
            this.particles.push(new AuroraParticle(this.width, this.height));
        }
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    update() {
        this.ctx.globalCompositeOperation = 'screen';
        this.particles.forEach(p => {
            p.update(this.width, this.height);
            p.draw(this.ctx);
        });
    }

    destroy() {
        this.particles = [];
    }
}

class AuroraParticle {
    constructor(width, height) {
        this.reset(width, height);
    }
    reset(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 200 + 150;
        this.color = CONFIG.aurora.colors[Math.floor(Math.random() * CONFIG.aurora.colors.length)];
        this.alpha = Math.random() * 0.1 + 0.05;
        this.phase = Math.random() * Math.PI * 2;
    }
    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += 0.002;
        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;
    }
    draw(ctx) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        const currentAlpha = this.alpha + Math.sin(this.phase) * 0.02;
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ═══ ENGINE 2: LIGHT NETWORK ═══ */
class LightNetworkEngine {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.particles = [];
        this.burstHandler = (e) => this.burst(e.clientX, e.clientY);
        window.addEventListener('pointerdown', this.burstHandler);
        this.init();
    }

    getParticleCount() {
        if (this.width > 1024) return CONFIG.network.count.desktop;
        if (this.width > 768) return CONFIG.network.count.tablet;
        return CONFIG.network.count.mobile;
    }

    init() {
        const count = this.getParticleCount();
        for (let i = 0; i < count; i++) {
            this.particles.push(new NetParticle(this.width, this.height));
        }
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        if (this.particles.length < this.getParticleCount()) {
            const diff = this.getParticleCount() - this.particles.length;
            for (let i = 0; i < diff; i++) this.particles.push(new NetParticle(this.width, this.height));
        } else if (this.particles.length > this.getParticleCount()) {
            this.particles.splice(0, this.particles.length - this.getParticleCount());
        }
    }

    update() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.particles.forEach(p => {
            p.update(this.width, this.height);
            p.draw(this.ctx);
        });
        this.drawConnections();
    }

    drawConnections() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = CONFIG.network.lineColor;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.particles.length; i++) {
            const a = this.particles[i];
            for (let j = i + 1; j < this.particles.length; j++) {
                const b = this.particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.network.connectDist) {
                    this.ctx.moveTo(a.x, a.y);
                    this.ctx.lineTo(b.x, b.y);
                }
            }
        }
        this.ctx.stroke();
    }

    burst(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new NetParticle(this.width, this.height, x, y, true));
        }
    }

    destroy() {
        window.removeEventListener('pointerdown', this.burstHandler);
        this.particles = [];
    }
}

class NetParticle {
    constructor(width, height, x = null, y = null, isBurst = false) {
        this.width = width;
        this.height = height;
        this.x = x !== null ? x : Math.random() * width;
        this.y = y !== null ? y : Math.random() * height;
        this.vx = (Math.random() - 0.5) * (isBurst ? 4 : 0.5);
        this.vy = (Math.random() - 0.5) * (isBurst ? 4 : 0.5);
        this.size = Math.random() * 3 + 1;
        this.isBurst = isBurst;
        this.life = 1.0;
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.isBurst) {
            this.life -= 0.02;
        } else {
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse Repel
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 2;
                this.y += Math.sin(angle) * force * 2;
            }
        }
    }

    draw(ctx) {
        if (this.isBurst && this.life <= 0) return;
        ctx.fillStyle = CONFIG.network.colors[Math.floor(Math.random() * 2)]; // Simple pick
        ctx.globalAlpha = this.isBurst ? this.life : 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ENGINES REGISTRY (Must be after class definitions due to JavaScript hoisting)
// ═══════════════════════════════════════════════════════════════════════════
const ENGINES = {
    aurora: DarkAuroraEngine,
    network: LightNetworkEngine,
    static: class StaticEngine {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
        }
        resize(w, h) { this.width = w; this.height = h; }
        update() { /* No-op */ }
        destroy() { this.ctx.clearRect(0, 0, this.width, this.height); }
    }
};
