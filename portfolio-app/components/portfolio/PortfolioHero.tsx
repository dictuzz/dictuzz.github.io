'use client';

import { MagneticButton } from '@/components/motion/MagneticButton';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { ProductVisual } from '@/components/portfolio/ProductVisual';
import type { PortfolioHomeData } from '@/content/types';

type PortfolioHeroProps = {
  hero: PortfolioHomeData['hero'];
};

export function PortfolioHero({ hero }: PortfolioHeroProps) {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <SectionReveal className="hero-copy">
          <div className="hero-kicker-row">
            <p className="eyebrow">Portfolio</p>
            <span className="hero-kicker-note">Design for software companies that need to look credible quickly.</span>
          </div>
          <div className="hero-identity">
            <p className="hero-name">{hero.name}</p>
            <span className="hero-identity-separator" aria-hidden="true">
              /
            </span>
            <p className="hero-role">{hero.role}</p>
          </div>
          <h1 className="hero-title">{hero.positioning}</h1>
          <div className="hero-proof">
            <p>{hero.proofSignal}</p>
          </div>
          <div className="button-row">
            <MagneticButton href="/#selected-work">{hero.primaryCta}</MagneticButton>
            <MagneticButton href="/#contact" variant="secondary">
              {hero.secondaryCta}
            </MagneticButton>
          </div>
        </SectionReveal>
        <SectionReveal className="hero-visual-shell" delay={80}>
          <div className="hero-visual-frame">
            <ProductVisual variant="dashboard" />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
