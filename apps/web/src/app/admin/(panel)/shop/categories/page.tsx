'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ShopCategoryAdmin } from '@alma-jardin/shared';

export default function ShopCategoriesAdminPage() {
  const [categories, setCategories] = useState<ShopCategoryAdmin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    orderIndex: 0,
  });

  async function loadCategories() {
    const response = await fetch('/api/admin/shop/admin/categories');
    if (!response.ok) {
      throw new Error('No se pudieron cargar las categorías');
    }
    setCategories(await response.json());
  }

  useEffect(() => {
    loadCategories().catch((err: Error) => setError(err.message));
  }, []);

  async function createCategory(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const response = await fetch('/api/admin/shop/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
        orderIndex: Number(form.orderIndex),
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo crear la categoría');
      return;
    }

    setForm({ name: '', slug: '', description: '', orderIndex: 0 });
    await loadCategories();
  }

  if (error && categories.length === 0) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Categorías de tienda</h1>

      <form
        onSubmit={createCategory}
        style={{
          display: 'grid',
          gap: '0.75rem',
          maxWidth: '480px',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1rem' }}>Nueva categoría</h2>
        <input
          placeholder="Nombre"
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          placeholder="Slug (opcional)"
          value={form.slug}
          onChange={(event) => setForm({ ...form, slug: event.target.value })}
        />
        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
        />
        <input
          type="number"
          placeholder="Orden"
          value={form.orderIndex}
          onChange={(event) =>
            setForm({ ...form, orderIndex: Number(event.target.value) })
          }
        />
        <button type="submit">Crear categoría</button>
      </form>

      {error ? <p style={{ color: '#9a3412' }}>{error}</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Nombre</th>
            <th align="left">Slug</th>
            <th align="left">Orden</th>
            <th align="left">Estado</th>
            <th align="left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.slug}</td>
              <td>{category.orderIndex}</td>
              <td>{category.isActive ? 'Activa' : 'Oculta'}</td>
              <td>
                <Link href={`/admin/shop/categories/${category.id}`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
