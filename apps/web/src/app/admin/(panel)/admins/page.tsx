'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AdminStatus, AdminSummary, PaginatedResponse } from '@alma-jardin/shared';
import {
  AdminListToolbar,
  AdminPagination,
} from '@/components/admin/list-controls';

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'active', label: 'Activo' },
  { value: 'blocked', label: 'Bloqueado' },
  { value: 'inactive', label: 'Inactivo' },
];

const STATUS_LABELS: Record<AdminStatus, string> = {
  pending: 'Pendiente',
  active: 'Activo',
  blocked: 'Bloqueado',
  inactive: 'Inactivo',
};

export default function AdminsPage() {
  const [data, setData] = useState<PaginatedResponse<AdminSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState({ search: '', status: 'all', page: 1 });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      const params = new URLSearchParams({
        page: String(query.page),
        limit: '20',
      });
      if (query.search.trim()) params.set('search', query.search.trim());
      if (query.status !== 'all') params.set('status', query.status);

      const response = await fetch(`/api/admin/admins?${params.toString()}`);
      if (!response.ok) {
        throw new Error('No se pudo cargar administradores');
      }
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

  if (error && !data) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>Cargando administradores…</p>;
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Administradores</h1>
        <Link href="/admin/admins/new">Nuevo administrador</Link>
      </div>

      <AdminListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Nombre o correo"
        filterLabel="Estado"
        filterValue={status}
        filterOptions={STATUS_OPTIONS}
        onFilterChange={setStatus}
        onSubmit={() => {
          setPage(1);
          setQuery({ search, status, page: 1 });
        }}
      />

      {error ? <p style={{ color: '#b42318' }}>{error}</p> : null}

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
          {data.data.length === 0 ? (
            <tr>
              <td colSpan={4}>No hay administradores con esos filtros.</td>
            </tr>
          ) : (
            data.data.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <Link href={`/admin/admins/${admin.id}`}>
                    {admin.firstName} {admin.lastName}
                  </Link>
                  {admin.isSuperAdmin ? ' · Super' : ''}
                </td>
                <td>{admin.email}</td>
                <td>{STATUS_LABELS[admin.status] ?? admin.status}</td>
                <td>{admin.roleIds.length}</td>
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
          setPage(nextPage);
          setQuery((current) => ({ ...current, page: nextPage }));
        }}
      />
    </section>
  );
}
