/* ═══════════════════════════════════════════
   CURTAIN.JS — Index Page Logic (Scroll Narrative)
   ═══════════════════════════════════════════ */

export function initCurtainPage() {
    gsap.registerPlugin(ScrollTrigger);
    initCurtainAnimations();
}

function initCurtainAnimations() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const declaration = document.querySelector('.curtain-declaration');

    // 1. Initial State: Hidden
    if (declaration) {
        gsap.set(declaration, { opacity: 0 });
        // Save original text for scramble
        declaration.dataset.original = declaration.innerText;
        declaration.innerText = getScrambledString(declaration.innerText.length);
    }

    if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0, y: 20 });

    // HIDE NAME (Fallback triggers if JS fails, but we hide it accessible-ly here)
    const curtainName = document.querySelector('.curtain-name');
    if (curtainName) {
        curtainName.classList.add('sr-only');
        // Remove display:none enforcement if previously set
        gsap.set(curtainName, { opacity: 1, display: 'block' });
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
        const tl = gsap.timeline({
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
    const originalText = element.dataset.original;
    const length = originalText.length;
    let iteration = 0;

    const interval = setInterval(function () {
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
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
