import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('search index has valid targets, correct keys, and no raw HTML entities', () => {
  const indexPath = 'content/resources/search-index.json';
  assert.ok(fs.existsSync(indexPath), 'search-index.json must exist');

  const raw = fs.readFileSync(indexPath, 'utf8');
  const index = JSON.parse(raw);

  assert.ok(Array.isArray(index), 'search-index must be an array');
  assert.ok(index.length > 300, `search-index has only ${index.length} entries`);

  const entityPattern = /&(?:amp|#39|quot|lt|gt);/i;
  let entityCount = 0;
  const invalidUrls = [];

  for (const item of index) {
    // Assert required keys
    assert.ok(item.t, 'item title required');
    assert.ok(item.u, `item url required for "${item.t}"`);

    // Check entity leaks in title and description
    if (entityPattern.test(item.t) || entityPattern.test(item.d || '')) {
      entityCount++;
    }

    // Check that internal URLs point to valid HTML files
    if (item.u.startsWith('/resources/')) {
      const cleanPath = item.u.split('#')[0].replace(/^\//, '');
      if (!fs.existsSync(cleanPath)) {
        invalidUrls.push(`${item.t}: ${item.u} -> ${cleanPath} does not exist`);
      }
    }
  }

  assert.strictEqual(entityCount, 0, `Found ${entityCount} entries with raw unescaped HTML entities in search-index.json`);
  assert.deepStrictEqual(invalidUrls, [], `Found ${invalidUrls.length} invalid internal URLs in search-index.json`);
});

