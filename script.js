/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LINK IN BIO — ULTRA-LIGHT.JS
 * Powered by Vanilla JS & Canvas API (No GSAP)
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════
  const CONFIG = {
    cursorBlinkDuration: 530,

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
      repoelDist: 150,
      connectDist: 80
    }
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let canvas, ctx, width, height;
  let mouse = { x: -500, y: -500 };

  // ═══════════════════════════════════════════
  // 1. BACKGROUND MANAGER (Dual Engine)
  // ═══════════════════════════════════════════
  const BackgroundManager = {
    activeEngine: null,
    animationId: null,

    init() {
      if (prefersReducedMotion) return;
      canvas = document.getElementById('ambient-canvas');
      if (!canvas) return;
      ctx = canvas.getContext('2d');

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
    },

    resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (this.activeEngine) this.activeEngine.resize();
    },

    setMode(mode) {
      if (prefersReducedMotion) return;

      if (this.animationId) cancelAnimationFrame(this.animationId);
      if (this.activeEngine && this.activeEngine.destroy) this.activeEngine.destroy();
      ctx.clearRect(0, 0, width, height);

      if (mode === 'light') {
        this.activeEngine = new LightNetworkEngine();
      } else {
        this.activeEngine = new DarkAuroraEngine();
      }

      this.loop();
    },

    loop() {
      this.animationId = requestAnimationFrame(this.loop.bind(this));
      ctx.clearRect(0, 0, width, height);
      if (this.activeEngine) this.activeEngine.update();
    }
  };

  // ─── ENGINE 1: DARK AURORA ─────────────────────
  class DarkAuroraEngine {
    constructor() {
      this.particles = [];
      this.init();
      ctx.globalCompositeOperation = 'screen';
    }

    init() {
      for (let i = 0; i < CONFIG.aurora.count; i++) {
        this.particles.push(new AuroraParticle());
      }
    }

    resize() { }

    update() {
      ctx.globalCompositeOperation = 'screen';
      this.particles.forEach(p => {
        p.update();
        p.draw();
      });
    }

    destroy() {
      this.particles = [];
    }
  }

  class AuroraParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.radius = Math.random() * 200 + 150;
      this.color = CONFIG.aurora.colors[Math.floor(Math.random() * CONFIG.aurora.colors.length)];
      this.alpha = Math.random() * 0.1 + 0.05;
      this.phase = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += 0.002;
      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = height + this.radius;
      if (this.y > height + this.radius) this.y = -this.radius;
    }
    draw() {
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

  // ─── ENGINE 2: LIGHT NETWORK ───────────────────
  class LightNetworkEngine {
    constructor() {
      this.particles = [];
      this.init();
      this.burstHandler = (e) => this.burst(e.clientX, e.clientY);
      window.addEventListener('pointerdown', this.burstHandler);
    }

    getParticleCount() {
      if (width > 1024) return CONFIG.network.count.desktop;
      if (width > 768) return CONFIG.network.count.tablet;
      return CONFIG.network.count.mobile;
    }

    init() {
      const count = this.getParticleCount();
      for (let i = 0; i < count; i++) {
        this.particles.push(new NetParticle());
      }
    }

    resize() {
      if (this.particles.length < this.getParticleCount()) {
        const diff = this.getParticleCount() - this.particles.length;
        for (let i = 0; i < diff; i++) this.particles.push(new NetParticle());
      } else if (this.particles.length > this.getParticleCount()) {
        this.particles.splice(0, this.particles.length - this.getParticleCount());
      }
    }

    update() {
      ctx.globalCompositeOperation = 'source-over';

      this.particles.forEach(p => {
        p.update();
        p.draw();
      });

      this.drawConnections();
    }

    drawConnections() {
      ctx.beginPath();
      ctx.strokeStyle = CONFIG.network.lineColor;
      ctx.lineWidth = 1;

      for (let i = 0; i < this.particles.length; i++) {
        const a = this.particles[i];
        for (let j = i + 1; j < this.particles.length; j++) {
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONFIG.network.connectDist) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.stroke();
    }

    burst(x, y) {
      for (let i = 0; i < 8; i++) {
        this.particles.push(new NetParticle(x, y, true));
      }
    }

    destroy() {
      window.removeEventListener('pointerdown', this.burstHandler);
      this.particles = [];
    }
  }

  class NetParticle {
    constructor(x, y, isTemp = false) {
      this.isTemp = isTemp;
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.color = CONFIG.network.colors[Math.floor(Math.random() * CONFIG.network.colors.length)];
      this.life = 1.0;
    }

    update() {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.network.repoelDist) {
        const forceDirectionX = dx / dist;
        const forceDirectionY = dy / dist;
        const force = (CONFIG.network.repoelDist - dist) / CONFIG.network.repoelDist;
        const directionX = forceDirectionX * force * 2;
        const directionY = forceDirectionY * force * 2;
        this.vx -= directionX;
        this.vy -= directionY;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (this.isTemp) {
        this.life -= 0.02;
        if (this.life <= 0) this.x = -9999;
      }
    }

    draw() {
      if (this.x < -100) return;
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.isTemp ? this.life : 0.6;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  // ═══════════════════════════════════════════
  // 2. MAGNETIC BUTTONS (Vanilla JS)
  // ═══════════════════════════════════════════
  function initMagneticButtons() {
    if (prefersReducedMotion || 'ontouchstart' in window) return;

    const buttons = document.querySelectorAll('.link-button');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Apply magnetic effect using CSS Transform directly
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px) rotateX(${-y * 0.1}deg) rotateY(${x * 0.1}deg)`;

        // Staggered children effect (optional, simplified)
        const children = btn.children;
        for (let i = 0; i < children.length; i++) {
          children[i].style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
          children[i].style.transition = 'none'; // Instant follow
        }
      });

      btn.addEventListener('mouseleave', () => {
        // Reset with smooth transition via CSS
        btn.style.transform = '';
        const children = btn.children;
        for (let i = 0; i < children.length; i++) {
          children[i].style.transform = '';
          children[i].style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        }
      });
    });
  }

  function initHaptics() {
    if (!('vibrate' in navigator)) return;
    // Delegate event listener for better performance
    document.addEventListener('click', (e) => {
      if (e.target.closest('.link-button, .social-link, #theme-toggle')) {
        navigator.vibrate(5);
      }
    });
  }

  // ═══════════════════════════════════════════
  // 3. THEME SWITCHER
  // ═══════════════════════════════════════════
  function initThemeSwitcher() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!toggleBtn || !icon) return;

    const storedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark = storedTheme ? storedTheme === 'dark' : (storedTheme ? false : systemDark);
    if (!storedTheme && !systemDark) isDark = true;

    function applyTheme(dark) {
      if (dark) {
        document.documentElement.removeAttribute('data-theme');
        icon.className = 'fas fa-sun'; // FontAwesome class
        BackgroundManager.setMode('dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.className = 'fas fa-moon'; // FontAwesome class
        BackgroundManager.setMode('light');
      }
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }

    applyTheme(isDark);

    toggleBtn.addEventListener('click', () => {
      isDark = !isDark;

      // Simple rotation animation
      icon.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      icon.style.transform = 'rotate(180deg) scale(0.5)';

      setTimeout(() => {
        applyTheme(isDark);
        icon.style.transform = 'rotate(0deg) scale(1)';
      }, 150);

      createRipple(toggleBtn);
    });

    function createRipple(btn) {
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.background = 'rgba(255, 255, 255, 0.2)';
      circle.style.transform = 'scale(0)';
      circle.style.animation = 'ripple 0.6s linear';
      circle.style.left = '0';
      circle.style.top = '0';
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    }
  }

  // ═══════════════════════════════════════════
  // SPOTLIGHT LOGIC (Optimized)
  // ═══════════════════════════════════════════
  let cachedCards = [];

  function initSpotlights() {
    if ('ontouchstart' in window) return;
    cachedCards = Array.from(document.querySelectorAll('.link-button'));
    window.addEventListener('mousemove', updateSpotlights);
  }

  function updateSpotlights(e) {
    if (cachedCards.length === 0) return;
    cachedCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  }

  // ═══════════════════════════════════════════
  // 4. TYPING CLASS (Unified from Resume)
  // ═══════════════════════════════════════════
  class Typer {
    constructor(el, texts, speed = 50) {
      this.el = el;
      this.texts = texts; // Array of strings if we want rotation, otherwise single string
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

      // Cycle (not implemented here as root only needs single name typing usually)
    }

    async type(text) {
      for (let i = 0; i < text.length; i++) {
        this.el.textContent += text[i];
        const randomSpeed = this.speed + (Math.random() * 20 - 10);
        await new Promise(r => setTimeout(r, randomSpeed));
      }
    }
  }

  function initProfileTilt() {
    if (prefersReducedMotion || 'ontouchstart' in window) return;
    const avatar = document.querySelector('.avatar-wrapper');
    const container = document.querySelector('.profile-header');
    if (!avatar || !container) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Vanilla JS Tilt
      avatar.style.transform = `perspective(1000px) rotateY(${x * 0.1}deg) rotateX(${-y * 0.1}deg)`;
    });

    container.addEventListener('mouseleave', () => {
      avatar.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
      avatar.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'; // Elastic ease emulation
      setTimeout(() => { avatar.style.transition = ''; }, 800); // Cleanup transition to allow mousemove instant update
    });
  }

  // ═══════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════
    // 0. CONTENT RENDERER (Config-Driven)
    // ═══════════════════════════════════════════
    const ContentRenderer = {
      init() {
        if (typeof CONFIG_DATA === 'undefined') {
          // Config data not loaded
          return;
        }

        // 1. Profile
        const profile = CONFIG_DATA.profile;
        const avatarEl = document.getElementById('profile-avatar');
        const nameEl = document.getElementById('profile-name');
        const taglineEl = document.getElementById('profile-tagline');
        const bioEl = document.getElementById('profile-bio');

        if (avatarEl) avatarEl.src = profile.avatar;
        if (nameEl) {
          nameEl.dataset.text = profile.name;
          nameEl.textContent = "";
        }
        if (taglineEl) taglineEl.textContent = profile.tagline;
        if (bioEl) bioEl.innerHTML = profile.bio;

        // 2. Links
        const linkList = document.getElementById('link-list');
        if (linkList) {
          linkList.innerHTML = '';
          CONFIG_DATA.links.forEach(link => {
            // Extract brand from icon (e.g. "fa-whatsapp" -> "whatsapp")
            const brandMatch = link.icon.match(/fa-([a-z]+)/);
            const brand = brandMatch ? brandMatch[1] : 'default';

            const li = document.createElement('li');
            li.innerHTML = `
              <a href="${link.url}" class="link-button hover-trigger" target="_blank" rel="noopener noreferrer" data-brand="${brand}">
                <i class="${link.icon} link-icon"></i>
                <span class="link-label">${link.label}</span>
                <i class="fas fa-arrow-right link-arrow"></i>
              </a>
            `;
            linkList.appendChild(li);
          });
        }

        // 3. Footer
        const footerText = document.getElementById('footer-text');
        if (footerText) {
          footerText.innerHTML = CONFIG_DATA.footer.copyright || `© ${new Date().getFullYear()} dictuzz. All rights reserved.`;
        }
      }
    };

    ContentRenderer.init();
    BackgroundManager.init();

    // Instant Init
    initMagneticButtons();
    initProfileTilt();
    initThemeSwitcher();
    initHaptics();

    initSpotlights();

    // Unified Typer usage
    const nameEl = document.querySelector('.name .typing-text');
    if (nameEl && nameEl.dataset.text) {
      new Typer(nameEl, nameEl.dataset.text);
    }

    // Register SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .catch(() => { /* Service Worker registration failed silently */ });
    }

    // IMAGE PROTECTION (No Right Click)
    document.addEventListener('contextmenu', e => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    });
  });

})();
