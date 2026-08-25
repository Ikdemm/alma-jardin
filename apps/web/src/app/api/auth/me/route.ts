import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-server';

export async function GET() {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(admin);
}
