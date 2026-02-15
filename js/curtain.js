/* ═══════════════════════════════════════════
   CURTAIN.JS — Index Page Logic (Scroll Narrative)
   ═══════════════════════════════════════════ */
(function () {
    'use strict';

    // Wait for dependencies (GSAP + ScrollTrigger)
    var checkDeps = setInterval(function () {
        if (window.gsap && window.ScrollTrigger) {
            clearInterval(checkDeps);
            initCurtainPage();
        }
    }, 100);

    function initCurtainPage() {
        gsap.registerPlugin(ScrollTrigger);
        initCurtainAnimations();
    }

    function initCurtainAnimations() {
        var scrollIndicator = document.querySelector('.scroll-indicator');
        var declaration = document.querySelector('.curtain-declaration');

        // 1. Initial State: Hidden
        if (declaration) {
            gsap.set(declaration, { opacity: 0 });
            // Save original text for scramble
            declaration.dataset.original = declaration.innerText;
            declaration.innerText = getScrambledString(declaration.innerText.length);
        }

        if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0, y: 20 });

        // HIDE NAME (Fallback) - It interferes with Loom
        var curtainName = document.querySelector('.curtain-name');
        if (curtainName) {
            gsap.set(curtainName, { opacity: 0, display: 'none' });
        }

        // 2. Reveal Scroll Indicator (After 2s delay)
        setTimeout(function () {
            if (scrollIndicator) {
                gsap.to(scrollIndicator, {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power2.out"
                });
            }
        }, 2000);

        // 3. TAGLINE SEQUENCE (Scroll Driven)
        // trigger: .curtain (height: 350vh)
        // Loom exits by 100vh (approx).
        // Tagline should start appearing at 100vh.

        if (declaration) {
            var tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".curtain",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1
                }
            });

            // 0% -> 30%: Nothing (Loom is exiting)
            // 30% -> 50%: Tagline Fades In + Scramble

            tl.to(declaration, {
                opacity: 1,
                duration: 1, // relative duration in timeline
                onStart: function () {
                    // Trigger Scramble when it starts appearing
                    scrambleText(declaration);
                }
            }, 0.3); // Start at 30% of scroll

            // 60% -> 90%: Tagline Exits (Slide Up)
            tl.to(declaration, {
                opacity: 0,
                y: -50,
                duration: 1
            }, 0.7); // Start at 70% of scroll
        }
    }

    // --- Scramble Logic ---
    function scrambleText(element) {
        if (!element || element.dataset.scrambling === "true") return;

        element.dataset.scrambling = "true";
        var originalText = element.dataset.original;
        var length = originalText.length;
        var iteration = 0;

        var interval = setInterval(function () {
            element.innerText = originalText
                .split("")
                .map(function (letter, index) {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"[Math.floor(Math.random() * 46)];
                })
                .join("");

            if (iteration >= length) {
                clearInterval(interval);
                element.dataset.scrambling = "false";
            }

            iteration += 1 / 2; // Speed control
        }, 30);
    }

    function getScrambledString(length) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        var result = "";
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

})();
