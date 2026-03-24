import fs from 'node:fs/promises';
import path from 'node:path';

const TODO_PATTERN = /\[TODO:[^\]]+\]/i;

function fail(message) {
  throw new Error(message);
}

function assert(condition, message, issues) {
  if (!condition) {
    issues.push(message);
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function collectTodoStrings(value, pathName = 'root', issues = []) {
  if (typeof value === 'string' && TODO_PATTERN.test(value)) {
    issues.push(`${pathName} contains a TODO placeholder`);
    return issues;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectTodoStrings(entry, `${pathName}[${index}]`, issues));
    return issues;
  }

  if (isObject(value)) {
    Object.entries(value).forEach(([key, entry]) => collectTodoStrings(entry, `${pathName}.${key}`, issues));
  }

  return issues;
}

function validateSharedSiteConfig(raw) {
  const issues = [];
  assert(isObject(raw?.site), 'site config is required', issues);
  assert(isObject(raw?.profile), 'profile config is required', issues);
  assert(isObject(raw?.contact), 'contact config is required', issues);
  assert(Array.isArray(raw?.socials), 'socials must be an array', issues);
  assert(Array.isArray(raw?.navigation?.footer), 'navigation.footer must be an array', issues);
  assert(isObject(raw?.seo?.pages), 'seo.pages is required', issues);
  assert(typeof raw?.contact?.email === 'string' && raw.contact.email.includes('@'), 'contact.email is required', issues);
  assert(typeof raw?.profile?.name === 'string' && raw.profile.name.length > 0, 'profile.name is required', issues);
  collectTodoStrings(raw, 'site', issues);
  if (issues.length > 0) fail(`Invalid shared site config:\n- ${issues.join('\n- ')}`);
}

function validateHomeContent(raw) {
  const issues = [];
  assert(Array.isArray(raw?.folders), 'home.folders must be an array', issues);
  const folderIds = new Set();

  raw?.folders?.forEach((folder, folderIndex) => {
    assert(typeof folder?.id === 'string' && folder.id.length > 0, `folders[${folderIndex}].id is required`, issues);
    assert(!folderIds.has(folder?.id), `folders[${folderIndex}].id must be unique`, issues);
    folderIds.add(folder?.id);
    assert(Array.isArray(folder?.items), `folders[${folderIndex}].items must be an array`, issues);
  });

  collectTodoStrings(raw, 'home', issues);
  if (issues.length > 0) fail(`Invalid home content:\n- ${issues.join('\n- ')}`);
}

function validateResumeContent(raw) {
  const issues = [];
  assert(typeof raw?.locale === 'string' && raw.locale.length > 0, 'resume.locale is required', issues);
  assert(isObject(raw?.strings), 'resume.strings is required', issues);
  assert(isObject(raw?.sections), 'resume.sections is required', issues);
  assert(isObject(raw?.collections), 'resume.collections is required', issues);
  assert(isObject(raw?.downloads), 'resume.downloads is required', issues);
  assert(typeof raw?.strings?.hero?.role === 'string' && raw.strings.hero.role.length > 0, 'resume.strings.hero.role is required', issues);
  assert(Array.isArray(raw?.sections?.experience), 'resume.sections.experience must be an array', issues);
  assert(Array.isArray(raw?.sections?.education), 'resume.sections.education must be an array', issues);
  assert(Array.isArray(raw?.collections?.skills?.strategic), 'resume.collections.skills.strategic must be an array', issues);
  assert(Array.isArray(raw?.collections?.languages), 'resume.collections.languages must be an array', issues);
  assert(typeof raw?.downloads?.resumeUrl === 'string' && raw.downloads.resumeUrl.startsWith('https://'), 'resume.downloads.resumeUrl is required', issues);
  collectTodoStrings(raw, `resume.${raw?.locale || 'unknown'}`, issues);
  if (issues.length > 0) fail(`Invalid resume locale content:\n- ${issues.join('\n- ')}`);
}

function validatePortfolioCaseStudies(raw) {
  const issues = [];
  assert(Array.isArray(raw), 'portfolio case studies must be an array', issues);
  const slugs = new Set();
  const aliases = new Set();

  raw.forEach((item, index) => {
    assert(typeof item?.slug === 'string' && item.slug.length > 0, `caseStudies[${index}].slug is required`, issues);
    assert(!slugs.has(item?.slug), `caseStudies[${index}].slug must be unique`, issues);
    slugs.add(item?.slug);
    assert(Array.isArray(item?.impact), `caseStudies[${index}].impact must be an array`, issues);
    assert(Array.isArray(item?.narrative), `caseStudies[${index}].narrative must be an array`, issues);
    assert(isObject(item?.board), `caseStudies[${index}].board is required`, issues);
    assert(isObject(item?.image), `caseStudies[${index}].image is required`, issues);

    (item.aliases || []).forEach((alias) => {
      assert(!aliases.has(alias), `alias "${alias}" must be unique`, issues);
      assert(alias !== item.slug, `alias "${alias}" cannot match its own slug`, issues);
      aliases.add(alias);
    });
  });

  collectTodoStrings(raw, 'portfolio.caseStudies', issues);
  if (issues.length > 0) fail(`Invalid portfolio case studies:\n- ${issues.join('\n- ')}`);
}

function validatePortfolioHome(raw) {
  const issues = [];
  assert(typeof raw?.hero?.name === 'string' && raw.hero.name.length > 0, 'portfolio.home.hero.name is required', issues);
  assert(Array.isArray(raw?.capabilityClusters), 'portfolio.home.capabilityClusters must be an array', issues);
  collectTodoStrings(raw, 'portfolio.home', issues);
  if (issues.length > 0) fail(`Invalid portfolio home content:\n- ${issues.join('\n- ')}`);
}

async function readJson(relativePath) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const raw = await fs.readFile(absolutePath, 'utf8');
  return JSON.parse(raw.replace(/^\uFEFF/, ''));
}

async function main() {
  validateSharedSiteConfig(await readJson('content/site.json'));
  validateHomeContent(await readJson('content/home.json'));

  for (const locale of ['en', 'id', 'de']) {
    validateResumeContent(await readJson(`content/resume/${locale}.json`));
  }

  validatePortfolioCaseStudies(await readJson('content/portfolio/case-studies.json'));
  validatePortfolioHome(await readJson('content/portfolio/home.json'));
  process.stdout.write('Content validation passed.\n');
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
