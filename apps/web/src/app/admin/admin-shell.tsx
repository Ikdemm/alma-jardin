'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { AuthAdmin } from '@alma-jardin/shared';
import { hasPermission } from '@alma-jardin/shared';
import styles from './admin.module.css';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', permission: null },
  { href: '/admin/admins', label: 'Administradores', permission: 'admins.read' as const },
  { href: '/admin/roles', label: 'Roles', permission: 'roles.read' as const },
];

export function AdminShell({
  admin,
  children,
}: {
  admin: AuthAdmin;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className={styles.adminShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Alma Jardín Admin</div>
        <nav className={styles.nav}>
          {NAV_ITEMS.filter(
            (item) =>
              !item.permission || hasPermission(admin, item.permission),
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={pathname === item.href ? 'true' : 'false'}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <strong>
              {admin.firstName} {admin.lastName}
            </strong>
            <div className={styles.userMeta}>
              {admin.isSuperAdmin ? 'Super administrador' : admin.email}
            </div>
          </div>
          <button type="button" onClick={logout}>
            Cerrar sesión
          </button>
        </header>
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}
