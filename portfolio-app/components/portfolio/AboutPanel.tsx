'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import type { PortfolioHomeData } from '@/content/types';

type AboutPanelProps = {
  about: PortfolioHomeData['about'];
};

export function AboutPanel({ about }: AboutPanelProps) {
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <SectionReveal className="about-card about-card--primary">
          <p className="eyebrow">About</p>
          <h2>A senior product design practice for companies that need to look ready.</h2>
          <p>{about.story}</p>
          <p>{about.philosophy}</p>
        </SectionReveal>
        <SectionReveal className="about-card" delay={60}>
          <p className="detail-label">Sectors</p>
          <div className="pill-row">
            {about.industries.map((industry) => (
              <span className="pill" key={industry}>
                {industry}
              </span>
            ))}
          </div>
          <p className="detail-label detail-label--spaced">Working Style</p>
          <ul className="detail-list">
            {about.approach.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
}
