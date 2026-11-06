import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Window } from 'happy-dom';
import { normalizeResumeTranslations } from '../js/site-content.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE_URL = 'https://dictuzz.me';
const LANGS = ['en', 'id', 'de'];
const CHECK_ONLY = process.argv.includes('--check');

const renderers = await import('../resume/resume-renderers.js');
const { updateResumeSeo } = await import('../resume/resume-seo.js');
const siteConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));
const template = fs.readFileSync(path.join(ROOT, 'resume/index.html'), 'utf8');
const DOM_TEMPLATE = template
  .replace(/<script\b(?![^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<link\b(?=[^>]*\brel=["'](?:stylesheet|preload|prefetch|preconnect|dns-prefetch)["'])[^>]*>/gi, '');

function resumePath(lang) {
  return lang === 'en' ? '/resume/' : `/resume/${lang}/`;
}

function portfolioPath(lang) {
  return lang === 'en' ? '/portfolio/' : `/portfolio/${lang}/`;
}

function pageOutputPath(lang) {
  return lang === 'en'
    ? path.join(ROOT, 'resume/index.html')
    : path.join(ROOT, 'resume', lang, 'index.html');
}

function updateFooter(document, translations, lang) {
  const labels = translations.footer;
  const nav = document.querySelector('.global-footer__nav');
  if (nav) {
    nav.setAttribute('aria-label', labels.navLabel);
    const links = [
      ['/', labels.home], [resumePath(lang), labels.resume], [portfolioPath(lang), labels.portfolio],
      ['/resources/', labels.resources]
    ];
    nav.replaceChildren(...links.map(([href, label]) => {
      const link = document.createElement('a');
      link.href = href;
      link.className = 'global-footer__link';
      link.textContent = label;
      if (href === resumePath(lang)) link.setAttribute('aria-current', 'page');
      return link;
    }));
  }

  const copy = document.querySelector('.global-footer__copy');
  if (copy) {
    copy.replaceChildren(document.createTextNode(`© ${new Date().getFullYear()} Benedictus Richard Ricardo. ${labels.allRights} `));
    const role = document.createElement('span');
    role.textContent = translations.hero.role;
    copy.append(role);
  }
}

function renderLocale(lang) {
  const url = `${SITE_URL}${resumePath(lang)}`;
  const window = new Window({ url, settings: {
    disableCSSFileLoading: true,
    disableJavaScriptEvaluation: true,
    disableJavaScriptFileLoading: true
  } });
  window.document.write(DOM_TEMPLATE);
  window.document.close();

  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.Node = window.Node;

  const content = JSON.parse(fs.readFileSync(path.join(ROOT, `content/resume/${lang}.json`), 'utf8'));
  const translations = normalizeResumeTranslations(content);
  const document = window.document;

  renderers.renderExperience(content.sections.experience, '#experience .timeline');
  renderers.renderExperience(content.sections.volunteering, '#volunteering-list');
  renderers.renderEducation(content.sections.education);
  renderers.renderCertifications(content.sections.certifications, translations);
  renderers.renderImpact(content.sections.impact);
  renderers.renderSkills(content.collections, translations);
  renderers.renderList('#awards-list', content.sections.awards);
  renderers.applyTranslations(translations);
  renderers.renderConnectSection(siteConfig, translations, content);

  const typingStatic = document.querySelector('#typing-static');
  if (typingStatic) typingStatic.textContent = content.strings.hero.typing.staticText || '';
  const typingDynamic = document.querySelector('#typing-dynamic');
  if (typingDynamic) typingDynamic.textContent = '';

  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  updateFooter(document, translations, lang);
  updateResumeSeo(siteConfig, content, lang);

  const serialized = document.documentElement.outerHTML.replace(/\n<\/body>/gi, '</body>');
  const html = `<!DOCTYPE html>\n${serialized}\n`;
  return html;
}

let stale = [];
for (const lang of LANGS) {
  const outputPath = pageOutputPath(lang);
  const output = renderLocale(lang);
  if (CHECK_ONLY) {
    const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
    if (current !== output) {
      stale.push(path.relative(ROOT, outputPath));
      const offset = [...current].findIndex((char, index) => char !== output[index]);
      console.error(`  first difference at ${Math.max(offset, 0)}: expected ${JSON.stringify(output.slice(Math.max(offset, 0), Math.max(offset, 0) + 100))}; found ${JSON.stringify(current.slice(Math.max(offset, 0), Math.max(offset, 0) + 100))}`);
    }
    continue;
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`prerendered ${path.relative(ROOT, outputPath)}`);
}

if (stale.length) {
  console.error('resume prerender is out of date; run: node scripts/prerender_resume.mjs');
  for (const file of stale) console.error(`  ${file}`);
  process.exitCode = 1;
} else if (CHECK_ONLY) {
  console.log(`resume prerender is up to date (${LANGS.length} files)`);
}
