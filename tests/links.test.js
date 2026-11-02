import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file.startsWith('.')) continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (filePath.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

test('all internal links in HTML files resolve to existing files and valid anchors', () => {
  const htmlFiles = getAllHtmlFiles('.');
  const brokenLinks = [];
  const hrefRegex = /href=["']([^"'#\s][^"']*)["']/g;

  // Cache parsed IDs per file
  const fileIdMap = new Map();

  function getIds(filePath) {
    const normalized = path.normalize(filePath);
    if (fileIdMap.has(normalized)) return fileIdMap.get(normalized);
    if (!fs.existsSync(normalized)) return null;

    const content = fs.readFileSync(normalized, 'utf8');
    const ids = new Set();
    const idRegex = /(?:id|name)=["']([^"']+)["']/g;
    let m;
    while ((m = idRegex.exec(content)) !== null) {
      ids.add(m[1]);
    }
    fileIdMap.set(normalized, ids);
    return ids;
  }

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    let match;

    while ((match = hrefRegex.exec(content)) !== null) {
      const href = match[1];

      // Ignore external, protocol, mailto, tel, javascript
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('irc:') ||
        href.startsWith('javascript:') ||
        href.startsWith('data:')
      ) {
        continue;
      }

      const [urlPath, hash] = href.split('#');
      let targetFile = '';

      if (!urlPath || urlPath === '') {
        targetFile = file;
      } else if (urlPath.startsWith('/')) {
        // Absolute path from repo root
        const cleanPath = urlPath.replace(/^\//, '').split('?')[0];
        if (cleanPath === '' || cleanPath.endsWith('/')) {
          targetFile = path.join(cleanPath, 'index.html');
        } else if (cleanPath.endsWith('.html')) {
          targetFile = cleanPath;
        } else {
          // Could be a directory without trailing slash
          if (fs.existsSync(path.join(cleanPath, 'index.html'))) {
            targetFile = path.join(cleanPath, 'index.html');
          } else {
            targetFile = cleanPath;
          }
        }
      } else {
        // Relative path
        const cleanPath = urlPath.split('?')[0];
        const dir = path.dirname(file);
        if (cleanPath.endsWith('/')) {
          targetFile = path.join(dir, cleanPath, 'index.html');
        } else {
          targetFile = path.join(dir, cleanPath);
        }
      }

      if (!fs.existsSync(targetFile)) {
        brokenLinks.push(`${file} -> ${href} (target "${targetFile}" does not exist)`);
        continue;
      }

      if (hash) {
        const ids = getIds(targetFile);
        if (ids && !ids.has(hash)) {
          // Warning or failure depending on anchor match
          // Allow some dynamically loaded tabs if applicable
          if (!hash.startsWith('tab-') && !hash.startsWith('step-')) {
            brokenLinks.push(`${file} -> ${href} (anchor #${hash} not found in "${targetFile}")`);
          }
        }
      }
    }
  }

  assert.deepStrictEqual(brokenLinks, [], `Found ${brokenLinks.length} broken internal links:\n${brokenLinks.slice(0, 10).join('\n')}`);
});
