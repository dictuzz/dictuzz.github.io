import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve('./');
const DIRS_TO_SCAN = ['resources', 'resume', 'portfolio', 'content', 'js'];

const ICON_MAP = {
    // Social
    'fab fa-github': 'i-ph-github-logo-duotone',
    'fa-github': 'i-ph-github-logo-duotone',
    'fab fa-linkedin-in': 'i-ph-linkedin-logo-duotone',
    'fa-linkedin': 'i-ph-linkedin-logo-duotone',
    'fab fa-linkedin': 'i-ph-linkedin-logo-duotone',
    'fab fa-kaggle': 'i-ph-student-duotone',
    'fab fa-instagram': 'i-ph-instagram-logo-duotone',
    'fa-instagram': 'i-ph-instagram-logo-duotone',
    'fab fa-facebook-f': 'i-ph-facebook-logo-duotone',
    'fa-facebook-f': 'i-ph-facebook-logo-duotone',
    'fab fa-steam-symbol': 'i-ph-game-controller-duotone',
    'fa-steam-symbol': 'i-ph-game-controller-duotone',
    'fab fa-discord': 'i-ph-discord-logo-duotone',
    'fa-discord': 'i-ph-discord-logo-duotone',
    'fab fa-whatsapp': 'i-ph-whatsapp-logo-duotone',
    'fa-whatsapp': 'i-ph-whatsapp-logo-duotone',
    
    // UI General
    'fas fa-at': 'i-ph-at-duotone',
    'fa-at': 'i-ph-at-duotone',
    'fas fa-house': 'i-ph-house-duotone',
    'fa-house': 'i-ph-house-duotone',
    'fas fa-folder-open': 'i-ph-folder-open-duotone',
    'fa-folder-open': 'i-ph-folder-open-duotone',
    'fas fa-file-lines': 'i-ph-file-text-duotone',
    'fa-file-lines': 'i-ph-file-text-duotone',
    'fas fa-file-contract': 'i-ph-file-text-duotone',
    'fa-file-contract': 'i-ph-file-text-duotone',
    'fas fa-calendar-check': 'i-ph-calendar-check-duotone',
    'fa-calendar-check': 'i-ph-calendar-check-duotone',
    'fas fa-table-cells-large': 'i-ph-squares-four-duotone',
    'fa-table-cells-large': 'i-ph-squares-four-duotone',
    'fas fa-envelope': 'i-ph-envelope-duotone',
    'fa-envelope': 'i-ph-envelope-duotone',
    'fas fa-bars': 'i-ph-list-duotone',
    'fa-bars': 'i-ph-list-duotone',
    'fas fa-xmark': 'i-ph-x-duotone',
    'fa-xmark': 'i-ph-x-duotone',
    'fas fa-moon': 'i-ph-moon-duotone',
    'fa-moon': 'i-ph-moon-duotone',
    'fas fa-sun': 'i-ph-sun-duotone',
    'fa-sun': 'i-ph-sun-duotone',
    'fas fa-link': 'i-ph-link-duotone',
    'fa-link': 'i-ph-link-duotone',
    'fas fa-arrow-right': 'i-ph-arrow-right-duotone',
    'fa-arrow-right': 'i-ph-arrow-right-duotone',
    'fas fa-arrow-up-right-from-square': 'i-ph-arrow-up-right-duotone',
    'fa-arrow-up-right-from-square': 'i-ph-arrow-up-right-duotone',
    'fas fa-chevron-down': 'i-ph-caret-down-duotone',
    'fa-chevron-down': 'i-ph-caret-down-duotone',
    'fas fa-triangle-exclamation': 'i-ph-warning-duotone',
    'fa-triangle-exclamation': 'i-ph-warning-duotone',
    'fas fa-share-nodes': 'i-ph-share-network-duotone',
    'fa-share-nodes': 'i-ph-share-network-duotone',
    'fas fa-paper-plane': 'i-ph-paper-plane-tilt-duotone',
    'fa-paper-plane': 'i-ph-paper-plane-tilt-duotone',
    'fas fa-video': 'i-ph-video-camera-duotone',
    'fa-video': 'i-ph-video-camera-duotone',

    // Twemoji
    'i-twemoji-laptop': 'i-ph-laptop-duotone',
    'i-twemoji-card-file-box': 'i-ph-folder-duotone',
    'i-twemoji-paperclip': 'i-ph-paperclip-duotone',
    'i-twemoji-left-speech-bubble': 'i-ph-chat-circle-dots-duotone',
    'i-twemoji-memo': 'i-ph-pencil-simple-duotone',
    'i-twemoji-alien-monster': 'i-ph-alien-duotone',
    'i-twemoji-camera': 'i-ph-camera-duotone',
    'i-twemoji-videocassette': 'i-ph-film-strip-duotone',
    'i-twemoji-man-technologist': 'i-ph-code-duotone',
    'i-twemoji-warning': 'i-ph-warning-duotone',
    'i-twemoji-wastebasket': 'i-ph-trash-duotone',
    'i-twemoji-package': 'i-ph-package-duotone',
    'i-twemoji-globe-with-meridians': 'i-ph-globe-hemisphere-west-duotone',
    'i-twemoji-star': 'i-ph-star-duotone',
    'i-twemoji-game-die': 'i-ph-dice-five-duotone',
    'i-twemoji-desktop-computer': 'i-ph-desktop-duotone',
    'i-twemoji-television': 'i-ph-television-duotone',
    'i-twemoji-books': 'i-ph-books-duotone',
    'i-twemoji-musical-note': 'i-ph-music-note-duotone',
    'i-twemoji-mobile-phone': 'i-ph-device-mobile-camera-duotone',
    'i-twemoji-floppy-disk': 'i-ph-floppy-disk-duotone',
    'i-twemoji-link': 'i-ph-link-duotone',
    'i-twemoji-magnifying-glass': 'i-ph-magnifying-glass-duotone',
    'i-twemoji-eyes': 'i-ph-eye-duotone',
    'i-twemoji-red-apple': 'i-ph-apple-logo-duotone',
    'i-twemoji-penguin': 'i-ph-linux-logo-duotone',

    // MDI & Carbon
    'i-mdi-reddit': 'i-ph-reddit-logo-duotone',
    'i-carbon-logo-discord': 'i-ph-discord-logo-duotone',
    'i-carbon-logo-github': 'i-ph-github-logo-duotone',
    'i-carbon-logo-x': 'i-ph-x-logo-duotone',
    'i-mdi-telegram': 'i-ph-telegram-logo-duotone',
    'i-carbon-play-filled': 'i-ph-play-circle-duotone'
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // Replace fa-* icons
    // Some are inside <i class="...">
    for (const [oldClass, newClass] of Object.entries(ICON_MAP)) {
        if (content.includes(oldClass)) {
            content = content.split(oldClass).join(newClass);
            changed = true;
        }
    }

    // Convert <i class="i-ph-*"> back to <span class="i-ph-*"> just in case, but actually i tag is fine for UnoCSS

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
    }
}

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.json') || fullPath.endsWith('.js')) {
            processFile(fullPath);
        }
    }
}

scanDir(ROOT_DIR);
console.log("Migration complete.");
