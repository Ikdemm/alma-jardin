import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/site/json-ld';
import { BLOG_CATEGORY_LABELS } from '@/lib/format';
import { getBlogPostBySlug } from '@/lib/public-api';
import { blogPostingJsonLd, buildPageMetadata } from '@/lib/seo';
import styles from '../../site.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return buildPageMetadata({
      title: 'Artículo no encontrado',
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    imageUrl: post.coverImageUrl,
    type: 'article',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <JsonLd data={blogPostingJsonLd(post)} />
      <section className={styles.pageHero}>
        <Link href="/blog">← Blog</Link>
        <p className={styles.eyebrow} style={{ marginTop: '1rem' }}>
          {BLOG_CATEGORY_LABELS[post.category] ?? post.category}
        </p>
        <h1>{post.title}</h1>
        <p className={styles.sectionLead}>{post.excerpt}</p>
      </section>

      <article className={styles.bookingPanel} style={{ marginBottom: '3rem' }}>
        {post.content.split('\n\n').map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className={styles.sectionLead}>
            {paragraph}
          </p>
        ))}
      </article>
    </div>
  );
}
