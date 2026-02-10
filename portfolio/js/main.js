/* ═══════════════════════════════════════════
   main.js — The entire JavaScript budget.
   
   This file does exactly 2 things:
   1. Sets the active nav link
   2. Prevents animation replay on back-navigation
   
   That's it. No scroll effects. No particles.
   No typing. No tilt. No cursor tracking.
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Active Navigation ───────────────────
    // Highlight current page in nav based on filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // ── Prevent Animation Replay ────────────
    // If the user navigates back to Curtain, don't replay the
    // name resolve animation. The performance has been seen.
    if (currentPage === 'index.html' || currentPage === '') {
        var navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry && navEntry.type === 'back_forward') {
            document.documentElement.classList.add('revisit');
        }
    }
})();
