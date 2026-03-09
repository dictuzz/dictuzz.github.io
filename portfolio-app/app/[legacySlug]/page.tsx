import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProtectedPortfolioRoute } from '@/components/protected/ProtectedPortfolioRoute';
import { getAliasTarget, getCaseStudy, getLegacyAliases } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return getLegacyAliases().map((entry) => ({ legacySlug: entry.alias }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ legacySlug: string }>;
}): Promise<Metadata> {
  const { legacySlug } = await params;
  const alias = getAliasTarget(legacySlug);

  if (!alias) {
    return buildMetadata({
      title: 'Private Portfolio',
      description: 'Access code required to view this private portfolio.',
      path: `/portfolio/${legacySlug}/`
    });
  }

  return buildMetadata({
    title: 'Private Portfolio',
    description: 'Access code required to view this private portfolio.',
    path: `/portfolio/${legacySlug}/`
  });
}

export default async function LegacyAliasPage({
  params
}: {
  params: Promise<{ legacySlug: string }>;
}) {
  const { legacySlug } = await params;
  const alias = getAliasTarget(legacySlug);

  if (!alias) {
    notFound();
  }

  const target = getCaseStudy(alias.target);

  if (!target) {
    notFound();
  }

  return <ProtectedPortfolioRoute route={{ kind: 'legacy', legacySlug }} />;
}
