'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import type { InsightSection } from '@/content/types';

type ArticleSectionProps = {
  section: InsightSection;
  delay?: number;
};

export function ArticleSection({ section, delay = 0 }: ArticleSectionProps) {
  return (
    <SectionReveal className="article-section" delay={delay}>
      <h2>{section.title}</h2>
      <p>{section.body}</p>
    </SectionReveal>
  );
}
