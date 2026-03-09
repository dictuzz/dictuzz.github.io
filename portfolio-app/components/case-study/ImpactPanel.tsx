'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import type { CaseStudy } from '@/content/types';

type ImpactPanelProps = {
  caseStudy: CaseStudy;
};

export function ImpactPanel({ caseStudy }: ImpactPanelProps) {
  return (
    <SectionReveal className="case-section" delay={160}>
      <p className="eyebrow">Impact</p>
      <h2>What improved after the work was applied.</h2>
      <div className="impact-panel">
        <div className="impact-panel__metrics">
          {caseStudy.impact.map((item) => (
            <article className="impact-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
        {caseStudy.testimonial ? (
          <figure className="impact-panel__quote">
            <blockquote>{caseStudy.testimonial.quote}</blockquote>
            <figcaption>
              {caseStudy.testimonial.author}
              <span>{caseStudy.testimonial.role}</span>
            </figcaption>
          </figure>
        ) : null}
      </div>
    </SectionReveal>
  );
}
