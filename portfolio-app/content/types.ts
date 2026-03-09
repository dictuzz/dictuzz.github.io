export type HeroVisualKey = 'dashboard' | 'pricing' | 'workflow' | 'analytics';

export type ImpactMetric = {
  value: string;
  label: string;
};

export type Decision = {
  title: string;
  rationale: string;
};

export type InterfaceSolution = {
  title: string;
  body: string;
  visualKey: HeroVisualKey;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type TrustMetric = ImpactMetric & {
  note: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  summary: string;
};

export type CaseStudy = {
  slug: string;
  aliases?: string[];
  title: string;
  category: string;
  summary: string;
  problem: string;
  context: string;
  research: string[];
  uxInsight: string;
  designDecisions: Decision[];
  interfaceSolution: InterfaceSolution[];
  impact: ImpactMetric[];
  testimonial?: Testimonial;
  heroVisual: HeroVisualKey;
  role: string;
  timeline: string;
  scope: string[];
  sector: string;
  outcome: string;
  headline: string;
};

export type InsightSection = {
  title: string;
  body: string;
};

export type Insight = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  thesis: string;
  sections: InsightSection[];
};

export type PortfolioHomeData = {
  hero: {
    name: string;
    role: string;
    positioning: string;
    proofSignal: string;
    primaryCta: string;
    secondaryCta: string;
  };
  proofMetrics: TrustMetric[];
  clientPills: string[];
  testimonial: Testimonial;
  process: ProcessStep[];
  about: {
    story: string;
    philosophy: string;
    industries: string[];
    approach: string[];
  };
  contact: {
    title: string;
    body: string;
    email: string;
    linkedin: string;
    calendar: string;
  };
};

export type ProtectedHomePayload = {
  kind: 'home';
  home: PortfolioHomeData;
  caseStudies: CaseStudy[];
  insights: Insight[];
};

export type ProtectedWorkPayload = {
  kind: 'work';
  caseStudy: CaseStudy;
  related: CaseStudy[];
};

export type ProtectedInsightPayload = {
  kind: 'thinking';
  insight: Insight;
};

export type ProtectedLegacyPayload = {
  kind: 'legacy';
  legacySlug: string;
  target: {
    slug: string;
    title: string;
    category: string;
  };
};

export type ProtectedPayload =
  | ProtectedHomePayload
  | ProtectedWorkPayload
  | ProtectedInsightPayload
  | ProtectedLegacyPayload;
