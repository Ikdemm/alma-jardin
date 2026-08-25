'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { AdminSummary } from '@alma-jardin/shared';

export default function AdminDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/admins/${params.id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Administrador no encontrado');
        return response.json();
      })
      .then(setAdmin)
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  async function toggleBlock() {
    if (!admin) return;

    const action = admin.status === 'blocked' ? 'unblock' : 'block';
    const response = await fetch(`/api/admin/admins/${admin.id}/${action}`, {
      method: 'POST',
    });

    if (!response.ok) {
      setError('No se pudo actualizar el estado');
      return;
    }

    const updated = await response.json();
    setAdmin(updated);
    router.refresh();
  }

  if (error) return <p>{error}</p>;
  if (!admin) return <p>Cargando…</p>;

  return (
    <section>
      <h1>
        {admin.firstName} {admin.lastName}
      </h1>
      <p>{admin.email}</p>
      <p>Estado: {admin.status}</p>
      <p>Roles asignados: {admin.roleIds.length}</p>
      {!admin.isSuperAdmin ? (
        <button type="button" onClick={toggleBlock}>
          {admin.status === 'blocked' ? 'Reactivar cuenta' : 'Bloquear cuenta'}
        </button>
      ) : null}
    </section>
  );
}
