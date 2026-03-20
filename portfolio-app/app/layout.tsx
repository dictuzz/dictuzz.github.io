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
    default: 'dictuzz · Systems Architect & Automation Specialist',
    template: '%s · Systems Architect & Automation Specialist | dictuzz',
  },
  description:
    'Building systems that scale operations and eliminate friction.',
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
    title: 'dictuzz · Systems Architect & Automation Specialist',
    description: 'Building systems that scale operations and eliminate friction.',
    url: 'https://dictuzz.me/portfolio/',
    siteName: 'dictuzz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dictuzz · Systems Architect & Automation Specialist',
    description: 'Building systems that scale operations and eliminate friction.',
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
