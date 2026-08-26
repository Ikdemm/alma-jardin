'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ShopCategoryPublic, ShopProductPublic } from '@alma-jardin/shared';
import { formatPriceCents, MENU_ITEM_STATUS_LABELS } from '@/lib/format';

export default function ShopProductsAdminPage() {
  const [categories, setCategories] = useState<ShopCategoryPublic[]>([]);
  const [products, setProducts] = useState<ShopProductPublic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    story: '',
    artistName: '',
    technique: '',
    medium: '',
    dimensions: '',
    priceCents: 0,
    imageUrls: '',
    featured: false,
  });

  async function loadData() {
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch('/api/admin/shop/admin/categories'),
      fetch('/api/admin/shop/admin/products'),
    ]);

    if (!categoriesResponse.ok || !productsResponse.ok) {
      throw new Error('No se pudo cargar la tienda');
    }

    const nextCategories = await categoriesResponse.json();
    setCategories(nextCategories);
    setProducts(await productsResponse.json());

    if (!form.categoryId && nextCategories[0]?.id) {
      setForm((current) => ({ ...current, categoryId: nextCategories[0].id }));
    }
  }

  useEffect(() => {
    loadData().catch((err: Error) => setError(err.message));
  }, []);

  async function createProduct(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const response = await fetch('/api/admin/shop/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId: form.categoryId,
        name: form.name,
        description: form.description || undefined,
        story: form.story || undefined,
        artistName: form.artistName || undefined,
        technique: form.technique || undefined,
        medium: form.medium || undefined,
        dimensions: form.dimensions || undefined,
        priceCents: Number(form.priceCents),
        imageUrls: form.imageUrls
          ? form.imageUrls
              .split('\n')
              .map((url) => url.trim())
              .filter(Boolean)
          : [],
        featured: form.featured,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo crear la obra');
      return;
    }

    setForm((current) => ({
      ...current,
      name: '',
      description: '',
      story: '',
      artistName: '',
      technique: '',
      medium: '',
      dimensions: '',
      priceCents: 0,
      imageUrls: '',
      featured: false,
    }));
    await loadData();
  }

  if (error && products.length === 0 && categories.length === 0) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Obras de arte</h1>

      <form
        onSubmit={createProduct}
        style={{
          display: 'grid',
          gap: '0.75rem',
          maxWidth: '560px',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1rem' }}>Nueva obra</h2>
        <select
          required
          value={form.categoryId}
          onChange={(event) =>
            setForm((current) => ({ ...current, categoryId: event.target.value }))
          }
        >
          <option value="">Selecciona categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          required
          placeholder="Nombre"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
        />
        <input
          placeholder="Descripción corta"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
        />
        <textarea
          rows={3}
          placeholder="Historia de la obra"
          value={form.story}
          onChange={(event) =>
            setForm((current) => ({ ...current, story: event.target.value }))
          }
        />
        <input
          placeholder="Artista"
          value={form.artistName}
          onChange={(event) =>
            setForm((current) => ({ ...current, artistName: event.target.value }))
          }
        />
        <input
          placeholder="Técnica"
          value={form.technique}
          onChange={(event) =>
            setForm((current) => ({ ...current, technique: event.target.value }))
          }
        />
        <input
          placeholder="Soporte / medio"
          value={form.medium}
          onChange={(event) =>
            setForm((current) => ({ ...current, medium: event.target.value }))
          }
        />
        <input
          placeholder="Dimensiones"
          value={form.dimensions}
          onChange={(event) =>
            setForm((current) => ({ ...current, dimensions: event.target.value }))
          }
        />
        <input
          type="number"
          required
          min={0}
          placeholder="Precio en centavos"
          value={form.priceCents}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              priceCents: Number(event.target.value),
            }))
          }
        />
        <textarea
          rows={2}
          placeholder="URLs de imagen (una por línea)"
          value={form.imageUrls}
          onChange={(event) =>
            setForm((current) => ({ ...current, imageUrls: event.target.value }))
          }
        />
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) =>
              setForm((current) => ({ ...current, featured: event.target.checked }))
            }
          />
          Destacada
        </label>
        <button type="submit">Crear obra</button>
      </form>

      {error ? <p style={{ color: '#9a3412' }}>{error}</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Obra</th>
            <th align="left">Categoría</th>
            <th align="left">Precio</th>
            <th align="left">Estado</th>
            <th align="left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {product.name}
                {product.featured ? ' · ★' : ''}
              </td>
              <td>{product.categorySlug}</td>
              <td>{formatPriceCents(product.priceCents)}</td>
              <td>{MENU_ITEM_STATUS_LABELS[product.status] ?? product.status}</td>
              <td>
                <Link href={`/admin/shop/products/${product.id}`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
