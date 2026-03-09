import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import './globals.css';
import { absoluteUrl } from '@/lib/seo';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap'
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dictuzz.me'),
  title: {
    default: 'Private Portfolio',
    template: '%s'
  },
  description: 'Access code required to view this private portfolio.',
  robots: {
    index: false,
    follow: false,
    nocache: true
  },
  alternates: {
    canonical: absoluteUrl('/portfolio/')
  },
  openGraph: {
    title: 'Private Portfolio',
    description: 'Access code required to view this private portfolio.',
    url: absoluteUrl('/portfolio/'),
    siteName: 'Private Portfolio',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Portfolio',
    description: 'Access code required to view this private portfolio.'
  }
};

export default function PortfolioAppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${instrumentSans.variable}`}>
        <div className="site-shell">
          <div className="ambient ambient--one" aria-hidden="true" />
          <div className="ambient ambient--two" aria-hidden="true" />
          {children}
        </div>
      </body>
    </html>
  );
}
