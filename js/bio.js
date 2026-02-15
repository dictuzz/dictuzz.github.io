/* ═══════════════════════════════════════════
   BIO.JS — Refined Interaction Logic
   Theme, Time, Physics, & Entrance
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── 0. Init Safeguard ─────────────────────
    if (typeof document === 'undefined') return;

    // ── 1. Theme Toggle Logic ─────────────────
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Load saved or default to 'light' for this page specific vibe
    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem('bio-theme') || 'light';
    } catch (e) { }

    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('bio-theme', theme);
        } catch (e) { }

        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    // ── 5. Dynamic Link Rendering ─────────────
    function renderLinks() {
        const container = document.getElementById('links-container');
        if (!container || typeof linkData === 'undefined') return;

        container.innerHTML = linkData.map(zone => `
            <section class="bio-card ${zone.className || ''}" data-zone="${zone.id}">
                <div class="card-header">
                    <div class="header-content">
                        <span class="card-label">${zone.label}</span>
                        <h2 class="card-title">${zone.title}</h2>
                    </div>
                    <!-- Icon added via Expansion Logic below -->
                </div>
                <div class="link-list-wrapper">
                    <div class="link-list">
                        ${zone.items.map(item => `
                            <a href="${item.url}" ${item.target ? `target="${item.target}"` : ''} class="bio-link">
                                <div class="link-icon"><i class="${item.icon}"></i></div>
                                <div class="link-content">
                                    <div class="link-title">
                                        ${item.title} 
                                        <i class="fas fa-arrow-right link-arrow"></i>
                                    </div>
                                    <div class="link-desc">${item.desc}</div>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </section>
        `).join('');
    }

    // Initialize Links first
    renderLinks();

    // ── 2. Expansion Logic (All Devices) ──────
    // Re-query zones after rendering
    const zones = document.querySelectorAll('.bio-card[data-zone]');

    zones.forEach(zone => {
        // Find or create header interactive area
        const header = zone.querySelector('.card-header');

        if (header) {
            // Add icon if not present
            if (!header.querySelector('.collapse-icon')) {
                const title = header.querySelector('.card-title');
                // We'll append icon to title or header via JS for simplicity if not in HTML
                const icon = document.createElement('i');
                icon.className = 'fas fa-chevron-down collapse-icon';
                header.appendChild(icon);
            }

            header.addEventListener('click', (e) => {
                // Prevent triggering if clicking a link inside header (unlikely but safe)
                if (e.target.tagName === 'A') return;

                const isCollapsed = zone.classList.contains('zone-collapsed');

                if (isCollapsed) {
                    zone.classList.remove('zone-collapsed');
                } else {
                    zone.classList.add('zone-collapsed');
                }
            });
        }
    });

    // ── 3. Magnetic Hover Logic ───────────────
    // Applies a subtle magnetic pull to cards and links
    const magneticItems = document.querySelectorAll('.bio-card, .bio-link');

    magneticItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Subtle movement
            item.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translate(0, 0)';
        });
    });

    // ── 3. Time Display (Asia/Jakarta) ────────
    function updateTime() {
        const timeElement = document.getElementById('local-time');
        if (timeElement) {
            const now = new Date();
            const timeOptions = {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };

            const timeStr = now.toLocaleTimeString('en-US', timeOptions);
            // Blinking colon effect
            const separator = now.getSeconds() % 2 === 0 ? ':' : ' ';
            timeElement.innerHTML = `<i class="far fa-clock" style="margin-right:6px"></i> ${timeStr.replace(':', separator)} WIB`;
        }
    }

    setInterval(updateTime, 1000);
    updateTime();

    // ── 4. Entrance Animations (GSAP) ─────────
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Header Elements
        tl.from(".profile-frame", { scale: 0.8, opacity: 0, duration: 1 })
            .from(".profile-name", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
            .from(".profile-role, .profile-meta", { y: 10, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.4");

        // Cards Stagger
        tl.from(".bio-card", {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            clearProps: "all" // Important for magnetic hover to work after
        }, "-=0.2");
    }

})();
