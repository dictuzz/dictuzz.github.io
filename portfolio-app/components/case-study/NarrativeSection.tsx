'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';

type NarrativeSectionProps = {
  kicker: string;
  title: string;
  body: string | string[];
  delay?: number;
};

export function NarrativeSection({ kicker, title, body, delay = 0 }: NarrativeSectionProps) {
  return (
    <SectionReveal className="case-section" delay={delay}>
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {Array.isArray(body) ? (
        <ul className="detail-list detail-list--spacious">
          {body.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{body}</p>
      )}
    </SectionReveal>
  );
}
