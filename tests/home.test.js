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

  const originalWindowSetInterval = window.setInterval;
  const originalGlobalSetInterval = global.setInterval;

  window.setInterval = () => {};
  global.setInterval = () => {};

  const restoreTimers = () => {
    window.setInterval = originalWindowSetInterval;
    global.setInterval = originalGlobalSetInterval;
  };

  return { document, window, restoreTimers };
}

function setupConsoleMock() {
  const originalConsoleError = console.error;
  let calledWith = [];
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('MODULE_TYPELESS_PACKAGE_JSON')) return;
    calledWith.push(args);
  };
  return { 
    calledWith, 
    restoreConsole: () => { console.error = originalConsoleError; } 
  };
}

test('initFolders error path - fetch non-OK', async (t) => {
  const { restoreTimers } = setupEnvironment();
  t.after(restoreTimers);

  const { calledWith, restoreConsole } = setupConsoleMock();

  global.fetch = mock.fn(async () => {
    return { ok: false };
  });

  await import('../js/home.js?cachebust=' + Date.now());

  await new Promise(r => setImmediate(r));

  const accordion = document.querySelector('.accordion');
  assert.strictEqual(calledWith.length, 0);
  assert.match(accordion.textContent, /Directory unavailable/i);
  assert.match(accordion.textContent, /Resume/i);
  assert.match(accordion.textContent, /Email/i);

  restoreConsole();
});

test('initFolders error path - fetch throws', async () => {
  const { document } = setupEnvironment();

  const { calledWith, restoreConsole } = setupConsoleMock();

  global.fetch = mock.fn(async () => {
    throw new Error('Network error');
  });

  await import('../js/home.js?cachebust=' + Date.now());

  await new Promise(r => setImmediate(r));

  const accordion = document.querySelector('.accordion');
  assert.strictEqual(calledWith.length, 0);
  assert.match(accordion.textContent, /Directory unavailable/i);
  assert.match(accordion.textContent, /Resume/i);
  assert.match(accordion.textContent, /Email/i);

  restoreConsole();
});

test('initFolders error path - malformed JSON', async () => {
  const { document } = setupEnvironment();

  const { calledWith, restoreConsole } = setupConsoleMock();

  global.fetch = mock.fn(async () => {
    return {
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); }
    };
  });

  await import('../js/home.js?cachebust=' + Date.now());

  await new Promise(r => setImmediate(r));

  const accordion = document.querySelector('.accordion');
  assert.strictEqual(calledWith.length, 0);
  assert.match(accordion.textContent, /Directory unavailable/i);
  assert.match(accordion.textContent, /Resume/i);
  assert.match(accordion.textContent, /Email/i);

  restoreConsole();
});
