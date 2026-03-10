'use client';

import Link from 'next/link';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { PortfolioHeader } from '@/components/portfolio/PortfolioHeader';
import { ArticleHero } from '@/components/thinking/ArticleHero';
import { ArticleSection } from '@/components/thinking/ArticleSection';
import type { Insight } from '@/content/types';

type InsightPageProps = {
  insight: Insight;
};

export function InsightPage({ insight }: InsightPageProps) {
  return (
    <>
      <PortfolioHeader />
      <main className="page-main">
        <div className="container article-page">
          <Link className="inline-link" href="/" prefetch={false}>
            Back to Work
          </Link>
          <ArticleHero insight={insight} />
          <div className="article-stack">
            {insight.sections.map((section, index) => (
              <ArticleSection key={section.title} section={section} delay={index * 50} />
            ))}
          </div>
          <div className="contact-panel contact-panel--compact">
            <p className="eyebrow">Next Step</p>
            <h2>If your product needs this level of clarity, let's talk.</h2>
            <p>
              I work with teams that want design to improve trust, conversion, and product maturity, not just visual
              polish.
            </p>
            <div className="button-row">
              <MagneticButton href="/#selected-work">Review Case Studies</MagneticButton>
              <MagneticButton href="/#contact" variant="secondary">
                Start a Conversation
              </MagneticButton>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
