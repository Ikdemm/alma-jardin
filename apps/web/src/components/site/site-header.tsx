'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AlmaLogo } from './alma-logo';
import { CartIcon } from './cart-icon';
import styles from './site-header.module.css';

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/menu', label: 'Menú' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === '/';

  return (
    <header
      className={styles.header}
      data-home={isHome ? 'true' : 'false'}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link
            href="/"
            className={styles.brand}
            aria-label="Alma Jardín — inicio"
            onClick={() => setOpen(false)}
          >
            <AlmaLogo tone={isHome ? 'light' : 'dark'} size="md" priority={isHome} />
          </Link>
        </div>

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
            className={styles.ctaMobile}
            onClick={() => setOpen(false)}
          >
            Reservar mesa
          </Link>
        </nav>

        <div className={styles.right}>
          <Link
            href="/reservar"
            className={styles.cta}
            onClick={() => setOpen(false)}
          >
            Reservar mesa
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

          <Link
            href="/carrito"
            className={styles.cartLink}
            aria-label="Ver carrito"
            data-active={pathname === '/carrito' ? 'true' : 'false'}
            onClick={() => setOpen(false)}
          >
            <CartIcon className={styles.cartIcon} />
          </Link>
        </div>
      </div>
    </header>
  );
}
