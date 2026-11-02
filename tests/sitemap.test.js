import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

test('sitemap contains all 34 site pages with valid URLs and lastmod tags', () => {
  const sitemapPath = 'sitemap.xml';
  assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml must exist');

  const content = fs.readFileSync(sitemapPath, 'utf8');

  // Parse all <loc> entries
  const locMatches = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.strictEqual(locMatches.length, 34, `Expected 34 URLs in sitemap.xml, found ${locMatches.length}`);

  // Parse all <lastmod> entries
  const lastmodMatches = [...content.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
  assert.strictEqual(lastmodMatches.length, 34, `Expected 34 <lastmod> entries in sitemap.xml, found ${lastmodMatches.length}`);

  // Date format check YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  for (const date of lastmodMatches) {
    assert.match(date, dateRegex, `Invalid date format in sitemap: ${date}`);
  }

  // Check required core URLs
  const required = [
    'https://dictuzz.me/',
    'https://dictuzz.me/resume/',
    'https://dictuzz.me/portfolio/',
    'https://dictuzz.me/resources/',
    'https://dictuzz.me/resources/search.html',
    'https://dictuzz.me/portfolio/cases/automation-mandate/',
    'https://dictuzz.me/portfolio/cases/kpi-governance-record/',
    'https://dictuzz.me/portfolio/cases/large-scale-event-ops/',
    'https://dictuzz.me/portfolio/cases/vertical-rescue-ops/'
  ];

  for (const req of required) {
    assert.ok(locMatches.includes(req), `Missing required URL in sitemap: ${req}`);
  }
});

