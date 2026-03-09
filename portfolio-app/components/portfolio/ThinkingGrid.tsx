'use client';

import Link from 'next/link';
import { SectionReveal } from '@/components/motion/SectionReveal';
import type { Insight } from '@/content/types';

type ThinkingGridProps = {
  insights: Insight[];
};

export function ThinkingGrid({ insights }: ThinkingGridProps) {
  return (
    <section className="section" id="thinking">
      <div className="container">
        <SectionReveal className="section-heading">
          <p className="eyebrow">Design Thinking</p>
          <h2>How I think about product trust.</h2>
          <p>These short essays make the strategy visible before we ever have a call.</p>
        </SectionReveal>
        <div className="thinking-grid">
          {insights.map((insight, index) => (
            <SectionReveal className="thinking-card" key={insight.slug} delay={index * 50}>
              <p className="detail-label">{insight.kicker}</p>
              <h3>{insight.title}</h3>
              <p>{insight.summary}</p>
              <Link className="inline-link" href={`/thinking/${insight.slug}`} prefetch={false}>
                Read Insight
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
