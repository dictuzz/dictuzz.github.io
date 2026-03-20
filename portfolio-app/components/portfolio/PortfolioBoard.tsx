'use client';

import type { CaseStudy, PortfolioHomeData } from '@/content/types';
import { CaseBoardSection } from '@/components/sections/case-board';

export function PortfolioBoard({
  home,
  cases
}: {
  home: PortfolioHomeData;
  cases: CaseStudy[];
}) {
  return <CaseBoardSection caseStudies={cases} home={home} />;
}
