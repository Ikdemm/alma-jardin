import type { Metadata, Viewport } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'Alma Jardín',
    template: '%s · Alma Jardín',
  },
  description:
    'Restaurante Alma Jardín — cocina gourmet en un jardín vivo, inspirada en la naturaleza y el vuelo del colibrí.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Alma Jardín',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#2d4a3e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
