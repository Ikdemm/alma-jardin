import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPriceCents, whatsappUrl } from '@/lib/format';
import {
  getPublicSettings,
  getShopProductBySlug,
} from '@/lib/public-api';
import styles from '../../site.module.css';

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getShopProductBySlug(slug),
    getPublicSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const inquiryMessage =
    product.whatsappInquiryMessage ||
    `Hola Alma Jardín, me interesa la obra "${product.name}".`;
  const waLink = settings?.whatsappPhone
    ? whatsappUrl(settings.whatsappPhone, inquiryMessage)
    : '#';

  return (
    <div className={styles.container}>
      <section className={styles.pageHero}>
        <Link href="/tienda">← Tienda</Link>
        <p className={styles.eyebrow} style={{ marginTop: '1rem' }}>
          {product.categorySlug}
        </p>
        <h1>{product.name}</h1>
        {product.artistName ? (
          <p className={styles.sectionLead}>{product.artistName}</p>
        ) : null}
      </section>

      <section className={styles.gridTwo} style={{ marginBottom: '3rem' }}>
        <div className={styles.bookingPanel}>
          {product.description ? <p>{product.description}</p> : null}
          {product.story ? (
            <p className={styles.sectionLead}>{product.story}</p>
          ) : null}
          <ul style={{ paddingLeft: '1.1rem', lineHeight: 1.7 }}>
            {product.technique ? <li>Técnica: {product.technique}</li> : null}
            {product.medium ? <li>Medio: {product.medium}</li> : null}
            {product.dimensions ? <li>Medidas: {product.dimensions}</li> : null}
          </ul>
          <p>
            <strong>{formatPriceCents(product.priceCents)}</strong>
            {product.status === 'sold_out' ? ' · Vendido' : ''}
          </p>
          {product.status !== 'sold_out' ? (
            <a href={waLink} className={styles.primaryButton} target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </a>
          ) : null}
        </div>

        <div>
          {(product.imageUrls ?? []).length > 0 ? (
            <div className={styles.featureGrid}>
              {product.imageUrls.map((url) => (
                <div
                  key={url}
                  className={styles.featureCard}
                  style={{
                    minHeight: '220px',
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  role="img"
                  aria-label={product.name}
                />
              ))}
            </div>
          ) : (
            <div className={styles.infoCard}>
              Imagen próximamente. Mientras tanto, consulta por WhatsApp para
              conocer la obra.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
