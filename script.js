/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LINK IN BIO: ULTRA-LIGHT.JS
 * Powered by Vanilla JS & Canvas API (No GSAP)
 * Refactored: 2026-01-08
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ThemeManager } from './shared/theme.js';
import { Typer, initHaptics, initMagneticButtons } from './shared/utils.js';
import { BackgroundManager } from './js/background-manager.js';
import { initAnalytics } from './shared/analytics.js';

// 1. INIT SHARED CORE
// ══════════════════════════════════════════════
if (typeof CONFIG_DATA !== 'undefined') {
  initAnalytics(CONFIG_DATA.analytics);
}

const themeManager = new ThemeManager({
  toggleElement: document.getElementById('theme-toggle'),
  iconElement: document.getElementById('theme-icon')
});

initHaptics();

// 2. SPOTLIGHT & VISUALS
// ══════════════════════════════════════════════
function initSpotlights() {
  if ('ontouchstart' in window) return;
  const cards = document.querySelectorAll('.link-button');

  document.addEventListener('mousemove', (e) => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });
}

function initProfileTilt() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || 'ontouchstart' in window) return;

  const avatar = document.querySelector('.avatar-wrapper');
  const container = document.querySelector('.profile-header');
  if (!avatar || !container) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    avatar.style.transform = `perspective(1000px) rotateY(${x * 0.1}deg) rotateX(${-y * 0.1}deg)`;
  });

  container.addEventListener('mouseleave', () => {
    avatar.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    avatar.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => { avatar.style.transition = ''; }, 800);
  });
}

