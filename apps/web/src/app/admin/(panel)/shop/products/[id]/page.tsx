'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ShopCategoryPublic, ShopProductPublic } from '@alma-jardin/shared';

export default function EditShopProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<ShopCategoryPublic[]>([]);
  const [form, setForm] = useState<ShopProductPublic | null>(null);
  const [imageUrlsText, setImageUrlsText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/shop/admin/products/${params.id}`),
      fetch('/api/admin/shop/admin/categories'),
    ])
      .then(async ([productResponse, categoriesResponse]) => {
        if (!productResponse.ok) {
          throw new Error('Obra no encontrada');
        }
        if (!categoriesResponse.ok) {
          throw new Error('No se pudieron cargar categorías');
        }

        const product = (await productResponse.json()) as ShopProductPublic;
        setForm(product);
        setImageUrlsText((product.imageUrls ?? []).join('\n'));
        setCategories(await categoriesResponse.json());
      })
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);

    const response = await fetch(`/api/admin/shop/admin/products/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        imageUrls: imageUrlsText
          .split('\n')
          .map((url) => url.trim())
          .filter(Boolean),
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo guardar');
      return;
    }

    router.push('/admin/shop/products');
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar esta obra?')) {
      return;
    }

    const response = await fetch(`/api/admin/shop/admin/products/${params.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo eliminar');
      return;
    }

    router.push('/admin/shop/products');
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
      <Link href="/admin/shop/products">← Volver</Link>
      <h1>Editar obra</h1>

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
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
        />
        <textarea
          rows={3}
          value={form.story ?? ''}
          onChange={(event) => setForm({ ...form, story: event.target.value })}
        />
        <input
          placeholder="Artista"
          value={form.artistName ?? ''}
          onChange={(event) =>
            setForm({ ...form, artistName: event.target.value })
          }
        />
        <input
          placeholder="Técnica"
          value={form.technique ?? ''}
          onChange={(event) =>
            setForm({ ...form, technique: event.target.value })
          }
        />
        <input
          placeholder="Medio"
          value={form.medium ?? ''}
          onChange={(event) => setForm({ ...form, medium: event.target.value })}
        />
        <input
          placeholder="Dimensiones"
          value={form.dimensions ?? ''}
          onChange={(event) =>
            setForm({ ...form, dimensions: event.target.value })
          }
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
        <textarea
          rows={3}
          placeholder="URLs de imagen (una por línea)"
          value={imageUrlsText}
          onChange={(event) => setImageUrlsText(event.target.value)}
        />
        <select
          value={form.status}
          onChange={(event) =>
            setForm({
              ...form,
              status: event.target.value as ShopProductPublic['status'],
            })
          }
        >
          <option value="active">Activo</option>
          <option value="sold_out">Agotado / vendido</option>
          <option value="hidden">Oculto</option>
        </select>
        <input
          type="number"
          value={form.orderIndex}
          onChange={(event) =>
            setForm({ ...form, orderIndex: Number(event.target.value) })
          }
        />
        <input
          placeholder="Mensaje WhatsApp de consulta (opcional)"
          value={form.whatsappInquiryMessage ?? ''}
          onChange={(event) =>
            setForm({ ...form, whatsappInquiryMessage: event.target.value })
          }
        />
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) =>
              setForm({ ...form, featured: event.target.checked })
            }
          />
          Destacada
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
