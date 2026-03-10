import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProtectedPortfolioRoute } from '@/components/protected/ProtectedPortfolioRoute';
import { getInsight, getInsights } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return getInsights().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) {
    return buildMetadata({
      title: 'Private Portfolio',
      description: 'Access code required to view this private portfolio.',
      path: `/portfolio/thinking/${slug}/`
    });
  }

  return buildMetadata({
    title: 'Private Portfolio',
    description: 'Access code required to view this private portfolio.',
    path: `/portfolio/thinking/${insight.slug}/`
  });
}

export default async function ThinkingPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) {
    notFound();
  }

  return <ProtectedPortfolioRoute route={{ kind: 'thinking', slug: insight.slug }} />;
}
