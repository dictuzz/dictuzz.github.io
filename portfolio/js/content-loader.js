/**
 * PORTFOLIO CONTENT LOADER
 * Hydrates the HTML with data from PORTFOLIO_CONTENT (data.js)
 */
import { initCurtainPage } from './curtain.js';
import { initProofPage } from './proof.js';
import { initThreadPage } from './thread.js';
import { initSignalPage } from './signal.js';

// Initialize by fetching JSON
fetch('/data/global-config.json')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load global config');
    return response.json();
  })
  .then(data => {
    window.PORTFOLIO_CONTENT = data;
    initLoader();
  })
  .catch(err => {
    console.error('PORTFOLIO_CONTENT fetch error:', err);
  });

function initLoader() {
  const DATA = window.PORTFOLIO_CONTENT;
  const portfolioData = DATA.portfolio;
  if (!portfolioData) return;

  // 1. GLOBAL HYDRATION (Meta, Footer)
  hydrateExamples(portfolioData.global);

  // Web Component Hydration
  const navEl = document.querySelector('global-nav');
  if (navEl) navEl.data = portfolioData.global;

  const footerEl = document.querySelector('global-footer');
  if (footerEl) footerEl.data = portfolioData.global;

  // 2. SECTION HYDRATION
  // Since we are now a single page, we try to hydrate everything.
  // Each function checks for the existence of its container.
  if (portfolioData.curtain) hydrateCurtain(portfolioData.curtain);
  if (portfolioData.proof) renderProof(portfolioData.proof);
  if (portfolioData.thread) renderThread(portfolioData.thread);
  if (portfolioData.signal) renderSignal(portfolioData.signal);
}

function getPageName() {
  // Legacy support or if we ever split pages again
  return 'index';
}

// -------------------------------------------------------------
// RENDERERS
// -------------------------------------------------------------

function hydrateExamples(data) {
  // Hydrate elements with data-i18n="global.key"
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const value = getNestedValue(window.PORTFOLIO_CONTENT, key);
    if (value) el.innerHTML = value;
  });
}

class GlobalNav extends HTMLElement {
  set data(data) {
    if (!data || !data.navigation) return;
    const currentPath = window.location.pathname;
    const isMainPage = currentPath.endsWith('/portfolio/') || currentPath.endsWith('/portfolio/index.html') || currentPath.endsWith('/portfolio');
    const basePath = isMainPage ? '' : '/portfolio/';

    const navLinks = data.navigation
      .map((link) => {
        let href = link.url;
        let sectionId = href.replace('.html', '');
        if (sectionId === 'index') sectionId = 'curtain';
        href = `${basePath}#${sectionId}`;

        const subtitleHtml = link.subtitle ? `<span class="nav-subtitle">${link.subtitle}</span>` : '';
        return `<li><a href="${href}" class="glass-nav-link"><span class="nav-label">${link.label}</span>${subtitleHtml}</a></li>`;
      })
      .join('');

    this.innerHTML = `
      <nav class="glass-nav" aria-label="Main Navigation">
          <ul class="glass-nav-list">
              ${navLinks}
          </ul>
      </nav>
      `;
  }
}

class GlobalFooter extends HTMLElement {
  set data(data) {
    if (!data) return;
    const currentPath = window.location.pathname;
    const isMainPage = currentPath.endsWith('/portfolio/') || currentPath.endsWith('/portfolio/index.html') || currentPath.endsWith('/portfolio');
    const basePath = isMainPage ? '' : '/portfolio/';

    const navLinksHtml = (data.navigation || [])
      .map((link) => {
        let href = link.url;
        let sectionId = href.replace('.html', '');
        if (sectionId === 'index') sectionId = 'curtain';
        href = `${basePath}#${sectionId}`;
        return `<a href="${href}" class="footer-link">${link.label}</a>`;
      })
      .join('');

    const socialLinksHtml = (data.socials || [])
      .map(
        (link) =>
          `<a href="${link.url}" class="footer-link" target="_blank" rel="noopener">${link.label}</a>`
      )
      .join('');

    this.innerHTML = `
      <footer class="site-footer">
          <div class="footer-inner">
              <div class="footer-section">
                  <h3 class="footer-heading">Navigate</h3>
                  <nav class="footer-nav-dynamic">${navLinksHtml}</nav>
              </div>
              <div class="footer-section">
                  <h3 class="footer-heading">Contact</h3>
                  <nav class="footer-contact-dynamic">${socialLinksHtml}</nav>
              </div>
              <div class="footer-section footer-legal">
                  <h3 class="footer-heading">Terms &amp; Privacy</h3>
                  <a href="terms.html" class="footer-link">Read Terms</a>
                  <p class="footer-terms">By submitting information, you agree to our terms.</p>
              </div>
          </div>
          <div class="footer-bottom">
              <p>${data.footer.copyright}</p>
              <p class="footer-tagline">${data.footer.tagline}</p>
          </div>
      </footer>
      `;
  }
}

customElements.define('global-nav', GlobalNav);
customElements.define('global-footer', GlobalFooter);

function hydrateCurtain(data) {
  const nameEl = document.querySelector('.curtain-name');
  if (nameEl && data.textLines) {
    nameEl.innerHTML = data.textLines.join('<br>'); // Simple join for HTML display
  }

  const taglineEl = document.querySelector('.curtain-declaration');
  if (taglineEl && data.tagline) {
    taglineEl.textContent = data.tagline;
  }

  initCurtainPage();
}

