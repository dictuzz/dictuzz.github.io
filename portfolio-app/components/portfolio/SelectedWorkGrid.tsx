'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import { CaseStudyCard } from '@/components/portfolio/CaseStudyCard';
import type { CaseStudy } from '@/content/types';

type SelectedWorkGridProps = {
  caseStudies: CaseStudy[];
};

export function SelectedWorkGrid({ caseStudies }: SelectedWorkGridProps) {
  return (
    <section className="section" id="selected-work">
      <div className="container">
        <SectionReveal className="section-heading">
          <p className="eyebrow">Selected Work</p>
          <h2>A small selection of work with real business context.</h2>
          <p>
            Each project shows what was wrong before, what changed, and why the final result felt stronger for both the
            customer and the business.
          </p>
        </SectionReveal>
        <div className="case-grid">
          {caseStudies.map((project, index) => (
            <SectionReveal key={project.slug} delay={index * 50}>
              <CaseStudyCard project={project} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
