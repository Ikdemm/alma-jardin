'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { BlogCategory, BlogPostPublic, BlogPostStatus } from '@alma-jardin/shared';
import { BLOG_CATEGORIES } from '@alma-jardin/shared';
import { ImageUpload } from '@/components/admin/image-upload';
import { BLOG_CATEGORY_LABELS } from '@/lib/format';

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<BlogPostPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/blog/admin/${params.id}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Artículo no encontrado');
        }
        return response.json();
      })
      .then(setForm)
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);

    const response = await fetch(`/api/admin/blog/admin/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        coverImageUrl: form.coverImageUrl,
        status: form.status,
        featured: form.featured,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo guardar');
      return;
    }

    router.push('/admin/blog');
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este artículo?')) {
      return;
    }

    const response = await fetch(`/api/admin/blog/admin/${params.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo eliminar');
      return;
    }

    router.push('/admin/blog');
    router.refresh();
  }

  if (error && !form) {
    return <p>{error}</p>;
  }

  if (!form) {
    return <p>Cargando…</p>;
  }

  return (
    <section>
      <Link href="/admin/blog">← Volver al blog</Link>
      <h1>Editar artículo</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '0.75rem', maxWidth: '640px', marginTop: '1rem' }}
      >
        <input
          required
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
        <input
          value={form.slug}
          onChange={(event) => setForm({ ...form, slug: event.target.value })}
        />
        <input
          required
          value={form.excerpt}
          onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
        />
        <textarea
          required
          rows={8}
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
          value={form.coverImageUrl ?? ''}
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

        {error ? <p style={{ color: '#9a3412', margin: 0 }}>{error}</p> : null}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          <button type="button" onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </form>
    </section>
  );
}
