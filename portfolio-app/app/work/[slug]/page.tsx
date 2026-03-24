import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseFilePage } from '@/components/portfolio/CaseFilePage';
import { getPortfolioCaseStudies, getPortfolioCaseStudy, getRelatedCaseStudies } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPortfolioCaseStudies().map((caseStudy) => ({
    slug: caseStudy.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getPortfolioCaseStudy(slug);

  if (!caseStudy) {
    return buildMetadata({
      title: 'Case File Not Found',
      description: 'The requested case file could not be located.',
      path: `/portfolio/work/${slug}/`,
      noIndex: true
    });
  }

  return buildMetadata({
    title: caseStudy.title,
    description: caseStudy.headline,
    path: `/portfolio/work/${caseStudy.slug}/`
  });
}

export default async function WorkCasePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getPortfolioCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <CaseFilePage
      caseStudy={caseStudy}
      related={getRelatedCaseStudies(caseStudy.slug, 3)}
    />
  );
}