function renderProof(data) {
  const container = document.querySelector('.featured-work');
  if (!container || !data.experiences) return;

  container.innerHTML = data.experiences
    .map(
      (exp, index) => `
            <article class="experience" id="${exp.id}">
                <header class="experience-entry">
                    <p class="experience-hook">${exp.hook}</p>
                    <p class="experience-meta">${exp.role} · ${exp.company} · ${exp.date}</p>
                </header>

                <figure class="experience-artifact">
                    <img src="${exp.image}" 
                         width="1200" height="675"
                         alt="${exp.alt}" loading="lazy">
                </figure>

                <div class="experience-body">
                    ${window.marked ? marked.parse(exp.body) : exp.body}
                </div>
                
                ${exp.links && exp.links.length > 0 ? `
                <div class="experience-links">
                    ${exp.links.map(link => `<a href="${link.url}" class="btn-outline" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join('')}
                </div>
                ` : ''}

                <blockquote class="experience-takeaway">
                    <p>${exp.takeaway}</p>
                </blockquote>
            </article>
        `
    )
    .join('');

  // Re-init animations for the new elements if script ran early
  if (window.ScrollTrigger) ScrollTrigger.refresh();

  // Retrigger proof.js init if it exists
  initProofPage();
}

function renderThread(data) {
  const thesisEl = document.querySelector('.thread-thesis p');
  if (thesisEl && data.thesis) thesisEl.textContent = data.thesis;

  const main = document.querySelector('main.thread');

  // Remove existing clusters to render fresh
  const existingClusters = document.querySelectorAll('.thread-cluster');
  existingClusters.forEach((el) => el.remove());

  const footer = document.querySelector('.thread-footnote');

  // Render Clusters
  if (data.clusters) {
    const clusterHTML = data.clusters
      .map(
        (cluster) => `
                <section class="thread-cluster">
                    <h2 class="cluster-heading">${cluster.title}</h2>
                    ${window.marked ? marked.parse(cluster.content) : cluster.content}
                </section>
            `
      )
      .join('');

    // Insert before footnote or append to main if it exists
    if (footer) {
      footer.insertAdjacentHTML('beforebegin', clusterHTML);
    } else if (main) {
      main.insertAdjacentHTML('beforeend', clusterHTML);
    }
  }

  // Render Footnotes
  if (footer && data.footnotes) {
    const dl = footer.querySelector('dl');
    if (dl) {
      dl.innerHTML = data.footnotes
        .map(
          (note) => `
                    <div class="footnote-item">
                        <dt>${note.title}</dt>
                        <dd>${note.value}</dd>
                    </div>
                `
        )
        .join('');
    }
  }

  if (window.ScrollTrigger) ScrollTrigger.refresh();
  initThreadPage();
}

function renderSignal(data) {
  const sentence = document.querySelector('.signal-sentence');
  if (sentence && data.sentence) sentence.textContent = data.sentence;

  const channels = document.querySelector('.signal-channels');
  if (channels && window.PORTFOLIO_CONTENT.portfolio.global.socials) {
    // Merge global socials with pure contact emails?
    // The design has specific links. Let's use the layout from data.js

    // For now, let's keep the dedicated contact logic or map from global
    // But data.js global.socials has URLs.

    // Use specific Signal logic if defined, otherwise empty
    // The HTML had hardcoded links. We can regenerate them.

    // Let's assume user wants to edit LINKS in data.js global.socials
    const socials = window.PORTFOLIO_CONTENT.portfolio.global.socials;
    const email = window.PORTFOLIO_CONTENT.portfolio.global.email;

    let linksHTML = `<a href="mailto:${email}">Email</a>`;
    linksHTML += socials
      .map(
        (s) =>
          `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`
      )
      .join('');

    channels.innerHTML = linksHTML;
  }

  const form = document.querySelector('form.signal-form');
  if (form && data.form) {
    form.action = data.form.action;
    const fields = data.form.fields;

    // We assume structure matches. We can update placeholders/labels.
    if (fields.name) {
      const input = form.querySelector('input[name="name"]');
      if (input) input.placeholder = fields.name.placeholder;
    }
    if (fields.email) {
      const input = form.querySelector('input[name="email"]');
      if (input) input.placeholder = fields.email.placeholder;
    }
    if (fields.phone) {
      const input = form.querySelector('input[name="phone"]');
      if (input) input.placeholder = fields.phone.placeholder;
    }
    if (fields.topic) {
      const input = form.querySelector('textarea[name="topic"]');
      if (input) input.placeholder = fields.topic.placeholder;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn && data.form.submit) btn.textContent = data.form.submit;
  }

  if (window.ScrollTrigger) ScrollTrigger.refresh();
  initSignalPage();
}

// UTILS
function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
}

function generateSrcSet(url) {
  if (!url.includes('images.unsplash.com')) return '';

  // Base URL without params might be cleaner, but we assume the input url has params.
  // We will replace 'w=...' with our target widths.
  const base = url.split('?')[0];
  const params = new URLSearchParams(url.split('?')[1]);

  // Helper to build a variant
  const build = (w) => {
    params.set('w', w);
    params.set('h', Math.round(w * 0.5625)); // 16:9 aspect ratio
    return `${base}?${params.toString()} ${w}w`;
  };

  return `${build(400)}, ${build(800)}, ${build(1200)}`;
}
