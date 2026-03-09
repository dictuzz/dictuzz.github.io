'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import type { Insight } from '@/content/types';

type ArticleHeroProps = {
  insight: Insight;
};

export function ArticleHero({ insight }: ArticleHeroProps) {
  return (
    <SectionReveal className="article-hero">
      <p className="eyebrow">{insight.kicker}</p>
      <h1 className="page-title">{insight.title}</h1>
      <p className="page-intro">{insight.summary}</p>
      <div className="hero-proof hero-proof--case">
        <p>{insight.thesis}</p>
      </div>
    </SectionReveal>
  );
}
