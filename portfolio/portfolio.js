import { applyGlobalFooter } from '../js/site-renderers.js';
import { upgradeIcons } from '../js/icon-kit.js';
import { loadSiteConfig } from '../js/site-content.js';

const SUPPORTED_LANGS = ['en', 'id', 'de'];
const DEFAULT_LANG = 'en';
const LANG_KEY = 'dictuzz-lang';
const THEME_KEY = 'dictuzz-theme';

const STORAGE_OK = (() => {
  try {
    const t = '__t__';
    localStorage.setItem(t, t);
    localStorage.removeItem(t);
    return true;
  } catch { return false; }
})();

const docEl = document.documentElement;
const bodyEl = document.body;

const state = {
  lang: DEFAULT_LANG,
  data: null,
  siteConfig: null,
  pageType: bodyEl.dataset.page || 'landing',
  caseSlug: bodyEl.dataset.case || null
};

/* ---------- language ---------- */

function readStoredLang() {
  if (!STORAGE_OK) return null;
  try { return localStorage.getItem(LANG_KEY); } catch { return null; }
}
function writeStoredLang(lang) {
  if (!STORAGE_OK) return;
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }
}
function getInitialLang() {
  const url = new URLSearchParams(location.search).get('lang');
  if (SUPPORTED_LANGS.includes(url)) return url;
  const saved = readStoredLang();
  if (SUPPORTED_LANGS.includes(saved)) return saved;
  const nav = (navigator.language || '').slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGS.includes(nav)) return nav;
  return DEFAULT_LANG;
}
function pushLangUrl(lang) {
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url);
}

