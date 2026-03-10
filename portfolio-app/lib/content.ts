import { caseStudies } from '@/content/case-studies';
import { homeContent } from '@/content/home';
import { insights } from '@/content/insights';

export function getHomeContent() {
  return homeContent;
}

export function getCaseStudies() {
  return caseStudies;
}

export function getCaseStudy(slug: string) {
  return caseStudies.find((entry) => entry.slug === slug);
}

export function getRelatedCaseStudies(slug: string, limit = 2) {
  return caseStudies.filter((entry) => entry.slug !== slug).slice(0, limit);
}

export function getInsights() {
  return insights;
}

export function getInsight(slug: string) {
  return insights.find((entry) => entry.slug === slug);
}

export function getLegacyAliases() {
  return caseStudies.flatMap((entry) =>
    (entry.aliases ?? []).map((alias) => ({
      alias,
      target: entry.slug,
      title: entry.title
    }))
  );
}

export function getAliasTarget(alias: string) {
  return getLegacyAliases().find((entry) => entry.alias === alias);
}

