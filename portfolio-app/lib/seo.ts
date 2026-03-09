import type { Metadata } from 'next';

export const siteUrl = 'https://dictuzz.me';
export const portfolioBasePath = '/portfolio';

export function absoluteUrl(path = '') {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true
    },
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Private Portfolio',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}
