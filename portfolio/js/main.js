/* ═══════════════════════════════════════════
   main.js — The Stage: Advanced GSAP Orchestration

   Features:
   1. Active navigation (preserved)
   2. Back-nav animation skip (preserved)
   3. GSAP ScrollTrigger — cinematic scroll choreography
   4. Nav scroll blur effect
   5. Cursor spotlight (Curtain only)
   6. Typing animation (Curtain declaration)
   7. Page transitions on nav
   8. Parallax background (Curtain)
   9. Image reveal with scale + clip-path (Proof)
   10. Magnetic hover on links
   11. Footer reveal
   12. Scroll indicator hide on scroll
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

    // ── 2. Back-Nav: No Animation Replay ─────
    var isRevisit = false;
    if (currentPage === 'index.html' || currentPage === '') {
        var navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry && navEntry.type === 'back_forward') {
            document.documentElement.classList.add('revisit');
            isRevisit = true;
        }
    }

    // ── 0. Lenis Setup ───────────────────────
    var lenis = null;
    if (window.Lenis) {
        lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            direction: 'vertical',
            smooth: true,
            smoothTouch: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ── Page Load: Curtain Reveal ─────────────
    var curtainTransition = document.querySelector('.page-transition-curtain');
    if (curtainTransition) {
        gsap.set(curtainTransition, { scaleY: 1, transformOrigin: 'top' });
        gsap.to(curtainTransition, {
            scaleY: 0,
            duration: 1.0,
            ease: 'power4.out',
            delay: 0.1
        });
    } else {
        document.body.style.opacity = '1';
    }

    // ── 3. GSAP Initialization ───────────────
    function waitForGSAP(callback) {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Connect Lenis to ScrollTrigger
            if (lenis) {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add(function (time) {
                    // lenis.raf(time * 1000); 
                });
                gsap.ticker.lagSmoothing(0);
            }
            callback();
        } else {
            // Retry — scripts may still be loading
            setTimeout(function () { waitForGSAP(callback); }, 100);
        }
    }

    waitForGSAP(function () {
        // Configure GSAP defaults
        gsap.defaults({
            ease: 'power3.out',
            duration: 0.8
        });

        initCurtainAnimations();
        initProofAnimations();
        initThreadAnimations();
        initSignalAnimations();
        initFooterAnimation();
        initKineticType();
        initLiquidBackground();
    });

    // ══════════════════════════════════════════
    // CURTAIN PAGE — Cinematic entrance
    // ══════════════════════════════════════════
    function initCurtainAnimations() {
        var curtainBg = document.querySelector('.curtain-bg-img');
        var scrollIndicator = document.querySelector('.scroll-indicator');

        if (!curtainBg) return;

        // Parallax background on scroll
        gsap.to(curtainBg, {
            y: '-15%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.curtain',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        // Background image entrance — scale down from 1.2 to 1.1
        if (!isRevisit) {
            gsap.from(curtainBg, {
                scale: 1.3,
                opacity: 0,
                duration: 2.5,
                ease: 'power2.out'
            });
        }

        // Scroll indicator hides on scroll
        if (scrollIndicator) {
            gsap.to(scrollIndicator, {
                opacity: 0,
                y: -20,
                scrollTrigger: {
                    trigger: '.curtain',
                    start: 'top top',
                    end: '20% top',
                    scrub: true
                }
            });
        }
    }

    // ══════════════════════════════════════════
    // PROOF PAGE — The Investigation Board
    // Pan & Zoom Camera Logic
    // ══════════════════════════════════════════
    function initProofAnimations() {
        var board = document.querySelector('.featured-work');
        var proofSection = document.querySelector('.proof-board');
        var cards = document.querySelectorAll('.experience');
        var isMobile = window.innerWidth <= 768;

        if (!board || cards.length === 0 || !proofSection) return;

        if (isMobile) {
            // Mobile: Standard Vertical Scroll with simple reveals
            cards.forEach(function (card) {
                gsap.from(card, {
                    scale: 0.9,
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card, // Use card itself as trigger in normal flow
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });
            return;
        }

        // Desktop: Pan & Zoom Camera

        // 1. Initial State
        // Ensure board is Top-Left aligned to start
        gsap.set(board, { scale: 1, xPercent: 0, yPercent: 0 });

        // 2. Timeline
        // 2. Timeline
        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.proof-board', // The pinned viewport container
                pin: true,
                start: 'top top',
                end: '+=8000', // Maximized for 7 cards
                scrub: 1,
                anticipatePin: 1
            }
        });

        // ── Camera Movements ──
        // We move the BOARD, not the camera. moving the board LEFT moves the camera RIGHT.

        // Move to Card 2 (120vw, 110vh)
        tl.to(board, {
            scale: 1.1,
            duration: 0.5
        });

        // Pan to Card 2: 12 hours. Every week.
        // T: 110, L: 120. S: 1.2. Target Top 20vh.
        tl.to(board, {
            x: '-115vw',
            y: '-112vh',
            scale: 1.2,
            duration: 2,
            ease: 'power1.inOut'
        });

        // Pan to Card 3: 1000 people.
        // T: 50, L: 210. S: 1.3. Target Top 20vh.
        tl.to(board, {
            x: '-245vw',
            y: '-45vh',
            scale: 1.3,
            duration: 2,
            ease: 'power1.inOut'
        });

        // Pan to Card 4: Forum OSIS
        // T: 150, L: 300. S: 1.25. Target Top 20vh.
        tl.to(board, {
            x: '-347vw',
            y: '-168vh',
            scale: 1.25,
            duration: 2,
            ease: 'power1.inOut'
        });

        // Pan to Card 5: Catholic Youth
        // T: 240, L: 60. S: 1.15. Target Top 20vh.
        tl.to(board, {
            x: '-39vw',
            y: '-256vh',
            scale: 1.15,
            duration: 3,
            ease: 'power1.inOut'
        });

        // Pan to Card 6: Acolyte
        // T: 30, L: 400. S: 1.3. Target Top 20vh.
        tl.to(board, {
            x: '-493vw',
            y: '-19vh',
            scale: 1.3,
            duration: 3,
            ease: 'power1.inOut'
        });

        // Pan to Card 7: Vertical Rescue
        // T: 200, L: 350. S: 1.2. Target Top 20vh.
        tl.to(board, {
            x: '-391vw',
            y: '-220vh',
            scale: 1.2,
            duration: 2,
            ease: 'power1.inOut'
        });

        // Exit: Zoom out and slide up to reveal footer
        tl.to(board, {
            scale: 1,
            x: '-250vw', // Center exit roughly
            y: '-250vh', // Exit towards bottom
            duration: 1.5
        });
    }

    // ══════════════════════════════════════════
    // THREAD PAGE — Sticky thesis + cluster reveals
    // ══════════════════════════════════════════
    function initThreadAnimations() {
        var thesis = document.querySelector('.thread-thesis');
        var clusters = document.querySelectorAll('.thread-cluster');

        if (!thesis) return;

        // Thesis: words reveal with subtle vertical stagger
        var thesisP = thesis.querySelector('p');
        if (thesisP) {
            // Split text into words manually for animation
            var words = thesisP.textContent.split(' ');
            thesisP.innerHTML = words.map(function (word) {
                return '<span class="word-wrap"><span class="word">' + word + '</span></span>';
            }).join(' ');

            var wordSpans = thesisP.querySelectorAll('.word');

            gsap.from(wordSpans, {
                opacity: 0,
                y: 30,
                rotateX: 40,
                transformOrigin: 'bottom center',
                duration: 0.6,
                stagger: 0.04,
                ease: 'power3.out',
                delay: 0.3
            });
        }

        // Thesis: Fade out and blur as user scrolls down to avoid collision
        gsap.to(thesis, {
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: '+=400',
                scrub: true
            },
            opacity: 0,
            filter: 'blur(10px)',
            y: -50
        });

        // Editorial / Karaoke Effect
        // paragraphs dim/highlight based on scroll position
        clusters.forEach(function (cluster) {
            var heading = cluster.querySelector('.cluster-heading');
            var paragraphs = cluster.querySelectorAll('p');

            // 1. Heading Wipe (Keep existing)
            if (heading) {
                gsap.from(heading, {
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    clipPath: 'inset(0 100% 0 0)',
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }

            // 2. Paragraph Karaoke Highlight
            paragraphs.forEach(function (p) {
                // Determine reading zone
                // We want it to highlight when it's in the "middle slice" of the screen
                // Start highlight: When top of p hits 65% of viewport height
                // End highlight: When bottom of p hits 35% of viewport height (move up)

                ScrollTrigger.create({
                    trigger: p,
                    start: 'top 65%',
                    end: 'bottom 35%',
                    toggleClass: 'is-reading',
                    // markers: true // for debugging
                });
            });
        });

        // Footnote items: staggered reveal
        var footnoteItems = document.querySelectorAll('.footnote-item');
        if (footnoteItems.length > 0) {
            gsap.from(footnoteItems, {
                scrollTrigger: {
                    trigger: '.thread-footnote',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.12,
                ease: 'power2.out'
            });
        }

        // Visual Fix: Blur & fade sticky thesis as content scrolls over
        if (clusters.length > 0) {
            gsap.to(thesis, {
                scrollTrigger: {
                    trigger: clusters[0],
                    start: 'top 60%',
                    end: 'top 15%',
                    scrub: true
                },
                opacity: 0,
                filter: 'blur(10px)',
                y: -50,
                scale: 0.95,
                ease: 'none'
            });
        }
    }

    // ══════════════════════════════════════════
    // SIGNAL PAGE — Intimate sequential reveal
    // ══════════════════════════════════════════
    function initSignalAnimations() {
        var sentence = document.querySelector('.signal-sentence');
        var links = document.querySelectorAll('.signal-channels a');
        var meeting = document.querySelector('.meeting-details');

        if (!sentence) return;

        // Sentence: slow fade with vertical shift
        gsap.from(sentence, {
            opacity: 0,
            y: 25,
            duration: 1,
            ease: 'power3.out',
            delay: 0.4
        });

        // Contact links: sequential slide with stagger
        if (links.length > 0) {
            gsap.from(links, {
                opacity: 0,
                x: -30,
                duration: 0.7,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.8
            });
        }

        // Meeting details: delayed subtle reveal
        if (meeting) {
            gsap.from(meeting, {
                opacity: 0,
                y: 15,
                duration: 0.6,
                ease: 'power2.out',
                delay: 1.4
            });
        }
    }

    // ══════════════════════════════════════════
    // FOOTER — Rise reveal on all pages
    // ══════════════════════════════════════════
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

    // ── 4. Nav Scroll Effect ──────────────────
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

    // ── 5. Cursor Spotlight (Curtain Only) ────
    var curtainName = document.querySelector('.curtain-name');
    if (curtainName && !isRevisit) {
        var curtain = document.querySelector('.curtain');
        if (curtain) {
            var spotlightRAF = null;
            curtain.addEventListener('mousemove', function (e) {
                if (spotlightRAF) cancelAnimationFrame(spotlightRAF);
                spotlightRAF = requestAnimationFrame(function () {
                    var rect = curtain.getBoundingClientRect();
                    var x = ((e.clientX - rect.left) / rect.width) * 100;
                    var y = ((e.clientY - rect.top) / rect.height) * 100;

                    var shadowX = (x - 50) * 0.4;
                    var shadowY = (y - 50) * 0.4;
                    curtainName.style.textShadow =
                        shadowX + 'px ' + shadowY + 'px 80px rgba(201, 165, 90, 0.15), ' +
                        (shadowX * 2) + 'px ' + (shadowY * 2) + 'px 160px rgba(201, 165, 90, 0.06)';
                });
            });

            curtain.addEventListener('mouseleave', function () {
                curtainName.style.textShadow =
                    '0 0 80px rgba(201, 165, 90, 0.07), 0 0 160px rgba(201, 165, 90, 0.03)';
            });
        }
    }

    // ── 6. Typing Animation (Curtain) ─────────
    var declaration = document.querySelector('.curtain-declaration');
    if (declaration && !isRevisit) {
        var fullText = declaration.textContent.trim();
        declaration.textContent = '';
        declaration.style.opacity = '1';
        declaration.style.animation = 'none';
        declaration.style.borderLeft = 'none';

        setTimeout(function () {
            declaration.style.borderLeft = '1px solid var(--c-text-faint)';

            var charIndex = 0;
            var cursor = document.createElement('span');
            cursor.className = 'typed-cursor';
            cursor.textContent = '|';
            declaration.appendChild(cursor);

            function typeChar() {
                if (charIndex < fullText.length) {
                    var textNode = document.createTextNode(fullText[charIndex]);
                    declaration.insertBefore(textNode, cursor);
                    charIndex++;

                    var nextDelay = 35;
                    var currentChar = fullText[charIndex - 1];
                    if (currentChar === '.' || currentChar === '—' || currentChar === ',') {
                        nextDelay = 180;
                    } else if (currentChar === ' ') {
                        nextDelay = 55;
                    }

                    setTimeout(typeChar, nextDelay);
                } else {
                    setTimeout(function () {
                        cursor.style.transition = 'opacity 1s ease';
                        cursor.style.opacity = '0';
                        setTimeout(function () {
                            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
                        }, 1000);
                    }, 2000);
                }
            }

            setTimeout(typeChar, 200);
        }, 1000);
    } else if (declaration && isRevisit) {
        declaration.style.opacity = '1';
        declaration.style.animation = 'none';
    }

    // ── 7. Page Transitions ───────────────────
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
                // Fallback
                window.location.href = href;
            }
        });
    });

    // ── 8. Kinetic Typography ─────────────────
    // ── 8. Kinetic Typography (Optimized) ─────
    function initKineticType() {
        if (!lenis) return;
        var targets = document.querySelectorAll('.curtain-name, .experience-hook, .thread-thesis p');

        // Create a quickTo function for each element if possible, 
        // OR just use a single tween instance and update it?
        // Actually, quickTo is best for single props.

        // Since we have multiple targets, we'll use a shared proxy or just optimize the tween.
        // But to be cleaner:

        lenis.on('scroll', function (e) {
            var velocity = e.velocity;
            // Limit velocity cap to prevent text exploding
            if (Math.abs(velocity) > 50) velocity = 50 * Math.sign(velocity);

            gsap.to(targets, {
                skewX: velocity * 0.1,
                duration: 0.1, // Faster response
                ease: 'power1.out',
                overwrite: 'auto'
            });
        });
    }

    // ── 9. Liquid Canvas Background ───────────
    function initLiquidBackground() {
        var canvas = document.getElementById('liquid-noise');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var width, height;
        var particles = [];
        var mouse = { x: -1000, y: -1000 };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        resize();

        // Create Golden Particles — Increased count & variety
        for (var i = 0; i < 65; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2.5 + 0.5,
                baseAlpha: Math.random() * 0.4 + 0.1,
                alpha: 0
            });
            particles[i].alpha = particles[i].baseAlpha;
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#c9a55a'; // Gold

            particles.forEach(function (p) {
                // Base movement
                p.x += p.vx;
                p.y += p.vy;

                // Mouse attraction
                var dx = mouse.x - p.x;
                var dy = mouse.y - p.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var interactionRadius = 250;

                if (dist < interactionRadius) {
                    // Move slightly towards mouse
                    p.x += dx * 0.02;
                    p.y += dy * 0.02;
                    // Brighten significantly
                    p.alpha = Math.min(p.baseAlpha + 0.4, 0.9);
                } else {
                    p.alpha = p.baseAlpha;
                }

                // Wrap around edges
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ── 10. Magnetic Hover on Links ───────────
    // ── 10. Magnetic Hover on Links (Optimized) ──
    function initMagneticHover() {
        var magneticElements = document.querySelectorAll('.signal-channels a, .footer-link');

        magneticElements.forEach(function (el) {
            var rect = null;
            var width, height, left, top;

            // Calculate layout ONLY on enter
            el.addEventListener('mouseenter', function () {
                rect = el.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
                left = rect.left;
                top = rect.top;
                el.style.transition = 'transform 0.1s ease-out'; // Snappy follow
            });

            el.addEventListener('mousemove', function (e) {
                if (!rect) return;
                // No getBoundingClientRect here!
                var x = e.clientX - left - width / 2;
                var y = e.clientY - top - height / 2;

                // Use CSS transform directly
                el.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });

            el.addEventListener('mouseleave', function () {
                el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s';
                el.style.transform = 'translate(0, 0)';
                rect = null; // Clear
                setTimeout(function () {
                    el.style.transition = '';
                }, 400);
            });
        });
    }

    initMagneticHover();

    // ══════════════════════════════════════════
    // PROOF PAGE — Interactive Modal Logic
    // ══════════════════════════════════════════
    function initProofInteractions() {
        var modal = document.getElementById('proof-modal');
        var cards = document.querySelectorAll('.experience');

        if (!modal || cards.length === 0) return;

        var modalBody = modal.querySelector('.modal-body');
        var closeBtn = modal.querySelector('.modal-close');
        var backdrop = modal.querySelector('.modal-backdrop');

        function openModal(card) {
            // Clone content
            modalBody.innerHTML = card.innerHTML;

            // Show modal
            modal.classList.add('is-active');

            // Allow Lenis to continue (so it doesn't break event loop), 
            // but prevent it from handling scroll on the modal.
            // We do this by adding the attribute to the scrollable container.
            var content = modal.querySelector('.modal-content');
            if (content) content.setAttribute('data-lenis-prevent', '');
        }

        function closeModal() {
            modal.classList.remove('is-active');
            // Cleanup
            var content = modal.querySelector('.modal-content');
            if (content) content.removeAttribute('data-lenis-prevent');
        }

        // Add Click Listeners to Cards
        cards.forEach(function (card) {
            card.style.cursor = 'pointer'; // Indicate interactivity
            card.addEventListener('click', function () {
                openModal(card);
            });
        });

        // Close Listeners
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    // Call it
    initProofInteractions();

})();
