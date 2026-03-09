'use client';

import { SectionReveal } from '@/components/motion/SectionReveal';
import type { ProcessStep } from '@/content/types';

type ProcessRailProps = {
  steps: ProcessStep[];
};

export function ProcessRail({ steps }: ProcessRailProps) {
  return (
    <section className="section" id="process">
      <div className="container">
        <SectionReveal className="section-heading">
          <p className="eyebrow">Process</p>
          <h2>A working process built for busy founders and teams.</h2>
          <p>
            The process stays structured, lightweight, and tied to business goals so teams can move quickly without
            guessing what comes next.
          </p>
        </SectionReveal>
        <div className="process-rail">
          {steps.map((step, index) => (
            <SectionReveal className="process-card" delay={index * 40} key={step.step}>
              <div className="process-card__top">
                <span className="process-step">{step.step}</span>
                <h3>{step.title}</h3>
              </div>
              <p>{step.summary}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
