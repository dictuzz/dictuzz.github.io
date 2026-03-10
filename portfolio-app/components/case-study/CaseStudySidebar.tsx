'use client';

import type { CaseStudy } from '@/content/types';

type CaseStudySidebarProps = {
  caseStudy: CaseStudy;
};

export function CaseStudySidebar({ caseStudy }: CaseStudySidebarProps) {
  return (
    <aside className="case-sidebar">
      <div className="sidebar-card">
        <div>
          <p className="detail-label">Role</p>
          <p className="detail-value">{caseStudy.role}</p>
        </div>
        <div>
          <p className="detail-label">Timeline</p>
          <p className="detail-value">{caseStudy.timeline}</p>
        </div>
        <div>
          <p className="detail-label">Sector</p>
          <p className="detail-value">{caseStudy.sector}</p>
        </div>
        <div>
          <p className="detail-label">Scope</p>
          <ul className="detail-list">
            {caseStudy.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="detail-label">Impact</p>
          <div className="metric-mini-grid">
            {caseStudy.impact.map((item) => (
              <article className="metric-mini" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
