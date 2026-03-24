import { ThemeManager, Typer, updateThemeColor } from '../js/ui-kit.js';
import { resumeState } from './resume-state.js';

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

export function initTheme() {
    const toggleEl = document.getElementById('theme-toggle');
    const iconEl = document.getElementById('theme-icon');

    resumeState.themeManager = new ThemeManager({
        toggleElement: toggleEl,
        storageKey: 'dictuzz-theme',
        iconElement: iconEl,
        defaultTheme: 'light'
    });

    updateThemeColor(resumeState.themeManager.getMode());
    window.addEventListener('theme-changed', (event) => {
        updateThemeColor(event.detail?.theme || 'light');
    });
}

export function updateTyping(strings) {
    const staticEl = $('#typing-static');
    const dynamicEl = $('#typing-dynamic');
    if (staticEl) staticEl.textContent = strings.hero.typing.staticText || '';

    if (!dynamicEl) return;
    if (resumeState.typerInstance) resumeState.typerInstance.stop();
    dynamicEl.textContent = '';
    resumeState.typerInstance = new Typer(dynamicEl, strings.hero.typing.dynamicTexts, 80);
}

export function initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    window.__resumeRevealObserver = observer;
    $$('.reveal, .stagger').forEach((element) => observer.observe(element));
}

export function initInteractions() {
    document.addEventListener('contextmenu', (event) => {
        if (event.target.tagName === 'IMG') {
            event.preventDefault();
        }
    });

    $$('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const target = $(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                $('.nav__links')?.classList.remove('open');
                $('.nav__toggle')?.classList.remove('active');
            }
        });
    });

    $('.nav__toggle')?.addEventListener('click', () => {
        const toggle = $('.nav__toggle');
        const links = $('.nav__links');
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    const sections = $$('section[id]');
    const navLinks = $$('.nav__link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach((section) => {
            const top = section.offsetTop - 150;
            if (scrollY >= top) current = section.id;
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }, { passive: true });
}

export function initProfileTilt() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || 'ontouchstart' in window) return;

    const avatar = $('.hero__photo-wrapper');
    const container = $('.hero__container');
    if (!avatar || !container) return;

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        avatar.style.transform = `perspective(1000px) rotateY(${x * 0.025}deg) rotateX(${-y * 0.025}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        avatar.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        avatar.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => { avatar.style.transition = ''; }, 800);
    });
}
