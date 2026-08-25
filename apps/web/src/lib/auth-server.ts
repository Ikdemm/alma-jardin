import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { AuthAdmin } from '@alma-jardin/shared';
import { ADMIN_COOKIE, apiFetch } from './api-client';

export async function getAdminSession(): Promise<AuthAdmin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return await apiFetch<AuthAdmin>('/auth/me', { token });
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AuthAdmin> {
  const admin = await getAdminSession();

  if (!admin) {
    redirect('/admin/login');
  }

  return admin;
}
