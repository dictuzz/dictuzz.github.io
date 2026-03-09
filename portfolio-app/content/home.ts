import type { PortfolioHomeData } from './types';

export const homeContent: PortfolioHomeData = {
  hero: {
    name: 'Benedictus Richard Ricardo',
    role: 'Product Designer for B2B Software',
    positioning: 'I help software companies look clearer, feel more valuable, and earn trust faster.',
    proofSignal:
      'I design websites, products, and key customer journeys for founders who need their company to feel more mature from the first impression to everyday use.',
    primaryCta: 'View Selected Work',
    secondaryCta: 'Start a Conversation'
  },
  proofMetrics: [
    {
      value: '12+',
      label: 'years shaping digital products',
      note: 'Experience across new ventures, product redesigns, and interface systems for growing software companies.'
    },
    {
      value: '28',
      label: 'launches across SaaS and platform teams',
      note: 'Work delivered across onboarding, dashboards, monetization, internal tools, and core workflow products.'
    },
    {
      value: '$180M+',
      label: 'commercial decisions influenced',
      note: 'Product, website, and conversion improvements that helped teams sell with more confidence and clarity.'
    }
  ],
  clientPills: ['B2B SaaS', 'Fintech', 'Developer Tools', 'Operations Software', 'Digital Health'],
  testimonial: {
    quote:
      'The work made us look like a far more mature company. The product felt easier to understand, easier to demo, and much easier to trust.',
    author: 'Maya Chen',
    role: 'Founder, Arc Ledger'
  },
  process: [
    {
      step: '01',
      title: 'Discovery',
      summary: 'Understand the business goal, the customer tension, and what currently feels unclear or weak.'
    },
    {
      step: '02',
      title: 'Research',
      summary: 'Review behavior, objections, and handoff points so the right problems are being solved first.'
    },
    {
      step: '03',
      title: 'Structure',
      summary: 'Define the product flow, content hierarchy, and decision points before polishing visuals.'
    },
    {
      step: '04',
      title: 'Design',
      summary: 'Shape an interface that feels credible, calm, and easy to understand at a glance.'
    },
    {
      step: '05',
      title: 'Validation',
      summary: 'Check whether the work reads clearly, reduces confusion, and supports the intended action.'
    },
    {
      step: '06',
      title: 'Launch',
      summary: 'Ship with a clear rollout plan and measure whether trust, adoption, or conversion actually improved.'
    }
  ],
  about: {
    story:
      'I run a small independent design practice focused on software companies that need to look sharper, clearer, and more ready for serious customers.',
    philosophy:
      'Good design is not decoration. It helps people understand the product faster, trust the business more quickly, and make better decisions with less friction.',
    industries: ['Enterprise SaaS', 'Developer Infrastructure', 'Fintech Platforms', 'Digital Health'],
    approach: [
      'Business clarity before visual polish',
      'Simple language before clever language',
      'Trust built into the product, not added as a marketing layer afterward'
    ]
  },
  contact: {
    title: 'Available for a small number of product design engagements.',
    body:
      'Best suited to founders and product teams who need a more credible website, a clearer product experience, or a sharper customer journey.',
    email: 'contact@dictuzz.me',
    linkedin: 'https://linkedin.com/in/dictuzz',
    calendar: 'https://calendar.app.google/39u2qGH6ybaFenhdA'
  }
};
