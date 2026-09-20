import { loadSiteConfig } from '../js/site-content.js';
import { applyGlobalFooter } from '../js/site-renderers.js';
import { upgradeIcons } from '../js/icon-kit.js';
import { ThemeManager, updateThemeColor } from '../js/ui-kit.js';

const INDEX_URL = '/content/resources/search-index.json';
const FUSE_OPTIONS = {
  keys: [
    { name: 't', weight: 3 },
    { name: 'd', weight: 1 },
    { name: 'c', weight: 2 },
    { name: 'se', weight: 2 },
    { name: 'su', weight: 1 }
  ],
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2
};

let fuse = null;
let index = [];
let categories = {};
let fuseReady = false;

const $ = (sel) => document.querySelector(sel);
const input = $('#search-input');
const clearBtn = $('#search-clear');
const list = $('#search-list');
const empty = $('#search-empty');
const emptyText = $('#search-empty-text');
const count = $('#result-count');
const loading = $('#search-loading');
const filter = $('#category-filter');

let debounceTimer = null;

async function init() {
  bindMobileNav();
  bindThemeToggle();

  showLoading(true);
  const loaded = await loadIndex();
  showLoading(false);

  if (!loaded) {
    showError('Failed to load search index. Please try again later.');
    return;
  }

  populateFilter();
  bindEvents();

  try {
    const siteConfig = await loadSiteConfig();
    applyGlobalFooter(siteConfig);
  } catch {
    /* footer will show static fallback */
  }

  upgradeIcons();

  const q = new URLSearchParams(window.location.search).get('q');
  if (q) {
    input.value = q;
    doSearch(q);
  } else {
    showEmpty('Type a query to start searching');
  }
}

async function loadIndex() {
  try {
    const cached = sessionStorage.getItem('resourcesSearchIndex');
    if (cached) {
      index = JSON.parse(cached);
      buildFuse();
      return true;
    }

    const res = await fetch(INDEX_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    index = await res.json();

    try {
      sessionStorage.setItem('resourcesSearchIndex', JSON.stringify(index));
    } catch (e) {
      /* storage full or unavailable — proceed without cache */
    }

    buildFuse();
    return true;
  } catch (err) {
    console.error('Search index load failed:', err);
    return false;
  }
}

function buildFuse() {
  if (typeof window.Fuse === 'undefined') {
    fuseReady = false;
    return;
  }
  fuse = new window.Fuse(index, FUSE_OPTIONS);
  fuseReady = true;

  categories = {};
  for (const item of index) {
    if (!categories[item.s]) {
      categories[item.s] = { slug: item.s, name: item.c, count: 0 };
    }
    categories[item.s].count++;
  }
}

function populateFilter() {
  const sorted = Object.values(categories).sort((a, b) => b.count - a.count);
  for (const cat of sorted) {
    const opt = document.createElement('option');
    opt.value = cat.slug;
    opt.textContent = `${cat.name} (${cat.count})`;
    filter.appendChild(opt);
  }
}

function bindEvents() {
  input.addEventListener('input', () => {
    clearBtn.hidden = !input.value;
    debounceSearch();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (input.value) {
        input.value = '';
        clearBtn.hidden = true;
        doSearch('');
        e.preventDefault();
      } else {
        input.blur();
      }
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.hidden = true;
    doSearch('');
    input.focus();
  });

  filter.addEventListener('change', () => {
    debounceSearch();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
    }
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      e.preventDefault();
      input.focus();
    }
  });
}

function debounceSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => doSearch(input.value), 200);
}

let lastQuery = '';
let lastFilter = '';

function doSearch(query) {
  query = query.trim();
  const catFilter = filter.value;
  lastQuery = query;
  lastFilter = catFilter;

  if (!query) {
    showEmpty('Type a query to start searching');
    updateCount(0);
    list.innerHTML = '';
    return;
  }

  if (!fuseReady || !fuse) {
    showEmpty('Search engine is still loading...');
    return;
  }

  const exact = query.match(/"([^"]+)"/);
  let results;

  if (exact) {
    const phrase = exact[1].toLowerCase();
    results = index.filter(item => {
      const text = [item.t, item.d, item.c, item.se, item.su].join(' ').toLowerCase();
      return text.includes(phrase);
    });
    results = results.map(item => ({ item, score: 0 }));
  } else {
    results = fuse.search(query);
  }

  if (catFilter) {
    results = results.filter(r => r.item.s === catFilter);
  }

  if (results.length === 0) {
    showEmpty(`No results found for "${query}"`);
    updateCount(0);
    list.innerHTML = '';
    return;
  }

  updateCount(results.length);
  renderResults(results, query);
}

