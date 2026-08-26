import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_CATEGORIES } from '@alma-jardin/shared';
import { BLOG_CATEGORY_LABELS } from '@/lib/format';
import { getBlogPosts } from '@/lib/public-api';
import { buildPageMetadata } from '@/lib/seo';
import styles from '../site.module.css';

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog',
  description:
    'Historias, recetas, ingredientes y eventos del restaurante Alma Jardín.',
  path: '/blog',
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = BLOG_CATEGORIES.includes(params.category as never)
    ? (params.category as (typeof BLOG_CATEGORIES)[number])
    : undefined;
  const posts = (await getBlogPosts(category)) ?? [];

  return (
    <div className={styles.container}>
      <section className={styles.pageHero}>
        <p className={styles.eyebrow}>Editorial</p>
        <h1>Blog</h1>
        <p className={styles.sectionLead}>
          Historias, recetas, ingredientes y eventos — la vida detrás de Alma
          Jardín.
        </p>

        <nav className={styles.categoryNav} aria-label="Categorías del blog">
          <Link href="/blog">Todas</Link>
          {BLOG_CATEGORIES.map((value) => (
            <Link key={value} href={`/blog?category=${value}`}>
              {BLOG_CATEGORY_LABELS[value]}
            </Link>
          ))}
        </nav>
      </section>

      {posts.length === 0 ? (
        <p className={styles.sectionLead}>Pronto publicaremos nuevos artículos.</p>
      ) : (
        <div className={styles.menuGrid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.featureCard}>
              <p className={styles.eyebrow}>
                {BLOG_CATEGORY_LABELS[post.category] ?? post.category}
              </p>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`}>Leer más</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
