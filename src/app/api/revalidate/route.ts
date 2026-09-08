import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag') || 'products';
  const path = searchParams.get('path');

  try {
    if (tag) {
      revalidateTag(tag, 'default');
    }
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath('/');
      revalidatePath('/kolekcja/[slug]', 'page');
      revalidatePath('/produkt/[slug]', 'page');
    }

    return NextResponse.json({
      revalidated: true,
      tag,
      path: path || 'all storefront paths',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Błąd rewalidacji';
    return NextResponse.json({ revalidated: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
