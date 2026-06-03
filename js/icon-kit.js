const ICON_MAP = {
    'i-ph-arrow-right-duotone': icon('M5 12h14 M13 5l7 7-7 7'),
    'i-ph-list-duotone': icon('M4 6h16 M4 12h16 M4 18h16'),
    'i-ph-house-duotone': icon('M3 12l9-8 9 8 M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9'),
    'i-ph-link-duotone': icon('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'),
    'i-ph-x-duotone': icon('M18 6 6 18 M6 6l12 12'),
    'i-ph-arrow-up-right-duotone': icon('M8 8h8v8 M10 14 16 8 M14 5h5v5 M5 9V6a1 1 0 0 1 1-1h5 M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V10'),
    'i-ph-calendar-check-duotone': icon('M8 3v3 M16 3v3 M4 8h16 M7 13l3 3 7-7 M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1'),
    'i-ph-caret-down-duotone': icon('M6 9l6 6 6-6'),
    'i-ph-envelope-duotone': icon('M4 7h16v10H4z M4 8l8 6 8-6'),
    'i-ph-file-text-duotone': icon('M8 3h7l4 4v14H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2 M15 3v4h4 M9 11h6 M9 15h6'),
    'i-ph-file-text-duotone': icon('M8 3h7l4 4v14H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2 M15 3v4h4 M9 11h6 M9 15h6 M9 19h4'),
    'i-ph-folder-open-duotone': icon('M3 8.5h18l-2 9.5H5L3 8.5z M3 8.5V7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1.5'),
    'i-ph-instagram-logo-duotone': icon('M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4 M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5 M17.5 6.5h.01'),
    'i-ph-moon-duotone': icon('M15.5 3.5a8.5 8.5 0 1 0 5 15.5A9 9 0 1 1 15.5 3.5'),
    'i-ph-paper-plane-tilt-duotone': icon('M3 11.5 20 4l-4.5 16-3.5-5-5-3.5z M10 12l5.5-3.5'),
    'i-ph-share-network-duotone': icon('M8 12a2 2 0 1 0 0-.01 M18 6a2 2 0 1 0 0-.01 M18 18a2 2 0 1 0 0-.01 M10 11l6-4 M10 13l6 4'),
    'i-ph-sun-duotone': icon('M12 4V2 M12 22v-2 M4 12H2 M22 12h-2 M6.3 6.3 4.9 4.9 M19.1 19.1l-1.4-1.4 M17.7 6.3l1.4-1.4 M6.3 17.7l-1.4 1.4 M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8'),
    'i-ph-squares-four-duotone': icon('M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z'),
    'i-ph-warning-duotone': icon('M12 4 21 20H3L12 4z M12 10v4 M12 17h.01'),
    'i-ph-video-camera-duotone': icon('M4 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4z M17 10l4-2v8l-4-2'),
    'i-ph-whatsapp-logo-duotone': icon('M16.5 14.2c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.4.5c-.1.2-.3.2-.5.1-.3-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.3-.3.2-.3c.1-.1.1-.3 0-.4l-.7-1.6c-.1-.2-.3-.2-.5-.2h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.4.9 2.6c.1.2 1.6 2.6 4 3.5 2.3.9 2.3.6 2.7.6.4 0 1.3-.5 1.5-1.1.2-.6.2-1 .1-1.1z M20 11.7c0 4.6-3.8 8.3-8.5 8.3-1.4 0-2.8-.4-4-1l-3.5.9 1-3.3a8.1 8.1 0 0 1-2-5.1C3 7 6.8 3.3 11.5 3.3S20 7 20 11.7z', true),
    'i-ph-at-duotone': glyphIcon('@', 13),
    'i-ph-discord-logo-duotone': filledIcon('<path d="M19.54 5.31a16.38 16.38 0 0 0-4.14-1.29.06.06 0 0 0-.07.03c-.18.33-.38.76-.52 1.1a15.2 15.2 0 0 0-4.58 0c-.14-.35-.35-.77-.53-1.1a.06.06 0 0 0-.07-.03 16.3 16.3 0 0 0-4.14 1.29.05.05 0 0 0-.02.02C2.82 9.18 2.1 12.95 2.45 16.67a.07.07 0 0 0 .03.05 16.7 16.7 0 0 0 5.08 2.57.06.06 0 0 0 .07-.03c.39-.54.74-1.11 1.03-1.72a.06.06 0 0 0-.03-.08 10.9 10.9 0 0 1-1.58-.76.06.06 0 0 1-.01-.1c.11-.08.22-.17.32-.25a.06.06 0 0 1 .06-.01c3.31 1.51 6.89 1.51 10.16 0a.06.06 0 0 1 .06.01c.1.08.21.17.32.25a.06.06 0 0 1-.01.1c-.5.3-1.03.56-1.58.76a.06.06 0 0 0-.03.08c.3.61.64 1.18 1.03 1.72a.06.06 0 0 0 .07.03 16.64 16.64 0 0 0 5.08-2.57.07.07 0 0 0 .03-.05c.42-4.3-.71-8.03-3.02-11.34a.05.05 0 0 0-.02-.02ZM9.09 14.4c-.99 0-1.8-.9-1.8-2s.8-2 1.8-2c1 0 1.8.9 1.8 2s-.8 2-1.8 2Zm5.82 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>'),
    'i-ph-facebook-logo-duotone': filledIcon('<path d="M13.34 20v-6.83h2.3l.34-2.66h-2.64V8.8c0-.77.21-1.3 1.32-1.3h1.41V5.12c-.24-.03-1.06-.1-2.01-.1-1.99 0-3.36 1.21-3.36 3.45v2.03H8.44v2.66h2.26V20h2.64Z"/>'),
    'i-ph-github-logo-duotone': filledIcon('<path d="M12 .6a11.4 11.4 0 0 0-3.6 22.22c.57.1.78-.25.78-.56 0-.28-.01-1.18-.02-2.13-3.17.69-3.84-1.35-3.84-1.35-.52-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.16 1.74 1.16 1.01 1.73 2.66 1.23 3.31.94.1-.72.4-1.22.73-1.5-2.53-.29-5.19-1.26-5.19-5.61 0-1.24.45-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.16a10.97 10.97 0 0 1 5.74 0c2.19-1.47 3.15-1.16 3.15-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.36-2.66 5.31-5.2 5.6.41.35.77 1.03.77 2.08 0 1.51-.01 2.72-.01 3.09 0 .31.2.67.79.56A11.4 11.4 0 0 0 12 .6Z" transform="translate(1.5 1.5) scale(0.875)"/>'),
    'i-ph-linkedin-logo-duotone': filledIcon('<path d="M5.8 8.6H2.95V20h2.85V8.6Zm.19-3.53C5.98 4.08 5.24 3.4 4.38 3.4s-1.6.69-1.6 1.67c0 .96.73 1.67 1.58 1.67h.02c.88 0 1.61-.7 1.61-1.67ZM20 13.03c0-3.5-1.87-5.13-4.36-5.13-2.01 0-2.91 1.11-3.42 1.88V8.6H9.37c.04.79 0 11.4 0 11.4h2.85v-6.37c0-.34.02-.68.13-.92.27-.68.88-1.39 1.92-1.39 1.36 0 1.9 1.04 1.9 2.57V20H19v-6.97Z"/>'),
    'i-ph-linkedin-logo-duotone-in': filledIcon('<path d="M5.8 8.6H2.95V20h2.85V8.6Zm.19-3.53C5.98 4.08 5.24 3.4 4.38 3.4s-1.6.69-1.6 1.67c0 .96.73 1.67 1.58 1.67h.02c.88 0 1.61-.7 1.61-1.67ZM20 13.03c0-3.5-1.87-5.13-4.36-5.13-2.01 0-2.91 1.11-3.42 1.88V8.6H9.37c.04.79 0 11.4 0 11.4h2.85v-6.37c0-.34.02-.68.13-.92.27-.68.88-1.39 1.92-1.39 1.36 0 1.9 1.04 1.9 2.57V20H19v-6.97Z"/>'),
    'i-ph-game-controller-duotone': filledIcon('<path d="M18.2 6.05a4.7 4.7 0 0 0-4.68 4.4l-3.1 4.53a3.3 3.3 0 0 0-1.75-.5c-.16 0-.31.01-.46.03l-2.34-.96a.4.4 0 0 0-.53.22.4.4 0 0 0 .22.52l2.02.83a3.3 3.3 0 1 0 3.13 5.75l4.39-6.18h.05a4.7 4.7 0 1 0 3.05-8.64Zm-9.55 14.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm9.55-5.02a3.47 3.47 0 1 1 0-6.94 3.47 3.47 0 0 1 0 6.94Zm0-5.7a2.23 2.23 0 1 0 0 4.46 2.23 2.23 0 0 0 0-4.46Z"/>')
};

