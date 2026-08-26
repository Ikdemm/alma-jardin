'use client';

import type { ReactNode } from 'react';

export function AdminListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar…',
  filterLabel,
  filterValue,
  filterOptions,
  onFilterChange,
  onSubmit,
  children,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterLabel?: string;
  filterValue?: string;
  filterOptions?: Array<{ value: string; label: string }>;
  onFilterChange?: (value: string) => void;
  onSubmit: () => void;
  children?: ReactNode;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'end',
        marginBottom: '1rem',
      }}
    >
      <label style={{ display: 'grid', gap: '0.25rem', minWidth: '220px', flex: 1 }}>
        <span style={{ fontSize: '0.85rem' }}>Buscar</span>
        <input
          value={search}
          placeholder={searchPlaceholder}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      {filterOptions && onFilterChange ? (
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.85rem' }}>{filterLabel ?? 'Filtro'}</span>
          <select
            value={filterValue}
            onChange={(event) => onFilterChange(event.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <button type="submit">Aplicar</button>
      {children}
    </form>
  );
}

export function AdminPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return (
      <p style={{ marginTop: '1rem', color: '#6b5b4f', fontSize: '0.9rem' }}>
        {total} resultado{total === 1 ? '' : 's'}
      </p>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
        marginTop: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </button>
      <span style={{ fontSize: '0.9rem', color: '#6b5b4f' }}>
        Página {page} de {totalPages} · {total} resultado{total === 1 ? '' : 's'}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}
