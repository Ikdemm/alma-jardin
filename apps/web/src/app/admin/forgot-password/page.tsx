'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import styles from '../login/login.module.css';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setDevToken(null);

    const form = new FormData(event.currentTarget);

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email') }),
    });

    const body = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(body.message ?? 'No se pudo enviar el correo');
      return;
    }

    setMessage(body.message ?? 'Revisa tu correo para continuar.');
    if (typeof body.resetToken === 'string') {
      setDevToken(body.resetToken);
    }
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.card}>
        <h1>Recuperar contraseña</h1>
        <p>
          Te enviaremos un enlace para definir una nueva contraseña de
          administrador.
        </p>
        <form className={styles.form} onSubmit={onSubmit}>
          <label>
            Correo electrónico
            <input name="email" type="email" required autoComplete="email" />
          </label>
          {error ? <p className={styles.error}>{error}</p> : null}
          {message ? <p className={styles.success}>{message}</p> : null}
          {devToken ? (
            <p className={styles.devHint}>
              Dev token:{' '}
              <Link href={`/admin/reset-password?token=${encodeURIComponent(devToken)}`}>
                abrir enlace de restablecimiento
              </Link>
            </p>
          ) : null}
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar enlace'}
          </button>
        </form>
        <p className={styles.footerLink}>
          <Link href="/admin/login">← Volver al inicio de sesión</Link>
        </p>
      </div>
    </main>
  );
}
