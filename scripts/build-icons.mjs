import fs from 'fs';
import path from 'path';
import ph from '@iconify-json/ph/icons.json' with { type: 'json' };
import twemoji from '@iconify-json/twemoji/icons.json' with { type: 'json' };
import carbon from '@iconify-json/carbon/icons.json' with { type: 'json' };
import fluent from '@iconify-json/fluent/icons.json' with { type: 'json' };
import gravity from '@iconify-json/gravity-ui/icons.json' with { type: 'json' };

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file.startsWith('.')) continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (filePath.endsWith('.html') || filePath.endsWith('.json')) {
      results.push(filePath);
    }
  }
  return results;
}

const targetFiles = getAllHtmlFiles('.');
const iconClasses = new Set();
// Match directly any token that looks like an icon class
const classRegex = /(i-(?:ph|twemoji|carbon|fluent|gravity-ui)-[a-z0-9-]+)/g;

for (const file of targetFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = classRegex.exec(content)) !== null) {
    iconClasses.add(match[1]);
  }
}

const collections = {
  'ph': ph,
  'twemoji': twemoji,
  'carbon': carbon,
  'fluent': fluent,
  'gravity-ui': gravity
};

let jsOutput = `// Auto-generated icon data\nexport const ICON_MAP = {\n`;

for (const c of iconClasses) {
  const parts = c.split('-');
  let prefix = '';
  let name = '';
  
  if (c.startsWith('i-ph-')) { prefix = 'ph'; name = c.substring(5); }
  else if (c.startsWith('i-twemoji-')) { prefix = 'twemoji'; name = c.substring(10); }
  else if (c.startsWith('i-carbon-')) { prefix = 'carbon'; name = c.substring(9); }
  else if (c.startsWith('i-fluent-')) { prefix = 'fluent'; name = c.substring(9); }
  else if (c.startsWith('i-gravity-ui-')) { prefix = 'gravity-ui'; name = c.substring(13); }
  else { prefix = parts[1]; name = parts.slice(2).join('-'); }

  const collection = collections[prefix];
  if (collection && collection.icons[name]) {
    const iconData = collection.icons[name];
    const width = iconData.width || collection.width || 24;
    const height = iconData.height || collection.height || 24;
    
    // Convert currentcolor to currentColor for case-sensitive matches if any
    let body = iconData.body.replace(/currentColor/gi, 'currentColor');
    
    const svgStr = `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false" width="1em" height="1em">${body}</svg>`;
    
    jsOutput += `  '${c}': \`${svgStr}\`,\n`;
  } else {
    console.warn('Icon not found:', c);
  }
}

jsOutput += `};\n`;
fs.writeFileSync('js/icon-data.js', jsOutput);
console.log('js/icon-data.js generated successfully.');
