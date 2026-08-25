import type { HealthResponse } from '@alma-jardin/shared';
import styles from './page.module.css';

async function getHealth(): Promise<HealthResponse | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api';

  try {
    const response = await fetch(`${baseUrl}/health`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function Index() {
  const health = await getHealth();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Alma Jardín</p>
        <h1>Restaurant platform bootstrap</h1>
        <p className={styles.lead}>
          Nx monorepo with Next.js, NestJS, TypeScript, and MongoDB.
        </p>
      </section>

      <section className={styles.card}>
        <h2>API health</h2>
        {health ? (
          <dl className={styles.stats}>
            <div>
              <dt>Status</dt>
              <dd>{health.status}</dd>
            </div>
            <div>
              <dt>MongoDB</dt>
              <dd>{health.mongo}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>{health.service}</dd>
            </div>
          </dl>
        ) : (
          <p className={styles.warning}>
            API unreachable. Start MongoDB and run{' '}
            <code>npm run dev:api</code>.
          </p>
        )}
      </section>

      <section className={styles.card}>
        <h2>Development</h2>
        <ul className={styles.commands}>
          <li>
            <code>npm run docker:up</code> — start MongoDB
          </li>
          <li>
            <code>npm run dev:api</code> — NestJS on port 3333
          </li>
          <li>
            <code>npm run dev:web</code> — Next.js on port 4200
          </li>
        </ul>
      </section>
    </main>
  );
}
