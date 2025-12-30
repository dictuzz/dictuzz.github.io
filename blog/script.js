/**
 * tuzzblog Theme - JavaScript
 * Minimal scripts for mobile menu and theme toggle
 */

(function () {
    'use strict';

    // Theme Management
    const ThemeManager = {
        STORAGE_KEY: 'tuzzblog-theme',

        init() {
            const savedTheme = localStorage.getItem(this.STORAGE_KEY);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (prefersDark ? 'dark' : 'light');

            document.documentElement.setAttribute('data-theme', theme);
            this.bindEvents();
        },

        bindEvents() {
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggle());
            }

            // Listen for system preference changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                }
            });
        },

        toggle() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem(this.STORAGE_KEY, newTheme);
        }
    };

    // Mobile Menu Management
    const MobileMenu = {
        init() {
            this.toggle = document.querySelector('.menu-toggle');
            this.nav = document.querySelector('.nav-main');
            this.overlay = document.querySelector('.nav-overlay');

            if (this.toggle && this.nav) {
                this.bindEvents();
            }
        },

        bindEvents() {
            this.toggle.addEventListener('click', () => this.toggleMenu());

            if (this.overlay) {
                this.overlay.addEventListener('click', () => this.closeMenu());
            }

            // Close menu on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    this.closeMenu();
                    this.toggle.focus();
                }
            });

            // Close menu on window resize (if switching to desktop)
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.isOpen()) {
                    this.closeMenu();
                }
            });

            // Trap focus within menu when open
            this.nav.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && this.isOpen()) {
                    this.trapFocus(e);
                }
            });
        },

        isOpen() {
            return this.nav.classList.contains('is-open');
        },

        toggleMenu() {
            if (this.isOpen()) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        },

        openMenu() {
            this.nav.classList.add('is-open');
            this.overlay.classList.add('is-visible');
            this.toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';

            // Focus first menu item
            const firstLink = this.nav.querySelector('a');
            if (firstLink) firstLink.focus();
        },

        closeMenu() {
            this.nav.classList.remove('is-open');
            this.overlay.classList.remove('is-visible');
            this.toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        },

        trapFocus(e) {
            const focusableElements = this.nav.querySelectorAll('a, button');
            const firstEl = focusableElements[0];
            const lastEl = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstEl) {
                e.preventDefault();
                lastEl.focus();
            } else if (!e.shiftKey && document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        }
    };

    // Form Validation
    const FormValidation = {
        init() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => this.bindForm(form));
        },

        bindForm(form) {
            form.addEventListener('submit', (e) => {
                const isValid = this.validateForm(form);
                if (!isValid) {
                    e.preventDefault();
                }
            });

            // Real-time validation on blur
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => {
                    if (input.parentElement.classList.contains('has-error')) {
                        this.validateField(input);
                    }
                });
            });
        },

        validateForm(form) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            return isValid;
        },

        validateField(input) {
            const parent = input.parentElement;
            let isValid = true;

            // Check if empty
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
            }

            // Check email format
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                }
            }

            // Toggle error class
            if (isValid) {
                parent.classList.remove('has-error');
            } else {
                parent.classList.add('has-error');
            }

            return isValid;
        }
    };

    // Smooth scroll for anchor links
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth' });
                        target.focus({ preventScroll: true });
                    }
                });
            });
        }
    };

    // Post Loader - Auto-indexes posts from posts.json
    const PostLoader = {
        async init() {
            const postList = document.getElementById('post-list');
            if (!postList) return; // Only run on index page

            try {
                const res = await fetch('posts.json');
                if (!res.ok) return;

                const data = await res.json();
                if (!data.posts || data.posts.length === 0) return;

                postList.innerHTML = data.posts.map(post => `
                    <li class="post-item">
                        <a href="posts/${post.slug}.html" class="post-link">
                            <h2 class="post-title">${post.title}</h2>
                            <div class="post-meta">
                                <time datetime="${post.date}">${post.dateFormatted}</time>
                                <span class="post-category">${post.category}</span>
                            </div>
                        </a>
                    </li>
                `).join('');
            } catch (err) {
                // Keep static posts if fetch fails
            }
        }
    };

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        ThemeManager.init();
        MobileMenu.init();
        FormValidation.init();
        SmoothScroll.init();
        PostLoader.init();
    });
})();
