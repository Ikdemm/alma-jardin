import { requireAdminSession } from '@/lib/auth-server';
import { AdminShell } from '../admin-shell';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminSession();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
