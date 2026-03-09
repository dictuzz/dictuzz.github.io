'use client';

import Link from 'next/link';
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero';
import { CaseStudySidebar } from '@/components/case-study/CaseStudySidebar';
import { DecisionGrid } from '@/components/case-study/DecisionGrid';
import { ImpactPanel } from '@/components/case-study/ImpactPanel';
import { InterfaceShowcase } from '@/components/case-study/InterfaceShowcase';
import { NarrativeSection } from '@/components/case-study/NarrativeSection';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { CaseStudyCard } from '@/components/portfolio/CaseStudyCard';
import { PortfolioHeader } from '@/components/portfolio/PortfolioHeader';
import type { CaseStudy } from '@/content/types';

type CaseStudyPageProps = {
  caseStudy: CaseStudy;
  related: CaseStudy[];
};

export function CaseStudyPage({ caseStudy, related }: CaseStudyPageProps) {
  return (
    <>
      <PortfolioHeader />
      <main className="page-main case-page">
        <div className="container case-page__header">
          <Link className="inline-link" href="/" prefetch={false}>
            Back to Work
          </Link>
        </div>
        <div className="container">
          <CaseStudyHero caseStudy={caseStudy} />
          <div className="case-layout">
            <CaseStudySidebar caseStudy={caseStudy} />
            <div className="case-content">
              <NarrativeSection
                kicker="Problem"
                title="What was not working before."
                body={caseStudy.problem}
              />
              <NarrativeSection
                kicker="Context"
                title="Why the redesign mattered to the business."
                body={caseStudy.context}
                delay={40}
              />
              <NarrativeSection
                kicker="Research"
                title="What we learned before making changes."
                body={caseStudy.research}
                delay={60}
              />
              <NarrativeSection
                kicker="UX Insight"
                title="The idea that guided the work."
                body={caseStudy.uxInsight}
                delay={70}
              />
              <DecisionGrid items={caseStudy.designDecisions} />
              <InterfaceShowcase items={caseStudy.interfaceSolution} />
              <ImpactPanel caseStudy={caseStudy} />
            </div>
          </div>
          <SectionReveal className="related-block">
            <div className="section-heading section-heading--inline">
              <div>
                <p className="eyebrow">Related Work</p>
                <h2>More projects in a similar category.</h2>
              </div>
              <MagneticButton href="/#contact" variant="secondary">
                Discuss Your Product
              </MagneticButton>
            </div>
            <div className="case-grid case-grid--related">
              {related.map((item) => (
                <CaseStudyCard key={item.slug} project={item} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </main>
    </>
  );
}
