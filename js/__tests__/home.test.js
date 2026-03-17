import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

describe('Home Theme Manager Initialization', () => {
    let dom;
    let originalGlobal;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="theme-color" content="#ffffff">
            </head>
            <body>
                <button id="theme-toggle"></button>
                <i id="theme-icon"></i>
                <div class="accordion"></div>
                <h1 class="bio-title">dictuzz</h1>
                <span id="local-date"></span>
                <span id="local-time"></span>
            </body>
            </html>
        `, { url: 'http://localhost' });

        originalGlobal = { ...global };

        global.window = dom.window;
        global.document = dom.window.document;
        global.localStorage = {
            getItem: mock.fn(),
            setItem: mock.fn()
        };
        global.fetch = mock.fn(async () => ({
            ok: true,
            json: async () => ([])
        }));

        global.setInterval = mock.fn();
        global.setTimeout = mock.fn();

        global.Intl = dom.window.Intl;
        Object.defineProperty(global, 'navigator', {
            value: dom.window.navigator,
            configurable: true
        });
        global.CustomEvent = dom.window.CustomEvent;
        // mock matchMedia
        global.window.matchMedia = mock.fn(() => ({ matches: false }));
    });

    afterEach(() => {
        mock.restoreAll();
        // Restore globals
        global.window = originalGlobal.window;
        global.document = originalGlobal.document;
        global.localStorage = originalGlobal.localStorage;
        global.fetch = originalGlobal.fetch;
        global.Intl = originalGlobal.Intl;
        Object.defineProperty(global, 'navigator', {
            value: originalGlobal.navigator,
            configurable: true
        });
        global.CustomEvent = originalGlobal.CustomEvent;
        global.setInterval = originalGlobal.setInterval;
        global.setTimeout = originalGlobal.setTimeout;
    });

    it('should update theme color based on theme-changed event', async () => {
        // dynamic import with cache-busting
        await import('../home.js?t=' + Date.now());

        const themeMeta = global.document.querySelector('meta[name="theme-color"]');
        assert.strictEqual(themeMeta.getAttribute('content'), '#f5efe4'); // Default is light

        // trigger theme-changed event
        global.window.dispatchEvent(new global.CustomEvent('theme-changed', {
            detail: { theme: 'dark' }
        }));

        assert.strictEqual(themeMeta.getAttribute('content'), '#121820');

        global.window.dispatchEvent(new global.CustomEvent('theme-changed', {
            detail: { theme: 'light' }
        }));

        assert.strictEqual(themeMeta.getAttribute('content'), '#f5efe4');
    });
});
