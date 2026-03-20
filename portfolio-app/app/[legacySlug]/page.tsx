import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAliasTarget, getLegacyAliases } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const dynamicParams = false;

export async function generateStaticParams() {
  const aliases = getLegacyAliases().map((entry) => ({ legacySlug: entry.alias }));
  return aliases.length > 0 ? aliases : [{ legacySlug: 'dummy-route-ignore' }];
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
      title: 'Record Not Found',
      description: 'The requested archive alias does not map to a public case file.',
      path: `/portfolio/${legacySlug}/`,
      noIndex: true
    });
  }

  return buildMetadata({
    title: `${alias.title} Redirect`,
    description: 'Redirecting to the canonical public case file.',
    path: `/portfolio/work/${alias.target}/`,
    noIndex: true
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

  redirect(`/work/${alias.target}/`);
}
