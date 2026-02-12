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

    function initSignalAnimations() {
        var sentence = document.querySelector('.signal-sentence');
        var links = document.querySelectorAll('.signal-channels a');
        var meeting = document.querySelector('.meeting-details');

        if (!sentence) return;

        gsap.from(sentence, {
            opacity: 0,
            y: 25,
            duration: 1,
            ease: 'power3.out',
            delay: 0.4
        });

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
})();
