/* ═══════════════════════════════════════════
   CORE.JS — Shared Infrastructure
   Navigation, Smooth Scroll, Global Animations
   ═══════════════════════════════════════════ */
(function () {
    'use strict';

    // ── 1. Active Navigation ─────────────────
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // ── 2. Back-Nav Check ────────────────────
    window.isRevisit = false;
    if (currentPage === 'index.html' || currentPage === '') {
        var navEntry = performance.getEntriesByType('navigation')[0];
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
    var curtainTransition = document.querySelector('.page-transition-curtain');
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
    }

    function initFooterAnimation() {
        var footer = document.querySelector('.site-footer');
        if (!footer) return;
        var footerSections = footer.querySelectorAll('.footer-section');
        var footerBottom = footer.querySelector('.footer-bottom');

        gsap.from(footerSections, {
            scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
        });

        if (footerBottom) {
            gsap.from(footerBottom, {
                scrollTrigger: {
                    trigger: footerBottom,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }

    function initMagneticHover() {
        var magneticElements = document.querySelectorAll('.signal-channels a, .footer-link');
        magneticElements.forEach(function (el) {
            var rect = null;
            var width, height, left, top;

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
                var x = e.clientX - left - width / 2;
                var y = e.clientY - top - height / 2;
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
        var nav = document.querySelector('.site-nav');
        if (nav) {
            var scrollThreshold = 50;
            function onScroll() {
                var scrollY = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollY > scrollThreshold) {
                    nav.classList.add('nav-scrolled');
                } else {
                    nav.classList.remove('nav-scrolled');
                }
            }
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    }

    function initPageTransitionLinks() {
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = link.getAttribute('href');
                if (href === currentPage) {
                    e.preventDefault();
                    return;
                }
                e.preventDefault();
                var curtain = document.querySelector('.page-transition-curtain');
                if (curtain) {
                    gsap.set(curtain, { transformOrigin: 'bottom' });
                    gsap.to(curtain, {
                        scaleY: 1,
                        duration: 0.6,
                        ease: 'power3.inOut',
                        onComplete: function () {
                            window.location.href = href;
                        }
                    });
                } else {
                    window.location.href = href;
                }
            });
        });
    }

})();
