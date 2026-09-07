import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const city = searchParams.get('city') || '';
    const limit = Math.min(Number(searchParams.get('limit')) || 15, 30);

    const targetUrl = new URL('https://api-shipx-pl.easypack24.net/v1/points');
    targetUrl.searchParams.set('type', 'parcel_locker');
    targetUrl.searchParams.set('status', 'Operating');
    targetUrl.searchParams.set('limit', String(limit));

    if (query.trim()) {
      targetUrl.searchParams.set('query', query.trim());
    }
    if (city.trim()) {
      targetUrl.searchParams.set('city', city.trim());
    }

    const res = await fetch(targetUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WarsawDuragStore/1.0 (+https://warsawduragstore.pl)',
      },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Błąd połączenia z InPost API', status: res.status, points: [] },
        { status: res.status }
      );
    }

    const data = await res.json();
    const rawItems = Array.isArray(data.items) ? data.items : [];

    const points = rawItems.map((item: any) => ({
      name: item.name, // np. WAW198M
      city: item.address_details?.city || item.address?.line2 || '',
      street: item.address_details?.street || item.address?.line1 || '',
      buildingNumber: item.address_details?.building_number || '',
      postCode: item.address_details?.post_code || '',
      province: item.address_details?.province || '',
      locationDescription: item.location_description || item.location_description_1 || '',
      imageUrl: item.image_url || null,
      operatingHours: item.opening_hours || '24/7',
      is24_7: Boolean(item.location_247 ?? true),
    }));

    return NextResponse.json({ points, count: points.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Nieoczekiwany błąd serwera', points: [] },
      { status: 500 }
    );
  }
}
