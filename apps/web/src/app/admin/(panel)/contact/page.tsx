'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ContactMessagePublic, ContactMessageStatus } from '@alma-jardin/shared';
import { CONTACT_STATUS_LABELS } from '@/lib/format';

const STATUS_OPTIONS: Array<ContactMessageStatus | 'all'> = [
  'all',
  'new',
  'read',
  'archived',
];

export default function ContactAdminPage() {
  const [messages, setMessages] = useState<ContactMessagePublic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContactMessageStatus | 'all'>('all');

  async function loadMessages() {
    const response = await fetch('/api/admin/contact');
    if (!response.ok) {
      throw new Error('No se pudieron cargar los mensajes');
    }
    setMessages(await response.json());
  }

  useEffect(() => {
    loadMessages()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return messages.filter((message) => {
      if (status !== 'all' && message.status !== status) {
        return false;
      }
      if (!term) return true;
      const haystack = [
        message.name,
        message.email,
        message.phone ?? '',
        message.subject,
        message.message,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [messages, search, status]);

  async function updateStatus(id: string, nextStatus: ContactMessageStatus) {
    setError(null);

    const response = await fetch(`/api/admin/contact/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      setError('No se pudo actualizar el mensaje');
      return;
    }

    await loadMessages();
  }

  if (loading) {
    return <p>Cargando mensajes…</p>;
  }

  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h1 style={{ margin: 0 }}>Mensajes de contacto</h1>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            Buscar
            <input
              value={search}
              placeholder="Nombre, correo, asunto…"
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            Estado
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ContactMessageStatus | 'all')
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === 'all'
                    ? 'Todos'
                    : CONTACT_STATUS_LABELS[option] ?? option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error ? <p style={{ color: '#9a3412' }}>{error}</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th align="left">Fecha</th>
            <th align="left">Remitente</th>
            <th align="left">Asunto</th>
            <th align="left">Mensaje</th>
            <th align="left">Estado</th>
            <th align="left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6}>No hay mensajes con este filtro.</td>
            </tr>
          ) : (
            filtered.map((message) => (
              <tr key={message.id}>
                <td>{new Date(message.createdAt).toLocaleString('es-CO')}</td>
                <td>
                  <div>{message.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b5b4f' }}>
                    {message.email}
                    {message.phone ? ` · ${message.phone}` : ''}
                  </div>
                </td>
                <td>{message.subject}</td>
                <td style={{ maxWidth: '280px' }}>{message.message}</td>
                <td>{CONTACT_STATUS_LABELS[message.status] ?? message.status}</td>
                <td style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {message.status !== 'read' ? (
                    <button type="button" onClick={() => updateStatus(message.id, 'read')}>
                      Marcar leído
                    </button>
                  ) : null}
                  {message.status !== 'archived' ? (
                    <button
                      type="button"
                      onClick={() => updateStatus(message.id, 'archived')}
                    >
                      Archivar
                    </button>
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
