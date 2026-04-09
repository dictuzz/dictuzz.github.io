const fs = require('fs');
const path = require('path');

const siteCssPath = path.join(__dirname, '../css/site.css');
const resumeCssPath = path.join(__dirname, '../resume/resume.css');

function removeFooter(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const token = '/* ═══════════════════════════════════════════';
    const firstIndex = content.indexOf(token);
    
    if (firstIndex === -1) {
        console.log(`Token not found in ${filePath}`);
        return;
    }
    
    // We want the index of the GLOBAL FOOTER specifically
    const globalFooterIndex = content.indexOf('GLOBAL FOOTER (', firstIndex);
    if (globalFooterIndex === -1) {
        console.log(`Global footer comment not found in ${filePath}`);
        return;
    }

    // Back up to the comment start
    const blockStart = content.lastIndexOf('/* ════', globalFooterIndex);
    
    if (blockStart === -1) {
        console.log(`Could not find start of footer block in ${filePath}`);
        return;
    }

    // The footer is the very last thing in these files
    const newContent = content.substring(0, blockStart) + '/* Global footer styles: see assets/css/core.css */\n';
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Successfully removed footer from ${filePath}`);
}

removeFooter(siteCssPath);
removeFooter(resumeCssPath);
