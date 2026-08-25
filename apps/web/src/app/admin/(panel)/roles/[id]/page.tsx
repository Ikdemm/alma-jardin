'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { RoleSummary } from '@alma-jardin/shared';

export default function RoleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [role, setRole] = useState<RoleSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/roles/${params.id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Rol no encontrado');
        return response.json();
      })
      .then(setRole)
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  async function toggleActive() {
    if (!role) return;

    const response = await fetch(`/api/admin/roles/${role.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !role.isActive }),
    });

    if (!response.ok) {
      setError('No se pudo actualizar el rol');
      return;
    }

    const updated = await response.json();
    setRole(updated);
    router.refresh();
  }

  if (error) return <p>{error}</p>;
  if (!role) return <p>Cargando…</p>;

  return (
    <section>
      <h1>{role.name}</h1>
      <p>{role.description}</p>
      <p>Estado: {role.isActive ? 'Activo' : 'Inactivo'}</p>
      <p>Permisos: {role.permissions.length}</p>
      <button type="button" onClick={toggleActive}>
        {role.isActive ? 'Desactivar rol' : 'Activar rol'}
      </button>
    </section>
  );
}
