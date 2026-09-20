import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const resourcesDir = fileURLToPath(new URL('../resources/', import.meta.url));

const EXCLUDE = new Set(['index.html', 'search.html', 'resources.js', 'search.js', 'resources.css', 'search.css', 'fmhy-icons.css', 'favicon.ico']);

async function updateFile(file) {
    if (EXCLUDE.has(file) || !file.endsWith('.html')) return;
    const slug = file.replace('.html', '');
    const url = `https://fmhy.net/${slug}`;
    console.log(`Fetching ${url}...`);
    
    let res;
    try {
        res = await fetch(url);
    } catch(e) {
        console.error(`Failed to fetch ${url}`, e);
        return;
    }
    
    if (!res.ok) {
        console.error(`Status ${res.status} for ${url}`);
        return;
    }
    
    const text = await res.text();
    
    // 1. Find vp-doc
    const vpDocMatch = text.match(/<div[^>]*class="vp-doc[^>]*>/);
    if (!vpDocMatch) {
        console.log(`vp-doc not found in ${slug}`);
        return;
    }
    
    let contentStart = vpDocMatch.index + vpDocMatch[0].length;
    
    // Find the end of vp-doc. It closes right before </main>
    const mainEndIdx = text.indexOf('</main>');
    if (mainEndIdx === -1) {
        console.log(`</main> not found in ${slug}`);
        return;
    }
    
    // There should be a </div> closing the vp-doc right before mainEndIdx.
    // In VitePress there are usually </div></div></main>. We need to find the matching closing div of vp-doc.
    // The easiest way is to just find the last </div> before </main> that matches the outer div, but since we skipped the outer div start, we just take everything up to the first </div></div></main> or whatever.
    // Let's just slice until the last </div> before </main>
    let contentEnd = text.lastIndexOf('</div>', mainEndIdx);
    
    // Wait, since we skipped the vp-doc opening tag, we need to skip one closing </div> tag too!
    // So we need the content BEFORE the last </div>.
    contentEnd = text.lastIndexOf('</div>', contentEnd - 1);
    
    let content = text.slice(contentStart, contentEnd);
    
    // Remove data-v-* attributes
    content = content.replace(/ data-v-[a-z0-9]+=""/g, '');
    content = content.replace(/ data-v-[a-z0-9]+/g, '');
    
    // Remove feedback widgets carefully. There are two types: 
    // <div class="feedback-widget...">...</div> and <button class="feedback-widget...">...</button>
    // Since regex matching over HTML is dangerous, let's just use simple non-greedy match that doesn't span across the whole document.
    // The comments surrounding them are <!--[--> and <!--]--> but sometimes there are teleports in between.
    content = content.replace(/<!--\[-->\s*<div class="feedback-widget[\s\S]*?<!--\]-->/g, '');
    content = content.replace(/<!--\[-->\s*<button class="feedback-widget[\s\S]*?<!--\]-->/g, '');
    
    // Insert dictuzz header link
    // The title is in a div: <div><div class="space-y-2 not-prose">...</div>
    // We want to insert the header link right after this div closes.
    const h1Match = content.match(/<div class="space-y-2 not-prose">[\s\S]*?<\/div>/);
    if (h1Match) {
        // We replace it and add the hr links. 
        // We also need to make sure we don't accidentally close an outer div.
        content = content.replace(h1Match[0], `${h1Match[0]}<hr><hr><p><strong><a href="/resources/" target="_blank" rel="noreferrer">◄◄ Back to Wiki Index</a></strong></p><hr><hr>`);
    }
    
    // Replace local file content
    const localFile = path.join(resourcesDir, file);
    let localContent = fs.readFileSync(localFile, 'utf8');
    
    const localStartMarker = '<div class="resources-content vp-doc">';
    const localStartIdx = localContent.indexOf(localStartMarker);
    const localEndIdx = localContent.indexOf('</main>');
    
    if (localStartIdx !== -1 && localEndIdx !== -1) {
        // The local file has <div class="resources-content vp-doc"> ... </div>
        // So we find the </div> that closes it.
        const localEndDiv = localContent.lastIndexOf('</div>', localEndIdx);
        
        const newLocalContent = localContent.substring(0, localStartIdx + localStartMarker.length) + '\n\n' + content.trim() + '\n        ' + localContent.substring(localEndDiv);

        
        fs.writeFileSync(localFile, newLocalContent);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Failed to find markers in local ${file}`);
    }
}

async function run() {
    const files = fs.readdirSync(resourcesDir);
    for (const f of files) {
        await updateFile(f);
    }
}

run();
