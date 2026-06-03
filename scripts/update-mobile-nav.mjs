import fs from 'fs';
import path from 'path';
const html = `        <div class="resources-mobile-nav__panel">
            <button class="resources-mobile-nav__close" id="resources-mobile-close" aria-label="Close navigation menu">
                <i class="i-ph-x-duotone" aria-hidden="true"></i>
            </button>
            <div style="padding: 1rem 0; overflow-y: auto;">
                <a href="/resources/beginners-guide.html" class="resources-mobile-nav__link"><i class="i-ph-books-duotone"></i> Beginners Guide</a>
                <h4 style="margin: 1.5rem 1.5rem 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted);">Wiki</h4>
                <a href="/resources/privacy.html" class="resources-mobile-nav__link"><i class="i-ph-identification-badge-duotone"></i> Adblocking / Privacy</a>
                <a href="/resources/ai.html" class="resources-mobile-nav__link"><i class="i-ph-robot-duotone"></i> Artificial Intelligence</a>
                <a href="/resources/video.html" class="resources-mobile-nav__link"><i class="i-ph-television-duotone"></i> Movies / TV / Anime</a>
                <a href="/resources/audio.html" class="resources-mobile-nav__link"><i class="i-ph-music-note-duotone"></i> Music / Podcasts / Radio</a>
                <a href="/resources/gaming.html" class="resources-mobile-nav__link"><i class="i-ph-game-controller-duotone"></i> Gaming / Emulation</a>
                <a href="/resources/reading.html" class="resources-mobile-nav__link"><i class="i-ph-book-open-text-duotone"></i> Books / Comics / Manga</a>
                <a href="/resources/downloading.html" class="resources-mobile-nav__link"><i class="i-ph-floppy-disk-duotone"></i> Downloading</a>
                <a href="/resources/torrenting.html" class="resources-mobile-nav__link"><i class="i-ph-cloud-rain-duotone"></i> Torrenting</a>
                <a href="/resources/educational.html" class="resources-mobile-nav__link"><i class="i-ph-brain-duotone"></i> Educational</a>
                <a href="/resources/mobile.html" class="resources-mobile-nav__link"><i class="i-ph-device-mobile-camera-duotone"></i> Android / iOS</a>
                <a href="/resources/linux-macos.html" class="resources-mobile-nav__link"><i class="i-ph-linux-logo-duotone"></i> Linux / macOS</a>
                <a href="/resources/non-english.html" class="resources-mobile-nav__link"><i class="i-ph-globe-hemisphere-east-duotone"></i> Non-English</a>
                <a href="/resources/misc.html" class="resources-mobile-nav__link"><i class="i-ph-folder-duotone"></i> Misc</a>

                <h4 style="margin: 1.5rem 1.5rem 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted);">Tools</h4>
                <a href="/resources/system-tools.html" class="resources-mobile-nav__link"><i class="i-ph-desktop-duotone"></i> System Tools</a>
                <a href="/resources/file-tools.html" class="resources-mobile-nav__link"><i class="i-ph-folder-open-duotone"></i> File Tools</a>
                <a href="/resources/internet-tools.html" class="resources-mobile-nav__link"><i class="i-ph-globe-hemisphere-west-duotone"></i> Internet Tools</a>
                <a href="/resources/social-media-tools.html" class="resources-mobile-nav__link"><i class="i-ph-chat-circle-dots-duotone"></i> Social Media Tools</a>
                <a href="/resources/text-tools.html" class="resources-mobile-nav__link"><i class="i-ph-pencil-simple-duotone"></i> Text Tools</a>
                <a href="/resources/image-tools.html" class="resources-mobile-nav__link"><i class="i-ph-camera-duotone"></i> Image Tools</a>
                <a href="/resources/video-tools.html" class="resources-mobile-nav__link"><i class="i-ph-film-strip-duotone"></i> Video Tools</a>
                <a href="/resources/audio-tools.html" class="resources-mobile-nav__link"><i class="i-ph-music-note-duotone"></i> Audio Tools</a>
                <a href="/resources/gaming-tools.html" class="resources-mobile-nav__link"><i class="i-ph-game-controller-duotone"></i> Gaming Tools</a>
                <a href="/resources/developer-tools.html" class="resources-mobile-nav__link"><i class="i-ph-code-duotone"></i> Developer Tools</a>
            </div>
        </div>`;

const dir = 'r:\\Github Project\\dictuzz.github.io\\resources';
for (let file of fs.readdirSync(dir)) {
    if (!file.endsWith('.html')) continue;
    let p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    let replaced = content.replace(/<div class="resources-mobile-nav__panel">[\s\S]*?<\/div>\s*<\/div>/, html + '\n    </div>');
    if (content !== replaced) {
        fs.writeFileSync(p, replaced);
        console.log('Updated', file);
    }
}