function renderResults(results, query) {
  const groups = {};
  for (const r of results) {
    const slug = r.item.s;
    if (!groups[slug]) groups[slug] = [];
    groups[slug].push(r);
  }

  const sortedSlugs = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);

  let html = '';

  for (const slug of sortedSlugs) {
    const group = groups[slug];
    const cat = categories[slug];
    const catName = cat ? cat.name : slug;

    html += `<div class="search-group">`;
    html += `<div class="search-group__header">`;
    html += `<span class="search-group__title">${escapeHtml(catName)}</span>`;
    html += `<span class="search-group__count">${group.length}</span>`;
    html += `</div>`;

    for (const r of group) {
      html += renderCard(r.item, r.matches, query);
    }

    html += `</div>`;
  }

  list.innerHTML = html;
  upgradeIcons();
}

function renderCard(item, matches, query) {
  const titleHtml = highlightField(item.t, 't', matches, query) || escapeHtml(item.t);
  const descHtml = item.d
    ? highlightField(item.d, 'd', matches, query) || escapeHtml(item.d)
    : '';
  const sectionHtml = item.se ? escapeHtml(item.se) : '';
  const catName = categories[item.s] ? categories[item.s].name : item.c;

  const starIcon = item.r
    ? '<span class="search-result__starred" aria-label="Recommended"><i class="i-ph-star-duotone"></i></span>'
    : '';

  return `<a class="search-result" href="${escapeAttr(item.u)}" target="_blank" rel="noopener noreferrer">
    ${starIcon}
    <div class="search-result__body">
      <div class="search-result__title">${titleHtml}</div>
      ${descHtml ? `<div class="search-result__description">${descHtml}</div>` : ''}
      <div class="search-result__meta">
        ${sectionHtml ? `<span class="search-result__section">${sectionHtml}</span>` : ''}
        <span class="search-result__category">${escapeHtml(catName)}</span>
      </div>
    </div>
    <span class="search-result__arrow" aria-hidden="true"><i class="i-ph-arrow-up-right-duotone"></i></span>
  </a>`;
}

function highlightField(text, key, matches, query) {
  if (!text) return null;
  const escaped = escapeHtml(text);

  if (matches && matches.length > 0) {
    const keyMatches = matches.filter(m => m.key === key);
    if (keyMatches.length > 0) {
      const indices = keyMatches.flatMap(m => m.indices);
      indices.sort((a, b) => a[0] - b[0]);
      return applyHighlights(escaped, indices);
    }
  }

  /* fallback: highlight exact query in escaped text */
  if (query) {
    const q = query.replace(/"/g, '').toLowerCase();
    const lower = escaped.toLowerCase();
    const idx = lower.indexOf(q);
    if (idx >= 0 && q.length >= 2) {
      const before = escaped.slice(0, idx);
      const match = escaped.slice(idx, idx + q.length);
      const after = escaped.slice(idx + q.length);
      return before + '<em>' + match + '</em>' + after;
    }
  }

  return null;
}

function applyHighlights(text, indices) {
  let result = '';
  let lastEnd = 0;

  for (const [start, end] of indices) {
    if (start > lastEnd) {
      result += text.slice(lastEnd, start);
    }
    result += '<em>' + text.slice(start, end + 1) + '</em>';
    lastEnd = end + 1;
  }

  if (lastEnd < text.length) {
    result += text.slice(lastEnd);
  }

  return result;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/&/g, '&amp;');
}

function showLoading(visible) {
  loading.classList.toggle('search-loading--visible', visible);
}

function showEmpty(msg) {
  empty.hidden = false;
  list.innerHTML = '';
  emptyText.textContent = msg;
  const icon = empty.querySelector('.search-results__empty-icon i');
  if (msg.includes('No results')) {
    if (icon) icon.className = 'i-ph-file-x-duotone';
  } else {
    if (icon) icon.className = 'i-ph-magnifying-glass-duotone';
  }
}

function showError(msg) {
  showLoading(false);
  showEmpty(msg);
}

function updateCount(n) {
  empty.hidden = true;
  count.textContent = n === 1 ? '1 result' : `${n.toLocaleString()} results`;
}

/* ── shared helpers (copied from resources.js) ── */

function bindMobileNav() {
  const hamburger = document.getElementById('resources-hamburger');
  const mobileNav = document.getElementById('resources-mobile-nav');
  const closeBtn = document.getElementById('resources-mobile-close');

  if (!hamburger || !mobileNav) return;

  const open = () => {
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-label', 'Close navigation menu');
  };

  const close = () => {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-label', 'Open navigation menu');
  };

  hamburger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) close();
  });

  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) close();
  });
}

function bindThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const themeManager = new ThemeManager({
    toggleElement: themeToggle,
    iconElement: themeIcon,
    defaultTheme: 'light',
    storageKey: 'dictuzz-theme'
  });

  updateThemeColor(themeManager.getMode(), themeMeta);
  window.addEventListener('theme-changed', (event) => {
    updateThemeColor(event.detail?.theme || 'light', themeMeta);
  });
}

// --- Service Worker ---
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.error('ServiceWorker registration failed: ', err);
            });
        });
    }
}
registerServiceWorker();

init();
