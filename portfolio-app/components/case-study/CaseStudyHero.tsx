'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import { ProductVisual } from '@/components/portfolio/ProductVisual';
import type { CaseStudy } from '@/content/types';

type CaseStudyHeroProps = {
  caseStudy: CaseStudy;
};

export function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  return (
    <section className="case-hero">
      <SectionReveal className="case-hero__copy">
        <p className="eyebrow">Case Study</p>
        <p className="case-hero__meta">
          <span>{caseStudy.category}</span>
          <span>{caseStudy.timeline}</span>
        </p>
        <h1 className="page-title">{caseStudy.title}</h1>
        <p className="page-intro">{caseStudy.headline}</p>
        <div className="hero-proof hero-proof--case">
          <p>{caseStudy.summary}</p>
        </div>
      </SectionReveal>
      <SectionReveal className="case-hero__visual" delay={80}>
        <ProductVisual variant={caseStudy.heroVisual} />
      </SectionReveal>
    </section>
  );
}
