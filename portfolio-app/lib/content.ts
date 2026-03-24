import { caseStudies } from '@/content/case-studies';
import { homeContent } from '@/content/home';
import { insights } from '@/content/insights';
import { sharedSiteConfig } from '@/content/site';
import type { CaseStudy, PortfolioHomeData, SharedSiteConfig } from '@/content/types';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNoTodo(value: unknown, path = 'root') {
  if (typeof value === 'string' && /\[TODO:[^\]]+\]/i.test(value)) {
    throw new Error(`${path} contains a TODO placeholder`);
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoTodo(entry, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) => assertNoTodo(entry, `${path}.${key}`));
  }
}

function validateSharedSiteConfig(config: SharedSiteConfig) {
  assert(typeof config.site.siteUrl === 'string' && config.site.siteUrl.length > 0, 'site.siteUrl is required');
  assert(typeof config.profile.name === 'string' && config.profile.name.length > 0, 'profile.name is required');
  assert(typeof config.contact.email === 'string' && config.contact.email.includes('@'), 'contact.email is required');
  assert(Array.isArray(config.socials), 'socials must be an array');
  assertNoTodo(config, 'sharedSiteConfig');
  return config;
}

function validatePortfolioHomeContent(content: PortfolioHomeData) {
  assert(typeof content.hero.name === 'string' && content.hero.name.length > 0, 'portfolio home hero.name is required');
  assert(Array.isArray(content.capabilityClusters), 'portfolio capabilityClusters must be an array');
  assertNoTodo(content, 'portfolio.home');
  return content;
}

function validateCaseStudies(entries: CaseStudy[]) {
  const slugs = new Set<string>();
  const aliases = new Set<string>();

  entries.forEach((entry) => {
    assert(entry.slug.length > 0, 'caseStudy.slug is required');
    assert(!slugs.has(entry.slug), `Duplicate caseStudy slug: ${entry.slug}`);
    slugs.add(entry.slug);

    (entry.aliases ?? []).forEach((alias) => {
      assert(!aliases.has(alias), `Duplicate caseStudy alias: ${alias}`);
      aliases.add(alias);
    });
  });

  assertNoTodo(entries, 'portfolio.caseStudies');
  return entries;
}

export function getSharedSiteConfig() {
  return validateSharedSiteConfig(sharedSiteConfig);
}

export function getPortfolioHomeContent() {
  return validatePortfolioHomeContent(homeContent);
}

export function getPortfolioCaseStudies() {
  return validateCaseStudies(caseStudies);
}

export function getPortfolioCaseStudy(slug: string) {
  return getPortfolioCaseStudies().find((entry) => entry.slug === slug);
}

export function getRelatedCaseStudies(slug: string, limit = 2) {
  return getPortfolioCaseStudies().filter((entry) => entry.slug !== slug).slice(0, limit);
}

export function getInsights() {
  return insights;
}

export function getInsight(slug: string) {
  return insights.find((entry) => entry.slug === slug);
}

export function getLegacyAliases() {
  return getPortfolioCaseStudies().flatMap((entry) =>
    (entry.aliases ?? []).map((alias) => ({
      alias,
      target: entry.slug,
      title: entry.title,
      category: entry.category
    }))
  );
}

export function getAliasTarget(alias: string) {
  return getLegacyAliases().find((entry) => entry.alias === alias);
}
