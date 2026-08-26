'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RoleSummary } from '@alma-jardin/shared';

export default function NewAdminPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [setPasswordNow, setSetPasswordNow] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/roles?limit=100')
      .then((response) => response.json())
      .then((result) => setRoles(result.data ?? []));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setSaving(true);

    const form = new FormData(event.currentTarget);
    const roleIds = form.getAll('roleIds') as string[];
    const password = setPasswordNow
      ? String(form.get('password') || '')
      : undefined;

    if (setPasswordNow && (!password || password.length < 8)) {
      setSaving(false);
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const response = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.get('firstName'),
        lastName: form.get('lastName'),
        email: form.get('email'),
        phone: form.get('phone') || undefined,
        password: password || undefined,
        roleIds,
      }),
    });

    const body = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setError(body.message ?? 'No se pudo crear el administrador');
      return;
    }

    if (body.invited) {
      setInfo(
        body.inviteSent
          ? 'Invitación enviada por correo. El administrador definirá su contraseña desde el enlace.'
          : 'Administrador creado como pendiente. SMTP no está configurado: usa “Reenviar invitación” o recuperación de contraseña en desarrollo.',
      );
      setTimeout(() => {
        router.push(`/admin/admins/${body.id}`);
        router.refresh();
      }, 1200);
      return;
    }

    router.push('/admin/admins');
    router.refresh();
  }

  return (
    <section>
      <h1>Nuevo administrador</h1>
      <p style={{ color: '#6b5b4f', maxWidth: 520 }}>
        Por defecto se envía una invitación por correo para que la persona active
        su cuenta y elija contraseña. También puedes definir una contraseña ahora.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem', maxWidth: 480 }}>
        <label>
          Nombre
          <input name="firstName" required />
        </label>
        <label>
          Apellido
          <input name="lastName" required />
        </label>
        <label>
          Correo
          <input name="email" type="email" required />
        </label>
        <label>
          Teléfono
          <input name="phone" />
        </label>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={setPasswordNow}
            onChange={(event) => setSetPasswordNow(event.target.checked)}
          />
          Definir contraseña ahora (sin invitación)
        </label>
        {setPasswordNow ? (
          <label>
            Contraseña
            <input name="password" type="password" minLength={8} required />
          </label>
        ) : null}
        <fieldset>
          <legend>Roles</legend>
          {roles.map((role) => (
            <label key={role.id} style={{ display: 'block' }}>
              <input type="checkbox" name="roleIds" value={role.id} /> {role.name}
            </label>
          ))}
        </fieldset>
        {error ? <p style={{ color: '#b42318' }}>{error}</p> : null}
        {info ? <p style={{ color: '#1f6b4a' }}>{info}</p> : null}
        <button type="submit" disabled={saving}>
          {saving
            ? 'Guardando…'
            : setPasswordNow
              ? 'Crear administrador'
              : 'Invitar administrador'}
        </button>
      </form>
    </section>
  );
}
