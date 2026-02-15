/* ═══════════════════════════════════════════
   SIGNAL.JS — Contact Logic
   ═══════════════════════════════════════════ */
(function () {
    'use strict';

    if (window.waitForGSAP) {
        window.waitForGSAP(initSignalPage);
    } else {
        var check = setInterval(function () {
            if (window.waitForGSAP) {
                clearInterval(check);
                window.waitForGSAP(initSignalPage);
            }
        }, 50);
    }

    function initSignalPage() {
        initSignalAnimations();
    }
    window.initSignalPage = initSignalPage;

    function initSignalAnimations() {
        var sentence = document.querySelector('.signal-sentence');
        var links = document.querySelectorAll('.signal-channels a');
        var meeting = document.querySelector('.meeting-details');

        if (!sentence) return;

        // Create a seamless entry timeline
        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.signal',
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        });

        tl.from(sentence, {
            opacity: 0,
            y: 25,
            duration: 1,
            ease: 'power3.out'
        });

        if (links.length > 0) {
            tl.from(links, {
                opacity: 0,
                x: -30,
                duration: 0.7,
                stagger: 0.15,
                ease: 'power3.out'
            }, '-=0.5');
        }

        if (meeting) {
            tl.from(meeting, {
                opacity: 0,
                y: 15,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3');
        }
    }
})();
