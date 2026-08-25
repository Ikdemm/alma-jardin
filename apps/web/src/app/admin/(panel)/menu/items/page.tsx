'use client';

import { useEffect, useState } from 'react';
import type { MenuCategoryPublic, MenuItemPublic } from '@alma-jardin/shared';
import { formatPriceCents, MENU_ITEM_STATUS_LABELS } from '@/lib/format';

export default function MenuItemsAdminPage() {
  const [categories, setCategories] = useState<MenuCategoryPublic[]>([]);
  const [items, setItems] = useState<MenuItemPublic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    ingredients: '',
    priceCents: 0,
    featured: false,
  });

  async function loadData() {
    const [categoriesResponse, itemsResponse] = await Promise.all([
      fetch('/api/admin/menu/admin/categories'),
      fetch('/api/admin/menu/admin/items'),
    ]);

    if (!categoriesResponse.ok || !itemsResponse.ok) {
      throw new Error('No se pudo cargar el menú');
    }

    const nextCategories = await categoriesResponse.json();
    setCategories(nextCategories);
    setItems(await itemsResponse.json());

    if (!form.categoryId && nextCategories[0]?.id) {
      setForm((current) => ({ ...current, categoryId: nextCategories[0].id }));
    }
  }

  useEffect(() => {
    loadData().catch((err: Error) => setError(err.message));
  }, []);

  async function createItem(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const response = await fetch('/api/admin/menu/admin/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId: form.categoryId,
        name: form.name,
        description: form.description || undefined,
        ingredients: form.ingredients || undefined,
        priceCents: Number(form.priceCents),
        featured: form.featured,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo crear el plato');
      return;
    }

    setForm((current) => ({
      ...current,
      name: '',
      description: '',
      ingredients: '',
      priceCents: 0,
      featured: false,
    }));
    await loadData();
  }

  async function updateItemStatus(item: MenuItemPublic, status: MenuItemPublic['status']) {
    setError(null);

    const response = await fetch(`/api/admin/menu/admin/items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      setError('No se pudo actualizar el plato');
      return;
    }

    await loadData();
  }

  if (error && items.length === 0 && categories.length === 0) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Platos del menú</h1>

      <form
        onSubmit={createItem}
        style={{
          display: 'grid',
          gap: '0.75rem',
          maxWidth: '560px',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1rem' }}>Nuevo plato</h2>
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
          placeholder="Nombre"
          required
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
        />
        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
        />
        <input
          placeholder="Ingredientes"
          value={form.ingredients}
          onChange={(event) =>
            setForm((current) => ({ ...current, ingredients: event.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Precio en centavos (ej. 2300000 = $23.000)"
          required
          min={0}
          value={form.priceCents}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              priceCents: Number(event.target.value),
            }))
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
          Destacado en inicio
        </label>
        <button type="submit">Crear plato</button>
      </form>

      {error ? <p style={{ color: '#9a3412' }}>{error}</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Plato</th>
            <th align="left">Categoría</th>
            <th align="left">Precio</th>
            <th align="left">Estado</th>
            <th align="left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                {item.name}
                {item.featured ? ' · ★' : ''}
              </td>
              <td>{item.categorySlug}</td>
              <td>{formatPriceCents(item.priceCents)}</td>
              <td>{MENU_ITEM_STATUS_LABELS[item.status] ?? item.status}</td>
              <td style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {item.status !== 'active' ? (
                  <button type="button" onClick={() => updateItemStatus(item, 'active')}>
                    Activar
                  </button>
                ) : null}
                {item.status !== 'sold_out' ? (
                  <button type="button" onClick={() => updateItemStatus(item, 'sold_out')}>
                    Agotado
                  </button>
                ) : null}
                {item.status !== 'hidden' ? (
                  <button type="button" onClick={() => updateItemStatus(item, 'hidden')}>
                    Ocultar
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
