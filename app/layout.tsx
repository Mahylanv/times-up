import type { Metadata } from 'next';
import './globals.css';
import SwRegister from './components/sw-register';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Thempo',
    template: '%s | Thempo',
  },
  description: "Thempo, un jeu de rapidité et de reflexion pour faire deviner des mots en équipe de plusieurs manières amusantes.",
  applicationName: 'Thempo',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    'thempo',
    'jeu de cartes',
    'jeu de societe',
    'party game',
    'mimes',
    'indices',
    'equipes',
    'chrono',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    siteName: 'Thempo',
    title: 'Thempo',
    description: "Thempo, un jeu de rapidité et de reflexion pour faire deviner des mots en équipe de plusieurs manières amusantes.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Thempo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thempo',
    description: "Thempo, un jeu de rapidité et de reflexion pour faire deviner des mots en équipe de plusieurs manières amusantes.",
    images: ['/og-image.png'],
  },
  authors: [{ name: 'Thempo' }],
  creator: 'Thempo',
  publisher: 'Thempo',
  themeColor: '#0f172a',
  appleWebApp: {
    capable: true,
    title: 'Thempo',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
