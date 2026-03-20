import type { Metadata } from 'next';

export const siteUrl = 'https://dictuzz.me';
export const portfolioBasePath = '/portfolio';

export function absoluteUrl(path = '') {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  noIndex = false
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true
        }
      : {
          index: true,
          follow: true
        },
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'dictuzz',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}
