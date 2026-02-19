/* ═══════════════════════════════════════════
   THREAD.JS — Karaoke & Thesis Logic
   ═══════════════════════════════════════════ */
(function () {
    'use strict';

    if (window.waitForGSAP) {
        window.waitForGSAP(initThreadPage);
    } else {
        let retries = 0;
        let check = setInterval(function () {
            if (window.waitForGSAP) {
                clearInterval(check);
                window.waitForGSAP(initThreadPage);
            } else if (retries++ > 50) {
                clearInterval(check);
                console.warn("GSAP failed to load for Thread");
            }
        }, 50);
    }

    function initThreadPage() {
        initThreadAnimations();
        if (window.initKineticType) {
            window.initKineticType('.thread-thesis p');
        }
    }
    window.initThreadPage = initThreadPage;

    function initThreadAnimations() {
        const thesis = document.querySelector('.thread-thesis');
        const clusters = document.querySelectorAll('.thread-cluster');
        if (!thesis) return;

        // Thesis Words
        const thesisP = thesis.querySelector('p');
        if (thesisP) {
            const words = thesisP.textContent.split(' ');
            thesisP.innerHTML = words.map(function (word) {
                return '<span class="word-wrap"><span class="word">' + word + '</span></span>';
            }).join(' ');

            const wordSpans = thesisP.querySelectorAll('.word');
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
                trigger: '.thread',
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
            const heading = cluster.querySelector('.cluster-heading');
            const paragraphs = cluster.querySelectorAll('p');

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
        const footnoteItems = document.querySelectorAll('.footnote-item');
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
})();
