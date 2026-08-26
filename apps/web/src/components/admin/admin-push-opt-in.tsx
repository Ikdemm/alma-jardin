'use client';

import { useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

type PushState = 'loading' | 'unsupported' | 'disabled' | 'denied' | 'subscribed' | 'ready';

export function AdminPushOptIn() {
  const [state, setState] = useState<PushState>('loading');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void refreshState();
  }, []);

  async function refreshState() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported');
      return;
    }

    const statusResponse = await fetch('/api/admin/notifications/push/status');
    if (!statusResponse.ok) {
      setState('disabled');
      return;
    }

    const status = await statusResponse.json();
    if (!status.pushConfigured || !status.vapidPublicKey) {
      setState('disabled');
      return;
    }

    await navigator.serviceWorker.register('/sw.js');
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();

    if (Notification.permission === 'denied') {
      setState('denied');
      return;
    }

    setState(existing ? 'subscribed' : 'ready');
  }

  async function enablePush() {
    setBusy(true);
    setMessage(null);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState('denied');
        setBusy(false);
        return;
      }

      const statusResponse = await fetch('/api/admin/notifications/push/status');
      const status = await statusResponse.json();

      if (!status.vapidPublicKey) {
        setState('disabled');
        setBusy(false);
        return;
      }

      await navigator.serviceWorker.register('/sw.js');
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(status.vapidPublicKey),
      });

      const json = subscription.toJSON();
      const response = await fetch('/api/admin/notifications/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar la suscripción');
      }

      setState('subscribed');
      setMessage('Notificaciones activadas en este dispositivo.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al activar push');
    } finally {
      setBusy(false);
    }
  }

  async function disablePush() {
    setBusy(true);
    setMessage(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch('/api/admin/notifications/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      setState('ready');
      setMessage('Notificaciones desactivadas en este dispositivo.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al desactivar');
    } finally {
      setBusy(false);
    }
  }

  if (state === 'loading') {
    return null;
  }

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1rem 1.15rem',
        borderRadius: '0.9rem',
        background: '#f6f2ec',
        border: '1px solid rgba(31, 26, 23, 0.08)',
      }}
    >
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem' }}>
        Notificaciones push (PWA)
      </h2>
      <p style={{ margin: '0 0 0.85rem', color: '#6b5b4f', lineHeight: 1.5 }}>
        Recibe alertas en este dispositivo cuando llegue una reserva o un mensaje
        de contacto. Instala la app desde el navegador para usarla como PWA.
      </p>

      {state === 'unsupported' ? (
        <p style={{ margin: 0 }}>Este navegador no soporta Web Push.</p>
      ) : null}
      {state === 'disabled' ? (
        <p style={{ margin: 0 }}>
          Push no configurado en el servidor (faltan claves VAPID).
        </p>
      ) : null}
      {state === 'denied' ? (
        <p style={{ margin: 0 }}>
          El permiso de notificaciones está bloqueado en el navegador.
        </p>
      ) : null}

      {state === 'ready' ? (
        <button type="button" onClick={enablePush} disabled={busy}>
          {busy ? 'Activando…' : 'Activar notificaciones'}
        </button>
      ) : null}

      {state === 'subscribed' ? (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ alignSelf: 'center', color: '#2d4a3e' }}>
            Activadas en este dispositivo
          </span>
          <button type="button" onClick={disablePush} disabled={busy}>
            Desactivar
          </button>
        </div>
      ) : null}

      {message ? <p style={{ margin: '0.75rem 0 0' }}>{message}</p> : null}
    </div>
  );
}
