import { test, mock } from 'node:test';
import assert from 'node:assert';
import { Window } from 'happy-dom';

function setupEnvironment() {
  const window = new Window();
  const document = window.document;
  global.document = document;
  global.window = window;
  global.CustomEvent = window.CustomEvent;

  document.body.innerHTML = '<div class="accordion"></div>';

  if (!global.navigator) {
      global.navigator = { vibrate: () => {} };
  } else if (!global.navigator.vibrate) {
      global.navigator.vibrate = () => {};
  }

  global.Intl = {
      DateTimeFormat: function() {
          return {
              resolvedOptions: () => ({ timeZone: 'Asia/Bangkok' }),
              format: () => 'formatted date'
          };
      }
  };
  global.localStorage = {
      getItem: () => null,
      setItem: () => {}
  };
  const matchMediaStub = () => ({ matches: false });
  window.matchMedia = matchMediaStub;
  global.matchMedia = matchMediaStub;

  const originalSetInterval = window.setInterval;
  window.setInterval = () => {};
  global.setInterval = () => {};

  return { document, window };
}

test('initFolders error path - fetch non-OK', async () => {
  setupEnvironment();

  const originalConsoleError = console.error;
  let consoleErrorCalledWith = [];
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('MODULE_TYPELESS_PACKAGE_JSON')) return;
    consoleErrorCalledWith.push(args);
  };

  global.fetch = mock.fn(async () => {
    return { ok: false };
  });

  await import('../js/home.js?cachebust=' + Date.now());

  await new Promise(r => setTimeout(r, 10));

  assert.strictEqual(consoleErrorCalledWith.length, 1);
  assert.strictEqual(consoleErrorCalledWith[0][0], 'Error rendering folders:');
  assert.ok(consoleErrorCalledWith[0][1] instanceof Error);
  assert.strictEqual(consoleErrorCalledWith[0][1].message, 'Failed to load links config');

  console.error = originalConsoleError;
});

test('initFolders error path - fetch throws', async () => {
  setupEnvironment();

  const originalConsoleError = console.error;
  let consoleErrorCalledWith = [];
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('MODULE_TYPELESS_PACKAGE_JSON')) return;
    consoleErrorCalledWith.push(args);
  };

  global.fetch = mock.fn(async () => {
    throw new Error('Network error');
  });

  await import('../js/home.js?cachebust=' + Date.now());

  await new Promise(r => setTimeout(r, 10));

  assert.strictEqual(consoleErrorCalledWith.length, 1);
  assert.strictEqual(consoleErrorCalledWith[0][0], 'Error rendering folders:');
  assert.ok(consoleErrorCalledWith[0][1] instanceof Error);
  assert.strictEqual(consoleErrorCalledWith[0][1].message, 'Network error');

  console.error = originalConsoleError;
});

test('initFolders error path - malformed JSON', async () => {
  setupEnvironment();

  const originalConsoleError = console.error;
  let consoleErrorCalledWith = [];
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('MODULE_TYPELESS_PACKAGE_JSON')) return;
    consoleErrorCalledWith.push(args);
  };

  global.fetch = mock.fn(async () => {
    return {
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); }
    };
  });

  await import('../js/home.js?cachebust=' + Date.now());

  await new Promise(r => setTimeout(r, 10));

  assert.strictEqual(consoleErrorCalledWith.length, 1);
  assert.strictEqual(consoleErrorCalledWith[0][0], 'Error rendering folders:');
  assert.ok(consoleErrorCalledWith[0][1] instanceof Error);
  assert.strictEqual(consoleErrorCalledWith[0][1].message, 'Invalid JSON');

  console.error = originalConsoleError;
});
