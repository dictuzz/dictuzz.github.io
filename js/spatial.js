/* ═══════════════════════════════════════════
   SPATIAL.JS — Proximity & Zone Logic
   Zero dependencies. Performance optimized.
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── 1. Spatial Zones (Cursor Tracking) ────
    const zones = document.querySelectorAll('[data-zone]');

    // We'll use a single mousemove listener for performance
    document.addEventListener('mousemove', function (e) {
        zones.forEach(zone => {
            const rect = zone.getBoundingClientRect();

            // Calculate cursor position relative to the card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS variables for the glow effect
            zone.style.setProperty('--x', `${x}px`);
            zone.style.setProperty('--y', `${y}px`);
        });
    });

    // ── 2. Mobile Expansion Logic ─────────────
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        zones.forEach(zone => {
            // Collapse by default (visual handling in CSS class)
            zone.classList.add('zone-collapsed');

            const header = zone.querySelector('.card-header');
            if (header) {
                header.addEventListener('click', () => {
                    // Toggle this zone
                    const isCollapsed = zone.classList.contains('zone-collapsed');

                    // Optional: Accordion behavior (close others)
                    // zones.forEach(z => z.classList.add('zone-collapsed'));

                    if (isCollapsed) {
                        zone.classList.remove('zone-collapsed');
                    } else {
                        zone.classList.add('zone-collapsed');
                    }
                });
            }
        });
    }

    // ── 3. Local Time (Asia/Jakarta) ──────────
    // ── 3. Creative Time (Asia/Jakarta) ──────
    function updateTime() {
        const timeElement = document.getElementById('local-time');
        if (timeElement) {
            const now = new Date();

            // Format: DD MMM • HH:mm
            const dateOptions = {
                timeZone: 'Asia/Jakarta',
                day: 'numeric',
                month: 'long'
            };

            const timeOptions = {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // 24h format
            };

            const dateStr = now.toLocaleDateString('en-US', dateOptions);
            const timeStr = now.toLocaleTimeString('en-US', timeOptions);

            // Blinking separator effect
            const separator = now.getSeconds() % 2 === 0 ? ':' : ' ';
            const formattedTime = timeStr.replace(':', separator);

            timeElement.innerHTML = `<i class="far fa-clock" style="margin-right: 6px;"></i> ${dateStr} &bull; ${formattedTime}`;
        }
    }

    // Update immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);

})();
