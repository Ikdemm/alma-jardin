'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RoleSummary } from '@alma-jardin/shared';

export default function NewAdminPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/roles?limit=100')
      .then((response) => response.json())
      .then((result) => setRoles(result.data ?? []));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const roleIds = form.getAll('roleIds') as string[];

    const response = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.get('firstName'),
        lastName: form.get('lastName'),
        email: form.get('email'),
        phone: form.get('phone') || undefined,
        password: form.get('password') || undefined,
        roleIds,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo crear el administrador');
      return;
    }

    router.push('/admin/admins');
    router.refresh();
  }

  return (
    <section>
      <h1>Nuevo administrador</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem', maxWidth: 480 }}>
        <label>
          Nombre
          <input name="firstName" required />
        </label>
        <label>
          Apellido
          <input name="lastName" required />
        </label>
        <label>
          Correo
          <input name="email" type="email" required />
        </label>
        <label>
          Teléfono
          <input name="phone" />
        </label>
        <label>
          Contraseña (opcional)
          <input name="password" type="password" minLength={8} />
        </label>
        <fieldset>
          <legend>Roles</legend>
          {roles.map((role) => (
            <label key={role.id} style={{ display: 'block' }}>
              <input type="checkbox" name="roleIds" value={role.id} /> {role.name}
            </label>
          ))}
        </fieldset>
        {error ? <p style={{ color: '#b42318' }}>{error}</p> : null}
        <button type="submit">Crear administrador</button>
      </form>
    </section>
  );
}
