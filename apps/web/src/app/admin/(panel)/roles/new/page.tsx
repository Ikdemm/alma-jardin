'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  buildPermissionCatalog,
  type PermissionCode,
} from '@alma-jardin/shared';

export default function NewRolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<PermissionCode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const catalog = buildPermissionCatalog();

  useEffect(() => {
    setSelected([]);
  }, []);

  function togglePermission(code: PermissionCode) {
    setSelected((current) =>
      current.includes(code)
        ? current.filter((item) => item !== code)
        : [...current, code],
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);

    const response = await fetch('/api/admin/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        description: form.get('description') || undefined,
        color: form.get('color') || undefined,
        permissions: selected,
        isActive: true,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo crear el rol');
      return;
    }

    router.push('/admin/roles');
    router.refresh();
  }

  return (
    <section>
      <h1>Nuevo rol</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: 720 }}>
        <label>
          Nombre
          <input name="name" required />
        </label>
        <label>
          Descripción
          <input name="description" />
        </label>
        <label>
          Color
          <input name="color" type="color" defaultValue="#4a7c59" />
        </label>
        <div>
          <h2>Permisos</h2>
          {catalog.map((module) => (
            <div key={module.module} style={{ marginBottom: '1rem' }}>
              <strong>{module.label}</strong>
              <div style={{ display: 'grid', gap: '0.35rem', marginTop: '0.35rem' }}>
                {module.permissions.map((permission) => (
                  <label key={permission.code}>
                    <input
                      type="checkbox"
                      checked={selected.includes(permission.code)}
                      onChange={() => togglePermission(permission.code)}
                    />{' '}
                    {permission.action}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {error ? <p style={{ color: '#b42318' }}>{error}</p> : null}
        <button type="submit">Crear rol</button>
      </form>
    </section>
  );
}
