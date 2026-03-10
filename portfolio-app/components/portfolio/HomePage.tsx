'use client';

import { AboutPanel } from '@/components/portfolio/AboutPanel';
import { ContactPanel } from '@/components/portfolio/ContactPanel';
import { PortfolioHeader } from '@/components/portfolio/PortfolioHeader';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { ProcessRail } from '@/components/portfolio/ProcessRail';
import { ProofStrip } from '@/components/portfolio/ProofStrip';
import { SelectedWorkGrid } from '@/components/portfolio/SelectedWorkGrid';
import { ThinkingGrid } from '@/components/portfolio/ThinkingGrid';
import { TrustBand } from '@/components/portfolio/TrustBand';
import type { CaseStudy, Insight, PortfolioHomeData } from '@/content/types';

type HomePageProps = {
  home: PortfolioHomeData;
  caseStudies: CaseStudy[];
  insights: Insight[];
};

export function HomePage({ home, caseStudies, insights }: HomePageProps) {
  return (
    <>
      <PortfolioHeader />
      <main className="page-main">
        <PortfolioHero hero={home.hero} />
        <div className="container">
          <ProofStrip metrics={home.proofMetrics} />
        </div>
        <SelectedWorkGrid caseStudies={caseStudies} />
        <TrustBand clientPills={home.clientPills} metrics={home.proofMetrics} testimonial={home.testimonial} />
        <ProcessRail steps={home.process} />
        <ThinkingGrid insights={insights} />
        <AboutPanel about={home.about} />
        <ContactPanel contact={home.contact} />
      </main>
    </>
  );
}
