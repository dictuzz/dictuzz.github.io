import fs from 'fs';
import path from 'path';
import ph from '@iconify-json/ph/icons.json' with { type: 'json' };
import twemoji from '@iconify-json/twemoji/icons.json' with { type: 'json' };
import carbon from '@iconify-json/carbon/icons.json' with { type: 'json' };
import fluent from '@iconify-json/fluent/icons.json' with { type: 'json' };
import gravity from '@iconify-json/gravity-ui/icons.json' with { type: 'json' };

function getAllScanFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file.startsWith('.')) continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllScanFiles(filePath));
    } else if (filePath.endsWith('.html') || filePath.endsWith('.json') || filePath.endsWith('.js')) {
      results.push(filePath);
    }
  }
  return results;
}

const targetFiles = getAllScanFiles('.');
const iconClasses = new Set();
// Match icon class identifiers: i-ph-*, i-twemoji-*, i-carbon-*, i-fluent-*, i-gravity-ui-*
const classRegex = /\b(i-(?:ph|twemoji|carbon|fluent|gravity-ui)-[a-z0-9-]+)\b/g;

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

const sortedIcons = Array.from(iconClasses).sort();

for (const c of sortedIcons) {
  let prefix = '';
  let name = '';
  
  if (c.startsWith('i-ph-')) { prefix = 'ph'; name = c.substring(5); }
  else if (c.startsWith('i-twemoji-')) { prefix = 'twemoji'; name = c.substring(10); }
  else if (c.startsWith('i-carbon-')) { prefix = 'carbon'; name = c.substring(9); }
  else if (c.startsWith('i-fluent-')) { prefix = 'fluent'; name = c.substring(9); }
  else if (c.startsWith('i-gravity-ui-')) { prefix = 'gravity-ui'; name = c.substring(13); }
  else {
    const parts = c.split('-');
    prefix = parts[1];
    name = parts.slice(2).join('-');
  }

  const collection = collections[prefix];
  if (collection && collection.icons && collection.icons[name]) {
    const iconData = collection.icons[name];
    const width = iconData.width || collection.width || 24;
    const height = iconData.height || collection.height || 24;
    
    // Normalize currentcolor
    const body = iconData.body.replace(/currentcolor/gi, 'currentColor');
    const svgStr = `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false" width="1em" height="1em">${body}</svg>`;
    
    // Safely emit using JSON.stringify to prevent broken syntax from backticks or ${}
    jsOutput += `  ${JSON.stringify(c)}: ${JSON.stringify(svgStr)},\n`;
  } else {
    console.warn('Icon not found in collections:', c);
  }
}

jsOutput += `};\n`;
fs.writeFileSync('js/icon-data.js', jsOutput, 'utf8');
console.log(`js/icon-data.js generated successfully with ${sortedIcons.length} icons.`);
