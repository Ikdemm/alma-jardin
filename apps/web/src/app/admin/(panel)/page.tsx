import { requireAdminSession } from '@/lib/auth-server';
import { hasPermission } from '@alma-jardin/shared';

export default async function AdminDashboardPage() {
  const admin = await requireAdminSession();

  return (
    <section>
      <h1>Panel administrativo</h1>
      <p>Bienvenido, {admin.firstName}.</p>
      <ul>
        <li>
          Administradores:{' '}
          {hasPermission(admin, 'admins.read') ? 'acceso permitido' : 'sin acceso'}
        </li>
        <li>
          Roles:{' '}
          {hasPermission(admin, 'roles.read') ? 'acceso permitido' : 'sin acceso'}
        </li>
        <li>
          Permisos efectivos:{' '}
          {admin.isSuperAdmin ? 'todos' : admin.permissions.length}
        </li>
      </ul>
    </section>
  );
}
