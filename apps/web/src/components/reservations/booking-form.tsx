'use client';

import { useState } from 'react';
import type { CreateReservationInput } from '@alma-jardin/shared';
import { createReservation } from '@/lib/public-api';
import styles from './booking-form.module.css';

const TIME_SLOTS = [
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
];

function tomorrowIsoDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function BookingForm() {
  const [form, setForm] = useState<CreateReservationInput>({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    date: tomorrowIsoDate(),
    time: '19:00',
    pax: 2,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload: CreateReservationInput = {
      ...form,
      contactEmail: form.contactEmail?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    };

    const result = await createReservation(payload);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className={styles.success}>
        <h2>¡Gracias, {form.contactName}!</h2>
        <p>
          Recibimos tu solicitud para {form.pax} personas el{' '}
          {new Date(`${form.date}T12:00:00`).toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}{' '}
          a las {form.time}.
        </p>
        <p>Te contactaremos pronto para confirmar tu mesa en el jardín.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <label>
          Nombre
          <input
            required
            value={form.contactName}
            onChange={(event) =>
              setForm((current) => ({ ...current, contactName: event.target.value }))
            }
          />
        </label>

        <label>
          Teléfono
          <input
            required
            type="tel"
            value={form.contactPhone}
            onChange={(event) =>
              setForm((current) => ({ ...current, contactPhone: event.target.value }))
            }
          />
        </label>

        <label>
          Correo (opcional)
          <input
            type="email"
            value={form.contactEmail ?? ''}
            onChange={(event) =>
              setForm((current) => ({ ...current, contactEmail: event.target.value }))
            }
          />
        </label>

        <label>
          Personas
          <input
            required
            type="number"
            min={1}
            max={30}
            value={form.pax}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                pax: Number(event.target.value),
              }))
            }
          />
        </label>

        <label>
          Fecha
          <input
            required
            type="date"
            min={tomorrowIsoDate()}
            value={form.date}
            onChange={(event) =>
              setForm((current) => ({ ...current, date: event.target.value }))
            }
          />
        </label>

        <label>
          Hora
          <select
            required
            value={form.time}
            onChange={(event) =>
              setForm((current) => ({ ...current, time: event.target.value }))
            }
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Notas especiales
        <textarea
          rows={4}
          placeholder="Alergias, celebración, preferencia de mesa en el jardín…"
          value={form.notes ?? ''}
          onChange={(event) =>
            setForm((current) => ({ ...current, notes: event.target.value }))
          }
        />
      </label>

      {error ? <p className={styles.error}>{error}</p> : null}

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando…' : 'Solicitar reserva'}
      </button>
    </form>
  );
}