// 3. CONTENT RENDERER (Config-Driven)
// ══════════════════════════════════════════════
const ContentRenderer = {
  init() {
    if (typeof CONFIG_DATA === 'undefined') return;

    // 0. HYDRATION (NEW: Customization Pack 1)
    if (typeof CONFIG_DATA.siteTitle === 'string') {
      document.title = CONFIG_DATA.siteTitle;
    }

    if (CONFIG_DATA.meta) {
      const metaKeys = Object.keys(CONFIG_DATA.meta);
      metaKeys.forEach(key => {
        let meta = document.querySelector(`meta[name="${key}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = key;
          document.head.appendChild(meta);
        }
        meta.content = CONFIG_DATA.meta[key];
      });
    }

    // Dynamic Favicon
    if (CONFIG_DATA.favicon) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      link.href = CONFIG_DATA.favicon;
      document.head.appendChild(link);
    }

    // Plugin Loader (NEW)
    if (CONFIG_DATA.plugins && Array.isArray(CONFIG_DATA.plugins)) {
      CONFIG_DATA.plugins.forEach(plugin => {
        const script = document.createElement('script');
        script.src = plugin.src;
        script.async = plugin.async !== false;
        document.body.appendChild(script);
      });
    }

    // Dynamic Theme Colors
    if (CONFIG_DATA.theme && CONFIG_DATA.theme.colors) {
      const { primary, secondary } = CONFIG_DATA.theme.colors;
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --accent-cyan: ${primary};
          --accent-purple: ${secondary};
        }
      `;
      document.head.appendChild(style);
    }

    // Dynamic Fonts (NEW: Font Loader)
    if (CONFIG_DATA.theme && CONFIG_DATA.theme.fonts) {
      const { display, body } = CONFIG_DATA.theme.fonts;
      // 1. Load Font
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${display.replace(/ /g, '+')}:wght@700;800&family=${body.replace(/ /g, '+')}:wght@400;500;600&display=swap`;
      document.head.appendChild(link);

      // 2. Set Variables
      const fontStyle = document.createElement('style');
      fontStyle.textContent = `
        :root {
          --font-display: '${display}', system-ui, sans-serif;
          --font-body: '${body}', system-ui, sans-serif;
        }
      `;
      document.head.appendChild(fontStyle);
    }

    // WIDGET SYSTEM (NEW: Layout Engine)
    this.renderLayout();
  },

  renderLayout() {
    const main = document.getElementById('main-content');
    if (!main) return;

    // Clear existing static content if layout is defined
    if (CONFIG_DATA.layout) {
      main.innerHTML = '';
      CONFIG_DATA.layout.forEach(widget => {
        switch (widget.type) {
          case 'hero': this.renderHero(main); break;
          case 'bio': this.renderBio(main); break;
          case 'socials': this.renderSocials(main); break;
          case 'links': this.renderLinksWidget(main); break;
          case 'html': this.renderHtml(main, widget.content); break;
        }
      });
    } else {
      // Fallback for existing static HTML structure hydration
      // (Legacy support if layout config is missing)
      this.hydrateStatic();
    }
  },

  renderSocials(container) {
    if (!CONFIG_DATA.socials || CONFIG_DATA.socials.length === 0) return;

    const section = document.createElement('div');
    section.className = 'social-section';

    const list = document.createElement('div');
    list.className = 'social-list';

    CONFIG_DATA.socials.forEach(social => {
      // Resolve Alias
      let iconClass = social.icon;
      if (CONFIG_DATA.socialAliases && CONFIG_DATA.socialAliases[social.icon]) {
        iconClass = CONFIG_DATA.socialAliases[social.icon];
      }

      // Extract brand for color mapping
      const brandMatch = iconClass.match(/fa-([a-z]+)/);
      const brand = brandMatch ? brandMatch[1] : 'default';

      const a = document.createElement('a');
      a.href = social.url;
      a.className = 'social-link hover-trigger';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.ariaLabel = social.label || social.icon; // Fallback accessibility label
      a.dataset.brand = brand;

      a.innerHTML = `<i class="${iconClass} social-icon"></i>`;

      list.appendChild(a);
    });

    section.appendChild(list);
    container.appendChild(section);

    // Init Magnetic Effect
    initMagneticButtons('.social-link');
  },

  renderHero(container) {
    const profile = CONFIG_DATA.profile;
    const header = document.createElement('header');
    header.className = 'profile-header';
    header.innerHTML = `
      <div class="avatar-section">
        <div class="avatar-wrapper drag-target">
          <img src="${profile.avatar}" alt="${profile.name}" class="avatar-premium" id="profile-avatar" width="280" height="380">
          <span class="verified-badge" title="Verified"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="icon-verified"><path d="m325-2-86-146-165-37 17-168-111-127L91-607 74-775l165-37 86-146 155 66 155-66 86 146 165 37-17 168 111 127-111 127 17 168-165 37-86 146-155-66-155 66Zm113-317 245-246-75-74-170 170-85-86-76 75 161 161Z"/></svg></span>
          <div class="avatar-ring"></div>
          <div class="avatar-dots"></div>
        </div>
        <div class="status-badge glass"><span class="status-dot"></span><span>Available for opportunities</span></div>
      </div>
      <div class="identity">
        <h1 class="name"><span class="typing-text" data-text="${profile.name}"></span><span class="cursor"></span></h1>
        <p class="tagline">${profile.tagline}</p>
      </div>
    `;
    container.appendChild(header);
  },

  renderBio(container) {
    if (!CONFIG_DATA.profile.bio) return;
    const section = document.createElement('section');
    section.className = 'bio-section';
    section.innerHTML = `<p class="bio-text">${CONFIG_DATA.profile.bio}</p>`;
    container.appendChild(section);
  },

  renderLinksWidget(container) {
    const nav = document.createElement('nav');
    nav.className = 'links-section';
    nav.innerHTML = `<div id="tabs-container" class="tabs-container"></div><ul class="link-list" id="link-list"></ul>`;
    container.appendChild(nav);

    // Trigger the existing logic to populate this list
    // We need to delay slightly or call logic directly
    // Refactoring the logic into a method we can call:
    this.populateLinksLogic();
  },

  renderHtml(container, content) {
    const div = document.createElement('div');
    div.className = 'widget-html';
    div.innerHTML = content;
    container.appendChild(div);
  },

  populateLinksLogic() {
    const linkList = document.getElementById('link-list');
    const tabsContainer = document.getElementById('tabs-container');
    if (!linkList) return;

    const categories = [...new Set(CONFIG_DATA.links.map(link => link.category).filter(Boolean))];

    const renderLinks = (filterCategory) => {
      linkList.innerHTML = '';

      let filteredLinks = CONFIG_DATA.links;
      if (filterCategory && filterCategory !== 'All') {
        filteredLinks = CONFIG_DATA.links.filter(link => link.category === filterCategory);
      }

      filteredLinks.forEach((link, index) => {
        // ALIAS RESOLUTION
        let iconClass = link.icon;
        if (CONFIG_DATA.socialAliases && CONFIG_DATA.socialAliases[link.icon]) {
          iconClass = CONFIG_DATA.socialAliases[link.icon];
        }

        const brandMatch = iconClass.match(/fa-([a-z]+)/);
        const brand = brandMatch ? brandMatch[1] : 'default';
        const li = document.createElement('li');
        const isSecondary = link.style === 'secondary';
        const secondaryClass = isSecondary ? 'link-button--secondary' : '';

        li.style.animationDelay = `${index * 100}ms`;
        li.classList.add('fade-in-up');

        li.innerHTML = `
                      <a href="${link.url}" class="link-button ${secondaryClass} hover-trigger" target="_blank" rel="noopener noreferrer" data-brand="${brand}">
                        <i class="${iconClass} link-icon"></i>
                        <span class="link-label">${link.label}</span>
                        <i class="fas fa-arrow-right link-arrow"></i>
                      </a>
                    `;
        linkList.appendChild(li);
      });

      // Re-bind effects
      initMagneticButtons('.link-button');
      initSpotlights(); // Re-query DOM
    };

    if (tabsContainer && categories.length > 0) {
      const allCategories = ['All', ...categories];
      let activeCategory = 'All';

      const renderTabs = () => {
        tabsContainer.innerHTML = '';
        allCategories.forEach(cat => {
          const btn = document.createElement('button');
          btn.className = `tab-button ${cat === activeCategory ? 'active' : ''}`;
          btn.textContent = cat;
          btn.addEventListener('click', () => {
            activeCategory = cat;
            renderTabs();
            renderLinks(cat);
          });
          tabsContainer.appendChild(btn);
        });
      };
      renderTabs();
      renderLinks(activeCategory);
    } else {
      renderLinks();
    }
  },

  hydrateStatic() {
    // Original Hydration Logic (Profile, etc)
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

    this.populateLinksLogic();
  }
};

// 4. BOOTSTRAP
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Render Content
  ContentRenderer.init();

  // Init Background
  BackgroundManager.init();
  // Force initial set mode based on theme manager
  BackgroundManager.setMode(themeManager.getMode());

  // Init UI Effects
  initProfileTilt();

  // Typing
  // We need to wait for ContentRenderer to potentially inject the element
  setTimeout(() => {
    const nameEl = document.querySelector('.typing-text');
    if (nameEl && nameEl.dataset.text) {
      new Typer(nameEl, nameEl.dataset.text);
    }
  }, 50);

  // Image Protection
  document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });
});
