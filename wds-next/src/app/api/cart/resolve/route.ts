import { NextRequest, NextResponse } from 'next/server';
import { resolveCartServer } from '@/lib/cart-server';
import { CartItemRef } from '@/store/useCartStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: CartItemRef[] = body.items || [];
    const promoCode: string | null = body.promoCode || null;

    const resolved = await resolveCartServer(items, promoCode);

    return NextResponse.json(resolved);
  } catch (error: any) {
    console.error('[API Cart Resolve Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Błąd podczas kalkulacji koszyka.' },
      { status: 500 }
    );
  }
}
