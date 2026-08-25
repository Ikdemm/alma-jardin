'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PaginatedResponse, RoleSummary } from '@alma-jardin/shared';

export default function RolesPage() {
  const [data, setData] = useState<PaginatedResponse<RoleSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/roles')
      .then(async (response) => {
        if (!response.ok) throw new Error('No se pudo cargar roles');
        return response.json();
      })
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Cargando roles…</p>;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1>Roles</h1>
        <Link href="/admin/roles/new">Nuevo rol</Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Nombre</th>
            <th align="left">Permisos</th>
            <th align="left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((role) => (
            <tr key={role.id}>
              <td>
                <Link href={`/admin/roles/${role.id}`}>{role.name}</Link>
              </td>
              <td>{role.permissions.length}</td>
              <td>{role.isActive ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
