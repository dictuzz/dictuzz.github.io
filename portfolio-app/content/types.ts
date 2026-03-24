export type ImpactMetric = {
  value: string;
  label: string;
  note?: string;
};

export type SharedSiteConfig = {
  site: {
    name: string;
    domain: string;
    siteUrl: string;
    defaultLocale: string;
    themeColorLight: string;
    themeColorDark: string;
  };
  profile: {
    name: string;
    handle: string;
    title: string;
    description: string;
    longDescription: string;
    motto: string;
    image: {
      portrait: string;
      og: string;
      resumeOg: string;
      alt: string;
    };
    location: {
      city: string;
      countryCode: string;
      countryName: string;
      timeZone: string;
    };
    alumniOf: {
      name: string;
      url: string;
    };
    knowsAbout: string[];
  };
  contact: {
    email: string;
    whatsappLabel: string;
    whatsappUrl: string;
    calendarUrl: string;
  };
  socials: Array<{
    id: string;
    label: string;
    url: string;
    icon: string;
  }>;
  navigation: {
    footer: Array<{
      label: string;
      href: string;
    }>;
  };
  seo: {
    twitterCreator: string;
    keywords: Record<string, string>;
    pages: Record<
      string,
      {
        path: string;
        title: string;
        description: string;
        ogType:
          | 'website'
          | 'profile'
          | 'article'
          | 'book'
          | 'music.song'
          | 'music.album'
          | 'music.playlist'
          | 'music.radio_station'
          | 'video.movie'
          | 'video.episode'
          | 'video.tv_show'
          | 'video.other';
        titleTemplate?: string;
      }
    >;
  };
};

export type EvidenceFact = {
  label: string;
  value: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type NarrativeSection = {
  title: string;
  body: string;
};

export type EvidenceImage = {
  src: string;
  alt: string;
  caption: string;
};

export type CaseBoardStyle = 'newsprint' | 'dossier' | 'bulletin' | 'field';

export type BoardPresentation = {
  recordCode: string;
  status: string;
  preview: string;
  coverImage: string;
  cardStyle: CaseBoardStyle;
  rotation: number;
  quickFacts: EvidenceFact[];
};

export type CaseStudy = {
  slug: string;
  aliases?: string[];
  title: string;
  headline: string;
  category: string;
  organization: string;
  role: string;
  timeline: string;
  location: string;
  summary: string;
  problem: string;
  intervention: string;
  outcome: string;
  evidenceBullets: string[];
  narrative: NarrativeSection[];
  impact: ImpactMetric[];
  scope: string[];
  tools: string[];
  board: BoardPresentation;
  image: EvidenceImage;
  dateline?: string;
  projectUrl?: string;
  githubUrl?: string;
  testimonial?: Testimonial;
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

export type CapabilityCluster = {
  id: string;
  title: string;
  summary: string;
  skills: string[];
};

export type PortfolioHomeData = {
  masthead: {
    archiveLabel: string;
    archiveTitle: string;
    guidance: string;
  };
  hero: {
    name: string;
    designation: string;
    lead: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    quickFacts: EvidenceFact[];
  };
  profile: {
    title: string;
    summary: string;
    philosophy: string;
    note: string;
    facts: EvidenceFact[];
  };
  capabilityClusters: CapabilityCluster[];
  contact: {
    title: string;
    body: string;
    availability: string;
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
