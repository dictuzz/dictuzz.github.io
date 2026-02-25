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
    function renderLinks(data) {
        const container = document.getElementById('links-container');
        if (!container) return;

        container.innerHTML = data.map(zone => `
            <section class="bio-card ${zone.className || ''}" data-zone="${zone.id}">
                <div class="card-header">
                    <div class="header-content">
                        <span class="card-label">${zone.label}</span>
                        <h2 class="card-title">${zone.title}</h2>
                    </div>
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

    function initBioInteractions() {
        // ── 2. Expansion Logic (All Devices) ──────
        const zones = document.querySelectorAll('.bio-card[data-zone]');

        zones.forEach(zone => {
            const header = zone.querySelector('.card-header');

            if (header) {
                if (!header.querySelector('.collapse-icon')) {
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-chevron-down collapse-icon';
                    header.appendChild(icon);
                }

                header.addEventListener('click', (e) => {
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
        const magneticItems = document.querySelectorAll('.bio-card, .bio-link');

        magneticItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                item.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translate(0, 0)';
            });
        });

        // ── 4. Entrance Animations (GSAP) ─────────
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(".profile-frame", { scale: 0.8, opacity: 0, duration: 1 })
                .from(".profile-name", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
                .from(".profile-role, .profile-meta", { y: 10, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.4");

            tl.from(".bio-card", {
                y: 40,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                clearProps: "all"
            }, "-=0.2");
        }
    }

    // ── 6. Async Fetch Initialization ─────────
    fetch('data/links.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load links data');
            return response.json();
        })
        .then(data => {
            renderLinks(data.zones);
            initBioInteractions();
        })
        .catch(err => console.error('Bio Link Error:', err));

})();
