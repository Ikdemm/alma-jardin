'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { BlogCategory, BlogPostPublic, BlogPostStatus } from '@alma-jardin/shared';
import { BLOG_CATEGORIES } from '@alma-jardin/shared';
import { ImageUpload } from '@/components/admin/image-upload';
import { BLOG_CATEGORY_LABELS, BLOG_STATUS_LABELS } from '@/lib/format';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'historias' as BlogCategory,
  coverImageUrl: '',
  status: 'draft' as BlogPostStatus,
  featured: false,
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPostPublic[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    const response = await fetch('/api/admin/blog/admin');
    if (!response.ok) {
      throw new Error('No se pudieron cargar los artículos');
    }
    setPosts(await response.json());
  }

  useEffect(() => {
    loadPosts().catch((err: Error) => setError(err.message));
  }, []);

  async function createPost(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const response = await fetch('/api/admin/blog/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        coverImageUrl: form.coverImageUrl || undefined,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo crear el artículo');
      return;
    }

    setForm(emptyForm);
    await loadPosts();
  }

  return (
    <section>
      <h1>Blog</h1>

      <form
        onSubmit={createPost}
        style={{ display: 'grid', gap: '0.75rem', maxWidth: '640px', marginBottom: '2rem' }}
      >
        <h2 style={{ margin: 0, fontSize: '1rem' }}>Nuevo artículo</h2>
        <input
          required
          placeholder="Título"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
        <input
          required
          placeholder="Extracto"
          value={form.excerpt}
          onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
        />
        <textarea
          required
          rows={6}
          placeholder="Contenido"
          value={form.content}
          onChange={(event) => setForm({ ...form, content: event.target.value })}
        />
        <select
          value={form.category}
          onChange={(event) =>
            setForm({ ...form, category: event.target.value as BlogCategory })
          }
        >
          {BLOG_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {BLOG_CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
        <ImageUpload
          label="Portada"
          folder="blog"
          value={form.coverImageUrl}
          onChange={(url) => setForm({ ...form, coverImageUrl: url })}
        />
        <select
          value={form.status}
          onChange={(event) =>
            setForm({ ...form, status: event.target.value as BlogPostStatus })
          }
        >
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="archived">Archivado</option>
        </select>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) =>
              setForm({ ...form, featured: event.target.checked })
            }
          />
          Destacado
        </label>
        <button type="submit">Crear artículo</button>
      </form>

      {error ? <p style={{ color: '#9a3412' }}>{error}</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Título</th>
            <th align="left">Categoría</th>
            <th align="left">Estado</th>
            <th align="left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                {post.title}
                {post.featured ? ' · ★' : ''}
              </td>
              <td>{BLOG_CATEGORY_LABELS[post.category] ?? post.category}</td>
              <td>{BLOG_STATUS_LABELS[post.status] ?? post.status}</td>
              <td>
                <Link href={`/admin/blog/${post.id}`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
