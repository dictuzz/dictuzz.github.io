import type { Metadata } from 'next';
import { IM_Fell_English, Inter, Playfair_Display, Special_Elite } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://dictuzz.me'),
  title: {
    default: 'Benedictus Richard Ricardo — Detective Case Board',
    template: '%s | dictuzz',
  },
  description:
    'A cinematic detective case board portfolio documenting workflow automation, governance, live operations, and technical readiness.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Benedictus Richard Ricardo — Detective Case Board',
    description:
      'An atmospheric newspaper-and-evidence-wall portfolio focused on systems, automation, governance, and dependable execution.',
    url: 'https://dictuzz.me/portfolio/',
    siteName: 'dictuzz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benedictus Richard Ricardo',
    description: 'Detective case board portfolio for systems, automation, governance, and field-ready execution.',
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
      className={`${playfairDisplay.variable} ${imFellEnglish.variable} ${specialElite.variable} ${inter.variable}`}
    >
      <body>
        {children}
        <div className="film-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
