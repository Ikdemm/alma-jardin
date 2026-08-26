import Link from 'next/link';
import { formatPriceCents } from '@/lib/format';
import { getShopCategories, getShopProducts } from '@/lib/public-api';
import styles from '../site.module.css';

export default async function TiendaPage() {
  const [categories, products] = await Promise.all([
    getShopCategories(),
    getShopProducts(),
  ]);

  const categoryList = categories ?? [];
  const productList = products ?? [];

  return (
    <div className={styles.container}>
      <section className={styles.pageHero}>
        <p className={styles.eyebrow}>Arte</p>
        <h1>Tienda del jardín</h1>
        <p className={styles.sectionLead}>
          Obras inspiradas en la naturaleza, el colibrí y la cocina de Alma
          Jardín. Consulta disponibilidad por WhatsApp.
        </p>

        {categoryList.length > 0 ? (
          <nav className={styles.categoryNav} aria-label="Categorías de tienda">
            {categoryList.map((category) => (
              <Link key={category.id} href={`#${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </section>

      {categoryList.length === 0 ? (
        <p className={styles.sectionLead}>Pronto añadiremos obras a la tienda.</p>
      ) : (
        categoryList.map((category) => {
          const categoryProducts = productList.filter(
            (product) => product.categorySlug === category.slug,
          );

          return (
            <section
              key={category.id}
              id={category.slug}
              className={styles.categoryBlock}
            >
              {category.imageUrl ? (
                <div
                  className={styles.categoryImage}
                  style={{ backgroundImage: `url(${category.imageUrl})` }}
                  role="img"
                  aria-label={category.name}
                />
              ) : null}
              <h2>{category.name}</h2>
              {category.description ? <p>{category.description}</p> : null}
              <div className={styles.menuGrid}>
                {categoryProducts.map((product) => (
                  <article key={product.id} className={styles.featureCard}>
                    <h3>
                      <Link href={`/tienda/${product.slug}`}>{product.name}</Link>
                    </h3>
                    {product.artistName ? <p>{product.artistName}</p> : null}
                    {product.description ? <p>{product.description}</p> : null}
                    <p>
                      <strong>{formatPriceCents(product.priceCents)}</strong>
                      {product.status === 'sold_out' ? ' · Vendido' : ''}
                    </p>
                    <Link href={`/tienda/${product.slug}`}>Ver obra</Link>
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
