'use client';

import Link from 'next/link';
import { ProductVisual } from '@/components/portfolio/ProductVisual';
import type { CaseStudy } from '@/content/types';

type CaseStudyCardProps = {
  project: CaseStudy;
};

export function CaseStudyCard({ project }: CaseStudyCardProps) {
  const impactItems = project.impact.slice(0, 2);

  return (
    <article className="case-card">
      <div className="case-card__media">
        <ProductVisual variant={project.heroVisual} compact />
      </div>
      <div className="case-card__body">
        <div className="case-card__meta">
          <span>{project.category}</span>
          <span>{project.timeline}</span>
        </div>
        <div className="case-card__summary">
          <h3>{project.title}</h3>
          <p className="case-card__headline">{project.headline}</p>
          <p className="case-card__summary-text">{project.summary}</p>
        </div>
        <div className="case-card__impact">
          {impactItems.map((item) => (
            <span className="metric-chip" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </span>
          ))}
        </div>
        <div className="case-card__footer">
          <p className="case-card__footer-note">{project.sector}</p>
          <Link className="inline-link" href={`/work/${project.slug}`} prefetch={false}>
            Read Case Study
          </Link>
        </div>
      </div>
    </article>
  );
}
