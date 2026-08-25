import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'Alma Jardín',
  description: 'Restaurante Alma Jardín — plataforma digital',
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
