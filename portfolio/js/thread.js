/* ═══════════════════════════════════════════
   THREAD.JS — Karaoke & Thesis Logic
   ═══════════════════════════════════════════ */
(function () {
    'use strict';

    if (window.waitForGSAP) {
        window.waitForGSAP(initThreadPage);
    } else {
        var check = setInterval(function () {
            if (window.waitForGSAP) {
                clearInterval(check);
                window.waitForGSAP(initThreadPage);
            }
        }, 50);
    }

    function initThreadPage() {
        initThreadAnimations();
        initKineticType();
    }

    function initThreadAnimations() {
        var thesis = document.querySelector('.thread-thesis');
        var clusters = document.querySelectorAll('.thread-cluster');
        if (!thesis) return;

        // Thesis Words
        var thesisP = thesis.querySelector('p');
        if (thesisP) {
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

        // Sticky Fade Out
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

        // Karaoke
        clusters.forEach(function (cluster) {
            var heading = cluster.querySelector('.cluster-heading');
            var paragraphs = cluster.querySelectorAll('p');

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

            paragraphs.forEach(function (p) {
                ScrollTrigger.create({
                    trigger: p,
                    start: 'top 65%',
                    end: 'bottom 35%',
                    toggleClass: 'is-reading'
                });
            });
        });

        // Footnotes
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

        // Move Sticky Thesis
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

    function initKineticType() {
        if (!window.lenis) return;
        var targets = document.querySelectorAll('.thread-thesis p');
        window.lenis.on('scroll', function (e) {
            var velocity = e.velocity;
            if (Math.abs(velocity) > 50) velocity = 50 * Math.sign(velocity);
            gsap.to(targets, {
                skewX: velocity * 0.1,
                duration: 0.1,
                ease: 'power1.out',
                overwrite: 'auto'
            });
        });
    }
})();
