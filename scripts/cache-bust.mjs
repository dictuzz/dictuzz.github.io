import fs from 'fs';
import path from 'path';

const VERSION = 'v4';

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    if (file === 'node_modules' || file.startsWith('.')) continue;
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) {
      let content = fs.readFileSync(p, 'utf8');
      let changed = false;
      
      // Add cache-bust to CSS links
      const cssPattern = /href="([^"]+\.css)(?:\?v=\w+)?"/g;
      content = content.replace(cssPattern, (match, href) => {
        changed = true;
        return `href="${href}?v=${VERSION}"`;
      });
      
      // Add cache-bust to JS links  
      const jsPattern = /src="([^"]+\.js)(?:\?v=\w+)?"/g;
      content = content.replace(jsPattern, (match, src) => {
        changed = true;
        return `src="${src}?v=${VERSION}"`;
      });
      
      if (changed) {
        fs.writeFileSync(p, content);
        console.log('Updated:', p);
      }
    }
  }
}

walk('.');
console.log('Cache-bust applied with version:', VERSION);
