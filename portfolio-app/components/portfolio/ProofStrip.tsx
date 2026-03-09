'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import type { TrustMetric } from '@/content/types';

type ProofStripProps = {
  metrics: TrustMetric[];
};

export function ProofStrip({ metrics }: ProofStripProps) {
  return (
    <SectionReveal className="proof-strip">
      {metrics.map((metric) => (
        <article className="proof-item" key={metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </article>
      ))}
    </SectionReveal>
  );
}
