'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PaginatedResponse, RoleSummary } from '@alma-jardin/shared';
import {
  AdminListToolbar,
  AdminPagination,
} from '@/components/admin/list-controls';

export default function RolesPage() {
  const [data, setData] = useState<PaginatedResponse<RoleSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState({
    search: '',
    activeFilter: 'all',
    page: 1,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      const params = new URLSearchParams({
        page: String(query.page),
        limit: '20',
      });
      if (query.search.trim()) params.set('search', query.search.trim());
      if (query.activeFilter === 'true' || query.activeFilter === 'false') {
        params.set('isActive', query.activeFilter);
      }

      const response = await fetch(`/api/admin/roles?${params.toString()}`);
      if (!response.ok) throw new Error('No se pudo cargar roles');
      const body = await response.json();
      if (!cancelled) setData(body);
    }

    load().catch((err: Error) => {
      if (!cancelled) setError(err.message);
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (error && !data) return <p>{error}</p>;
  if (!data) return <p>Cargando roles…</p>;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Roles</h1>
        <Link href="/admin/roles/new">Nuevo rol</Link>
      </div>

      <AdminListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Nombre del rol"
        filterLabel="Estado"
        filterValue={activeFilter}
        filterOptions={[
          { value: 'all', label: 'Todos' },
          { value: 'true', label: 'Activos' },
          { value: 'false', label: 'Inactivos' },
        ]}
        onFilterChange={setActiveFilter}
        onSubmit={() => {
          setQuery({ search, activeFilter, page: 1 });
        }}
      />

      {error ? <p style={{ color: '#b42318' }}>{error}</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Nombre</th>
            <th align="left">Permisos</th>
            <th align="left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.data.length === 0 ? (
            <tr>
              <td colSpan={3}>No hay roles con esos filtros.</td>
            </tr>
          ) : (
            data.data.map((role) => (
              <tr key={role.id}>
                <td>
                  <Link href={`/admin/roles/${role.id}`}>{role.name}</Link>
                </td>
                <td>{role.permissions.length}</td>
                <td>{role.isActive ? 'Activo' : 'Inactivo'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <AdminPagination
        page={data.page}
        totalPages={data.totalPages}
        total={data.total}
        onPageChange={(nextPage) => {
          setQuery((current) => ({ ...current, page: nextPage }));
        }}
      />
    </section>
  );
}
