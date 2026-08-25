import Link from 'next/link';
import type { RestaurantSettingsPublic } from '@alma-jardin/shared';
import { whatsappUrl } from '@/lib/format';
import { ColibriMark } from './colibri-mark';
import styles from './site-footer.module.css';

export function SiteFooter({ settings }: { settings: RestaurantSettingsPublic }) {
  const waLink = whatsappUrl(settings.whatsappPhone, settings.whatsappMessage);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <div className={styles.brand}>
            <ColibriMark className={styles.mark} />
            <strong>{settings.name}</strong>
          </div>
          <p>{settings.tagline}</p>
        </div>

        <div>
          <h3>Visítanos</h3>
          <p>{settings.address}</p>
          <p>{settings.openingHours}</p>
        </div>

        <div>
          <h3>Contacto</h3>
          <p>
            <a href={`tel:${settings.phone}`}>{settings.phone}</a>
          </p>
          <p>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </p>
          <p>
            <a href={waLink} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </p>
          {settings.instagramUrl ? (
            <p>
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </p>
          ) : null}
        </div>

        <div>
          <h3>Explora</h3>
          <nav className={styles.links}>
            <Link href="/menu">Menú</Link>
            <Link href="/reservar">Reservar</Link>
            <Link href="/contacto">Contacto</Link>
            <Link href="/admin/login">Admin</Link>
          </nav>
        </div>
      </div>

      <div className={styles.copy}>
        © {new Date().getFullYear()} {settings.name}. Cocina de jardín, fuego lento y colibríes.
      </div>
    </footer>
  );
}
