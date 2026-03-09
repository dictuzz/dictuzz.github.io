'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import type { Decision } from '@/content/types';

type DecisionGridProps = {
  items: Decision[];
};

export function DecisionGrid({ items }: DecisionGridProps) {
  return (
    <SectionReveal className="case-section" delay={80}>
      <p className="eyebrow">Design Decision</p>
      <h2>The decisions that changed how the product felt.</h2>
      <div className="decision-grid">
        {items.map((item) => (
          <article className="decision-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.rationale}</p>
          </article>
        ))}
      </div>
    </SectionReveal>
  );
}
