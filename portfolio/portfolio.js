import { applyGlobalFooter } from '../js/site-renderers.js';
import { upgradeIcons } from '../js/icon-kit.js';
import { loadSiteConfig } from '../js/site-content.js?v=v11';
import { safeStorage } from '../js/ui-kit.js';

const SUPPORTED_LANGS = ['en', 'id', 'de'];
const DEFAULT_LANG = 'en';
const LANG_KEY = 'dictuzz-lang';
const THEME_KEY = 'dictuzz-theme';

const docEl = document.documentElement;
const bodyEl = document.body;

const state = {
  lang: DEFAULT_LANG,
  data: null,
  siteConfig: null,
  pageType: bodyEl.dataset.page || 'landing',
  caseSlug: bodyEl.dataset.case || null
};

const PORTFOLIO_ACCESS_KEY = 'portfolio-unlocked-v2';
const PORTFOLIO_ACCESS_HASH = 'c28595c067550031126e2dbe55cd86afdb7209fc25e2edf8f18a87e4fc9095cf';
const portfolioUnlocked = (() => {
  try {
    return sessionStorage.getItem(PORTFOLIO_ACCESS_KEY) === 'true';
  } catch {
    return false;
  }
})();

if (!portfolioUnlocked) docEl.classList.add('is-locked');

async function hashPassphrase(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function renderAccessGate() {
  if (portfolioUnlocked) return;

  const overlay = document.createElement('div');
  overlay.id = 'portfolio-access-gate';
  overlay.innerHTML = `
    <main class="access-gate" aria-labelledby="access-gate-title">
      <span class="access-gate__mark" aria-hidden="true">◆</span>
      <p class="access-gate__eyebrow">dictuzz / private records</p>
      <h1 id="access-gate-title">Authorized personnel only.</h1>
      <p class="access-gate__copy">Enter the passphrase to view the operational record.</p>
      <form class="access-gate__form" id="portfolio-access-form">
        <label class="sr-only" for="portfolio-access-passphrase">Passphrase</label>
        <input id="portfolio-access-passphrase" class="access-gate__input" type="password" autocomplete="current-password" placeholder="Passphrase" required autofocus>
        <button class="access-gate__submit" type="submit">Unlock records</button>
        <a class="access-gate__request" href="https://wa.me/6285186888630" target="_blank" rel="noopener noreferrer">Request access</a>
        <p class="access-gate__error" id="portfolio-access-error" aria-live="polite"></p>
      </form>
    </main>
  `;
  document.body.prepend(overlay);

  const form = overlay.querySelector('#portfolio-access-form');
  const input = overlay.querySelector('#portfolio-access-passphrase');
  const error = overlay.querySelector('#portfolio-access-error');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const candidate = input.value.trim();
    if (!candidate) return;

    const hash = await hashPassphrase(candidate);
    if (hash !== PORTFOLIO_ACCESS_HASH) {
      error.textContent = 'Incorrect passphrase.';
      input.value = '';
      input.focus();
      return;
    }

    try { sessionStorage.setItem(PORTFOLIO_ACCESS_KEY, 'true'); } catch { /* storage is optional */ }
    overlay.classList.add('is-hidden');
    window.setTimeout(() => {
      docEl.classList.remove('is-locked');
      overlay.remove();
      initReveal();
    }, 220);
  });
}

let revealObserver = null;

