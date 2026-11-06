import { upgradeIcons } from '../js/icon-kit.js';
import { bindThemeToggle, bindMobileNav, bindSearchShortcuts, initSharedFooter } from './resources-common.js';

const INDEX_URL = '/content/resources/search-index.json?v=v2';
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
const chips = $('#category-chips');
const moreBtn = $('#search-more');
const PAGE_SIZE = 60;

let debounceTimer = null;
let currentResults = [];
let currentQuery = '';
let visibleLimit = PAGE_SIZE;

async function init() {
  bindMobileNav();
  bindThemeToggle();
  bindSearchShortcuts(() => input?.focus());

  showLoading(true);
  const loaded = await loadIndex();
  showLoading(false);

  if (!loaded) {
    showError('Failed to load search index. Please try again later.');
    return;
  }

  populateFilter();
  bindEvents();

  upgradeIcons();
  await initSharedFooter('/resources/');

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  filter.value = params.get('category') || '';
  syncCategoryChips();
  if (q) {
    input.value = q;
    doSearch(q);
  } else if (filter.value) {
    doSearch('');
  } else {
    showEmpty('Type a query to start searching');
  }
}

async function loadIndex() {
  try {
    const res = await fetch(INDEX_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    index = await res.json();
    buildFuse();
    return true;
  } catch (err) {
    console.error('Search index load failed:', err);
    return false;
  }
}

function buildFuse() {
  categories = {};
  for (const item of index) {
    if (!categories[item.s]) {
      categories[item.s] = { slug: item.s, name: item.c, count: 0 };
    }
    categories[item.s].count++;
  }

  if (typeof window.Fuse === 'undefined') {
    fuseReady = false;
    fuse = null;
    return;
  }
  fuse = new window.Fuse(index, FUSE_OPTIONS);
  fuseReady = true;
}

function populateFilter() {
  const sorted = Object.values(categories).sort((a, b) => b.count - a.count);
  for (const cat of sorted) {
    const opt = document.createElement('option');
    opt.value = cat.slug;
    opt.textContent = `${cat.name} (${cat.count})`;
    filter.appendChild(opt);
  }
  if (chips) {
    const popular = sorted.slice(0, 8);
    chips.innerHTML = `<button type="button" class="search-chip is-active" data-category="" aria-pressed="true">All resources</button>` +
      popular.map(cat => `<button type="button" class="search-chip" data-category="${escapeAttr(cat.slug)}" aria-pressed="false">${escapeHtml(cat.name)}<span>${cat.count.toLocaleString()}</span></button>`).join('');
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
    syncCategoryChips();
    debounceSearch();
  });

  chips?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    filter.value = button.dataset.category;
    syncCategoryChips();
    doSearch(input.value);
  });

  moreBtn?.addEventListener('click', () => {
    visibleLimit += PAGE_SIZE;
    renderResults(currentResults, currentQuery);
  });

  document.querySelectorAll('[data-search-example]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.searchExample;
      clearBtn.hidden = false;
      filter.value = '';
      syncCategoryChips();
      doSearch(input.value);
      input.focus();
    });
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

function doSearch(query) {
  query = query.trim();
  const catFilter = filter.value;

  if (!query && !catFilter) {
    showEmpty('Type a query to start searching');
    updateCount(0);
    list.innerHTML = '';
    moreBtn.hidden = true;
    syncUrl();
    return;
  }

  const exact = query.match(/"([^"]+)"/);
  let results;

  if (!query) {
    results = index.filter(item => item.s === catFilter).map(item => ({ item, score: 0 }));
  } else if (exact) {
    const phrase = exact[1].toLowerCase();
    results = index.filter(item => {
      const text = [item.t, item.d, item.c, item.se, item.su].join(' ').toLowerCase();
      return text.includes(phrase);
    });
    results = results.map(item => ({ item, score: 0 }));
  } else if (!fuseReady || !fuse) {
    // Fallback: substring search when Fuse library is not loaded
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    results = index.filter(item => {
      const text = [item.t, item.d, item.c, item.se, item.su].join(' ').toLowerCase();
      return terms.every(t => text.includes(t));
    }).map(item => ({ item, score: 0 }));
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
    moreBtn.hidden = true;
    syncUrl();
    return;
  }

  currentResults = results;
  currentQuery = query;
  visibleLimit = PAGE_SIZE;
  updateCount(results.length);
  syncUrl();
  renderResults(results, query);
}

