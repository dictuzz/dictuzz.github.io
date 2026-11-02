import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const VERSION = process.env.CACHE_BUST_VERSION || process.argv[2] || `v${pkg.version.split('.')[0]}`;

function isLocalAsset(url) {
  if (!url) return false;
  return !url.startsWith('http://') &&
         !url.startsWith('https://') &&
         !url.startsWith('//') &&
         !url.startsWith('data:');
}

let updatedCount = 0;

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    if (file === 'node_modules' || file === '.git' || file.startsWith('.')) continue;
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.html')) {
      const original = fs.readFileSync(p, 'utf8');
      
      // Cache-bust local CSS links only
      let content = original.replace(/href="([^"]+\.css)(?:\?v=[^"]*)?"/g, (match, href) => {
        if (!isLocalAsset(href)) return match;
        return `href="${href}?v=${VERSION}"`;
      });
      
      // Cache-bust local JS links only
      content = content.replace(/src="([^"]+\.js)(?:\?v=[^"]*)?"/g, (match, src) => {
        if (!isLocalAsset(src)) return match;
        return `src="${src}?v=${VERSION}"`;
      });
      
      if (content !== original) {
        fs.writeFileSync(p, content, 'utf8');
        updatedCount++;
      }
    }
  }
}

walk('.');
console.log(`Cache-bust applied (version: ${VERSION}). Updated ${updatedCount} files.`);
