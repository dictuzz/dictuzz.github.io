import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFoldersMarkup } from '../js/site-renderers.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUTPUT_PATH = path.join(ROOT, 'index.html');
const SOURCE_PATH = path.join(ROOT, 'content', 'home.json');
const START_MARKER = '<!-- HOME_FOLDERS_START -->';
const END_MARKER = '<!-- HOME_FOLDERS_END -->';
const CHECK_ONLY = process.argv.includes('--check');

const html = fs.readFileSync(OUTPUT_PATH, 'utf8');
const start = html.indexOf(START_MARKER);
const end = html.indexOf(END_MARKER, start + START_MARKER.length);

if (start < 0 || end < 0 || html.indexOf(START_MARKER, start + START_MARKER.length) >= 0) {
  throw new Error('Homepage folder markers are missing or duplicated in index.html');
}

const content = JSON.parse(fs.readFileSync(SOURCE_PATH, 'utf8'));
const markup = renderFoldersMarkup(content.folders)
  .trim()
  .split('\n')
  .map((line) => line.trim() ? `                ${line}` : '')
  .join('\n');
const output = `${html.slice(0, start + START_MARKER.length)}\n${markup}\n                ${html.slice(end)}`;

if (CHECK_ONLY) {
  if (html !== output) {
    console.error('Homepage folders are out of date; run: npm run build:home');
    process.exitCode = 1;
  } else {
    console.log('Homepage folders are up to date.');
  }
} else {
  fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log('Prerendered homepage folders from content/home.json');
}
