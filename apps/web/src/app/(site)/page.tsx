import Link from 'next/link';
import { ColibriMark } from '@/components/site/colibri-mark';
import { MenuCard } from '@/components/site/menu-card';
import { whatsappUrl } from '@/lib/format';
import {
  getFeaturedItems,
  getPublicSettings,
} from '@/lib/public-api';
import styles from './site.module.css';

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getPublicSettings(),
    getFeaturedItems(),
  ]);

  const heroTitle =
    settings?.heroTitle ?? 'Donde el jardín se encuentra con la alta cocina';
  const heroSubtitle =
    settings?.heroSubtitle ??
    'Un refugio verde donde la naturaleza, el fuego lento y el vuelo del colibrí inspiran cada plato.';
  const aboutText =
    settings?.aboutText ??
    'Cocina gourmet en un entorno vivo, con ingredientes de estación y el susurro del bosque.';
  const waLink = settings
    ? whatsappUrl(settings.whatsappPhone, settings.whatsappMessage)
    : '#';

  return (
    <>
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              {settings?.tagline ?? 'Restaurante · Jardín · Cocina de autor'}
            </p>
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
            <div className={styles.heroActions}>
              <Link href="/reservar" className={styles.primaryButton}>
                Reservar mesa
              </Link>
              <Link href="/menu" className={styles.secondaryButton}>
                Ver menú
              </Link>
            </div>
          </div>

          <aside className={styles.heroPanel}>
            <ColibriMark className={styles.heroMark} />
            <p className={styles.sectionLead}>
              Entre árboles, hierbas aromáticas y la gracia silenciosa del colibrí,
              servimos una experiencia íntima de alta cocina.
            </p>
            <ul>
              <li>Ingredientes de huerto y proveedores de confianza</li>
              <li>Pizzas y pastas con masa longamente fermentada</li>
              <li>Mesas bajo la luz filtrada del jardín</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.gridTwo}>
            <div>
              <p className={styles.eyebrow}>Nuestra alma</p>
              <h2 className={styles.sectionTitle}>Un jardín que se come</h2>
              <p className={styles.sectionLead}>{aboutText}</p>
            </div>
            <div className={styles.featureGrid}>
              <article className={styles.featureCard}>
                <h3>Naturaleza</h3>
                <p>
                  Un entorno verde que cambia con las estaciones y acompaña cada
                  servicio.
                </p>
              </article>
              <article className={styles.featureCard}>
                <h3>Fuego lento</h3>
                <p>
                  Técnicas pacientes, horno y brasas para resaltar lo esencial de
                  cada ingrediente.
                </p>
              </article>
              <article className={styles.featureCard}>
                <h3>Colibrí</h3>
                <p>
                  Nuestro símbolo: ligereza, precisión y belleza en cada detalle
                  del servicio.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Carta destacada</p>
          <h2 className={styles.sectionTitle}>Sabores del huerto</h2>
          <p className={styles.sectionLead}>
            Una selección de platos que capturan la esencia del jardín y la cocina
            gourmet.
          </p>

          <div className={styles.menuGrid}>
            {(featured ?? []).map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          <div className={styles.heroActions} style={{ marginTop: '2rem' }}>
            <Link href="/menu" className={styles.primaryButton}>
              Explorar menú completo
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.gridTwo}>
            <div>
              <p className={styles.eyebrow}>Visítanos</p>
              <h2 className={styles.sectionTitle}>Horarios y ubicación</h2>
              <div className={styles.infoCard}>
                <strong>Dirección</strong>
                <span>{settings?.address ?? 'Camino del Bosque 123'}</span>
              </div>
              <div className={styles.infoCard} style={{ marginTop: '1rem' }}>
                <strong>Horario</strong>
                <span>
                  {settings?.openingHours ??
                    'Mar–Dom · Almuerzo 12:00–16:00 · Cena 18:00–23:00'}
                </span>
              </div>
            </div>

            <div className={styles.ctaBand}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
                  Reserva tu mesa
                </h3>
                <p>
                  Cuéntanos cuántos vienen, cuándo y si celebran algo especial.
                  Te responderemos para confirmar.
                </p>
              </div>
              <div className={styles.heroActions}>
                <Link href="/reservar" className={styles.secondaryButton}>
                  Reservar en línea
                </Link>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.secondaryButton}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