function readStoredLang() {
  return safeStorage.getItem(LANG_KEY);
}
function writeStoredLang(lang) {
  safeStorage.setItem(LANG_KEY, lang);
}
function getInitialLang() {
  const routeLang = location.pathname.match(/^\/portfolio\/(id|de)(?:\/|$)/)?.[1];
  const url = new URLSearchParams(location.search).get('lang');
  if (SUPPORTED_LANGS.includes(routeLang)) return routeLang;
  if (SUPPORTED_LANGS.includes(url)) return url;
  const saved = readStoredLang();
  if (SUPPORTED_LANGS.includes(saved)) return saved;
  const nav = (navigator.language || '').slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGS.includes(nav)) return nav;
  return DEFAULT_LANG;
}
function landingPath(lang) {
  return lang === DEFAULT_LANG ? '/portfolio/' : `/portfolio/${lang}/`;
}
function casePath(slug, lang) {
  const prefix = lang === DEFAULT_LANG ? '' : `${lang}/`;
  return `/portfolio/${prefix}cases/${slug}/`;
}
function currentPagePath(lang) {
  return state.pageType === 'case' ? casePath(state.caseSlug, lang) : landingPath(lang);
}
function localizedPath(path, lang) {
  const caseMatch = path.match(/^\/portfolio\/cases\/([^/?#]+)\/?$/);
  if (caseMatch) return casePath(caseMatch[1], lang);
  if (path === '/portfolio/') return landingPath(lang);
  return path;
}
function pushLangUrl(lang) {
  const url = new URL(location.href);
  url.pathname = currentPagePath(lang);
  url.searchParams.delete('lang');
  window.history.replaceState({}, '', url);
}

function localizedPageUrl() {
  return new URL(currentPagePath(state.lang), getSiteUrl()).href;
}

function setHeadMeta(selector, attribute, value) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    if (selector.includes('[property=')) element.setAttribute('property', selector.match(/\[property="([^"]+)"\]/)?.[1] || '');
    else element.setAttribute('name', selector.match(/\[name="([^"]+)"\]/)?.[1] || '');
    document.head.append(element);
  }
  element.setAttribute(attribute, value);
}

function updatePageMetadata(title, description) {
  const url = localizedPageUrl();
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
    const lang = link.getAttribute('hreflang');
    if (['en', 'id', 'de', 'x-default'].includes(lang)) {
      link.setAttribute('href', new URL(currentPagePath(lang === 'x-default' ? DEFAULT_LANG : lang), getSiteUrl()).href);
    }
  });
  setHeadMeta('meta[property="og:url"]', 'content', url);
  setHeadMeta('meta[property="og:title"]', 'content', title);
  setHeadMeta('meta[property="og:description"]', 'content', description);
  const imagePath = '/og-image.png';
  const imageUrl = absoluteUrl(imagePath);
  const imageAlt = ({
    en: 'Illustrated profile card for Benedictus Richard Ricardo, with dictuzz branding and the tagline Automate, Create, Solve.',
    id: 'Kartu profil ilustrasi Benedictus Richard Ricardo dengan identitas dictuzz dan slogan Automate, Create, Solve.',
    de: 'Illustrierte Profilkarte von Benedictus Richard Ricardo mit dictuzz-Markenzeichen und dem Motto Automate, Create, Solve.'
  })[state.lang];
  setHeadMeta('meta[property="og:type"]', 'content', state.pageType === 'case' ? 'article' : 'website');
  setHeadMeta('meta[property="og:image"]', 'content', imageUrl);
  setHeadMeta('meta[property="og:image:type"]', 'content', 'image/png');
  setHeadMeta('meta[property="og:image:width"]', 'content', '1200');
  setHeadMeta('meta[property="og:image:height"]', 'content', '630');
  setHeadMeta('meta[property="og:image:alt"]', 'content', imageAlt);
  setHeadMeta('meta[property="og:locale"]', 'content', ({ en: 'en_US', id: 'id_ID', de: 'de_DE' })[state.lang] || 'en_US');
  const ogLocales = { en: 'en_US', id: 'id_ID', de: 'de_DE' };
  document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((meta) => meta.remove());
  Object.entries(ogLocales).forEach(([lang, locale]) => {
    if (lang === state.lang) return;
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:locale:alternate');
    meta.setAttribute('content', locale);
    document.head.append(meta);
  });
  setHeadMeta('meta[name="twitter:url"]', 'content', url);
  setHeadMeta('meta[name="twitter:title"]', 'content', title);
  setHeadMeta('meta[name="twitter:description"]', 'content', description);
  setHeadMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setHeadMeta('meta[name="twitter:image"]', 'content', imageUrl);
  setHeadMeta('meta[name="twitter:image:alt"]', 'content', imageAlt);
  document.documentElement.lang = state.lang;
}

async function loadLocale(lang) {
  const url = `/content/portfolio/locales/${lang}.json?v=v8`;
  const res = await fetch(url, { credentials: 'omit', cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load locale ${lang}: ${res.status}`);
  const text = await res.text();
  return JSON.parse(text.replace(/^\uFEFF/, ''));
}

function readStoredTheme() {
  return safeStorage.getItem(THEME_KEY);
}
function writeStoredTheme(theme) {
  safeStorage.setItem(THEME_KEY, theme);
}
function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  docEl.setAttribute('data-theme', next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', next === 'dark' ? '#0d1117' : '#f4ecdb');
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

function renderTopbar(data) {
  const ui = data.ui;
  const homeRoot = '/';
  const resumeRoot = state.lang === DEFAULT_LANG ? '/resume/' : `/resume/${state.lang}/`;

  setText('[data-i18n="brand"]', ui.brand);
  setText('[data-i18n="brandSub"]', ui.brandSub);

  const navLinks = document.querySelector('[data-topbar-nav]');
  if (navLinks) {
    const items = state.pageType === 'case'
      ? [
          { href: landingPath(state.lang), label: ui.allFiles },
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

function renderLanding(data) {
  const L = data.landing;

  document.title = L.documentTitle;
  setAttr('meta[name="description"]', 'content', L.metaDescription);
  updatePageMetadata(L.shareTitle || L.documentTitle, L.metaDescription);

    setText('[data-masthead-strap-left]', L.masthead.strapLeft);
  setText('[data-masthead-strap-center]', L.masthead.strapCenter);
  setText('[data-masthead-strap-right]', L.masthead.strapRight);
  setText('[data-masthead-wordmark]', L.masthead.wordmark);
  setText('[data-masthead-subtitle]', L.masthead.subtitle);
  setText('[data-masthead-rule]', data.ui.magazineLabel);
  setText('[data-masthead-work-cta]', data.ui.workCta);
  setText('[data-masthead-contact-cta]', data.ui.contactCta);
  setAttr('[data-masthead-work-cta]', 'href', localizedPath(L.feature.href, state.lang));
  setText('[data-artifact-kicker]', data.ui.artifactKicker);
  setText('[data-artifact-label]', data.ui.artifactLabel);
  setText('[data-artifact-period]', data.ui.artifactPeriod);
  (data.ui.artifactTeams || []).forEach((label, index) => setText(`[data-artifact-team="${index}"]`, label));
  setAttr('[data-masthead-artifact]', 'aria-label', data.ui.artifactAria);

    const f = L.feature;
  setText('[data-feature-kicker]', f.kicker);
  setText('[data-feature-headline]', f.headline);
  setText('[data-feature-deck]', f.deck);
  setText('[data-feature-byline]', f.byline);
  setText('[data-feature-meta]', f.meta);
  setAttr('[data-feature-link]', 'href', localizedPath(f.href, state.lang));
  setText('[data-feature-cta]', data.ui.featureCta);

  if (f.briefTag) {
    setText('[data-feature-brief-tag]', f.briefTag);
    setText('[data-feature-brief-badge]', f.briefBadge);
    setHtml('[data-feature-brief-num]', escapeHtml(f.briefMetric).replace('+', '<span>+</span>'));
    setText('[data-feature-brief-metric-label]', f.briefMetricLabel);
    setText('[data-feature-brief-metric-note]', f.briefMetricNote);
    const pointsEl = document.querySelector('[data-feature-brief-points]');
    if (pointsEl && Array.isArray(f.briefPoints)) {
      pointsEl.innerHTML = f.briefPoints.map(pt => `
        <div class="feature__brief-row">
          <span class="feature__brief-index">${escapeHtml(pt.num)}</span>
          <div>
            <strong>${escapeHtml(pt.title)}</strong>
            <p>${escapeHtml(pt.desc)}</p>
          </div>
        </div>
      `).join('');
    }
  } else if (f.image) {
    setAttr('[data-feature-image]', 'src', f.image);
    setAttr('[data-feature-image]', 'alt', f.imageAlt || '');
    setAttr('[data-feature-image]', 'data-image-fit', f.imageFit || 'cover');
    if (f.imageWidth && f.imageHeight) {
      setAttr('[data-feature-image]', 'width', String(f.imageWidth));
      setAttr('[data-feature-image]', 'height', String(f.imageHeight));
    }
    setText('[data-feature-caption]', f.caption);
  }

    setText('[data-index-label]', L.indexLabel);
  setText('[data-index-note]', L.indexNote);

  const list = document.querySelector('[data-secondary-list]');
  if (list && Array.isArray(L.secondary)) {
    list.innerHTML = L.secondary.map((item, i) => {
      const isExternal = /^https?:\/\//i.test(item.href);
      const linkHref = isExternal ? item.href : localizedPath(item.href, state.lang);
      const extAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const trackKind = isExternal ? 'tool' : 'case';
      return `
      <article class="dispatch reveal">
        <span class="dispatch__num">${String(i + 1).padStart(2, '0')}</span>
        <a class="dispatch__inner" href="${linkHref}" data-track="${trackKind}" data-slug="${item.slug}"${extAttrs}>
          <p class="dispatch__kicker">${escapeHtml(item.kicker)}</p>
          <h3 class="dispatch__title">${escapeHtml(item.title)}</h3>
          <p class="dispatch__deck">${escapeHtml(item.deck)}</p>
          <p class="dispatch__meta">${escapeHtml(item.meta)}</p>
        </a>
      </article>
      `;
    }).join('');
  }

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

    setText('[data-contact-kicker]', L.contact.kicker);
  setText('[data-contact-strap-mid]', data.ui.contactStrapMid);
  setText('[data-contact-strap-end]', data.ui.contactStrapEnd);
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

function renderCase(data) {
  const slug = state.caseSlug;
  const c = data.cases?.[slug];
  if (!c) return;

  document.title = c.documentTitle;
  setAttr('meta[name="description"]', 'content', c.metaDescription);
  updatePageMetadata(c.shareTitle || c.documentTitle, c.metaDescription);

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
        <img src="${c.image}" alt="${escapeHtml(c.imageAlt || '')}" data-image-fit="${c.imageFit || 'cover'}"${c.imageWidth && c.imageHeight ? ` width="${c.imageWidth}" height="${c.imageHeight}"` : ''}>
        <figcaption>${escapeHtml(c.caption || '')}</figcaption>
      `;
    } else {
      figure.hidden = true;
      figure.innerHTML = '';
    }
  }

  setText('[data-case-lead]', c.lead);

  const process = document.querySelector('[data-process-flow]');
  if (process && c.process) {
    const renderSteps = (steps) => steps.map((step, i) => `
      <li class="workflow-step">
        <span class="workflow-step__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="workflow-step__label">${escapeHtml(step)}</span>
      </li>
    `).join('<li class="workflow-arrow" aria-hidden="true">→</li>');
    process.innerHTML = `
      <div class="workflow-heading">
        <p class="article__block-label">${escapeHtml(c.process.kicker)}</p>
        <h2 id="workflow-title">${escapeHtml(c.process.title)}</h2>
        <p>${escapeHtml(c.process.description)}</p>
      </div>
      <div class="workflow-lane workflow-lane--before">
        <h3>${escapeHtml(c.process.beforeLabel)}</h3>
        <ol class="workflow-steps">${renderSteps(c.process.before)}</ol>
      </div>
      <div class="workflow-lane workflow-lane--after">
        <h3>${escapeHtml(c.process.afterLabel)}</h3>
        <ol class="workflow-steps">${renderSteps(c.process.after)}</ol>
      </div>
    `;
    process.setAttribute('aria-labelledby', 'workflow-title');
  }

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
      prevWrap.innerHTML = `<a href="${casePath(c.prev.slug, state.lang)}"><span class="case-nav__direction">← ${escapeHtml(data.ui.previous)}</span><span class="case-nav__title">${escapeHtml(c.prev.title)}</span></a>`;
    } else {
      prevWrap.innerHTML = `<a href="${landingPath(state.lang)}"><span class="case-nav__direction">← ${escapeHtml(data.ui.allFiles)}</span></a>`;
    }
  }
  const nextWrap = document.querySelector('[data-case-next]');
  if (nextWrap) {
    if (c.next) {
      nextWrap.innerHTML = `<a href="${casePath(c.next.slug, state.lang)}"><span class="case-nav__direction">${escapeHtml(data.ui.next)} →</span><span class="case-nav__title">${escapeHtml(c.next.title)}</span></a>`;
    } else {
      nextWrap.innerHTML = `<a href="${landingPath(state.lang)}"><span class="case-nav__direction">${escapeHtml(data.ui.allFiles)} →</span></a>`;
    }
  }
}

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
  revealObserver?.disconnect();
  revealObserver = null;

  const targets = document.querySelectorAll('.reveal');
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach((el) => revealObserver.observe(el));
}

