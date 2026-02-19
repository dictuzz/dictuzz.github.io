/* ═══════════════════════════════════════════
   CORE.JS — Shared Infrastructure
   Navigation, Smooth Scroll, Global Animations
   ═══════════════════════════════════════════ */
(function () {
    'use strict';

    // ── 1. Active Navigation (Scroll Spy) ─────────────────
    const navLinks = document.querySelectorAll('.glass-nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Trigger when section center hits viewport center
            if (scrollY >= (sectionTop - windowHeight * 0.5) &&
                scrollY < (sectionTop + sectionHeight - windowHeight * 0.5)) {

                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    // Run once on load
    updateActiveNav();

    // ── 2. Back-Nav Check ────────────────────
    window.isRevisit = false;
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html' || currentPage === '') {
        const navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry && navEntry.type === 'back_forward') {
            document.documentElement.classList.add('revisit');
            window.isRevisit = true;
        }
    }

    // ── 3. Lenis (Smooth Scroll) ─────────────
    window.lenis = null;
    if (window.Lenis) {
        window.lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            direction: 'vertical',
            smooth: true,
            smoothTouch: false
        });

        function raf(time) {
            window.lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ── 4. Page Transition Reveal ────────────
    const curtainTransition = document.querySelector('.page-transition-curtain');
    if (curtainTransition) {
        if (typeof gsap !== 'undefined') {
            gsap.set(curtainTransition, { scaleY: 1, transformOrigin: 'top' });
            gsap.to(curtainTransition, {
                scaleY: 0,
                duration: 1.0,
                ease: 'power4.out',
                delay: 0.1
            });
        }
    } else {
        document.body.style.opacity = '1';
    }

    // ── 5. Global Init Helper ────────────────
    window.waitForGSAP = function (callback) {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Connect Lenis
            if (window.lenis) {
                window.lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add(function (time) { });
                gsap.ticker.lagSmoothing(0);
            }

            // Defaults
            gsap.defaults({
                ease: 'power3.out',
                duration: 0.8
            });

            callback(); // Run page specific logic
            initGlobalAnimations(); // Run global logic

            // Force refresh after everything is initialized
            ScrollTrigger.refresh();
        } else {
            setTimeout(function () { waitForGSAP(callback); }, 100);
        }
    };

    // ── 6. Global Animations ─────────────────
    function initGlobalAnimations() {
        initFooterAnimation();
        initMagneticHover();
        initNavScroll();
        initPageTransitionLinks();
        ScrollTrigger.refresh();
    }

    // ── 7. Shared Utilities ──────────────────
    window.initKineticType = function (selector) {
        if (!window.lenis) return;
        const targets = document.querySelectorAll(selector);
        if (targets.length === 0) return;

        window.lenis.on('scroll', function (e) {
            let velocity = e.velocity;
            if (Math.abs(velocity) > 50) velocity = 50 * Math.sign(velocity);
            gsap.to(targets, {
                skewX: velocity * 0.1,
                duration: 0.1,
                ease: 'power1.out',
                overwrite: 'auto'
            });
        });
    };

    function initFooterAnimation() {
        const footer = document.querySelector('.site-footer');
        if (!footer) return;
        const footerSections = footer.querySelectorAll('.footer-section');
        const footerBottom = footer.querySelector('.footer-bottom');

        // Set initial state
        gsap.set(footerSections, { opacity: 0, y: 30 });

        ScrollTrigger.batch(footerSections, {
            start: "top 95%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.6,
                ease: 'power2.out',
                overwrite: true
            })
        });

        if (footerBottom) {
            gsap.set(footerBottom, { opacity: 0 });
            gsap.to(footerBottom, {
                scrollTrigger: {
                    trigger: footerBottom,
                    start: 'top 98%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }

    function initMagneticHover() {
        const magneticElements = document.querySelectorAll('.signal-channels a, .footer-link');
        magneticElements.forEach(function (el) {
            let rect = null;
            let width, height, left, top;

            el.addEventListener('mouseenter', function () {
                rect = el.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
                left = rect.left;
                top = rect.top;
                el.style.transition = 'transform 0.1s ease-out';
            });

            el.addEventListener('mousemove', function (e) {
                if (!rect) return;
                const x = e.clientX - left - width / 2;
                const y = e.clientY - top - height / 2;
                el.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });

            el.addEventListener('mouseleave', function () {
                el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s';
                el.style.transform = 'translate(0, 0)';
                rect = null;
                setTimeout(function () { el.style.transition = ''; }, 400);
            });
        });
    }

    function initNavScroll() {
        const nav = document.querySelector('.glass-nav');
        if (nav) {
            const scrollThreshold = 50;
            function onScroll() {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                // Add 'scrolled' class for visual shrinking/darkening
                if (scrollY > scrollThreshold) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    }

    function initPageTransitionLinks() {
        // Intercept anchor clicks for smooth scrolling
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);

                    if (targetSection) {
                        if (window.lenis) {
                            window.lenis.scrollTo(targetSection);
                        } else {
                            targetSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });
        });
    }

})();
