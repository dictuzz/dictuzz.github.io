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
if (typeof SITE_CONFIG !== 'undefined') {
  initAnalytics(SITE_CONFIG.analytics);
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

    // Profile
    const profile = CONFIG_DATA.profile;
    const avatarEl = document.getElementById('profile-avatar');
    const nameEl = document.getElementById('profile-name');
    const taglineEl = document.getElementById('profile-tagline');
    const bioEl = document.getElementById('profile-bio');

    if (avatarEl) avatarEl.src = profile.avatar;
    if (nameEl) {
      nameEl.dataset.text = profile.name; // For Typer
      nameEl.textContent = "";
    }
    if (taglineEl) taglineEl.textContent = profile.tagline;
    if (bioEl) bioEl.innerHTML = profile.bio;

    // Links
    const linkList = document.getElementById('link-list');
    const tabsContainer = document.getElementById('tabs-container');

    if (linkList) {
      const categories = [...new Set(CONFIG_DATA.links.map(link => link.category).filter(Boolean))];

      const renderLinks = (filterCategory) => {
        linkList.innerHTML = '';

        let filteredLinks = CONFIG_DATA.links;
        if (filterCategory && filterCategory !== 'All') {
          filteredLinks = CONFIG_DATA.links.filter(link => link.category === filterCategory);
        }

        filteredLinks.forEach((link, index) => {
          const brandMatch = link.icon.match(/fa-([a-z]+)/);
          const brand = brandMatch ? brandMatch[1] : 'default';
          const li = document.createElement('li');
          const isSecondary = link.style === 'secondary';
          const secondaryClass = isSecondary ? 'link-button--secondary' : '';

          li.style.animationDelay = `${index * 100}ms`;
          li.classList.add('fade-in-up');

          li.innerHTML = `
                      <a href="${link.url}" class="link-button ${secondaryClass} hover-trigger" target="_blank" rel="noopener noreferrer" data-brand="${brand}">
                        <i class="${link.icon} link-icon"></i>
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
    }

    // Footer
    const footerText = document.getElementById('footer-text');
    if (footerText && CONFIG_DATA.footer) {
      footerText.innerHTML = CONFIG_DATA.footer.copyright || `© ${new Date().getFullYear()} dictuzz.`;
    }
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
  const nameEl = document.querySelector('#profile-name');
  if (nameEl && nameEl.dataset.text) {
    new Typer(nameEl, nameEl.dataset.text);
  }

  // Image Protection
  document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });
});