function getSiteUrl() {
  return state.siteConfig?.site?.siteUrl || 'https://dictuzz.me';
}

function absoluteUrl(href) {
  const base = getSiteUrl();
  return /^https?:\/\//i.test(href) ? href : `${base}${href}`;
}

function injectJsonLd(data) {
  const slot = document.querySelector('[data-jsonld]');
  if (!slot) return;
  const siteUrl = getSiteUrl();
  let payload = null;
  if (state.pageType === 'landing') {
    const itemList = (data.landing.secondary || []).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      url: absoluteUrl(s.href),
      name: s.title
    }));
    itemList.unshift({
      '@type': 'ListItem',
      position: 1,
      url: absoluteUrl(data.landing.feature.href),
      name: data.landing.feature.headline
    });
    payload = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: data.landing.documentTitle,
      description: data.landing.metaDescription,
      inLanguage: state.lang,
      url: localizedPageUrl(),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: itemList.length,
        itemListElement: itemList
      },
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
          name: state.siteConfig?.profile?.name || 'Benedictus Richard Ricardo',
          url: `${siteUrl}/`
        },
        publisher: {
          '@type': 'Person',
          name: state.siteConfig?.profile?.name || 'Benedictus Richard Ricardo',
          url: `${siteUrl}/`
        },
        url: localizedPageUrl()
      };
      if (c.image) {
        payload.image = absoluteUrl(c.image);
      }
    }
  }
  if (payload) {
    slot.textContent = JSON.stringify(payload);
  }
}

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
    try {
      applyGlobalFooter(state.siteConfig);
      translateFooter(state.data.ui);
    } catch (err) { console.error('footer error', err); }
  }
  injectJsonLd(state.data);
  upgradeIcons(document);
  applyTheme(docEl.getAttribute('data-theme') || 'light');
  initReveal();
}

