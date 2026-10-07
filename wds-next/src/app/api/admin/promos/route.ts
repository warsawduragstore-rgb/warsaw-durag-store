import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjljaljfmrqocnfglrij.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getHeaders() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };
}

async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return await verifyAdminSessionToken(token);
}

// GET /api/admin/promos - Pobierz kody rabatowe
export async function GET() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Brak autoryzacji administratora' }, { status: 401 });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/promo_codes?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ success: false, error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Błąd serwera' }, { status: 500 });
  }
}

// POST /api/admin/promos - Utwórz lub zaktualizuj kod
export async function POST(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Brak autoryzacji administratora' }, { status: 401 });
  }

  try {
    const { code, rate, active } = await req.json();

    if (!code || rate === undefined) {
      return NextResponse.json({ success: false, error: 'Brak kodu lub zniżki' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/promo_codes`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        code: code.toUpperCase().trim(),
        rate: Number(rate),
        active: active !== undefined ? Boolean(active) : true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, error: errText }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Błąd zapisu kodu' }, { status: 500 });
  }
}

// PATCH /api/admin/promos - Zmień status aktywności kodu
export async function PATCH(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Brak autoryzacji administratora' }, { status: 401 });
  }

  try {
    const { id, active } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Brak ID kodu' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/promo_codes?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        ...getHeaders(),
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ active: Boolean(active) }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, error: errText }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Błąd aktualizacji' }, { status: 500 });
  }
}
