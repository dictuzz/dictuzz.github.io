import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

test('portfolio landing and case pages contain valid static prerendered content and Schema.org metadata', () => {
  const caseStudies = [
    'automation-mandate',
    'kpi-governance-record',
    'large-scale-event-ops',
    'vertical-rescue-ops'
  ];

  // 1. Portfolio landing
  const landingPath = 'portfolio/index.html';
  assert.ok(fs.existsSync(landingPath), `${landingPath} must exist`);
  const landingHtml = fs.readFileSync(landingPath, 'utf8');
  assert.match(landingHtml, /<h1[^>]*>[\s\S]+<\/h1>/, 'Landing page must have non-empty <h1>');
  assert.match(landingHtml, /application\/ld\+json/, 'Landing page must include JSON-LD');
  assert.match(landingHtml, /CollectionPage/, 'Landing page JSON-LD must specify CollectionPage');

  // 2. Case study pages
  for (const slug of caseStudies) {
    const casePath = `portfolio/cases/${slug}/index.html`;
    assert.ok(fs.existsSync(casePath), `${casePath} must exist`);
    const caseHtml = fs.readFileSync(casePath, 'utf8');

    // Must have non-empty H1
    const h1Match = caseHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
    assert.ok(h1Match && h1Match[1].trim().length > 0, `Case ${slug} must have a non-empty <h1>`);

    // Must have prerendered article narrative text
    assert.match(caseHtml, /<article[^>]*>[\s\S]*?<section[\s\S]*?<\/article>/, `Case ${slug} must have prerendered article structure`);

    // Must have valid Article JSON-LD
    assert.match(caseHtml, /"@type":\s*"Article"/, `Case ${slug} must have Article JSON-LD`);
    assert.match(caseHtml, /"headline":/, `Case ${slug} JSON-LD must contain headline`);
  }
});