function translateFooter(ui) {
  const footer = ui.footer;
  if (!footer) return;
  const localizedResume = state.lang === DEFAULT_LANG ? '/resume/' : `/resume/${state.lang}/`;
  const localizedPortfolio = landingPath(state.lang);
  const footerLinks = [
    ['/', footer.home], [localizedResume, footer.resume], [localizedPortfolio, footer.portfolio],
    ['/resources/', footer.resources], ['/terms/', footer.terms]
  ];
  footerLinks.forEach(([href, label]) => {
    const canonicalHref = href === localizedResume ? '/resume/' : href === localizedPortfolio ? '/portfolio/' : href;
    const selector = canonicalHref === '/terms/' ? '.global-footer__link[href$="/terms/"]' : `.global-footer__link[href="${canonicalHref}"]`;
    const link = document.querySelector(selector);
    if (link) {
      link.setAttribute('href', href);
      link.textContent = label;
    }
  });
  document.querySelector('.global-footer__nav')?.setAttribute('aria-label', footer.navLabel);
  setAttr('.global-footer__contact-link[href^="mailto:"]', 'aria-label', footer.emailAria);
  const copy = document.querySelector('.global-footer__copy');
  const rightsNode = [...(copy?.childNodes || [])].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes('©'));
  if (rightsNode) rightsNode.textContent = `\n            © ${new Date().getFullYear()} Benedictus Richard Ricardo. ${footer.allRights}\n            `;
  setText('.global-footer__copy span', ui.systemRole);
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

  renderAccessGate();
  render();
  initProgress();
}

document.addEventListener('DOMContentLoaded', init);
