/**
 * PORTFOLIO CONTENT LOADER
 * Hydrates the HTML with data from PORTFOLIO_CONTENT (data.js)
 */

(function () {
    'use strict';

    // Wait for data.js to be loaded
    const checkData = setInterval(() => {
        if (window.PORTFOLIO_CONTENT) {
            clearInterval(checkData);
            initLoader();
        }
    }, 50);

    function initLoader() {
        const DATA = window.PORTFOLIO_CONTENT;
        const page = getPageName();

        // 1. GLOBAL HYDRATION (Meta, Footer)
        hydrateExamples(DATA.global);
        renderFooter(DATA.global);

        // 2. PAGE SPECIFIC HYDRATION
        if (page === 'index' && DATA.curtain) {
            hydrateCurtain(DATA.curtain);
        } else if (page === 'proof' && DATA.proof) {
            renderProof(DATA.proof);
        } else if (page === 'thread' && DATA.thread) {
            renderThread(DATA.thread);
        } else if (page === 'signal' && DATA.signal) {
            renderSignal(DATA.signal);
        }
    }

    function getPageName() {
        const path = window.location.pathname;
        if (path.includes('proof')) return 'proof';
        if (path.includes('thread')) return 'thread';
        if (path.includes('signal')) return 'signal';
        return 'index'; // Default to curtain
    }

    // -------------------------------------------------------------
    // RENDERERS
    // -------------------------------------------------------------

    function hydrateExamples(data) {
        // Hydrate elements with data-i18n="global.key"
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const value = getNestedValue(window.PORTFOLIO_CONTENT, key);
            if (value) el.innerHTML = value;
        });
    }

    function renderFooter(data) {
        // Dynamic Footer Rendering could act here, but current footer is static in HTML. 
        // We can update the copyright year or tagline if marked.
        const tagline = document.querySelector('.footer-tagline');
        if (tagline && data.footer.tagline) tagline.textContent = data.footer.tagline;

        const copyright = document.querySelector('.footer-bottom p:first-child');
        if (copyright && data.footer.copyright) copyright.innerHTML = data.footer.copyright;
    }

    function hydrateCurtain(data) {
        const nameEl = document.querySelector('.curtain-name');
        if (nameEl && data.textLines) {
            nameEl.innerHTML = data.textLines.join('<br>'); // Simple join for HTML display
        }

        const taglineEl = document.querySelector('.curtain-declaration');
        if (taglineEl && data.tagline) {
            taglineEl.textContent = data.tagline;
        }
    }

    function renderProof(data) {
        const container = document.querySelector('.featured-work');
        if (!container || !data.experiences) return;

        container.innerHTML = data.experiences.map(exp => `
            <article class="experience" id="${exp.id}">
                <header class="experience-entry">
                    <p class="experience-hook">${exp.hook}</p>
                    <p class="experience-meta">${exp.role} · ${exp.company} · ${exp.date}</p>
                </header>

                <figure class="experience-artifact">
                    <img src="${exp.image}" alt="${exp.alt}" loading="lazy">
                </figure>

                <div class="experience-body">
                    ${exp.body}
                </div>

                <blockquote class="experience-takeaway">
                    <p>${exp.takeaway}</p>
                </blockquote>
            </article>
        `).join('');

        // Re-init animations for the new elements if script ran early
        if (window.ScrollTrigger) ScrollTrigger.refresh();

        // Retrigger proof.js init if it exists
        if (window.initProofPage) window.initProofPage();
    }

    function renderThread(data) {
        const thesisEl = document.querySelector('.thread-thesis p');
        if (thesisEl && data.thesis) thesisEl.textContent = data.thesis;

        const main = document.querySelector('main.thread');

        // Remove existing clusters to render fresh
        const existingClusters = document.querySelectorAll('.thread-cluster');
        existingClusters.forEach(el => el.remove());

        const footer = document.querySelector('.thread-footnote');

        // Render Clusters
        if (data.clusters) {
            const clusterHTML = data.clusters.map(cluster => `
                <section class="thread-cluster">
                    <h2 class="cluster-heading">${cluster.title}</h2>
                    ${cluster.content}
                </section>
            `).join('');

            // Insert before footnote
            if (footer) {
                footer.insertAdjacentHTML('beforebegin', clusterHTML);
            } else {
                main.insertAdjacentHTML('beforeend', clusterHTML);
            }
        }

        // Render Footnotes
        if (footer && data.footnotes) {
            const dl = footer.querySelector('dl');
            if (dl) {
                dl.innerHTML = data.footnotes.map(note => `
                    <div class="footnote-item">
                        <dt>${note.title}</dt>
                        <dd>${note.value}</dd>
                    </div>
                `).join('');
            }
        }
    }

    function renderSignal(data) {
        const sentence = document.querySelector('.signal-sentence');
        if (sentence && data.sentence) sentence.textContent = data.sentence;

        const channels = document.querySelector('.signal-channels');
        if (channels && window.PORTFOLIO_CONTENT.global.socials) {
            // Merge global socials with pure contact emails? 
            // The design has specific links. Let's use the layout from data.js

            // For now, let's keep the dedicated contact logic or map from global
            // But data.js global.socials has URLs.

            // Use specific Signal logic if defined, otherwise empty
            // The HTML had hardcoded links. We can regenerate them.

            // Let's assume user wants to edit LINKS in data.js global.socials
            const socials = window.PORTFOLIO_CONTENT.global.socials;
            const email = window.PORTFOLIO_CONTENT.global.email;

            let linksHTML = `<a href="mailto:${email}">Email</a>`;
            linksHTML += socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('');

            channels.innerHTML = linksHTML;
        }

        const form = document.querySelector('form.signal-form');
        if (form && data.form) {
            form.action = data.form.action;
            const fields = data.form.fields;

            // We assume structure matches. We can update placeholders/labels.
            if (fields.name) {
                const input = form.querySelector('input[name="name"]');
                if (input) input.placeholder = fields.name.placeholder;
            }
            if (fields.email) {
                const input = form.querySelector('input[name="email"]');
                if (input) input.placeholder = fields.email.placeholder;
            }
            if (fields.phone) {
                const input = form.querySelector('input[name="phone"]');
                if (input) input.placeholder = fields.phone.placeholder;
            }
            if (fields.topic) {
                const input = form.querySelector('textarea[name="topic"]');
                if (input) input.placeholder = fields.topic.placeholder;
            }

            const btn = form.querySelector('button');
            if (btn && data.form.submit) btn.textContent = data.form.submit;
        }
    }

    // UTILS
    function getNestedValue(obj, path) {
        return path.split('.').reduce((o, k) => (o || {})[k], obj);
    }

})();
