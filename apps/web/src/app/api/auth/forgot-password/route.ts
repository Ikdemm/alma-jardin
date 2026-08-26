import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api-client';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const result = await apiFetch<{
      message: string;
      resetToken?: string;
      emailSent?: boolean;
    }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo procesar la solicitud';
    return NextResponse.json({ message }, { status: 400 });
  }
}
