'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { MenuCategoryPublic, MenuItemPublic } from '@alma-jardin/shared';
import { ImageUpload } from '@/components/admin/image-upload';

export default function EditMenuItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<MenuCategoryPublic[]>([]);
  const [form, setForm] = useState<MenuItemPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/menu/admin/items/${params.id}`),
      fetch('/api/admin/menu/admin/categories'),
    ])
      .then(async ([itemResponse, categoriesResponse]) => {
        if (!itemResponse.ok) {
          throw new Error('Plato no encontrado');
        }
        if (!categoriesResponse.ok) {
          throw new Error('No se pudieron cargar categorías');
        }

        setForm(await itemResponse.json());
        setCategories(await categoriesResponse.json());
      })
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);

    const response = await fetch(`/api/admin/menu/admin/items/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId: form.categoryId,
        name: form.name,
        slug: form.slug,
        description: form.description,
        ingredients: form.ingredients,
        priceCents: form.priceCents,
        imageUrl: form.imageUrl,
        status: form.status,
        featured: form.featured,
        orderIndex: form.orderIndex,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo guardar');
      return;
    }

    router.push('/admin/menu/items');
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este plato?')) {
      return;
    }

    const response = await fetch(`/api/admin/menu/admin/items/${params.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo eliminar');
      return;
    }

    router.push('/admin/menu/items');
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
      <Link href="/admin/menu/items">← Volver a platos</Link>
      <h1>Editar plato</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '0.75rem', maxWidth: '560px', marginTop: '1rem' }}
      >
        <select
          required
          value={form.categoryId}
          onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
        <input
          value={form.ingredients ?? ''}
          onChange={(event) => setForm({ ...form, ingredients: event.target.value })}
        />
        <input
          type="number"
          required
          min={0}
          value={form.priceCents}
          onChange={(event) =>
            setForm({ ...form, priceCents: Number(event.target.value) })
          }
        />
        <ImageUpload
          label="Imagen del plato"
          folder="menu"
          value={form.imageUrl ?? ''}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
        />
        <select
          value={form.status}
          onChange={(event) =>
            setForm({
              ...form,
              status: event.target.value as MenuItemPublic['status'],
            })
          }
        >
          <option value="active">Activo</option>
          <option value="sold_out">Agotado</option>
          <option value="hidden">Oculto</option>
        </select>
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
            checked={form.featured}
            onChange={(event) => setForm({ ...form, featured: event.target.checked })}
          />
          Destacado en inicio
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
