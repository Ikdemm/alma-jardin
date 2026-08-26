import Link from 'next/link';
import { MenuCard } from '@/components/site/menu-card';
import { getMenuCategories, getMenuItems } from '@/lib/public-api';
import styles from '../site.module.css';

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    getMenuCategories(),
    getMenuItems(),
  ]);

  const categoryList = categories ?? [];
  const itemList = items ?? [];

  return (
    <div className={styles.container}>
      <section className={styles.pageHero}>
        <p className={styles.eyebrow}>Carta</p>
        <h1>Menú del jardín</h1>
        <p className={styles.sectionLead}>
          Entradas del huerto, pizzas de masa madura, pastas artesanales y postres
          inspirados en la naturaleza.
        </p>

        {categoryList.length > 0 ? (
          <nav className={styles.categoryNav} aria-label="Categorías del menú">
            {categoryList.map((category) => (
              <Link key={category.id} href={`#${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </section>

      {categoryList.length === 0 ? (
        <p className={styles.sectionLead}>El menú estará disponible pronto.</p>
      ) : (
        categoryList.map((category) => {
          const categoryItems = itemList.filter(
            (item) => item.categorySlug === category.slug,
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
                {categoryItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