function icon(path, filled = false) {
    return {
        filled,
        markup: `<path d="${path}"${filled ? ' fill="currentColor" stroke="none"' : ''}/>`
    };
}

function filledIcon(markup) {
    return {
        filled: true,
        markup
    };
}

function glyphIcon(text, size = 10.5) {
    return {
        filled: true,
        markup: `<text x="12" y="16" text-anchor="middle" font-size="${size}" font-family="Arial, sans-serif" font-weight="700" fill="currentColor">${text}</text>`
    };
}

function findSupportedIcon(classList) {
    return [...classList].find((token) => ICON_MAP[token]);
}

function renderIcon(iconName) {
    const config = ICON_MAP[iconName];
    if (!config) return '';

    const sharedAttrs = config.filled
        ? 'viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"'
        : 'viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';

    return `<svg ${sharedAttrs}>${config.markup}</svg>`;
}

export function upgradeIcons(root = document) {
    const scope = root?.querySelectorAll ? root : document;
    scope.querySelectorAll('i[class*="fa-"]').forEach((element) => {
        const iconName = findSupportedIcon(element.classList);
        if (!iconName) return;
        if (element.dataset.iconRendered === iconName) return;

        element.innerHTML = renderIcon(iconName);
        element.dataset.iconRendered = iconName;
        element.classList.add('icon-svg');
        if (!element.hasAttribute('aria-hidden') && !element.hasAttribute('aria-label')) {
            element.setAttribute('aria-hidden', 'true');
        }
    });
}
