import { ThemeManager } from './ui-kit.js';

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-category]')];
const revealEls = [...document.querySelectorAll('.reveal')];

function updateThemeColor(theme) {
    if (!themeMeta) return;
    themeMeta.setAttribute('content', theme === 'dark' ? '#121820' : '#f5efe4');
}

const themeManager = new ThemeManager({
    toggleElement: themeToggle,
    iconElement: themeIcon,
    defaultTheme: 'light',
    storageKey: 'dictuzz-theme'
});

updateThemeColor(themeManager.getMode());
window.addEventListener('theme-changed', (event) => {
    updateThemeColor(event.detail?.theme || 'light');
});

if (filters.length && cards.length) {
    filters.forEach((button) => {
        button.addEventListener('click', () => {
            const value = button.dataset.filter || 'all';

            filters.forEach((item) => item.classList.toggle('is-active', item === button));

            cards.forEach((card) => {
                const category = card.dataset.category || '';
                card.hidden = value !== 'all' && category !== value;
            });
        });
    });
}

if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((element) => observer.observe(element));
} else {
    revealEls.forEach((element) => element.classList.add('is-visible'));
}
