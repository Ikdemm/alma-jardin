'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        password: form.get('password'),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo iniciar sesión');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.card}>
        <h1>Admin — Alma Jardín</h1>
        <p>Inicia sesión con tu cuenta administrativa.</p>
        <form className={styles.form} onSubmit={onSubmit}>
          <label>
            Correo electrónico
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@almajardin.com"
              autoComplete="username"
            />
          </label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              required
              defaultValue="Admin1234!"
              autoComplete="current-password"
            />
          </label>
          {error ? <p className={styles.error}>{error}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
        <p className={styles.footerLink}>
          <Link href="/admin/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>
      </div>
    </main>
  );
}
