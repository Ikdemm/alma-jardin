'use client';

import { useEffect, useState } from 'react';
import type { ReservationPublic, ReservationStatus } from '@alma-jardin/shared';
import { RESERVATION_STATUS_LABELS } from '@/lib/format';

const STATUS_OPTIONS: Array<ReservationStatus | 'all'> = [
  'all',
  'pending',
  'confirmed',
  'rejected',
  'cancelled',
];

export default function ReservationsAdminPage() {
  const [reservations, setReservations] = useState<ReservationPublic[]>([]);
  const [status, setStatus] = useState<ReservationStatus | 'all'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadReservations(nextStatus = status) {
    setLoading(true);
    setError(null);

    const query =
      nextStatus === 'all' ? '' : `?status=${encodeURIComponent(nextStatus)}`;
    const response = await fetch(`/api/admin/reservations${query}`);

    if (!response.ok) {
      throw new Error('No se pudieron cargar las reservas');
    }

    setReservations(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    loadReservations().catch((err: Error) => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id: string, nextStatus: ReservationStatus) {
    setError(null);

    const response = await fetch(`/api/admin/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      setError('No se pudo actualizar la reserva');
      return;
    }

    await loadReservations();
  }

  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ margin: 0 }}>Reservas</h1>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          Estado
          <select
            value={status}
            onChange={async (event) => {
              const nextStatus = event.target.value as ReservationStatus | 'all';
              setStatus(nextStatus);
              try {
                await loadReservations(nextStatus);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Error');
              }
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'all'
                  ? 'Todas'
                  : RESERVATION_STATUS_LABELS[option] ?? option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p style={{ color: '#9a3412' }}>{error}</p> : null}
      {loading ? <p>Cargando reservas…</p> : null}

      {!loading ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Fecha</th>
              <th align="left">Hora</th>
              <th align="left">Cliente</th>
              <th align="left">Pax</th>
              <th align="left">Estado</th>
              <th align="left">Notas</th>
              <th align="left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={7}>No hay reservas con este filtro.</td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.date}</td>
                  <td>{reservation.time}</td>
                  <td>
                    <div>{reservation.contactName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b5b4f' }}>
                      {reservation.contactPhone}
                      {reservation.contactEmail
                        ? ` · ${reservation.contactEmail}`
                        : ''}
                    </div>
                  </td>
                  <td>{reservation.pax}</td>
                  <td>
                    {RESERVATION_STATUS_LABELS[reservation.status] ??
                      reservation.status}
                  </td>
                  <td>{reservation.notes ?? '—'}</td>
                  <td style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {reservation.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => updateStatus(reservation.id, 'confirmed')}
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(reservation.id, 'rejected')}
                        >
                          Rechazar
                        </button>
                      </>
                    ) : null}
                    {reservation.status !== 'cancelled' ? (
                      <button
                        type="button"
                        onClick={() => updateStatus(reservation.id, 'cancelled')}
                      >
                        Cancelar
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