function syncCategoryChips() {
  chips?.querySelectorAll('[data-category]').forEach((button) => {
    const active = button.dataset.category === filter.value;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function syncUrl() {
  const url = new URL(window.location.href);
  const query = input.value.trim();
  if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
  if (filter.value) url.searchParams.set('category', filter.value); else url.searchParams.delete('category');
  window.history.replaceState({}, '', url);
}

function renderResults(results, query) {
  const groups = {};
  for (const r of results) {
    const slug = r.item.s;
    if (!groups[slug]) groups[slug] = [];
    groups[slug].push(r);
  }

  const sortedSlugs = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);
  const quotas = Object.fromEntries(sortedSlugs.map((slug) => [slug, 0]));
  let rendered = 0;
  while (rendered < visibleLimit) {
    let addedThisRound = false;
    for (const slug of sortedSlugs) {
      if (rendered >= visibleLimit) break;
      if (quotas[slug] < groups[slug].length) {
        quotas[slug]++;
        rendered++;
        addedThisRound = true;
      }
    }
    if (!addedThisRound) break;
  }

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

    for (const r of group.slice(0, quotas[slug])) {
      html += renderCard(r.item, r.matches, query);
    }

    html += `</div>`;
  }

  list.innerHTML = html;
  moreBtn.hidden = results.length <= visibleLimit;
  if (!moreBtn.hidden) moreBtn.textContent = `Show ${Math.min(PAGE_SIZE, results.length - visibleLimit).toLocaleString()} more · ${(results.length - visibleLimit).toLocaleString()} remaining`;
  count.textContent = results.length > rendered
    ? `Showing ${rendered.toLocaleString()} of ${results.length.toLocaleString()} results`
    : `${results.length.toLocaleString()} ${results.length === 1 ? 'result' : 'results'}`;
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
  const pageHref = item.p || `/resources/${item.s}.html`;

  return `<a class="search-result" href="${escapeAttr(pageHref)}">
    ${starIcon}
    <div class="search-result__body">
      <div class="search-result__title">${titleHtml}</div>
      ${descHtml ? `<div class="search-result__description">${descHtml}</div>` : ''}
      <div class="search-result__meta">
        ${sectionHtml ? `<span class="search-result__section">${sectionHtml}</span>` : ''}
        <span class="search-result__category">${escapeHtml(catName)}</span>
      </div>
    </div>
    <span class="search-result__arrow"><span>Open page</span><i class="i-ph-arrow-right-duotone" aria-hidden="true"></i></span>
  </a>`;
}

function highlightField(text, key, matches, query) {
  if (!text) return null;

  if (matches && matches.length > 0) {
    const keyMatches = matches.filter(m => m.key === key);
    if (keyMatches.length > 0) {
      const indices = keyMatches.flatMap(m => m.indices);
      indices.sort((a, b) => a[0] - b[0]);
      return applyHighlights(text, indices);
    }
  }

  /* fallback: highlight exact query in unescaped text */
  if (query) {
    const q = query.replace(/"/g, '').toLowerCase();
    const lower = text.toLowerCase();
    const idx = lower.indexOf(q);
    if (idx >= 0 && q.length >= 2) {
      return applyHighlights(text, [[idx, idx + q.length - 1]]);
    }
  }

  return escapeHtml(text);
}

function applyHighlights(text, indices) {
  if (!indices || indices.length === 0) return escapeHtml(text);

  // Merge overlapping / adjacent ranges
  const merged = [];
  for (const [start, end] of indices) {
    if (merged.length === 0) {
      merged.push([start, end]);
    } else {
      const prev = merged[merged.length - 1];
      if (start <= prev[1] + 1) {
        prev[1] = Math.max(prev[1], end);
      } else {
        merged.push([start, end]);
      }
    }
  }

  let result = '';
  let lastEnd = 0;

  for (const [start, end] of merged) {
    const safeStart = Math.max(0, Math.min(start, text.length));
    const safeEnd = Math.max(0, Math.min(end + 1, text.length));
    if (safeStart > lastEnd) {
      result += escapeHtml(text.slice(lastEnd, safeStart));
    }
    result += '<em>' + escapeHtml(text.slice(safeStart, safeEnd)) + '</em>';
    lastEnd = safeEnd;
  }

  if (lastEnd < text.length) {
    result += escapeHtml(text.slice(lastEnd));
  }

  return result;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
  if (n > 0) {
    empty.hidden = true;
    count.textContent = n === 1 ? '1 result' : `${n.toLocaleString()} results`;
  } else {
    count.textContent = '';
  }
}

init();
