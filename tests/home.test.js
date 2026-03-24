import { test, mock } from 'node:test';
import assert from 'node:assert';
import { Window } from 'happy-dom';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { clearContentCache } from '../js/site-content.js';

function setupEnvironment() {
  const window = new Window();
  const document = window.document;
  global.document = document;
  global.window = window;
  global.CustomEvent = window.CustomEvent;

  document.head.innerHTML = '<meta name="theme-color" content="#f5efe4">';
  document.body.innerHTML = `
    <button id="theme-toggle"></button>
    <i id="theme-icon"></i>
    <div class="bio-nameplate"></div>
    <div class="bio-title"></div>
    <div class="bio-text"></div>
    <div class="bio-status"><span class="dot"></span><span></span></div>
    <div id="local-date"></div>
    <div id="local-time"></div>
    <div class="accordion"></div>
    <footer class="global-footer"></footer>
    <script id="home-structured-data" type="application/ld+json"></script>
  `;

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

  clearContentCache();
  await import('../js/home.js?cachebust=' + Date.now());

  await new Promise(r => setImmediate(r));

  const accordion = document.querySelector('.accordion');
  assert.strictEqual(calledWith.length, 0);
  assert.match(accordion.textContent, /Directory unavailable/i);
  assert.match(accordion.textContent, /Resume/i);
  assert.match(accordion.textContent, /Email/i);

  restoreConsole();
});

test('initFolders renders centralized content on success', async () => {
  const { document } = setupEnvironment();

  const siteConfig = JSON.parse(await readFile(path.resolve('content/site.json'), 'utf8'));
  const homeContent = JSON.parse(await readFile(path.resolve('content/home.json'), 'utf8'));

  global.fetch = mock.fn(async (url) => {
    if (url.includes('/content/site.json')) {
      return {
        ok: true,
        text: async () => JSON.stringify(siteConfig)
      };
    }

    return {
      ok: true,
      text: async () => JSON.stringify(homeContent)
    };
  });

  clearContentCache();
  await import('../js/home.js?cachebust=' + Date.now());
  await new Promise(r => setImmediate(r));

  assert.match(document.querySelector('.bio-nameplate').textContent, /Benedictus Richard Ricardo/);
  assert.match(document.querySelector('.bio-title').textContent, /dictuzz/);
  assert.match(document.querySelector('.accordion').textContent, /Portfolio/);
  assert.match(document.querySelector('.global-footer').textContent, /contact@dictuzz.me/);
});

test('initFolders error path - fetch throws', async () => {
  const { document } = setupEnvironment();

  const { calledWith, restoreConsole } = setupConsoleMock();

  global.fetch = mock.fn(async () => {
    throw new Error('Network error');
  });

  clearContentCache();
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
        text: async () => '{not valid json'
    };
  });

  clearContentCache();
  await import('../js/home.js?cachebust=' + Date.now());

  await new Promise(r => setImmediate(r));

  const accordion = document.querySelector('.accordion');
  assert.strictEqual(calledWith.length, 0);
  assert.match(accordion.textContent, /Directory unavailable/i);
  assert.match(accordion.textContent, /Resume/i);
  assert.match(accordion.textContent, /Email/i);

  restoreConsole();
});
