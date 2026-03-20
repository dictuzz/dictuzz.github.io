import type { PortfolioHomeData } from './types';

export const homeContent: PortfolioHomeData = {
  masthead: {
    archiveLabel: 'The Universal Archive',
    archiveTitle: 'Operational Record.',
    guidance: 'Scroll to investigate the wall. Open any pinned case to inspect the short file or jump to the full dossier.'
  },
  hero: {
    name: 'Benedictus Richard Ricardo',
    designation: 'Systems Architect & Workflow Automation Specialist',
    lead: 'I build operating systems for real work: reporting, governance, live execution, and technical readiness.',
    body:
      'This portfolio is arranged like an evidence wall because the work itself is investigative. Find the friction. Trace the pattern. Build the structure. Measure the effect.',
    primaryCta: 'Open Primary Case',
    secondaryCta: 'Contact Dispatch',
    quickFacts: [
      {
        label: 'Base',
        value: 'Jakarta / Bangkok friendly'
      },
      {
        label: 'Focus',
        value: 'Ops, automation, governance'
      },
      {
        label: 'Current lane',
        value: 'Systems-minded execution'
      }
    ]
  },
  profile: {
    title: 'Profile Dossier',
    summary:
      'I work best in environments where operations are complex, ownership is distributed, and the cost of confusion is real. My role is usually some mix of investigator, systems builder, and execution stabilizer.',
    philosophy:
      'Good systems do not feel complicated when they are used. They make the next step obvious, reduce wasted motion, and help people act with more confidence under pressure.',
    note:
      'Alongside hands-on operational work, I am studying Data Science and continuing to refine the way process design, evidence, and execution fit together.',
    facts: [
      {
        label: 'Working style',
        value: 'Structured, calm, evidence-led'
      },
      {
        label: 'Primary value',
        value: 'Turning repeated friction into dependable routine'
      },
      {
        label: 'Signature move',
        value: 'Systems before spectacle'
      }
    ]
  },
  capabilityClusters: [
    {
      id: 'systems',
      title: 'Systems Architecture',
      summary: 'Define the operating model, the handoff points, and the evidence needed for a process to remain stable.',
      skills: ['Process mapping', 'Decision flow design', 'Operational structure', 'Standards and controls']
    },
    {
      id: 'automation',
      title: 'Workflow Automation',
      summary: 'Remove repetitive work from recurring cycles and replace it with tools people can actually maintain.',
      skills: ['Excel automation', 'Reporting systems', 'SOP design', 'Recurring workflow cleanup']
    },
    {
      id: 'governance',
      title: 'Governance & Leadership',
      summary: 'Create rhythm, accountability, and clarity across teams that need a cleaner operating cadence.',
      skills: ['KPI governance', 'Team leadership', 'Program structure', 'Cross-division coordination']
    },
    {
      id: 'execution',
      title: 'Live Operations',
      summary: 'Keep execution steady when timing, sequencing, and reliability matter in front of real people.',
      skills: ['Stage coordination', 'Run-of-show planning', 'Risk reduction', 'On-site decision making']
    },
    {
      id: 'readiness',
      title: 'Training & Readiness',
      summary: 'Support technical preparedness through equipment discipline, practice structure, and controlled repetition.',
      skills: ['Equipment readiness', 'Training support', 'Safety discipline', 'Field coordination']
    }
  ],
  contact: {
    title: 'Available for a focused set of systems, automation, and operations conversations.',
    body:
      'Best fit for teams or roles that need cleaner execution, more dependable process design, or stronger operational structure.',
    availability: 'Open to conversations across GMT+7 and nearby time zones.',
    email: 'contact@dictuzz.me',
    linkedin: 'https://linkedin.com/in/dictuzz',
    calendar: 'https://calendar.app.google/39u2qGH6ybaFenhdA'
  }
};
