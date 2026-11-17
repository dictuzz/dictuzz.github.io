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
  assert(typeof raw?.strings?.hero?.role === 'string' && raw.strings.hero.role.length > 0, 'resume.strings.hero.role is required', issues);
  assert(Array.isArray(raw?.sections?.experience), 'resume.sections.experience must be an array', issues);
  assert(Array.isArray(raw?.sections?.education), 'resume.sections.education must be an array', issues);
  assert(Array.isArray(raw?.collections?.skills?.strategic), 'resume.collections.skills.strategic must be an array', issues);
  assert(Array.isArray(raw?.collections?.languages), 'resume.collections.languages must be an array', issues);
  collectTodoStrings(raw, `resume.${raw?.locale || 'unknown'}`, issues);
  if (issues.length > 0) fail(`Invalid resume locale content:\n- ${issues.join('\n- ')}`);
}

function validatePortfolioLocale(raw, locale) {
  const issues = [];
  assert(raw?._locale === locale, `portfolio._locale must match "${locale}"`, issues);
  assert(isObject(raw?.ui), 'portfolio.ui is required', issues);
  assert(isObject(raw?.landing), 'portfolio.landing is required', issues);
  assert(typeof raw?.landing?.documentTitle === 'string' && raw.landing.documentTitle.length > 0, 'landing.documentTitle is required', issues);
  assert(Array.isArray(raw?.landing?.secondary), 'landing.secondary must be an array', issues);

  assert(isObject(raw?.cases), 'portfolio.cases is required', issues);
  const expectedCases = ['automation-mandate', 'kpi-governance-record', 'large-scale-event-ops', 'vertical-rescue-ops'];
  expectedCases.forEach((slug) => {
    const c = raw?.cases?.[slug];
    assert(isObject(c), `case "${slug}" is required in locale ${locale}`, issues);
    if (c) {
      assert(typeof c.title === 'string' && c.title.length > 0, `${slug}.title is required`, issues);
      assert(Array.isArray(c.narrative) && c.narrative.length > 0, `${slug}.narrative must be non-empty array`, issues);
      assert(Array.isArray(c.impact) && c.impact.length > 0, `${slug}.impact must be non-empty array`, issues);
      assert(Array.isArray(c.scope) && c.scope.length > 0, `${slug}.scope must be non-empty array`, issues);
      assert(Array.isArray(c.tools) && c.tools.length > 0, `${slug}.tools must be non-empty array`, issues);
      assert(Array.isArray(c.evidence), `${slug}.evidence must be an array`, issues);
    }
  });

  collectTodoStrings(raw, `portfolio.${locale}`, issues);
  if (issues.length > 0) fail(`Invalid portfolio locale [${locale}]:\n- ${issues.join('\n- ')}`);
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

  for (const locale of ['en', 'id', 'de']) {
    validatePortfolioLocale(await readJson(`content/portfolio/locales/${locale}.json`), locale);
  }

  process.stdout.write('Content validation passed.\n');
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
