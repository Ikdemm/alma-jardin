'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { AdminStatus, AdminSummary } from '@alma-jardin/shared';

const STATUS_LABELS: Record<AdminStatus, string> = {
  pending: 'Pendiente',
  active: 'Activo',
  blocked: 'Bloqueado',
  inactive: 'Inactivo',
};

export default function AdminDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/admins/${params.id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Administrador no encontrado');
        return response.json();
      })
      .then(setAdmin)
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  async function toggleBlock() {
    if (!admin) return;
    setWorking(true);
    setError(null);
    setInfo(null);

    const action = admin.status === 'blocked' ? 'unblock' : 'block';
    const response = await fetch(`/api/admin/admins/${admin.id}/${action}`, {
      method: 'POST',
    });

    setWorking(false);

    if (!response.ok) {
      setError('No se pudo actualizar el estado');
      return;
    }

    const updated = await response.json();
    setAdmin(updated);
    router.refresh();
  }

  async function resendInvite() {
    if (!admin) return;
    setWorking(true);
    setError(null);
    setInfo(null);

    const response = await fetch(
      `/api/admin/admins/${admin.id}/resend-invite`,
      { method: 'POST' },
    );
    const body = await response.json().catch(() => ({}));
    setWorking(false);

    if (!response.ok) {
      setError(body.message ?? 'No se pudo reenviar la invitación');
      return;
    }

    setAdmin(body);
    setInfo(
      body.inviteSent
        ? 'Invitación reenviada por correo.'
        : 'Token regenerado. SMTP no configurado — usa recuperar contraseña en desarrollo.',
    );
    router.refresh();
  }

  if (error && !admin) return <p>{error}</p>;
  if (!admin) return <p>Cargando…</p>;

  return (
    <section>
      <h1>
        {admin.firstName} {admin.lastName}
      </h1>
      <p>{admin.email}</p>
      <p>Estado: {STATUS_LABELS[admin.status] ?? admin.status}</p>
      <p>Roles asignados: {admin.roleIds.length}</p>

      {error ? <p style={{ color: '#b42318' }}>{error}</p> : null}
      {info ? <p style={{ color: '#1f6b4a' }}>{info}</p> : null}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {!admin.isSuperAdmin ? (
          <button type="button" onClick={toggleBlock} disabled={working}>
            {admin.status === 'blocked' ? 'Reactivar cuenta' : 'Bloquear cuenta'}
          </button>
        ) : null}
        {!admin.isSuperAdmin && admin.status === 'pending' ? (
          <button type="button" onClick={resendInvite} disabled={working}>
            Reenviar invitación
          </button>
        ) : null}
      </div>
    </section>
  );
}
