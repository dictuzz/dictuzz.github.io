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
    
        const vpDocMatch = text.match(/<div[^>]*class="vp-doc[^>]*>/);
    if (!vpDocMatch) {
        console.log(`vp-doc not found in ${slug}`);
        return;
    }
    
    let contentStart = vpDocMatch.index + vpDocMatch[0].length;
    
        const mainEndIdx = text.indexOf('</main>');
    if (mainEndIdx === -1) {
        console.log(`</main> not found in ${slug}`);
        return;
    }
    
    // In VitePress markup, the inner document container terminates before the wrapper divs enclosing </main>.
    // Locate the inner closing </div> immediately preceding </main>.
    let contentEnd = text.lastIndexOf('</div>', mainEndIdx);
    if (contentEnd !== -1) {
        contentEnd = text.lastIndexOf('</div>', contentEnd - 1);
    }
    if (contentEnd === -1 || contentEnd <= contentStart) {
        console.warn(`Could not locate valid content boundary in ${slug}`);
        return;
    }
    
    let content = text.slice(contentStart, contentEnd);
    
        content = content.replace(/ data-v-[a-z0-9]+=""/g, '');
    content = content.replace(/ data-v-[a-z0-9]+/g, '');
    
        content = content.replace(/<!--\[-->\s*<div class="feedback-widget[\s\S]*?<!--\]-->/g, '');
    content = content.replace(/<!--\[-->\s*<button class="feedback-widget[\s\S]*?<!--\]-->/g, '');

    // Strip Cloudflare email protection links
    content = content.replace(/<a[^>]*href=["'][^"']*cdn-cgi\/l\/email-protection[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, '$1');

    // Replace v-popper tooltips with native, accessible note span (no broken /note.svg or dead popper divs)
    content = content.replace(/<div class="v-popper[^"]*">[\s\S]*?aria-label="([^"]+)"[\s\S]*?<!--\]-->\s*<\/div>/g, (match, label) => {
        return `<span class="resource-note" title="${label}" aria-label="${label}">ℹ️</span>`;
    });
    content = content.replace(/<div class="v-popper[^"]*">[\s\S]*?<!--\]-->\s*<\/div>/g, '');

    // Rewrite internal FMHY links (/topic/#anchor or /topic/) to /resources/topic.html#anchor
    const topicSlugs = 'ai|audio|beginners-guide|developer-tools|downloading|educational|file-tools|gaming|gaming-tools|image-tools|internet-tools|linux-macos|misc|mobile|non-english|privacy|reading|social-media-tools|storage|system-tools|text-tools|torrenting|video|video-tools';
    content = content.replace(new RegExp(`href="/(${topicSlugs})/?(?:#([^"]*))?"`, 'g'), (match, topic, hash) => {
        return `href="/resources/${topic}.html${hash ? '#' + hash : ''}"`;
    });
    
    const h1Match = content.match(/<div class="space-y-2 not-prose">[\s\S]*?<\/div>/);
    if (h1Match) {
        content = content.replace(h1Match[0], `${h1Match[0]}<hr><hr><p><strong><a href="/resources/" target="_blank" rel="noreferrer">◄◄ Back to Wiki Index</a></strong></p><hr><hr>`);
    }
    
        const localFile = path.join(resourcesDir, file);
    let localContent = fs.readFileSync(localFile, 'utf8');
    
    const localStartMarker = '<div class="resources-content vp-doc">';
    const localStartIdx = localContent.indexOf(localStartMarker);
    const localEndIdx = localContent.indexOf('</main>');
    
    if (localStartIdx !== -1 && localEndIdx !== -1) {
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
