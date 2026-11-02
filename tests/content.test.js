import test from 'node:test';
import assert from 'node:assert';
import siteConfig from '../content/site.json' with { type: 'json' };
import homeContent from '../content/home.json' with { type: 'json' };
import resumeEn from '../content/resume/en.json' with { type: 'json' };
import portfolioEn from '../content/portfolio/locales/en.json' with { type: 'json' };
import portfolioId from '../content/portfolio/locales/id.json' with { type: 'json' };
import portfolioDe from '../content/portfolio/locales/de.json' with { type: 'json' };
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

test('portfolio locales contain all required case studies and narrative structures', () => {
  const expectedCases = ['automation-mandate', 'kpi-governance-record', 'large-scale-event-ops', 'vertical-rescue-ops'];
  const locales = [portfolioEn, portfolioId, portfolioDe];

  for (const loc of locales) {
    assert.ok(loc.ui, 'ui config must exist');
    assert.ok(loc.landing, 'landing config must exist');
    assert.ok(loc.cases, 'cases config must exist');

    for (const slug of expectedCases) {
      const c = loc.cases[slug];
      assert.ok(c, `case ${slug} must exist in ${loc._locale}`);
      assert.ok(c.title && c.title.length > 0, `case ${slug} title must be non-empty`);
      assert.ok(Array.isArray(c.narrative) && c.narrative.length > 0, `case ${slug} narrative must be non-empty`);
      assert.ok(Array.isArray(c.impact) && c.impact.length > 0, `case ${slug} impact must be non-empty`);
      assert.ok(Array.isArray(c.scope) && c.scope.length > 0, `case ${slug} scope must be non-empty`);
      assert.ok(Array.isArray(c.tools) && c.tools.length > 0, `case ${slug} tools must be non-empty`);
    }
  }
});
