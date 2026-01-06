import type { Metadata } from 'next';
import './globals.css';
import SwRegister from './components/sw-register';

export const metadata: Metadata = {
  title: 'Times Up Sprint',
  description: 'Mini jeu Times Up en 3 rounds pret pour Vercel',
  applicationName: 'Times Up Sprint',
  manifest: '/manifest.webmanifest',
  themeColor: '#0f172a',
  appleWebApp: {
    capable: true,
    title: 'Times Up Sprint',
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