async function loadLocale(lang) {
  const url = `/content/portfolio/locales/${lang}.json`;
  const res = await fetch(url, { credentials: 'omit', cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load locale ${lang}: ${res.status}`);
  const text = await res.text();
  return JSON.parse(text.replace(/^\uFEFF/, ''));
}

/* ---------- theme ---------- */

function readStoredTheme() {
  if (!STORAGE_OK) return null;
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}
function writeStoredTheme(theme) {
  if (!STORAGE_OK) return;
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
}
function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  docEl.setAttribute('data-theme', next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', next === 'dark' ? '#0e1218' : '#f6efe1');
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(next === 'dark'));
    const labelKey = next === 'dark' ? 'themeToLight' : 'themeToDark';
    const label = state.data?.ui?.[labelKey];
    if (label) {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    }
  });
}
function initialTheme() {
  const saved = readStoredTheme();
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/* ---------- DOM helpers ---------- */

const escapeHtml = (s = '') => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function setText(selector, text) {
  document.querySelectorAll(selector).forEach((el) => { el.textContent = text ?? ''; });
}
function setHtml(selector, html) {
  document.querySelectorAll(selector).forEach((el) => { el.innerHTML = html ?? ''; });
}
function setAttr(selector, attr, value) {
  document.querySelectorAll(selector).forEach((el) => { el.setAttribute(attr, value); });
}

function iconHtml(name) {
  switch (name) {
    case 'envelope':
      return '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M2.5 5.5h15v9h-15z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.8 6 10 11l7.2-5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    case 'calendar':
      return '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="3" y="5" width="14" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3 8.5h14M7 3.5v3M13 3.5v3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
    case 'linkedin':
      return '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="2.5" y="2.5" width="15" height="15" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 8.6v6M6 6.4v.05M9 14.6v-3.6c0-1.4 2.5-1.6 2.5 0v3.6M14 14.6v-3.6c0-1.4-2.5-1.6-2.5 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
    case 'sun':
      return '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M4.4 15.6l1.4-1.4M14.2 5.8l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    case 'moon':
      return '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M16.5 12.4A6.5 6.5 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    default:
      return '';
  }
}

/* ---------- topbar ---------- */

function renderTopbar(data) {
  const ui = data.ui;
  const homeRoot = `/?lang=${state.lang}`;
  const resumeRoot = `/resume/?lang=${state.lang}`;

  setText('[data-i18n="brand"]', ui.brand);
  setText('[data-i18n="brandSub"]', ui.brandSub);

  const navLinks = document.querySelector('[data-topbar-nav]');
  if (navLinks) {
    const items = state.pageType === 'case'
      ? [
          { href: '/portfolio/', label: ui.allFiles },
          { href: homeRoot, label: ui.topbar.home },
          { href: resumeRoot, label: ui.topbar.resume }
        ]
      : [
          { href: homeRoot, label: ui.topbar.home },
          { href: resumeRoot, label: ui.topbar.resume },
          { href: '#cases', label: ui.topbar.files },
          { href: '#contact', label: ui.topbar.contact }
        ];
    navLinks.innerHTML = items.map(({ href, label }) => `<a href="${href}">${escapeHtml(label)}</a>`).join('');
  }

  const langWrap = document.querySelector('[data-lang-switcher]');
  if (langWrap) {
    langWrap.setAttribute('aria-label', ui.languageLabel);
    langWrap.innerHTML = SUPPORTED_LANGS.map((code) => {
      const isActive = code === state.lang;
      return `<button type="button" class="lang-btn${isActive ? ' is-active' : ''}" data-lang="${code}" aria-pressed="${isActive}" aria-label="${escapeHtml(ui.languageNames[code] || code)}">${escapeHtml(ui.languages[code] || code.toUpperCase())}</button>`;
    }).join('');
    langWrap.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchLang(btn.dataset.lang));
    });
  }

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.innerHTML = `<span class="theme-toggle__icon theme-toggle__icon--sun">${iconHtml('sun')}</span><span class="theme-toggle__icon theme-toggle__icon--moon">${iconHtml('moon')}</span>`;
  });

  const skip = document.querySelector('.skip-link');
  if (skip) skip.textContent = ui.skipLink;
}

/* ---------- landing ---------- */

function renderLanding(data) {
  const L = data.landing;

  document.title = L.documentTitle;
  setAttr('meta[name="description"]', 'content', L.metaDescription);
  document.documentElement.lang = state.lang;

  // Masthead
  setText('[data-masthead-strap-left]', L.masthead.strapLeft);
  setText('[data-masthead-strap-center]', L.masthead.strapCenter);
  setText('[data-masthead-strap-right]', L.masthead.strapRight);
  setText('[data-masthead-wordmark]', L.masthead.wordmark);
  setText('[data-masthead-subtitle]', L.masthead.subtitle);
  setText('[data-masthead-rule]', data.ui.magazineLabel);

  // Feature
  const f = L.feature;
  setText('[data-feature-kicker]', f.kicker);
  setText('[data-feature-headline]', f.headline);
  setText('[data-feature-deck]', f.deck);
  setText('[data-feature-byline]', f.byline);
  setText('[data-feature-meta]', f.meta);
  setAttr('[data-feature-link]', 'href', f.href + `?lang=${state.lang}`);
  setAttr('[data-feature-image]', 'src', f.image);
  setAttr('[data-feature-image]', 'alt', f.imageAlt || '');
  setText('[data-feature-caption]', f.caption);

  // Index
  setText('[data-index-label]', L.indexLabel);
  setText('[data-index-note]', L.indexNote);

  const list = document.querySelector('[data-secondary-list]');
  if (list && Array.isArray(L.secondary)) {
    list.innerHTML = L.secondary.map((item, i) => `
      <article class="dispatch reveal">
        <span class="dispatch__num">${String(i + 1).padStart(2, '0')}</span>
        <a class="dispatch__inner" href="${item.href}?lang=${state.lang}" data-track="case" data-slug="${item.slug}">
          <p class="dispatch__kicker">${escapeHtml(item.kicker)}</p>
          <h3 class="dispatch__title">${escapeHtml(item.title)}</h3>
          <p class="dispatch__deck">${escapeHtml(item.deck)}</p>
          <p class="dispatch__meta">${escapeHtml(item.meta)}</p>
        </a>
      </article>
    `).join('');
  }

  // Editor
  setText('[data-editor-kicker]', L.editor.kicker);
  setText('[data-editor-title]', L.editor.title);
  setText('[data-editor-lede]', L.editor.lede);

  const editorBody = document.querySelector('[data-editor-body]');
  if (editorBody && Array.isArray(L.editor.body)) {
    editorBody.innerHTML = L.editor.body.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  }

  const facts = document.querySelector('[data-editor-facts]');
  if (facts && Array.isArray(L.editor.facts)) {
    facts.innerHTML = L.editor.facts.map((fact) => `
      <div class="dossier__row">
        <dt>${escapeHtml(fact.label)}</dt>
        <dd>${escapeHtml(fact.value)}</dd>
      </div>
    `).join('');
  }

  // Contact
  setText('[data-contact-kicker]', L.contact.kicker);
  setText('[data-contact-title]', L.contact.title);
  setText('[data-contact-body]', L.contact.body);

  const actions = document.querySelector('[data-contact-actions]');
  if (actions && Array.isArray(L.contact.actions)) {
    actions.innerHTML = L.contact.actions.map((a) => {
      const ext = a.external ? ' target="_blank" rel="noopener"' : '';
      const cls = a.type === 'primary' ? 'btn-cta btn-cta--primary' : 'btn-cta btn-cta--ghost';
      return `<a class="${cls}" href="${a.href}"${ext}>${iconHtml(a.icon)}<span>${escapeHtml(a.label)}</span></a>`;
    }).join('');
  }
}

/* ---------- case page ---------- */

function renderCase(data) {
  const slug = state.caseSlug;
  const c = data.cases?.[slug];
  if (!c) return;

  document.title = c.documentTitle;
  setAttr('meta[name="description"]', 'content', c.metaDescription);
  document.documentElement.lang = state.lang;

  setText('[data-case-vol]', c.vol);
  setText('[data-case-kicker]', c.kicker);
  setText('[data-case-title]', c.title);
  setText('[data-case-deck]', c.deck);
  setText('[data-case-byline-role]', c.bylineRole);
  setText('[data-case-byline-meta]', c.bylineMeta);
  setHtml('[data-byline-prefix]', `${escapeHtml(data.ui.byline)}&nbsp;`);

  const figure = document.querySelector('[data-case-figure]');
  if (figure) {
    if (c.image) {
      figure.hidden = false;
      figure.innerHTML = `
        <img src="${c.image}" alt="${escapeHtml(c.imageAlt || '')}">
        <figcaption>${escapeHtml(c.caption || '')}</figcaption>
      `;
    } else {
      figure.hidden = true;
      figure.innerHTML = '';
    }
  }

  setText('[data-case-lead]', c.lead);

  const narrative = document.querySelector('[data-case-narrative]');
  if (narrative && Array.isArray(c.narrative)) {
    narrative.innerHTML = c.narrative.map((sec) => `
      <section class="article__section reveal">
        <h2>${escapeHtml(sec.heading)}</h2>
        <p>${escapeHtml(sec.body)}</p>
      </section>
    `).join('');
  }

  setText('[data-case-pull]', c.pull);

  setText('[data-evidence-label]', data.ui.evidence);
  const evidence = document.querySelector('[data-case-evidence]');
  if (evidence && Array.isArray(c.evidence)) {
    evidence.innerHTML = c.evidence.map((line, i) => `
      <li><span class="evidence__num">${String(i + 1).padStart(2, '0')}</span><span>${escapeHtml(line)}</span></li>
    `).join('');
  }

  setText('[data-impact-label]', data.ui.impact);
  const impact = document.querySelector('[data-case-impact]');
  if (impact && Array.isArray(c.impact)) {
    impact.innerHTML = c.impact.map((stat) => `
      <div class="impact__cell">
        <p class="impact__value">${escapeHtml(stat.value)}</p>
        <p class="impact__label">${escapeHtml(stat.label)}</p>
        <p class="impact__note">${escapeHtml(stat.note)}</p>
      </div>
    `).join('');
  }

  setText('[data-scope-label]', data.ui.scope);
  setText('[data-tools-label]', data.ui.tools);
  setHtml('[data-case-scope]', (c.scope || []).map((s) => `<li>${escapeHtml(s)}</li>`).join(''));
  setHtml('[data-case-tools]', (c.tools || []).map((s) => `<li>${escapeHtml(s)}</li>`).join(''));

  const prevWrap = document.querySelector('[data-case-prev]');
  if (prevWrap) {
    if (c.prev) {
      prevWrap.innerHTML = `<a href="/portfolio/cases/${c.prev.slug}/?lang=${state.lang}"><span class="case-nav__direction">← ${escapeHtml(data.ui.previous)}</span><span class="case-nav__title">${escapeHtml(c.prev.title)}</span></a>`;
    } else {
      prevWrap.innerHTML = `<a href="/portfolio/?lang=${state.lang}"><span class="case-nav__direction">← ${escapeHtml(data.ui.allFiles)}</span></a>`;
    }
  }
  const nextWrap = document.querySelector('[data-case-next]');
  if (nextWrap) {
    if (c.next) {
      nextWrap.innerHTML = `<a href="/portfolio/cases/${c.next.slug}/?lang=${state.lang}"><span class="case-nav__direction">${escapeHtml(data.ui.next)} →</span><span class="case-nav__title">${escapeHtml(c.next.title)}</span></a>`;
    } else {
      nextWrap.innerHTML = `<a href="/portfolio/?lang=${state.lang}"><span class="case-nav__direction">${escapeHtml(data.ui.allFiles)} →</span></a>`;
    }
  }
}

/* ---------- progress + reveal ---------- */

function initProgress() {
  const bar = document.querySelector('[data-progress]');
  if (!bar) return;
  const update = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max <= 0 ? 0 : Math.min(100, (scrollTop / max) * 100);
    bar.style.width = pct + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function initReveal() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach((el) => io.observe(el));
}

/* ---------- structured data ---------- */

function injectJsonLd(data) {
  const slot = document.querySelector('[data-jsonld]');
  if (!slot) return;
  let payload = null;
  if (state.pageType === 'landing') {
    const itemList = (data.landing.secondary || []).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      url: `https://dictuzz.me${s.href}`,
      name: s.title
    }));
    itemList.unshift({
      '@type': 'ListItem',
      position: 1,
      url: `https://dictuzz.me${data.landing.feature.href}`,
      name: data.landing.feature.headline
    });
    payload = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: data.landing.documentTitle,
      description: data.landing.metaDescription,
      inLanguage: state.lang,
      url: `https://dictuzz.me/portfolio/?lang=${state.lang}`,
      hasPart: itemList.map((i) => ({ '@type': 'Article', name: i.name, url: i.url }))
    };
  } else if (state.pageType === 'case') {
    const c = data.cases?.[state.caseSlug];
    if (c) {
      payload = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: c.title,
        description: c.metaDescription,
        inLanguage: state.lang,
        author: {
          '@type': 'Person',
          name: 'Benedictus Richard Ricardo',
          url: 'https://dictuzz.me/'
        },
        publisher: {
          '@type': 'Person',
          name: 'Benedictus Richard Ricardo',
          url: 'https://dictuzz.me/'
        },
        url: `https://dictuzz.me/portfolio/cases/${state.caseSlug}/?lang=${state.lang}`
      };
      if (c.image) {
        payload.image = `https://dictuzz.me${c.image}`;
      }
    }
  }
  if (payload) {
    slot.textContent = JSON.stringify(payload);
  }
}

