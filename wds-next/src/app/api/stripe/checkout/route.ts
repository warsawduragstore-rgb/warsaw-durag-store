import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createOrderInSupabase } from '@/lib/supabase';
import { resolveCartServer } from '@/lib/cart-server';
import { CartItemRef } from '@/store/useCartStore';

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
      'https://warsawduragstore.pl';

    // Construct Stripe line items strictly in accordance with Spec Section 5:
    // "Przy tworzeniu Stripe Checkout Session: backend przelicza line_items, dodając trzecią sztukę z unit_amount: 0 i etykietą 'GRATIS'."
    
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
      const imgUrl = item.product.images?.[0]
        ? item.product.images[0].startsWith('http')
          ? item.product.images[0]
          : `${origin}${item.product.images[0]}`
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
              images: imgUrl ? [imgUrl] : [],
              description: item.product.material || 'Warsaw Durag Store',
            },
            unit_amount: Math.round(item.unitPrice * 100),
          },
          quantity: item.qty,
        });
      }
    }

    // Sort eligible units by price ascending to award the cheapest ones for free
    eligibleUnits.sort((a, b) => a.unitPrice - b.unitPrice);

    const freeUnitsCount = resolvedCart.freeItemsCount;
    const freeUnits = eligibleUnits.slice(0, freeUnitsCount);
    const paidUnits = eligibleUnits.slice(freeUnitsCount);

    const stripeLineItems: any[] = [...nonEligibleLineItems];

    // Add free items with unit_amount: 0 and label GRATIS
    for (const freeUnit of freeUnits) {
      stripeLineItems.push({
        price_data: {
          currency: 'pln',
          product_data: {
            name: `GRATIS — ${freeUnit.name}${freeUnit.variant ? ` (${freeUnit.variant})` : ''}`,
            images: freeUnit.image ? [freeUnit.image] : [],
            description: 'Promocja Warsaw Durag Store: Kup 2, trzeci gratis!',
          },
          unit_amount: 0,
        },
        quantity: 1,
      });
    }

    // Group remaining paid units by (productId + variant + unitPrice)
    const paidMap = new Map<string, { unit: typeof eligibleUnits[0]; count: number }>();
    for (const unit of paidUnits) {
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
            images: unit.image ? [unit.image] : [],
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
          error: 'Brak aktywnego klucza Stripe. Wklej poprawny STRIPE_SECRET_KEY (np. sk_test_...) w pliku wds-next/.env.local.',
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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'blik', 'p24'],
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
    });

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
