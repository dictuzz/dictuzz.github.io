import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProtectedPortfolioRoute } from '@/components/protected/ProtectedPortfolioRoute';
import { getCaseStudy, getCaseStudies } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return getCaseStudies().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    return buildMetadata({
      title: 'Private Portfolio',
      description: 'Access code required to view this private portfolio.',
      path: `/portfolio/work/${slug}/`
    });
  }

  return buildMetadata({
    title: 'Private Portfolio',
    description: 'Access code required to view this private portfolio.',
    path: `/portfolio/work/${caseStudy.slug}/`
  });
}

export default async function WorkPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  return <ProtectedPortfolioRoute route={{ kind: 'work', slug: caseStudy.slug }} />;
}
