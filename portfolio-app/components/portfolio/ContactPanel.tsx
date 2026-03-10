'use client';

import { MagneticButton } from '@/components/motion/MagneticButton';
import { SectionReveal } from '@/components/motion/SectionReveal';
import type { PortfolioHomeData } from '@/content/types';

type ContactPanelProps = {
  contact: PortfolioHomeData['contact'];
};

export function ContactPanel({ contact }: ContactPanelProps) {
  return (
    <section className="section" id="contact">
      <div className="container">
        <SectionReveal className="contact-panel">
          <p className="eyebrow">Contact</p>
          <h2>{contact.title}</h2>
          <p>{contact.body}</p>
          <div className="contact-grid">
            <div className="contact-item">
              <p className="detail-label">Email</p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
            <div className="contact-item">
              <p className="detail-label">LinkedIn</p>
              <a href={contact.linkedin} target="_blank" rel="noreferrer">
                linkedin.com/in/dictuzz
              </a>
            </div>
            <div className="contact-item">
              <p className="detail-label">Calendar</p>
              <a href={contact.calendar} target="_blank" rel="noreferrer">
                Book a conversation
              </a>
            </div>
          </div>
          <div className="button-row">
            <MagneticButton href={`mailto:${contact.email}`}>Email About a Project</MagneticButton>
            <MagneticButton href={contact.calendar} variant="secondary">
              Book an Intro Call
            </MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
