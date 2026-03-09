'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import { ProductVisual } from '@/components/portfolio/ProductVisual';
import type { InterfaceSolution } from '@/content/types';

type InterfaceShowcaseProps = {
  items: InterfaceSolution[];
};

export function InterfaceShowcase({ items }: InterfaceShowcaseProps) {
  return (
    <SectionReveal className="case-section" delay={120}>
      <p className="eyebrow">Interface Solution</p>
      <h2>The main product surfaces behind the final direction.</h2>
      <div className="interface-grid">
        {items.map((item) => (
          <article className="interface-card" key={item.title}>
            <ProductVisual variant={item.visualKey} compact />
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionReveal>
  );
}
