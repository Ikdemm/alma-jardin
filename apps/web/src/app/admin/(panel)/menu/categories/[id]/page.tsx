'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { MenuCategoryAdmin } from '@alma-jardin/shared';
import { ImageUpload } from '@/components/admin/image-upload';

export default function EditMenuCategoryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<MenuCategoryAdmin | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/menu/admin/categories/${params.id}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Categoría no encontrada');
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

    const response = await fetch(`/api/admin/menu/admin/categories/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        imageUrl: form.imageUrl ?? '',
        orderIndex: form.orderIndex,
        isActive: form.isActive,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo guardar');
      return;
    }

    router.push('/admin/menu/categories');
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar esta categoría?')) {
      return;
    }

    const response = await fetch(`/api/admin/menu/admin/categories/${params.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo eliminar');
      return;
    }

    router.push('/admin/menu/categories');
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
      <Link href="/admin/menu/categories">← Volver a categorías</Link>
      <h1>Editar categoría</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '0.75rem', maxWidth: '480px', marginTop: '1rem' }}
      >
        <input
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          value={form.slug}
          onChange={(event) => setForm({ ...form, slug: event.target.value })}
        />
        <input
          value={form.description ?? ''}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
        <ImageUpload
          label="Imagen de categoría"
          folder="menu"
          value={form.imageUrl ?? ''}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
        />
        <input
          type="number"
          value={form.orderIndex}
          onChange={(event) =>
            setForm({ ...form, orderIndex: Number(event.target.value) })
          }
        />
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
          />
          Activa en el sitio público
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
