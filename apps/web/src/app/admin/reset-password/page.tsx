'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../login/login.module.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = useMemo(
    () => searchParams.get('token')?.trim() ?? '',
    [searchParams],
  );

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') ?? '');
    const confirm = String(form.get('confirm') ?? '');
    const token = String(form.get('token') ?? tokenFromQuery);

    if (password !== confirm) {
      setLoading(false);
      setError('Las contraseñas no coinciden');
      return;
    }

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const body = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(body.message ?? 'No se pudo actualizar la contraseña');
      return;
    }

    setMessage(body.message ?? 'Contraseña actualizada');
    setTimeout(() => {
      router.push('/admin/login');
      router.refresh();
    }, 900);
  }

  return (
    <div className={styles.card}>
      <h1>Nueva contraseña</h1>
      <p>
        Define una contraseña segura para tu cuenta de administrador de Alma
        Jardín.
      </p>
      <form className={styles.form} onSubmit={onSubmit}>
        {!tokenFromQuery ? (
          <label>
            Token
            <input name="token" required placeholder="Token del correo" />
          </label>
        ) : (
          <input type="hidden" name="token" value={tokenFromQuery} />
        )}
        <label>
          Nueva contraseña
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label>
          Confirmar contraseña
          <input
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        {message ? <p className={styles.success}>{message}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </form>
      <p className={styles.footerLink}>
        <Link href="/admin/login">← Volver al inicio de sesión</Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className={styles.loginPage}>
      <Suspense fallback={<div className={styles.card}><p>Cargando…</p></div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
