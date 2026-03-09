import type { CaseStudy } from './types';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'atlas-risk-console',
    aliases: ['atlas-governance-framework', 'civic-service-blueprint'],
    title: 'Atlas Risk Console',
    category: 'Compliance Infrastructure',
    summary:
      'Atlas turned a dense compliance tool into a product that felt safer, clearer, and easier to trust during both daily use and buyer review.',
    problem:
      'The platform was powerful, but it never felt simple or dependable. Review teams had to jump across multiple screens to answer basic questions, which slowed approvals and made the product feel riskier than it really was.',
    context:
      'The company was moving upmarket and needed the product to stand up in front of larger buyers, security teams, and executives. The redesign had to improve daily usability while also making the business look more mature in demos and implementation.',
    research: [
      'Interviewed reviewers, operations leads, and product stakeholders to understand where confidence dropped during approval work.',
      'Mapped the current flow and found that people were repeatedly leaving the main screen to confirm ownership, policy status, and change history.',
      'Reviewed competitor products and saw that the strongest ones felt calm not because they were simpler, but because they ordered information more carefully.'
    ],
    uxInsight:
      'Trust grows when the product explains itself. People move faster when the interface shows what matters, what changed, and what happens next without sending them on a hunt.',
    designDecisions: [
      {
        title: 'Moved the most important signals to the first screen',
        rationale:
          'Teams could now see unresolved risk, approval urgency, and ownership status immediately instead of piecing the story together from several views.'
      },
      {
        title: 'Kept supporting evidence close to the decision',
        rationale:
          'Policy notes, history, and affected teams stayed near the action, which reduced hesitation and prevented accidental approvals.'
      },
      {
        title: 'Made the product feel calmer without making it feel smaller',
        rationale:
          'The new hierarchy reduced visual noise while keeping the depth needed for serious enterprise work.'
      }
    ],
    interfaceSolution: [
      {
        title: 'New review overview for risk and approvals',
        body: 'A clearer home screen helped reviewers understand status, urgency, and ownership in one pass.',
        visualKey: 'dashboard'
      },
      {
        title: 'Evidence view for policy and audit context',
        body: 'Supporting information stayed visible so users could move forward with more confidence and less backtracking.',
        visualKey: 'analytics'
      },
      {
        title: 'Approval flow designed around accountability',
        body: 'Actions, ownership, and consequence were aligned so the product felt more dependable in live decision moments.',
        visualKey: 'workflow'
      }
    ],
    impact: [
      { value: '-37%', label: 'faster approval cycle time' },
      { value: '+28%', label: 'higher reviewer confidence' },
      { value: '-41%', label: 'fewer exceptions escalated manually' }
    ],
    testimonial: {
      quote:
        'This was the first version of the product that felt enterprise-ready the moment you opened it.',
      author: 'Program Lead',
      role: 'Risk Operations, Enterprise SaaS'
    },
    heroVisual: 'dashboard',
    role: 'Lead product designer across product structure, interface direction, and approval workflow design.',
    timeline: '12-week concept sprint',
    scope: ['Risk overview', 'Approval workflow', 'Decision support', 'Audit-ready reporting'],
    sector: 'Enterprise SaaS',
    outcome:
      'The redesign gave the company a product that felt more credible in front of buyers and more dependable for the teams using it every day.',
    headline: 'A complex compliance product redesigned to feel safer, clearer, and easier to trust.'
  },
  {
    slug: 'meridian-pricing-studio',
    aliases: ['meridian-knowledge-studio'],
    title: 'Meridian Pricing Studio',
    category: 'Revenue Design Systems',
    summary:
      'Meridian transformed a confusing pricing journey into a clearer commercial experience that felt easier to buy and easier to explain internally.',
    problem:
      'The pricing model had evolved, but the interface had not. Plans, usage, and add-ons were technically accurate, yet customers still struggled to understand what they would pay and why.',
    context:
      'The business was growing into larger accounts, where pricing clarity mattered as much as the product itself. The work had to support self-serve evaluation, sales conversations, and internal buyer handoff all at once.',
    research: [
      'Reviewed buyer questions from sales calls, onboarding conversations, and pricing-related support requests.',
      'Compared self-serve pricing pages, proposal flows, and billing setup experiences to find where commercial trust often breaks down.',
      'Grouped objections into three recurring themes: cost predictability, governance readiness, and internal approval confidence.'
    ],
    uxInsight:
      'Pricing is one of the fastest ways a company proves maturity. When buyers understand cost, controls, and next steps quickly, the product feels safer to commit to.',
    designDecisions: [
      {
        title: 'Changed pricing from comparison mode to guidance mode',
        rationale:
          'Instead of forcing users to read a dense table, the redesign helped them understand which plan fit their team and why.'
      },
      {
        title: 'Put enterprise trust details next to the plan itself',
        rationale:
          'Billing controls, procurement readiness, and account governance were surfaced early instead of being buried in secondary content.'
      },
      {
        title: 'Made the chosen package easier to share internally',
        rationale:
          'Buyers could leave with a simple summary that made the decision easier to explain to finance, procurement, and leadership.'
      }
    ],
    interfaceSolution: [
      {
        title: 'Guided pricing surface for plan selection',
        body: 'The main pricing view helped teams understand fit, expected spend, and tradeoffs without feeling overwhelmed.',
        visualKey: 'pricing'
      },
      {
        title: 'Trust details built into the buying flow',
        body: 'Important commercial details appeared close to the decision instead of hiding in documentation or late-stage sales follow-up.',
        visualKey: 'dashboard'
      },
      {
        title: 'Board-ready summary for internal approval',
        body: 'Selected plans resolved into a clean package summary that buyers could share with the rest of the business.',
        visualKey: 'analytics'
      }
    ],
    impact: [
      { value: '+41%', label: 'higher plan selection completion' },
      { value: '-24%', label: 'fewer pricing clarification calls' },
      { value: '+19%', label: 'more enterprise-qualified leads' }
    ],
    testimonial: {
      quote:
        'The new pricing experience finally made us feel like a serious company with a serious commercial model.',
      author: 'VP Growth',
      role: 'Developer Infrastructure Platform'
    },
    heroVisual: 'pricing',
    role: 'Lead designer across pricing strategy translation, interface design, and conversion flow clarity.',
    timeline: '9-week pricing redesign',
    scope: ['Pricing structure', 'Plan selection', 'Commercial trust', 'Internal handoff'],
    sector: 'Developer Infrastructure',
    outcome:
      'The company gained a pricing experience that converted more clearly, supported larger deals, and felt far more mature in market.',
    headline: 'A pricing redesign that made the product easier to buy and easier to trust.'
  },
  {
    slug: 'northline-command-center',
    aliases: ['northstar-ops-intelligence'],
    title: 'Northline Command Center',
    category: 'Executive Operations Software',
    summary:
      'Northline reframed a dashboard-heavy reporting culture into a cleaner operating product built for faster leadership decisions.',
    problem:
      'Leaders already had access to plenty of data, but the dashboards were not helping them act. Important changes were easy to miss because everything on screen looked equally important.',
    context:
      'The company was growing beyond founder intuition and needed a more disciplined operating rhythm. The product had to help leadership teams review performance quickly, spot issues earlier, and leave meetings with clearer next steps.',
    research: [
      'Observed weekly operating reviews to understand what leaders actually looked for when deciding where to intervene.',
      'Separated vanity metrics from decision metrics so the design could focus on consequence instead of just reporting.',
      'Tested different levels of information density to find a format that felt strategic rather than analytical for its own sake.'
    ],
    uxInsight:
      'Leaders do not need more dashboards. They need a product that makes change, risk, and next action obvious enough to discuss quickly and act on with confidence.',
    designDecisions: [
      {
        title: 'Organized the product around weekly decision-making',
        rationale:
          'The new structure highlighted what required discussion now, what could wait, and where the business was quietly drifting off track.'
      },
      {
        title: 'Made signal hierarchy more important than data volume',
        rationale:
          'Strong prioritization helped leadership teams spend less time reading and more time deciding.'
      },
      {
        title: 'Connected issues to follow-up action',
        rationale:
          'The redesign reduced the gap between insight and accountability by tying surfaced problems to owners and review timing.'
      }
    ],
    interfaceSolution: [
      {
        title: 'Leadership overview designed for faster reviews',
        body: 'The primary screen highlighted material changes, business health, and open decisions without requiring deep dashboard navigation.',
        visualKey: 'analytics'
      },
      {
        title: 'Shared structure across team-level views',
        body: 'Each function saw a version of the same operating language, which made cross-functional review more coherent.',
        visualKey: 'dashboard'
      },
      {
        title: 'Action follow-up built into the operating flow',
        body: 'Important issues did not end as observations; they turned into visible next steps with owners and timing.',
        visualKey: 'workflow'
      }
    ],
    impact: [
      { value: '-32%', label: 'less time preparing weekly reviews' },
      { value: '+3.1x', label: 'faster leadership decision throughput' },
      { value: '+22%', label: 'stronger cross-functional accountability' }
    ],
    testimonial: {
      quote:
        'It felt less like a dashboard and more like an operating system for the leadership team.',
      author: 'Chief of Staff',
      role: 'Multi-Product SaaS Company'
    },
    heroVisual: 'analytics',
    role: 'Lead designer for information hierarchy, leadership workflow design, and executive product direction.',
    timeline: '10-week product definition sprint',
    scope: ['Leadership dashboard', 'Operating cadence', 'Signal hierarchy', 'Action tracking'],
    sector: 'B2B SaaS',
    outcome:
      'The product gave leadership a clearer, faster way to review the business and align around what needed attention most.',
    headline: 'A leadership dashboard redesigned to support decisions, not just reporting.'
  },
  {
    slug: 'sable-care-orchestrator',
    aliases: ['signal-room-live-experience', 'terrain-readiness-lab'],
    title: 'Sable Care Orchestrator',
    category: 'Healthcare Workflow Design',
    summary:
      'Sable made a fragmented care operations flow feel calmer, more coordinated, and easier for staff to trust under pressure.',
    problem:
      'The product handled the full patient journey, but key information was spread across too many screens. Staff had to carry the workflow in their heads, which increased handoff errors and slowed service coordination.',
    context:
      'The organization was balancing service quality with growing patient volume. The redesign needed to reduce operational friction while still feeling human, supportive, and appropriate for a care setting.',
    research: [
      'Mapped the intake-to-follow-through journey across front desk, nursing, and care coordination roles.',
      'Identified where missing context created patient frustration, repeat work, or delayed next steps.',
      'Reviewed healthcare workflow products and found that many optimized for record keeping more than team clarity.'
    ],
    uxInsight:
      'In care operations, calm is functional. Teams work better when the product preserves context, reduces ambiguity, and makes the next step hard to misread.',
    designDecisions: [
      {
        title: 'Centered the product on patient state instead of department state',
        rationale:
          'This kept the care journey understandable across roles and reduced hidden gaps during handoff.'
      },
      {
        title: 'Showed readiness before the next action',
        rationale:
          'Documents, approvals, and blockers appeared before staff moved the journey forward, which reduced avoidable mistakes.'
      },
      {
        title: 'Used visual calm as an operational tool',
        rationale:
          'Spacing, rhythm, and sequence helped the product feel easier to read under pressure without removing important detail.'
      }
    ],
    interfaceSolution: [
      {
        title: 'Patient journey view with clear ownership',
        body: 'Teams could see status, next step, and role responsibility in one place rather than stitching the story together manually.',
        visualKey: 'workflow'
      },
      {
        title: 'Readiness checks before coordination work',
        body: 'Staff saw missing documents, approvals, and blockers before the case moved on to the next stage.',
        visualKey: 'dashboard'
      },
      {
        title: 'Operations view for service leaders',
        body: 'Managers gained a cleaner view of flow health, staffing pressure, and handoff risk across the system.',
        visualKey: 'analytics'
      }
    ],
    impact: [
      { value: '-29%', label: 'shorter patient intake completion' },
      { value: '-34%', label: 'fewer handoff-related service issues' },
      { value: '+18%', label: 'higher staff confidence in daily flow' }
    ],
    testimonial: {
      quote:
        'It felt more humane and more operationally reliable at the same time, which was exactly the balance we needed.',
      author: 'Director of Care Operations',
      role: 'Outpatient Network'
    },
    heroVisual: 'workflow',
    role: 'Lead designer for service flow design, workflow clarity, and trust-critical operational UX.',
    timeline: '11-week service design concept',
    scope: ['Patient intake', 'Care coordination', 'Operational oversight', 'Readiness systems'],
    sector: 'Digital Health',
    outcome:
      'The redesign reduced friction for staff, improved service continuity, and gave the organization a calmer operational product to grow with.',
    headline: 'A care coordination product redesigned to feel calm, clear, and dependable.'
  }
];
