'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import type { PortfolioHomeData } from '@/content/types';

type TrustBandProps = {
  clientPills: PortfolioHomeData['clientPills'];
  metrics: PortfolioHomeData['proofMetrics'];
  testimonial: PortfolioHomeData['testimonial'];
};

export function TrustBand({ clientPills, metrics, testimonial }: TrustBandProps) {
  return (
    <section className="section" id="trust">
      <div className="container">
        <SectionReveal className="section-heading">
          <p className="eyebrow">Trust Signals</p>
          <h2>Enough proof to understand the level of work.</h2>
          <p>A good portfolio should feel clear even if you have never worked with a designer before.</p>
        </SectionReveal>
        <div className="trust-grid">
          <SectionReveal className="trust-card trust-card--contexts">
            <p className="detail-label">Focus Areas</p>
            <h3>Work that helps software companies feel more credible.</h3>
            <p className="trust-copy">
              The best results usually happen in products where clarity directly affects trust, buying confidence, and
              day-to-day usability.
            </p>
            <div className="pill-row">
              {clientPills.map((pill) => (
                <span className="pill" key={pill}>
                  {pill}
                </span>
              ))}
            </div>
          </SectionReveal>
          <SectionReveal className="trust-card trust-card--metrics" delay={60}>
            <p className="detail-label">Selected Signals</p>
            <div className="metric-stack">
              {metrics.map((metric) => (
                <article className="metric-item" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <div>
                    <span>{metric.label}</span>
                    <p>{metric.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </SectionReveal>
          <SectionReveal className="trust-card trust-card--quote" delay={120}>
            <p className="detail-label">Client Note</p>
            <h3>{testimonial.quote}</h3>
            <p className="quote-source">
              {testimonial.author}
              <span>{testimonial.role}</span>
            </p>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
