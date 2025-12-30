/**
 * tuzzblog - Simple Static Blog Builder
 * Converts Markdown files to HTML blog posts
 * 
 * Usage: node build.js
 * 
 * This script:
 * 1. Reads all .md files from /posts folder
 * 2. Parses frontmatter (title, date, category)
 * 3. Converts markdown to HTML
 * 4. Generates HTML files using the post template
 * 5. Updates posts.json and index.html with new posts
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  postsDir: path.join(__dirname, 'posts'),
  outputDir: path.join(__dirname, 'posts'),
  postsJsonPath: path.join(__dirname, 'posts.json'),
  templatePath: path.join(__dirname, 'post-template.html'),
  indexPath: path.join(__dirname, 'index.html'),
};

// ═══════════════════════════════════════════════════════════════════════════
// FRONTMATTER PARSER
// ═══════════════════════════════════════════════════════════════════════════

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, body: content };
  }

  const frontmatter = match[1];
  const body = match[2];
  const metadata = {};

  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      metadata[key] = value;
    }
  });

  return { metadata, body };
}

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLE MARKDOWN TO HTML CONVERTER
// ═══════════════════════════════════════════════════════════════════════════

function markdownToHtml(markdown) {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr>');

  // Bold & Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  const listRegex = /((?:^[-*] .+(?:\r?\n|$))+)/gm;
  html = html.replace(listRegex, (match) => {
    const items = match.trim().split(/\r?\n/)
      .map(line => `<li>${line.replace(/^[-*] /, '')}</li>`)
      .join('\n');
    return `<ul>\n${items}\n</ul>\n`;
  });

  // Paragraphs (lines not starting with HTML tags)
  const lines = html.split('\n');
  const result = [];
  let inParagraph = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      continue;
    }

    // Skip lines that are already HTML
    // Added regex check for more tags
    if (line.match(/^<\/?(h[1-6]|ul|ol|li|blockquote|hr|p|div|table|tr|td|span|a|img|figure|pre|code)/i)) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      result.push(line);
      continue;
    }

    if (!inParagraph) {
      result.push('<p>' + line);
      inParagraph = true;
    } else {
      result.push(line);
    }
  }

  if (inParagraph) {
    result.push('</p>');
  }

  return result.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// DATE FORMATTER
// ═══════════════════════════════════════════════════════════════════════════

function formatDate(dateString) {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2);
  return `${month} ${day} • ${year}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ═══════════════════════════════════════════════════════════════════════════
// POST TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════

function generatePostHtml(post) {
  return `<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${post.excerpt || post.title}">
  <title>${post.title} - tuzzblog</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="icon" href="../../assets/images/favicon.svg" type="image/svg+xml">
</head>
<body>
  <a href="#main-content" class="skip-link">Langsung ke konten</a>
  <div class="nav-overlay" aria-hidden="true"></div>
  
  <header class="site-header" role="banner">
    <div class="container container--wide">
      <a href="../index.html" class="site-brand">
        <i class="fa-solid fa-fire site-logo-icon" style="color: #e25822;"></i>
        <span class="site-title">tuzzblog</span>
      </a>
      <button class="menu-toggle" aria-expanded="false" aria-controls="nav-main" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
      <nav id="nav-main" class="nav-main" role="navigation">
        <ul class="nav-menu">
                    <li><a href="../index.html">Beranda</a></li>
          <li><a href="../manifesto.html">Manifesto</a></li>
          <li><a href="../contact.html">Kontak</a></li>
        </ul>
        <button class="theme-toggle" aria-label="Toggle tema">
          <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
      </nav>
    </div>
  </header>
  
  <main id="main-content" role="main">
    <article class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol><li><a href="../index.html">Beranda</a></li><li><span aria-current="page">${post.title}</span></li></ol>
      </nav>
      
      <header class="post-header">
        <h1 class="post-title">${post.title}</h1>
        <div class="post-meta">
          <time datetime="${post.date}">${post.dateFormatted}</time>
          <span class="post-category">${post.category}</span>
        </div>
      </header>
      
      <div class="post-content">
        ${post.contentHtml}
      </div>
    </article>
  </main>
  
  <footer class="site-footer" role="contentinfo">
    <div class="container container--wide">
      <div class="footer-content">
        <p class="copyright">© 2025 <a href="https://dictuzz.github.io/resume" target="_blank">dictuzz</a>. All rights reserved.</p>
        <nav class="footer-nav">
          <a href="../manifesto.html">Manifesto</a>
          <a href="../contact.html">Kontak</a>
          <a href="#">RSS</a>
        </nav>
      </div>
    </div>
  </footer>
  
  <script src="../script.js"></script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN BUILD FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

function build() {
  console.log('Building tuzzblog...\n');

  // Get all markdown files
  const files = fs.readdirSync(CONFIG.postsDir)
    .filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('No markdown files found in /posts folder');
    return;
  }

  const posts = [];

  // Process each markdown file
  files.forEach(file => {
    const filePath = path.join(CONFIG.postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata, body } = parseFrontmatter(content);

    const slug = file.replace('.md', '');
    const title = metadata.title || slug;
    const date = metadata.date || new Date().toISOString().split('T')[0];
    const category = metadata.category || 'Uncategorized';
    const dateFormatted = formatDate(date);

    // Convert markdown to HTML
    const contentHtml = markdownToHtml(body);

    // Generate excerpt (first 150 chars of first paragraph)
    const excerptMatch = body.match(/^[^#\-\*\n].+/m);
    const excerpt = excerptMatch ? excerptMatch[0].slice(0, 150) + '...' : '';

    const post = {
      slug,
      title,
      date,
      dateFormatted,
      category,
      excerpt,
      contentHtml
    };

    posts.push(post);

    // Generate HTML file
    const htmlContent = generatePostHtml(post);
    const outputPath = path.join(CONFIG.outputDir, `${slug}.html`);
    fs.writeFileSync(outputPath, htmlContent);

    console.log(`Generated: posts/${slug}.html`);
  });

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Update posts.json
  const postsJson = {
    posts: posts.map(p => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      dateFormatted: p.dateFormatted,
      category: p.category,
      excerpt: p.excerpt
    }))
  };

  fs.writeFileSync(CONFIG.postsJsonPath, JSON.stringify(postsJson, null, 2));
  console.log(`\nUpdated posts.json (${posts.length} posts)`);

  console.log('\nBuild complete!\n');
}

// Run build
build();