/* ---------- core ---------- */

async function switchLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang) || lang === state.lang) return;
  try {
    const data = await loadLocale(lang);
    state.lang = lang;
    state.data = data;
    writeStoredLang(lang);
    pushLangUrl(lang);
    render();
  } catch (err) {
    console.error('lang switch failed', err);
  }
}

function render() {
  renderTopbar(state.data);
  if (state.pageType === 'case') renderCase(state.data);
  else renderLanding(state.data);
  if (state.siteConfig) {
    try { applyGlobalFooter(state.siteConfig); } catch (err) { console.error('footer error', err); }
  }
  injectJsonLd(state.data);
  upgradeIcons(document);
  applyTheme(docEl.getAttribute('data-theme') || 'light');
}

async function init() {
  applyTheme(initialTheme());

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-theme-toggle]');
    if (!t) return;
    const next = (docEl.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    writeStoredTheme(next);
  });

  state.lang = getInitialLang();
  pushLangUrl(state.lang);

  let data;
  try {
    data = await loadLocale(state.lang);
  } catch (err) {
    console.error('locale load failed, falling back to en', err);
    state.lang = DEFAULT_LANG;
    data = await loadLocale(DEFAULT_LANG);
  }
  state.data = data;

  try {
    state.siteConfig = await loadSiteConfig();
  } catch (err) {
    console.error('site config load failed', err);
  }

  render();
  initProgress();
  initReveal();
}

document.addEventListener('DOMContentLoaded', init);
