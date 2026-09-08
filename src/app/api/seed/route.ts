import { NextRequest, NextResponse } from 'next/server';
import { seedProductsIfEmpty } from '@/lib/products-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const result = await seedProductsIfEmpty();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
