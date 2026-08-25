'use client';

import { useEffect, useState } from 'react';
import type { RestaurantSettingsPublic } from '@alma-jardin/shared';

const EMPTY: RestaurantSettingsPublic = {
  name: '',
  tagline: '',
  heroTitle: '',
  heroSubtitle: '',
  aboutText: '',
  address: '',
  phone: '',
  whatsappPhone: '',
  whatsappMessage: '',
  email: '',
  staffNotificationEmail: '',
  openingHours: '',
  instagramUrl: '',
  mapUrl: '',
};

export default function SettingsAdminPage() {
  const [form, setForm] = useState<RestaurantSettingsPublic>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar la configuración');
        }
        return response.json();
      })
      .then((data: RestaurantSettingsPublic) => {
        setForm({ ...EMPTY, ...data });
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const response = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo guardar');
      return;
    }

    setForm(await response.json());
    setMessage('Configuración guardada correctamente.');
  }

  if (loading) {
    return <p>Cargando configuración…</p>;
  }

  if (error && !form.name) {
    return <p>{error}</p>;
  }

  function updateField<K extends keyof RestaurantSettingsPublic>(
    key: K,
    value: RestaurantSettingsPublic[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <section>
      <h1>Configuración general</h1>
      <p style={{ color: '#6b5b4f', marginBottom: '1.5rem' }}>
        Edita la información mostrada en el sitio público y el correo de
        notificaciones del equipo.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '0.85rem', maxWidth: '720px' }}
      >
        {(
          [
            ['name', 'Nombre del restaurante'],
            ['tagline', 'Tagline'],
            ['heroTitle', 'Título del hero'],
            ['heroSubtitle', 'Subtítulo del hero'],
            ['aboutText', 'Texto sobre nosotros'],
            ['address', 'Dirección'],
            ['phone', 'Teléfono'],
            ['whatsappPhone', 'WhatsApp (solo números, ej. 573001234567)'],
            ['whatsappMessage', 'Mensaje predefinido de WhatsApp'],
            ['email', 'Correo público'],
            ['staffNotificationEmail', 'Correo de notificaciones del equipo'],
            ['instagramUrl', 'URL de Instagram'],
            ['openingHours', 'Horarios'],
            ['mapUrl', 'URL del mapa'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} style={{ display: 'grid', gap: '0.35rem' }}>
            {label}
            {key === 'aboutText' ? (
              <textarea
                rows={4}
                value={form[key] ?? ''}
                onChange={(event) => updateField(key, event.target.value)}
              />
            ) : (
              <input
                value={form[key] ?? ''}
                onChange={(event) => updateField(key, event.target.value)}
              />
            )}
          </label>
        ))}

        {error ? <p style={{ color: '#9a3412', margin: 0 }}>{error}</p> : null}
        {message ? <p style={{ color: '#2d4a3e', margin: 0 }}>{message}</p> : null}

        <button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </section>
  );
}
