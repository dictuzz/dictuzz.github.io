import type { Metadata } from 'next';
import { Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dictuzz.me'),
  title: {
    default: 'Benedictus Richard Ricardo — Systems Architect',
    template: '%s | dictuzz',
  },
  description:
    'Systems architect and workflow automation specialist. Turning complexity into clear systems and dependable execution.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Benedictus Richard Ricardo — Systems Architect',
    description:
      'Systems architect and workflow automation specialist. Turning complexity into clear systems and dependable execution.',
    url: 'https://dictuzz.me/portfolio/',
    siteName: 'dictuzz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benedictus Richard Ricardo',
    description: 'Systems Architect & Workflow Automation Specialist',
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
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <div className="film-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
