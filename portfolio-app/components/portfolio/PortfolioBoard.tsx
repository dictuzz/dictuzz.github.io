'use client';

import type { PortfolioHomeData } from '@/content/types';
import type { BoardCase } from '@/data/cases';
import { CaseBoardSection } from '@/components/sections/case-board';

export function PortfolioBoard({
  home,
  cases
}: {
  home: PortfolioHomeData;
  cases: BoardCase[];
}) {
  return <CaseBoardSection cases={cases} home={home} />;
}
