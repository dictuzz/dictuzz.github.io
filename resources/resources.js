import { upgradeIcons } from '../js/icon-kit.js';
import { bindThemeToggle, bindMobileNav, bindSearchShortcuts, initSharedFooter } from './resources-common.js';

bindThemeToggle();
bindMobileNav();
bindSearchShortcuts();

function injectSearchLink() {
    const nav = document.querySelector('.resources-navbar__nav');
    if (!nav) return;
    const existing = nav.querySelector('.resources-navbar__link--search');
    if (existing) return;
    const link = document.createElement('a');
    link.href = '/resources/search.html';
    link.className = 'resources-navbar__link resources-navbar__link--search';
    link.innerHTML = '<i class="i-ph-magnifying-glass-duotone" aria-hidden="true"></i> Search';
    nav.appendChild(link);
}

function buildToC() {
    const content = document.querySelector('.resources-content');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    const toc = document.createElement('aside');
    toc.className = 'resources-toc';
    
    const title = document.createElement('h4');
    title.textContent = 'On this page';
    toc.appendChild(title);

    const ul = document.createElement('ul');
    
    headings.forEach(heading => {
        if (!heading.id) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent.replace('​', '').trim();
        if (heading.tagName === 'H3') {
            a.className = 'toc-h3';
        }
        li.appendChild(a);
        ul.appendChild(li);
    });

    toc.appendChild(ul);
    content.parentNode.insertBefore(toc, content.nextSibling);

    const links = toc.querySelectorAll('a');
    const observer = new IntersectionObserver((entries) => {
        let activeId = null;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeId = entry.target.id;
            }
        });
        if (activeId) {
            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
            });
        }
    }, { rootMargin: '0px 0px -80% 0px' });

    headings.forEach(h => observer.observe(h));
}

async function init() {
    injectSearchLink();
    buildToC();
    upgradeIcons(document);
    await initSharedFooter('/resources/');
}

init();
