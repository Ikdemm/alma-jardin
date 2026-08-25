import type { MenuItemPublic } from '@alma-jardin/shared';
import { formatPriceCents } from '@/lib/format';
import styles from './menu-card.module.css';

export function MenuCard({ item }: { item: MenuItemPublic }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <h3>{item.name}</h3>
        <span className={styles.price}>{formatPriceCents(item.priceCents)}</span>
      </div>
      {item.description ? <p className={styles.description}>{item.description}</p> : null}
      {item.ingredients ? (
        <p className={styles.ingredients}>{item.ingredients}</p>
      ) : null}
      {item.status === 'sold_out' ? (
        <span className={styles.badge}>Agotado hoy</span>
      ) : item.featured ? (
        <span className={styles.featured}>Destacado del jardín</span>
      ) : null}
    </article>
  );
}
