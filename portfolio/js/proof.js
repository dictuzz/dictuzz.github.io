/* ═══════════════════════════════════════════
   PROOF.JS — Investigation Board Logic
   ═══════════════════════════════════════════ */
(function () {
    'use strict';

    if (window.waitForGSAP) {
        window.waitForGSAP(initProofPage);
    } else {
        let retries = 0;
        let check = setInterval(function () {
            if (window.waitForGSAP) {
                clearInterval(check);
                window.waitForGSAP(initProofPage);
            } else if (retries++ > 50) {
                clearInterval(check);
                console.warn("GSAP failed to load for Proof");
            }
        }, 50);
    }

    function initProofPage() {
        initProofAnimations();
        initProofInteractions();
        if (window.initKineticType) {
            window.initKineticType('.experience-hook');
        }
    }
    window.initProofPage = initProofPage;

    function initProofAnimations() {
        const board = document.querySelector('.featured-work');
        const proofSection = document.querySelector('.proof-board');
        const cards = document.querySelectorAll('.experience');
        const isMobile = window.innerWidth <= 768;

        if (!board || cards.length === 0 || !proofSection) return;

        if (isMobile) {
            cards.forEach(function (card) {
                gsap.from(card, {
                    scale: 0.9,
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });
            return;
        }

        // Desktop: Pan & Zoom Camera
        gsap.set(board, { scale: 1, xPercent: 0, yPercent: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.proof-board',
                pin: true,
                start: 'top top',
                end: '+=4000',
                scrub: 1,
                anticipatePin: 1
            }
        });

        // Camera Sequence
        tl.to(board, { scale: 1.1, duration: 0.5 });

        // Card 2
        tl.to(board, { x: '-115vw', y: '-112vh', scale: 1.2, duration: 2, ease: 'power1.inOut' });
        // Card 3
        tl.to(board, { x: '-245vw', y: '-45vh', scale: 1.3, duration: 2, ease: 'power1.inOut' });
        // Card 4
        tl.to(board, { x: '-347vw', y: '-168vh', scale: 1.25, duration: 2, ease: 'power1.inOut' });
        // Card 5
        tl.to(board, { x: '-39vw', y: '-256vh', scale: 1.15, duration: 3, ease: 'power1.inOut' });
        // Card 6
        tl.to(board, { x: '-493vw', y: '-19vh', scale: 1.3, duration: 3, ease: 'power1.inOut' });
        // Card 7
        tl.to(board, { x: '-391vw', y: '-220vh', scale: 1.2, duration: 2, ease: 'power1.inOut' });

        // Exit
        tl.to(board, { scale: 1, x: '-250vw', y: '-250vh', duration: 1.5 });
    }

    function initProofInteractions() {
        const modal = document.getElementById('proof-modal');
        const cards = document.querySelectorAll('.experience');
        if (!modal || cards.length === 0) return;

        const modalBody = modal.querySelector('.modal-body');
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        let lastFocused = null;

        // Accessibility Setup
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');

        function openModal(card) {
            lastFocused = document.activeElement;
            modalBody.innerHTML = card.innerHTML;
            modal.classList.add('is-active');
            modal.setAttribute('aria-hidden', 'false');

            const content = modal.querySelector('.modal-content');
            if (content) content.setAttribute('data-lenis-prevent', '');

            // Focus management
            closeBtn.focus();
            document.addEventListener('keydown', trapFocus);
        }

        function closeModal() {
            modal.classList.remove('is-active');
            modal.setAttribute('aria-hidden', 'true');

            const content = modal.querySelector('.modal-content');
            if (content) content.removeAttribute('data-lenis-prevent');

            document.removeEventListener('keydown', trapFocus);

            // Return focus
            if (lastFocused) lastFocused.focus();
        }

        function trapFocus(e) {
            if (e.key === 'Tab') {
                const focusableEls = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const first = focusableEls[0];
                const last = focusableEls[focusableEls.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            } else if (e.key === 'Escape') {
                closeModal();
            }
        }

        cards.forEach(function (card) {
            card.style.cursor = 'pointer';
            // Make cards accessible
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');

            card.addEventListener('click', function () { openModal(card); });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card);
                }
            });
        });

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
    }
})();
