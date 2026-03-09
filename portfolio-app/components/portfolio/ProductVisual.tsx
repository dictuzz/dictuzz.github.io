'use client';

import type { HeroVisualKey } from '@/content/types';

type ProductVisualProps = {
  variant: HeroVisualKey;
  compact?: boolean;
};

type VisualAsset = {
  src: string;
  alt: string;
  label: string;
  title: string;
  note: string;
  badge: string;
};

const visualAssets: Record<HeroVisualKey, VisualAsset> = {
  dashboard: {
    src: '/portfolio/placeholders/dashboard-cover.svg',
    alt: 'Portfolio cover image showing a premium compliance software concept on a laptop in a light studio setting.',
    label: 'Compliance Product',
    title: 'Risk review platform concept',
    note: 'A calmer product surface for approvals, audit review, and policy decisions.',
    badge: 'Portfolio Preview'
  },
  pricing: {
    src: '/portfolio/placeholders/pricing-cover.svg',
    alt: 'Portfolio cover image showing a premium pricing and packaging experience presented like a product launch visual.',
    label: 'Pricing Experience',
    title: 'Packaging and pricing redesign',
    note: 'A clearer commercial story for teams evaluating plans, spend, and procurement fit.',
    badge: 'Portfolio Preview'
  },
  workflow: {
    src: '/portfolio/placeholders/workflow-cover.svg',
    alt: 'Portfolio cover image showing a healthcare operations workflow concept displayed on a tablet-like device.',
    label: 'Workflow Product',
    title: 'Care coordination system',
    note: 'A service workflow designed to feel calm, dependable, and easy to follow.',
    badge: 'Portfolio Preview'
  },
  analytics: {
    src: '/portfolio/placeholders/analytics-cover.svg',
    alt: 'Portfolio cover image showing an executive operations dashboard concept photographed like a premium product mockup.',
    label: 'Executive Software',
    title: 'Leadership dashboard concept',
    note: 'A decision-focused reporting surface for founders, operators, and leadership teams.',
    badge: 'Portfolio Preview'
  }
};

export function ProductVisual({ variant, compact = false }: ProductVisualProps) {
  const asset = visualAssets[variant];

  return (
    <figure className={`product-visual ${compact ? 'is-compact' : ''}`.trim()}>
      <img
        className="product-visual__image"
        src={asset.src}
        alt={asset.alt}
        width="1400"
        height="900"
        loading={compact ? 'lazy' : 'eager'}
      />
      <figcaption className="product-visual__overlay">
        <p className="product-visual__meta">{asset.label}</p>
        <strong>{asset.title}</strong>
        <span>{asset.note}</span>
      </figcaption>
      {!compact ? <div className="product-visual__badge">{asset.badge}</div> : null}
    </figure>
  );
}
