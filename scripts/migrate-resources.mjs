import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Window } from 'happy-dom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resourcesDir = path.join(__dirname, '../resources');

const SKIP_FILES = ['index.html', '404.html', 'sandbox.html', 'startpage.html'];

function buildTemplate(title, content) {
    return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <meta name="apple-mobile-web-app-title" content="dictuzz Resources">
    <link rel="manifest" href="/site.webmanifest">

    <title>${title} | dictuzz</title>
    <meta name="theme-color" content="#f5efe4">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap">
    </noscript>

    <link rel="stylesheet" href="/css/site.css">
    <link rel="stylesheet" href="/resources/resources.css">
</head>
<body class="resources-page subpage">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- ═══ NAVBAR ═══ -->
    <nav class="resources-navbar" aria-label="Resources navigation">
        <div class="resources-navbar__inner">
            <a href="/" class="resources-navbar__brand">
                <div class="resources-navbar__logo">
                    <img src="/assets/images/favicon.png" alt="" width="36" height="36">
                </div>
                <span class="resources-navbar__title">dictuzz</span>
            </a>

            <div class="resources-navbar__nav">
                <a href="/" class="resources-navbar__link"><i class="fas fa-house" aria-hidden="true"></i> Home</a>
                <a href="/resume/" class="resources-navbar__link">Resume</a>
                <a href="/portfolio/" class="resources-navbar__link">Portfolio</a>
                <a href="/resources/" class="resources-navbar__link">Resources</a>
            </div>

            <div class="resources-navbar__actions">
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                    <i class="fas fa-moon" id="theme-icon"></i>
                </button>
                <button class="resources-hamburger" id="resources-hamburger" aria-label="Open navigation menu">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- ═══ MOBILE NAV ═══ -->
    <div class="resources-mobile-nav" id="resources-mobile-nav" aria-hidden="true">
        <div class="resources-mobile-nav__panel">
            <button class="resources-mobile-nav__close" id="resources-mobile-close" aria-label="Close navigation menu">
                <i class="fas fa-xmark" aria-hidden="true"></i>
            </button>
            <a href="/" class="resources-mobile-nav__link"><i class="fas fa-house" aria-hidden="true"></i> Home</a>
            <a href="/resume/" class="resources-mobile-nav__link"><i class="fas fa-file-lines" aria-hidden="true"></i> Resume</a>
            <a href="/portfolio/" class="resources-mobile-nav__link"><i class="fas fa-table-cells-large" aria-hidden="true"></i> Portfolio</a>
            <a href="/resources/" class="resources-mobile-nav__link"><i class="fas fa-link" aria-hidden="true"></i> Resources</a>
        </div>
    </div>

    <!-- ═══ MAIN CONTENT ═══ -->
    <main class="resources-shell" id="main-content">
        <div class="resources-content vp-doc">
${content}
        </div>
        <footer class="global-footer"></footer>
    </main>

    <script type="module" src="/resources/resources.js"></script>
</body>
</html>`;
}

async function run() {
    const files = fs.readdirSync(resourcesDir);
    for (const file of files) {
        if (!file.endsWith('.html') || SKIP_FILES.includes(file)) continue;

        const filePath = path.join(resourcesDir, file);
        const html = fs.readFileSync(filePath, 'utf8');

        const window = new Window();
        window.document.write(html);

        const titleTag = window.document.querySelector('title');
        const title = titleTag ? titleTag.textContent.replace(' • dictuzz', '') : 'Resources';

        const vpDoc = window.document.querySelector('.vp-doc');
        if (!vpDoc) {
            console.log(`Skipping ${file} - no .vp-doc found`);
            continue;
        }

        // Clean up some vitepress specific tags that we don't want (like empty elements)
        vpDoc.querySelectorAll('.header-anchor').forEach(el => el.remove());
        
        const content = vpDoc.innerHTML;
        const newHtml = buildTemplate(title, content);
        fs.writeFileSync(filePath, newHtml, 'utf8');
        console.log(`Migrated ${file}`);
    }
}

run();
