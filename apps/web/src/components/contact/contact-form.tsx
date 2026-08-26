'use client';

import { useState } from 'react';
import type { CreateContactInput } from '@alma-jardin/shared';
import { createContactMessage } from '@/lib/public-api';
import styles from './contact-form.module.css';

export function ContactForm() {
  const [form, setForm] = useState<CreateContactInput>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createContactMessage({
      ...form,
      phone: form.phone?.trim() || undefined,
    });

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
        <h2>¡Mensaje enviado!</h2>
        <p>Gracias por escribirnos, {form.name}. Te responderemos pronto.</p>
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
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
        </label>

        <label>
          Correo
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
        </label>

        <label>
          Teléfono (opcional)
          <input
            type="tel"
            value={form.phone ?? ''}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
          />
        </label>

        <label>
          Asunto
          <input
            required
            value={form.subject}
            onChange={(event) =>
              setForm((current) => ({ ...current, subject: event.target.value }))
            }
          />
        </label>
      </div>

      <label>
        Mensaje
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
        />
      </label>

      {error ? <p className={styles.error}>{error}</p> : null}

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
