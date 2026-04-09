import test from 'node:test';
import assert from 'node:assert';
import siteConfig from '../content/site.json' with { type: 'json' };
import homeContent from '../content/home.json' with { type: 'json' };
import resumeEn from '../content/resume/en.json' with { type: 'json' };
import {
  renderFoldersMarkup
} from '../js/site-renderers.js';
import {
  validateHomeContent,
  validateResumeContent,
  validateSharedSiteConfig
} from '../js/site-content.js';

test('validateSharedSiteConfig accepts centralized site config', () => {
  assert.doesNotThrow(() => validateSharedSiteConfig(siteConfig));
});

test('validateHomeContent accepts home folders and renderFoldersMarkup includes titles', () => {
  const validated = validateHomeContent(homeContent);
  const markup = renderFoldersMarkup(validated.folders);

  assert.match(markup, /Links/);
  assert.match(markup, /Portfolio/);
});

test('validateResumeContent accepts the normalized resume locale shape', () => {
  assert.doesNotThrow(() => validateResumeContent(resumeEn));
});
