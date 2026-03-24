import type { Metadata } from 'next';
import { getSharedSiteConfig } from './content';

const siteConfig = getSharedSiteConfig();
export const siteUrl = siteConfig.site.siteUrl;
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
  const titled = `${title} · ${siteConfig.profile.title}`;
  const imageUrl = absoluteUrl(siteConfig.profile.image.og);

  return {
    title: titled,
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
      title: titled,
      description,
      url,
      siteName: siteConfig.site.name,
      images: [
        {
          url: imageUrl,
          alt: siteConfig.profile.image.alt
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: titled,
      description,
      creator: siteConfig.seo.twitterCreator,
      images: [imageUrl]
    }
  };
}
