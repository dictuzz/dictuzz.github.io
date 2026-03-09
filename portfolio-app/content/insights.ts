import type { Insight } from './types';

export const insights: Insight[] = [
  {
    slug: 'why-most-saas-dashboards-fail',
    title: 'Why Most SaaS Dashboards Fail',
    kicker: 'Product Strategy',
    summary:
      'Most dashboards fail for a simple reason: they show too much information and guide too little action.',
    thesis:
      'A dashboard becomes useful when it helps people decide what matters now. When everything on screen looks equally important, the product turns into a report archive instead of a decision tool.',
    sections: [
      {
        title: 'Too much data feels responsible, but often is not',
        body:
          'Many teams mistake completeness for quality. In practice, the more crowded the screen becomes, the harder it is to see what actually requires attention.'
      },
      {
        title: 'Strong products create a clear sense of priority',
        body:
          'The best dashboards make it obvious what is healthy, what is drifting, and what needs a decision soon. That clarity is a design choice, not a happy accident.'
      },
      {
        title: 'Leadership trust comes from focus',
        body:
          'Executives trust products that help them move quickly without feeling reckless. That happens when the product compresses the truth well, not when it shows every possible metric at once.'
      }
    ]
  },
  {
    slug: 'designing-trust-into-pricing',
    title: 'Designing Trust Into Pricing Surfaces',
    kicker: 'Commercial Design',
    summary:
      'A pricing page does more than explain cost. It tells buyers whether the company feels clear, predictable, and ready for serious business.',
    thesis:
      'Great pricing design reduces doubt. It helps customers understand what they are buying, what they can expect over time, and whether the business feels disciplined enough to trust.',
    sections: [
      {
        title: 'Predictability matters as much as persuasion',
        body:
          'People are not only comparing plan features. They are asking whether future cost will feel manageable or become an unpleasant surprise.'
      },
      {
        title: 'Important commercial details should not feel hidden',
        body:
          'Billing logic, controls, procurement readiness, and account governance all shape buying confidence. When those details are buried, the product feels less mature.'
      },
      {
        title: 'The best pricing surfaces support internal approval',
        body:
          'A strong buying experience helps champions explain the decision to finance, procurement, and leadership. That is often where real conversion is won.'
      }
    ]
  },
  {
    slug: 'the-quiet-ux-of-operational-products',
    title: 'The Quiet UX of Operational Products',
    kicker: 'Operational UX',
    summary:
      'The best operational products do not feel loud or impressive. They feel clear, steady, and hard to misuse.',
    thesis:
      'Operational software succeeds when it reduces background friction. Teams should not have to remember the process, guess the next step, or search for context under pressure.',
    sections: [
      {
        title: 'Calm is a practical product quality',
        body:
          'When a product feels calm, teams make fewer avoidable mistakes, hand off work more cleanly, and spend less energy trying to interpret the interface.'
      },
      {
        title: 'Good workflow design protects context',
        body:
          'Operational products work best when information stays connected across stages, roles, and handoffs. That continuity is what makes the system feel dependable.'
      },
      {
        title: 'Clear accountability improves performance',
        body:
          'Products become stronger when ownership, next step, and consequence are visible inside the interface itself. Clear products help teams do better work with less friction.'
      }
    ]
  }
];
