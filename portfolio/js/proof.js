/* ═══════════════════════════════════════════
   PROOF.JS — Investigation Board Logic
   ═══════════════════════════════════════════ */
(function () {
    'use strict';

    if (window.waitForGSAP) {
        window.waitForGSAP(initProofPage);
    } else {
        var check = setInterval(function () {
            if (window.waitForGSAP) {
                clearInterval(check);
                window.waitForGSAP(initProofPage);
            }
        }, 50);
    }

    function initProofPage() {
        initProofAnimations();
        initProofInteractions();
        initKineticType();
    }

    function initProofAnimations() {
        var board = document.querySelector('.featured-work');
        var proofSection = document.querySelector('.proof-board');
        var cards = document.querySelectorAll('.experience');
        var isMobile = window.innerWidth <= 768;

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

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.proof-board',
                pin: true,
                start: 'top top',
                end: '+=8000',
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
        var modal = document.getElementById('proof-modal');
        var cards = document.querySelectorAll('.experience');
        if (!modal || cards.length === 0) return;

        var modalBody = modal.querySelector('.modal-body');
        var closeBtn = modal.querySelector('.modal-close');
        var backdrop = modal.querySelector('.modal-backdrop');

        function openModal(card) {
            modalBody.innerHTML = card.innerHTML;
            modal.classList.add('is-active');
            var content = modal.querySelector('.modal-content');
            if (content) content.setAttribute('data-lenis-prevent', '');
        }

        function closeModal() {
            modal.classList.remove('is-active');
            var content = modal.querySelector('.modal-content');
            if (content) content.removeAttribute('data-lenis-prevent');
        }

        cards.forEach(function (card) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function () { openModal(card); });
        });

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    function initKineticType() {
        if (!window.lenis) return;
        var targets = document.querySelectorAll('.experience-hook');
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
