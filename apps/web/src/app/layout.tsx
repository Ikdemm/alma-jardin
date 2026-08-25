import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'Alma Jardín',
    template: '%s · Alma Jardín',
  },
  description:
    'Restaurante Alma Jardín — cocina gourmet en un jardín vivo, inspirada en la naturaleza y el vuelo del colibrí.',
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
