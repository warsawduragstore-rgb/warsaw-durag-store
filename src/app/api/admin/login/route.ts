import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  getAdminPassword,
} from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Proszę podać hasło dostępowe.' },
        { status: 400 }
      );
    }

    const expectedPassword = getAdminPassword();
    if (password.trim() !== expectedPassword.trim()) {
      return NextResponse.json(
        { error: 'Nieprawidłowe hasło dostępowe.' },
        { status: 401 }
      );
    }

    const token = await createAdminSessionToken();
    const response = NextResponse.json({ success: true, message: 'Zalogowano pomyślnie' });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera podczas autoryzacji.' },
      { status: 500 }
    );
  }
}
