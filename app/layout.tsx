import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Times Up Sprint',
  description: 'Mini jeu Times Up en 3 rounds prêt pour Vercel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
