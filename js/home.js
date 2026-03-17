import { ThemeManager } from './ui-kit.js';

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeMeta = document.querySelector('meta[name="theme-color"]');

const themeManager = new ThemeManager({
    toggleElement: themeToggle,
    iconElement: themeIcon,
    defaultTheme: 'light',
    storageKey: 'dictuzz-theme'
});

function updateThemeColor(theme) {
    if (!themeMeta) return;
    themeMeta.setAttribute('content', theme === 'dark' ? '#121820' : '#f5efe4');
}

updateThemeColor(themeManager.getMode());
window.addEventListener('theme-changed', (event) => {
    updateThemeColor(event.detail?.theme || 'light');
});

const folders = [...document.querySelectorAll('[data-folder]')];
const dateEl = document.getElementById('local-date');
const timeEl = document.getElementById('local-time');

function getLocalTimeZone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Bangkok';
    } catch {
        return 'Asia/Bangkok';
    }
}

function updateLocalTime() {
    if (!dateEl || !timeEl) return;

    const timeZone = getLocalTimeZone();
    const now = new Date();

    dateEl.textContent = new Intl.DateTimeFormat(undefined, {
        timeZone,
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(now);

    timeEl.textContent = new Intl.DateTimeFormat(undefined, {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(now);
}

function closeFolder(folder) {
    const trigger = folder.querySelector('.folder__trigger');
    const panel = folder.querySelector('.folder__panel');
    if (!trigger || !panel) return;

    folder.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
}

function openFolder(folder) {
    const trigger = folder.querySelector('.folder__trigger');
    const panel = folder.querySelector('.folder__panel');
    if (!trigger || !panel) return;

    folder.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
}

async function initFolders() {
    const accordionContainer = document.querySelector('.accordion');
    if (!accordionContainer) return;

    try {
        // Fetch config
        const response = await fetch('/data/links.json');
        if (!response.ok) throw new Error('Failed to load links config');
        const configFolders = await response.json();

        // Render HTML
        accordionContainer.innerHTML = configFolders.map(folder => `
            <section class="folder card" data-folder>
                <h2 class="folder__heading">
                    <button class="folder__trigger" type="button" aria-expanded="${folder.defaultOpen ? 'true' : 'false'}" aria-controls="panel-${folder.id}" id="trigger-${folder.id}">
                        <span class="folder__label">
                            <span class="folder__icon"><i class="${folder.icon}"></i></span>
                            <span class="folder__title">${folder.title}</span>
                        </span>
                        <span class="folder__chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
                    </button>
                </h2>
                <div class="folder__panel" id="panel-${folder.id}" role="region" aria-labelledby="trigger-${folder.id}" ${folder.defaultOpen ? '' : 'hidden'}>
                    <div class="folder__items">
                        ${folder.items.map(item => `
                            <a class="folder-link" href="${item.href}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>
                                <span class="folder-link__main">
                                    <span class="folder-link__icon"><i class="${item.icon}" aria-hidden="true"></i></span>
                                    <span>${item.label}</span>
                                </span>
                                <i class="${item.external ? 'fas fa-arrow-up-right-from-square' : 'fas fa-arrow-right'}" aria-hidden="true"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </section>
        `).join('');

        // Bind interactive events
        const folders = [...document.querySelectorAll('[data-folder]')];
        folders.forEach((folder) => {
            const trigger = folder.querySelector('.folder__trigger');
            if (!trigger) return;

            // Initialize states
            if (folder.querySelector('.folder__trigger').getAttribute('aria-expanded') === 'true') {
                folder.classList.add('is-open');
            } else {
                closeFolder(folder);
            }

            trigger.addEventListener('click', () => {
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

                // Close all others
                folders.forEach((item) => closeFolder(item));

                if (!isExpanded) {
                    openFolder(folder);
                }
            });
        });

    } catch (error) {
        console.error('Error rendering folders:', error);
    }
}

initFolders();

updateLocalTime();
window.setInterval(updateLocalTime, 1000);

// Typing Animation for "dictuzz"
const bioTitle = document.querySelector('.bio-title');
if (bioTitle && bioTitle.textContent.trim() === 'dictuzz') {
    bioTitle.textContent = '';
    const textToType = 'dictuzz';
    let charIndex = 0;

    function typeChar() {
        if (charIndex < textToType.length) {
            bioTitle.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 120); // typing speed
        }
    }

    // slight delay before starting
    setTimeout(typeChar, 300);
}

// Problem Solver Demo
function initProblemSolver() {
    const select = document.getElementById('problem-select');
    const container = document.getElementById('solution-container');
    if (!select || !container) return;

    const solutions = {
        reporting: `
            <div class="solution-framework">
                <div class="solution-step">
                    <h4>1. Audit & Standardize</h4>
                    <p>Map out all existing data sources and unify metrics into a single dictionary so everyone speaks the same language.</p>
                </div>
                <div class="solution-step">
                    <h4>2. Automate the Pipeline</h4>
                    <p>Build zero-touch data pipelines using query automation to eliminate manual copy-pasting and human error.</p>
                </div>
                <div class="solution-step">
                    <h4>3. Design the Command Center</h4>
                    <p>Create a centralized, role-based dashboard where stakeholders can make decisions instantly.</p>
                </div>
                <div class="solution-impact">
                    <i class="fas fa-bolt"></i> Impact: Turns 12 hours of weekly grunt work into a 5-minute automated refresh.
                </div>
            </div>
        `,
        events: `
            <div class="solution-framework">
                <div class="solution-step">
                    <h4>1. Centralize the Source of Truth</h4>
                    <p>Move all planning from scattered chats into a single master document with clear owners, deadlines, and dependencies.</p>
                </div>
                <div class="solution-step">
                    <h4>2. Implement Triage Protocols</h4>
                    <p>Establish clear escalation paths so 90% of issues are resolved by area leads without reaching the director.</p>
                </div>
                <div class="solution-step">
                    <h4>3. Conduct Dry-Runs</h4>
                    <p>Simulate worst-case scenarios with the core team to build muscle memory before the actual event.</p>
                </div>
                <div class="solution-impact">
                    <i class="fas fa-bolt"></i> Impact: Coordinated 34+ members for a 1000-guest event with zero missed deadlines.
                </div>
            </div>
        `,
        onboarding: `
            <div class="solution-framework">
                <div class="solution-step">
                    <h4>1. Process Documentation (SOPs)</h4>
                    <p>Translate tribal knowledge into step-by-step Standard Operating Procedures that anyone can follow.</p>
                </div>
                <div class="solution-step">
                    <h4>2. Build a Knowledge Base</h4>
                    <p>Organize SOPs, access guides, and FAQs into a searchable repository.</p>
                </div>
                <div class="solution-step">
                    <h4>3. Implement Feedback Loops</h4>
                    <p>Require new hires to flag confusing steps in the SOPs, turning onboarding into a self-improving system.</p>
                </div>
                <div class="solution-impact">
                    <i class="fas fa-bolt"></i> Impact: Reduces ramp-up time by 40% and frees up senior team members.
                </div>
            </div>
        `
    };

    select.addEventListener('change', (e) => {
        const val = e.target.value;
        if (solutions[val]) {
            // Reset animation constraint for replay
            container.style.animation = 'none';
            void container.offsetHeight; // trigger reflow
            container.style.animation = null;
            
            container.innerHTML = solutions[val];
            container.hidden = false;
        } else {
            container.hidden = true;
        }
    });
}

initProblemSolver();
