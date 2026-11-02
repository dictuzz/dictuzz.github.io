import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../resources/', import.meta.url));
const OUT = fileURLToPath(new URL('../content/resources/search-index.json', import.meta.url));

const EXCLUDE = new Set(['index.html', 'search.html', 'beginners-guide.html']);

const files = readdirSync(DIR).filter(f => f.endsWith('.html') && !EXCLUDE.has(f)).sort();

const entries = [];

for (const file of files) {
  const html = readFileSync(join(DIR, file), 'utf8');
  const content = extractVpDoc(html);
  if (!content) continue;

  const slug = file.replace('.html', '');
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const category = h1Match ? stripTags(h1Match[1]).trim() : slug;

  let currentSection = '';
  let currentSubsection = '';

  const re = /<(h2|h3)[^>]*>([\s\S]*?)<\/\1>|<li(?:\s+class="([^"]*)")?>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    if (m[1] === 'h2') {
      currentSection = stripTags(m[2]).replace(/<!---->/g, '').trim();
      currentSubsection = '';
    } else if (m[1] === 'h3') {
      currentSubsection = stripTags(m[2]).trim();
    } else if (m[4] !== undefined) {
      const item = parseLi(m[4], m[3] || '', category, slug, currentSection, currentSubsection);
      if (item) entries.push(item);
    }
  }
}

writeFileSync(OUT, JSON.stringify(entries));
console.log(`Wrote ${entries.length} entries to ${OUT}`);

function extractVpDoc(html) {
  const marker = 'class="resources-content vp-doc">';
  const start = html.indexOf(marker);
  if (start < 0) return null;
  const bodyStart = start + marker.length;
  const mainEnd = html.indexOf('</main>', bodyStart);
  if (mainEnd < 0) return null;
  const lastDiv = html.lastIndexOf('</div>', mainEnd);
  if (lastDiv < bodyStart) return null;
  return html.slice(bodyStart, lastDiv);
}

function parseLi(html, liClass, category, slug, section, subsection) {
  const starred = liClass.includes('starred');
  const strongMatch = html.match(/<strong>([\s\S]*?)<\/strong>/);

  let title, url;

  if (strongMatch) {
    const strongInner = strongMatch[1];
    const aInside = strongInner.match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    if (aInside) {
      title = stripTags(aInside[2]).trim();
      url = aInside[1];
    } else {
      title = stripTags(strongInner).trim();
      if (!title) return null;
      const firstA = html.match(/<a[^>]*href="([^"]*)"[^>]*>/i);
      url = firstA ? firstA[1] : '';
    }
  } else {
    const firstA = html.match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!firstA) return null;
    url = firstA[1];
    title = stripTags(firstA[2]).trim();
  }

  if (!title || title.length > 200) return null;

  const afterPrimary = html.split('</a>').slice(1).join('</a>');
  const desc = stripTags(afterPrimary)
    .replace(/[\s/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 250);

  if (url && url.startsWith('/') && !url.startsWith('/resources/')) {
    const match = url.match(/^\/([^/#]+)(?:(\/)?|(#.*)?)$/);
    if (match) {
      const topic = match[1];
      const frag = match[3] || '';
      url = `/resources/${topic}.html${frag}`;
    }
  }

  return {
    t: title,
    u: url,
    d: desc || '',
    c: category,
    s: slug,
    se: section || '',
    su: subsection || '',
    r: starred ? 1 : 0
  };
}

function decodeEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function stripTags(str) {
  if (!str) return '';
  return decodeEntities(str.replace(/<[^>]*>/g, ''));
}
