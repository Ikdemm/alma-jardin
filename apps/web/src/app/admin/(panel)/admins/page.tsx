'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AdminSummary, PaginatedResponse } from '@alma-jardin/shared';

export default function AdminsPage() {
  const [data, setData] = useState<PaginatedResponse<AdminSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/admins')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar administradores');
        }
        return response.json();
      })
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>Cargando administradores…</p>;
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1>Administradores</h1>
        <Link href="/admin/admins/new">Nuevo administrador</Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Nombre</th>
            <th align="left">Correo</th>
            <th align="left">Estado</th>
            <th align="left">Roles</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((admin) => (
            <tr key={admin.id}>
              <td>
                <Link href={`/admin/admins/${admin.id}`}>
                  {admin.firstName} {admin.lastName}
                </Link>
                {admin.isSuperAdmin ? ' · Super' : ''}
              </td>
              <td>{admin.email}</td>
              <td>{admin.status}</td>
              <td>{admin.roleIds.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
