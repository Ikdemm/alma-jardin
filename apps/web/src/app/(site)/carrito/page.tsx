import type { Metadata } from 'next';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';
import styles from '../site.module.css';

export const metadata: Metadata = buildPageMetadata({
  title: 'Carrito',
  description: 'Revisa los productos en tu carrito de Alma Jardín.',
  path: '/carrito',
});

export default function CarritoPage() {
  return (
    <div className={styles.container}>
      <section className={styles.pageHero}>
        <p className={styles.eyebrow}>Tienda</p>
        <h1>Carrito</h1>
        <p className={styles.sectionLead}>Tu carrito está vacío por ahora.</p>
        <Link href="/tienda" className={styles.primaryButton}>
          Ver tienda
        </Link>
      </section>
    </div>
  );
}
