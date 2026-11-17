import { ICON_MAP } from './icon-data.js';

function findSupportedIcon(classList) {
    return [...classList].find((token) => ICON_MAP[token]);
}

function renderIcon(iconName) {
    return ICON_MAP[iconName] || '';
}

export function upgradeIcons(root = document) {
    const scope = root?.querySelectorAll ? root : document;
    scope.querySelectorAll('i[class*="i-"]').forEach((element) => {
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
