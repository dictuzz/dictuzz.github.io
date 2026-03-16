import test from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

// Setup DOM
const dom = new JSDOM(`<!DOCTYPE html><html><head><meta name="theme-color" content=""></head><body>
<div id="theme-toggle"></div>
<div id="theme-icon"></div>
<div id="local-date"></div>
<div id="local-time"></div>
</body></html>`);
global.document = dom.window.document;
global.window = dom.window;
global.window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
});
global.CustomEvent = dom.window.CustomEvent;
global.Event = dom.window.Event;
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.Intl = dom.window.Intl;
global.fetch = async () => ({
    ok: true,
    json: async () => ([])
});

// Mock setInterval and setTimeout so tests don't hang
global.window.setInterval = () => {};
global.window.setTimeout = () => {};

test('getLocalTimeZone works normally', async () => {
    await import('../home.js');
    const getLocalTimeZone = global.window.__getLocalTimeZone;
    const result = getLocalTimeZone();
    assert.strictEqual(typeof result, 'string');
});

test('getLocalTimeZone falls back to Asia/Bangkok on error', async () => {
    await import('../home.js');
    const getLocalTimeZone = global.window.__getLocalTimeZone;

    // Backup original Intl
    const originalIntl = global.Intl;

    try {
        // Mock Intl to throw error
        global.Intl = {
            DateTimeFormat: () => {
                throw new Error('Simulated Intl error');
            }
        };
        const result = getLocalTimeZone();
        assert.strictEqual(result, 'Asia/Bangkok');
    } finally {
        // Restore original Intl
        global.Intl = originalIntl;
    }
});
