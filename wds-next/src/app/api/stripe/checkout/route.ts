import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createOrderInSupabase } from '@/lib/supabase';
import { resolveCartServer } from '@/lib/cart-server';
import { CartItemRef } from '@/store/useCartStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawStripeKey = process.env.STRIPE_SECRET_KEY;
    const hasStripeKey = Boolean(
      rawStripeKey &&
      !rawStripeKey.includes('placeholder') &&
      !rawStripeKey.includes('twoj_tajny') &&
      rawStripeKey.trim().length > 10
    );

    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod = 'paczkomat',
      lockerCode,
      lockerAddress,
      pointId,
      items,
      discountCode,
      promoCode,
    } = body;

    // Validation of customer details
    if (!customerName?.trim() || !customerEmail?.trim() || !customerPhone?.trim()) {
      return NextResponse.json(
        { error: 'Wymagane są dane zamawiającego (imię i nazwisko, e-mail, telefon).' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Koszyk jest pusty.' },
        { status: 400 }
      );
    }

    const effectiveLockerCode = pointId || lockerCode;
    if (deliveryMethod === 'paczkomat' && !effectiveLockerCode) {
      return NextResponse.json(
        { error: 'Wybierz Paczkomat InPost przed przejściem do płatności.' },
        { status: 400 }
      );
    }

    if (deliveryMethod === 'courier' && !lockerAddress?.trim()) {
      return NextResponse.json(
        { error: 'Podaj pełny adres doręczenia dla przesyłki kurierskiej.' },
        { status: 400 }
      );
    }

    // Convert incoming items to canonical CartItemRef structure
    const cartRefs: CartItemRef[] = items.map((it: any) => ({
      productId: Number(it.productId || it.id),
      variant: it.variant || undefined,
      qty: Math.max(1, Number(it.qty || it.quantity) || 1),
    })).filter((it) => it.productId > 0);

    if (cartRefs.length === 0) {
      return NextResponse.json(
        { error: 'Nieprawidłowe pozycje w koszyku.' },
        { status: 400 }
      );
    }

    // Server-side price resolution and promotional calculations
    const effectivePromoCode = promoCode || discountCode || null;
    const resolvedCart = await resolveCartServer(cartRefs, effectivePromoCode);

    if (resolvedCart.items.length === 0 || resolvedCart.total < 0) {
      return NextResponse.json(
        { error: 'Nie udało się zweryfikować produktów w koszyku.' },
        { status: 400 }
      );
    }

    const orderNo = `WDS-${Math.floor(100000 + Math.random() * 900000)}`;

    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      req.headers.get('origin') ||
      req.headers.get('referer')?.replace(/\/$/, '') ||
      'https://warsawduragstore.com';

    // Helper: Stripe accepts only publicly accessible HTTPS images
    const getSafeImages = (imgUrl?: string): string[] => {
      if (!imgUrl) return [];
      if (
        imgUrl.startsWith('https://') &&
        !imgUrl.includes('localhost') &&
        !imgUrl.includes('127.0.0.1')
      ) {
        return [imgUrl];
      }
      return [];
    };

    // We determine which units among promo-eligible items are free
    const eligibleUnits: Array<{
      productId: number;
      name: string;
      image?: string;
      material?: string;
      variant?: string;
      unitPrice: number;
    }> = [];

    const nonEligibleLineItems: any[] = [];

    for (const item of resolvedCart.items) {
      const rawImg = item.product.images?.[0];
      const imgUrl = rawImg
        ? rawImg.startsWith('http')
          ? rawImg
          : `${origin.startsWith('https://') ? origin : 'https://warsawduragstore.com'}${rawImg}`
        : undefined;

      if (item.promoEligible) {
        for (let q = 0; q < item.qty; q++) {
          eligibleUnits.push({
            productId: item.productId,
            name: item.product.name,
            image: imgUrl,
            material: item.product.material,
            variant: item.variant,
            unitPrice: item.unitPrice,
          });
        }
      } else {
        nonEligibleLineItems.push({
          price_data: {
            currency: 'pln',
            product_data: {
              name: `${item.product.name}${item.variant ? ` (${item.variant})` : ''}`,
              images: getSafeImages(imgUrl),
              description: item.product.material || 'Warsaw Durag Store',
            },
            unit_amount: Math.round(item.unitPrice * 100),
          },
          quantity: item.qty,
        });
      }
    }

    const stripeLineItems: any[] = [...nonEligibleLineItems];

    // Group paid eligible units by (productId + variant + unitPrice)
    const paidMap = new Map<string, { unit: typeof eligibleUnits[0]; count: number }>();
    for (const unit of eligibleUnits) {
      const key = `${unit.productId}_${unit.variant || ''}_${unit.unitPrice}`;
      const existing = paidMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        paidMap.set(key, { unit, count: 1 });
      }
    }

    for (const { unit, count } of paidMap.values()) {
      stripeLineItems.push({
        price_data: {
          currency: 'pln',
          product_data: {
            name: `${unit.name}${unit.variant ? ` (${unit.variant})` : ''}`,
            images: getSafeImages(unit.image),
            description: unit.material || 'Warsaw Durag Store — Silk & Satin Durag',
          },
          unit_amount: Math.round(unit.unitPrice * 100),
        },
        quantity: count,
      });
    }

    // If Stripe key is missing in development mode, allow instant mock payment simulation
    if (!hasStripeKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Stripe Dev Mode] Brak STRIPE_SECRET_KEY w .env.local. Symulacja pomyślnej płatności.');
        const mockSessionId = `dev_mock_${Date.now()}`;
        const devOrderPayload = {
          order_no: orderNo,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          customer_phone: customerPhone.trim(),
          delivery_method: deliveryMethod as 'paczkomat' | 'courier' | 'pickup',
          locker_code: deliveryMethod === 'paczkomat' ? effectiveLockerCode : null,
          point_id: deliveryMethod === 'paczkomat' ? effectiveLockerCode : null,
          locker_address: lockerAddress || (deliveryMethod === 'pickup' ? 'Włodarzewska 4, Warszawa' : null),
          items: resolvedCart.items.map((i) => ({
            id: i.productId,
            name: i.product.name,
            price: i.unitPrice,
            quantity: i.qty,
            variant: i.variant,
            category: i.product.category,
            material: i.product.material,
            image: i.product.images?.[0] || null,
            promo_eligible: i.promoEligible,
          })),
          items_summary: resolvedCart.items
            .map((i) => `${i.qty}x ${i.product.name}${i.variant ? ` (${i.variant})` : ''}`)
            .join(' | '),
          subtotal: resolvedCart.subtotal,
          discount_code: resolvedCart.promoCode,
          discount_val: resolvedCart.freeItemsDiscount + resolvedCart.promoDiscount,
          total: resolvedCart.total,
          status: 'new' as const,
          payment_status: 'paid' as const,
          stripe_session_id: mockSessionId,
        };

        await createOrderInSupabase(devOrderPayload);

        return NextResponse.json({
          url: `${origin}/zamowienie/sukces?session_id=${mockSessionId}&order_no=${orderNo}&dev=true`,
          sessionId: mockSessionId,
          orderNo,
        });
      }

      return NextResponse.json(
        {
          error: 'Brak aktywnego klucza Stripe. Wklej poprawny STRIPE_SECRET_KEY (np. sk_test_... lub sk_live_...) w pliku wds-next/.env.local.',
        },
        { status: 500 }
      );
    }

    // Promo code coupon discount (if applicable beyond the BOGO promo)
    let discounts: { coupon: string }[] | undefined = undefined;
    if (resolvedCart.promoDiscount > 0) {
      try {
        const coupon = await stripe.coupons.create({
          amount_off: Math.round(resolvedCart.promoDiscount * 100),
          currency: 'pln',
          duration: 'once',
          name: resolvedCart.promoCode ? `KOD: ${resolvedCart.promoCode}` : 'RABAT',
        });
        discounts = [{ coupon: coupon.id }];
      } catch (err) {
        console.error('[Stripe] Błąd tworzenia kuponu rabatowego:', err);
      }
    }

    // Base Stripe Checkout Session config
    const sessionConfig = {
      mode: 'payment' as const,
      locale: 'pl' as const,
      customer_email: customerEmail.trim(),
      line_items: stripeLineItems,
      discounts,
      metadata: {
        order_no: orderNo,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        delivery_method: deliveryMethod,
        locker_code: effectiveLockerCode || '',
        point_id: effectiveLockerCode || '',
        locker_address: lockerAddress || '',
        discount_code: resolvedCart.promoCode || '',
        free_items_count: String(resolvedCart.freeItemsCount),
      },
      success_url: `${origin}/zamowienie/sukces?session_id={CHECKOUT_SESSION_ID}&order_no=${orderNo}`,
      cancel_url: `${origin}/checkout?canceled=true`,
    };

    // Resilient payment methods: try BLIK, P24, Card, fallback to default/card if account didn't enable BLIK
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        ...sessionConfig,
        payment_method_types: ['card', 'blik', 'p24'],
      });
    } catch (pmErr: any) {
      console.warn('[Stripe Checkout] Błąd specyficznych typów płatności (np. BLIK/P24 wyłączone w Dashboard), próba domyślnych metod konta:', pmErr?.message);
      try {
        session = await stripe.checkout.sessions.create(sessionConfig);
      } catch (fallbackErr: any) {
        console.warn('[Stripe Checkout] Ostateczny fallback do samej karty:', fallbackErr?.message);
        session = await stripe.checkout.sessions.create({
          ...sessionConfig,
          payment_method_types: ['card'],
        });
      }
    }

    // Save pending order to database with server-verified prices
    const orderPayload = {
      order_no: orderNo,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      customer_phone: customerPhone.trim(),
      delivery_method: deliveryMethod as 'paczkomat' | 'courier' | 'pickup',
      locker_code: deliveryMethod === 'paczkomat' ? effectiveLockerCode : null,
      point_id: deliveryMethod === 'paczkomat' ? effectiveLockerCode : null,
      locker_address: lockerAddress || (deliveryMethod === 'pickup' ? 'Włodarzewska 4, Warszawa' : null),
      items: resolvedCart.items.map((i) => ({
        id: i.productId,
        name: i.product.name,
        price: i.unitPrice,
        quantity: i.qty,
        variant: i.variant,
        category: i.product.category,
        material: i.product.material,
        image: i.product.images?.[0] || null,
        promo_eligible: i.promoEligible,
      })),
      items_summary: resolvedCart.items
        .map((i) => `${i.qty}x ${i.product.name}${i.variant ? ` (${i.variant})` : ''}`)
        .join(' | '),
      subtotal: resolvedCart.subtotal,
      discount_code: resolvedCart.promoCode,
      discount_val: resolvedCart.freeItemsDiscount + resolvedCart.promoDiscount,
      total: resolvedCart.total,
      status: 'pending_payment' as const,
      payment_status: 'pending' as const,
      stripe_session_id: session.id,
    };

    const dbRes = await createOrderInSupabase(orderPayload);
    if (!dbRes.success) {
      console.warn('[Supabase] Ostrzeżenie przy zapisie zamówienia wstępnego:', dbRes.error);
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderNo,
    });
  } catch (error: any) {
    console.error('[Stripe Checkout Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Wystąpił błąd podczas inicjalizacji płatności.' },
      { status: 500 }
    );
  }
}
