'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ColibriMark } from './colibri-mark';
import styles from './site-header.module.css';

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/menu', label: 'Menú' },
  { href: '/reservar', label: 'Reservar' },
  { href: '/contacto', label: 'Contacto' },
];

export function SiteHeader({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <ColibriMark className={styles.mark} />
          <span>{siteName}</span>
        </Link>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <nav className={styles.nav} data-open={open ? 'true' : 'false'}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={pathname === link.href ? 'true' : 'false'}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reservar"
            className={styles.cta}
            onClick={() => setOpen(false)}
          >
            Reservar mesa
          </Link>
        </nav>
      </div>
    </header>
  );
}
