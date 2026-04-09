const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../css/site.css');
let content = fs.readFileSync(cssPath, 'utf8');

const startMarker = '/* ═══════════════════════════════════════════';
const footerIdent = 'GLOBAL FOOTER (Unified across all Apps)';
const endMarker = '.global-footer__copy span {\r\n    display: block;\r\n    margin-top: 4px;\r\n}';
const endMarker2 = '.global-footer__copy span {\n    display: block;\n    margin-top: 4px;\n}';

const firstIndex = content.indexOf(startMarker);
if (firstIndex !== -1) {
    const footerStart = content.indexOf(footerIdent, firstIndex);
    if (footerStart !== -1 && footerStart - firstIndex < 100) {
        let endIndex = content.indexOf(endMarker, footerStart);
        let len = endMarker.length;
        if (endIndex === -1) {
            endIndex = content.indexOf(endMarker2, footerStart);
            len = endMarker2.length;
        }

        if (endIndex !== -1) {
            const before = content.substring(0, firstIndex);
            const after = content.substring(endIndex + len);
            const finalContent = before + '/* Global footer styles are managed in assets/css/core.css */' + after;
            fs.writeFileSync(cssPath, finalContent, 'utf8');
            console.log('Successfully removed duplicated footer from site.css');
        } else {
            console.log('End marker not found');
        }
    } else {
        console.log('Footer identity not found near start marker');
    }
} else {
    console.log('Start marker not found');
}
