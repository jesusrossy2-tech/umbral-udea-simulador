import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://umbral-udea-simulador.ciovonhorst.chatgpt.site'),
  title: 'Umbral UdeA — Simulador de admisión',
  description: 'Simulacros UdeA construidos desde exámenes históricos verificados.',
  openGraph: {
    title: 'Umbral UdeA — Simulador de admisión',
    description: 'Simulador de admisión basado en exámenes históricos.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Umbral UdeA — Simulador de admisión',
    description: 'Simulador de admisión basado en exámenes históricos.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
