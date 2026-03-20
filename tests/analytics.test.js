import test, { describe, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { initAnalytics } from '../js/analytics.js';

describe('initAnalytics', () => {
    let originalWindow;
    let originalDocument;
    let originalConfigData;
    let consoleWarnMock;
    let consoleLogMock;

    beforeEach(() => {
        originalWindow = global.window;
        originalDocument = global.document;
        originalConfigData = global.CONFIG_DATA;

        global.window = {};
        global.document = {
            querySelector: mock.fn(() => null),
            createElement: mock.fn(() => ({})),
            head: {
                appendChild: mock.fn()
            }
        };

        consoleWarnMock = mock.method(console, 'warn', () => {});
        consoleLogMock = mock.method(console, 'log', () => {});
    });

    afterEach(() => {
        global.window = originalWindow;
        global.document = originalDocument;
        global.CONFIG_DATA = originalConfigData;
        mock.restoreAll();
    });

    test('should return early silently if config is missing enabled or id', () => {
        initAnalytics({ enabled: true }); // Missing id
        assert.strictEqual(consoleWarnMock.mock.callCount(), 0);

        initAnalytics({ id: 'G-123' }); // Missing enabled
        assert.strictEqual(consoleWarnMock.mock.callCount(), 0);
    });

    test('should use global CONFIG_DATA if config argument is missing', () => {
        global.CONFIG_DATA = { analytics: { enabled: true, id: 'G-GLOBAL' } };
        // We pass undefined, which is technically falsy, so it will fall back to CONFIG_DATA.
        initAnalytics(undefined);

        assert.ok(global.window.dataLayer);
        assert.strictEqual(global.window.dataLayer[1][1], 'G-GLOBAL');
    });

    test('should return early if script is already injected', () => {
        global.document.querySelector = mock.fn(() => true); // Mock script exists

        initAnalytics({ enabled: true, id: 'G-123' });

        assert.strictEqual(global.document.querySelector.mock.callCount(), 1);
        assert.strictEqual(global.document.querySelector.mock.calls[0].arguments[0], 'script[src*="googletagmanager.com/gtag/js?id=G-123"]');
        assert.strictEqual(global.document.head.appendChild.mock.callCount(), 0); // shouldn't append script
    });

    test('should inject script and initialize dataLayer and gtag', () => {
        const mockScript = {};
        global.document.createElement = mock.fn(() => mockScript);

        initAnalytics({ enabled: true, id: 'G-123' });

        // Check script injection
        assert.strictEqual(global.document.createElement.mock.callCount(), 1);
        assert.strictEqual(global.document.createElement.mock.calls[0].arguments[0], 'script');
        assert.strictEqual(mockScript.async, true);
        assert.strictEqual(mockScript.src, 'https://www.googletagmanager.com/gtag/js?id=G-123');

        assert.strictEqual(global.document.head.appendChild.mock.callCount(), 1);
        assert.strictEqual(global.document.head.appendChild.mock.calls[0].arguments[0], mockScript);

        // Check dataLayer and gtag initialization
        assert.ok(Array.isArray(global.window.dataLayer));
        assert.strictEqual(typeof global.window.gtag, 'function');

        // Check gtag pushes
        assert.strictEqual(global.window.dataLayer.length, 2);

        // First push is date
        assert.strictEqual(global.window.dataLayer[0][0], 'js');
        assert.ok(global.window.dataLayer[0][1] instanceof Date);

        // Second push is config
        assert.strictEqual(global.window.dataLayer[1][0], 'config');
        assert.strictEqual(global.window.dataLayer[1][1], 'G-123');
    });
});
