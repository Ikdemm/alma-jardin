import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, apiFetch } from '@/lib/api-client';
import type { LoginResponse } from '@alma-jardin/shared';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const result = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = NextResponse.json({
      admin: result.admin,
    });

    response.cookies.set(ADMIN_COOKIE, result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ message }, { status: 401 });
  }
}
