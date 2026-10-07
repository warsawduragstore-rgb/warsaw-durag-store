import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidateTag, revalidatePath } from 'next/cache';
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

// GET /api/admin/products - Pobierz wszystkie produkty (w tym ukryte)
export async function GET() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Brak autoryzacji administratora' }, { status: 401 });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`, {
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

// POST /api/admin/products - Dodaj lub zaktualizuj produkt (service_role)
export async function POST(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Brak autoryzacji administratora' }, { status: 401 });
  }

  try {
    const product = await req.json();

    const payload: Record<string, unknown> = {
      name: product.name,
      name_en: product.nameEn || product.name_en || product.name,
      price: product.price,
      category: product.category,
      category_label: product.categoryLabel || product.category_label,
      material: product.material,
      description: product.description,
      images: product.images || [],
      colors: product.colors || [],
      reviews: product.reviews || [],
      stock: product.stock !== undefined ? Number(product.stock) : 10,
      visible: product.visible !== undefined ? Boolean(product.visible) : true,
      updated_at: new Date().toISOString(),
    };

    if (product.compareAtPrice !== undefined) {
      payload.compare_at_price = product.compareAtPrice;
    }
    if (product.promoEligible !== undefined) {
      payload.promo_eligible = product.promoEligible;
    }

    let res: Response;
    if (product.id) {
      // Aktualizacja istniejącego rekordu
      res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      });
    } else {
      // Tworzenie nowego rekordu
      res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, error: errText }, { status: res.status });
    }

    const data = await res.json();

    // Natychmiastowe unieważnienie cache Next.js
    try {
      revalidateTag('products', 'default');
      revalidatePath('/');
      revalidatePath('/kolekcja');
      revalidatePath('/produkt/[slug]', 'page');
    } catch {
      // Ignoruj błędy rewalidacji w trybie dev
    }

    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Błąd zapisu produktu' }, { status: 500 });
  }
}

// DELETE /api/admin/products - Usuń produkt o podanym ID
export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Brak autoryzacji administratora' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Brak ID produktu do usunięcia' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, error: errText }, { status: res.status });
    }

    try {
      revalidateTag('products', 'default');
      revalidatePath('/');
      revalidatePath('/kolekcja');
      revalidatePath('/produkt/[slug]', 'page');
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Błąd usuwania produktu' }, { status: 500 });
  }
}
