import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api-client';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const result = await apiFetch<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo restablecer la contraseña';
    return NextResponse.json({ message }, { status: 400 });
  }
}
