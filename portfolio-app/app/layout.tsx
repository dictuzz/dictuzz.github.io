import type { Metadata } from 'next';
import { Fraunces, IM_Fell_English, Inter, Manrope, Playfair_Display, Special_Elite } from 'next/font/google';
import { getSharedSiteConfig } from '@/lib/content';
import './globals.css';

const siteConfig = getSharedSiteConfig();
const portfolioSeo = siteConfig.seo.pages.portfolio;
const absoluteOg = new URL(siteConfig.profile.image.og, siteConfig.site.siteUrl).toString();

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline-face',
  display: 'swap',
});

const imFellEnglish = IM_Fell_English({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-body-face',
  display: 'swap'
});

const specialElite = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono-face',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui-face',
  display: 'swap'
});

/* BRAND-DECISION: Core brand fonts for shared UI elements (nav, footer, links) */
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-brand-display-face',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-brand-body-face',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.siteUrl),
  title: {
    default: portfolioSeo.title,
    template: portfolioSeo.titleTemplate || '%s',
  },
  description: portfolioSeo.description,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: portfolioSeo.title,
    description: portfolioSeo.description,
    url: new URL(portfolioSeo.path, siteConfig.site.siteUrl).toString(),
    siteName: siteConfig.site.name,
    type: portfolioSeo.ogType,
    images: [
      {
        url: absoluteOg,
        alt: siteConfig.profile.image.alt
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: portfolioSeo.title,
    description: portfolioSeo.description,
    creator: siteConfig.seo.twitterCreator,
    images: [absoluteOg]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${imFellEnglish.variable} ${specialElite.variable} ${inter.variable} ${fraunces.variable} ${manrope.variable}`}
    >
      <body>
        {children}
        <div className="film-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
