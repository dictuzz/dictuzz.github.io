/* ═══════════════════════════════════════════════════════════
   Portfolio — Editorial enhancements
   Theme toggle · live edition strap · footer · reveal · progress
   ═══════════════════════════════════════════════════════════ */

const THEME_KEY = 'dictuzz-theme';
const STORAGE_OK = (() => {
  try {
    const k = '__t';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch { return false; }
})();

/* ─── Theme ─────────────────────────────────────────────────── */

function getStoredTheme() {
  if (!STORAGE_OK) return null;
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}

function preferredTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', next === 'dark' ? '#0e1218' : '#f6efe1');
  }
  const button = document.querySelector('[data-theme-toggle]');
  if (button) {
    const icon = button.querySelector('i');
    if (icon) {
      icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    button.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

function initTheme() {
  const stored = getStoredTheme();
  applyTheme(stored || preferredTheme());

  const button = document.querySelector('[data-theme-toggle]');
  if (button) {
    button.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      if (STORAGE_OK) {
        try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
      }
    });
  }
}

/* ─── Edition strap (date + reading-time-ish edition number) ── */

function formatEdition() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return fmt.format(now);
}

function initEditionStrap() {
  const dateEl = document.querySelector('[data-edition-date]');
  if (dateEl) dateEl.textContent = formatEdition();

  const yearEl = document.querySelectorAll('[data-current-year]');
  yearEl.forEach((el) => { el.textContent = String(new Date().getFullYear()); });
}

/* ─── Reveal on scroll ──────────────────────────────────────── */

function initReveal() {
  const revealTargets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || revealTargets.length === 0) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  revealTargets.forEach((el) => io.observe(el));
}

/* ─── Scroll progress bar ───────────────────────────────────── */

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

/* ─── Footer ────────────────────────────────────────────────── */

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

async function loadSiteConfig() {
  try {
    const res = await fetch('/content/site.json', { credentials: 'omit', cache: 'no-cache' });
    if (!res.ok) return null;
    const text = await res.text();
    return JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch {
    return null;
  }
}

function renderFooter(config, currentPath) {
  const footer = document.querySelector('.global-footer');
  if (!footer) return;

  if (!config) {
    footer.innerHTML = `
      <p class="global-footer__copy">
        © ${new Date().getFullYear()} Benedictus Richard Ricardo. All rights reserved.
        <span>Quam Plurimi et Quam Aptissimi.</span>
      </p>
    `;
    return;
  }

  const navItems = (config.navigation?.footer || []).map((entry) => `
    <a href="${escapeHtml(entry.href)}"${entry.href === currentPath ? ' aria-current="page"' : ''}>${escapeHtml(entry.label)}</a>
  `).join('');

  const contactItems = [
    {
      href: `mailto:${config.contact?.email || 'contact@dictuzz.me'}`,
      icon: 'fas fa-envelope',
      label: config.contact?.email || 'contact@dictuzz.me',
    },
    {
      href: config.contact?.whatsappUrl || 'https://wa.me/6285186888630',
      icon: 'fab fa-whatsapp',
      label: config.contact?.whatsappLabel || 'WhatsApp',
      external: true,
    },
    {
      href: '/terms/',
      icon: 'fas fa-file-contract',
      label: 'Terms',
    },
  ];

  const contactsHtml = contactItems.map((entry, i) => `
    ${i > 0 ? '<span class="global-footer__divider">&bull;</span>' : ''}
    <a href="${escapeHtml(entry.href)}" class="global-footer__contact-link"${entry.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
      <i class="${escapeHtml(entry.icon)}"></i> ${escapeHtml(entry.label)}
    </a>
  `).join('');

  const copyright = `© ${new Date().getFullYear()} ${config.profile?.name || 'Benedictus Richard Ricardo'}. All rights reserved.`;
  const motto = config.profile?.motto || 'Quam Plurimi et Quam Aptissimi.';

  footer.innerHTML = `
    <nav class="global-footer__nav" aria-label="Global navigation">${navItems}</nav>
    <div class="global-footer__contacts">${contactsHtml}</div>
    <p class="global-footer__copy">${escapeHtml(copyright)}<span>${escapeHtml(motto)}</span></p>
  `;
}

async function initFooter() {
  const path = window.location.pathname;
  const config = await loadSiteConfig();
  renderFooter(config, path);
}

/* ─── Bootstrap ─────────────────────────────────────────────── */

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

ready(() => {
  initTheme();
  initEditionStrap();
  initReveal();
  initProgress();
  initFooter();
});
