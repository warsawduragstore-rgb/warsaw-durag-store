import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { fetchOrderBySessionId, fetchOrderByOrderNo, updateOrderPaymentBySessionId } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    const orderNo = searchParams.get('order_no');

    if (!sessionId && !orderNo) {
      return NextResponse.json({ error: 'Brak identyfikatora sesji lub zamówienia.' }, { status: 400 });
    }

    let session = null;
    if (sessionId && process.env.STRIPE_SECRET_KEY) {
      try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
      } catch (err) {
        console.warn('[Stripe Session] Nie udało się pobrać sesji ze Stripe:', err);
      }
    }

    // Try to find the order in Supabase
    let order = null;
    if (sessionId) {
      order = await fetchOrderBySessionId(sessionId);
    }
    if (!order && orderNo) {
      order = await fetchOrderByOrderNo(orderNo);
    }

    // If Stripe says paid, ensure DB is marked paid as well
    if (session && session.payment_status === 'paid' && order) {
      if (order.payment_status !== 'paid') {
        await updateOrderPaymentBySessionId(session.id, {
          payment_status: 'paid',
          status: 'new',
          payment_method: session.payment_method_types?.[0] || 'stripe',
        });
        order.payment_status = 'paid';
        order.status = 'new';
      }
    }

    return NextResponse.json({
      success: true,
      paid: session?.payment_status === 'paid' || order?.payment_status === 'paid',
      order: order || {
        order_no: orderNo || session?.metadata?.order_no || 'WDS-UNKNOWN',
        customer_name: session?.metadata?.customer_name,
        customer_email: session?.customer_email || session?.metadata?.customer_email,
        customer_phone: session?.metadata?.customer_phone,
        delivery_method: session?.metadata?.delivery_method,
        locker_code: session?.metadata?.locker_code,
        locker_address: session?.metadata?.locker_address,
        total: session?.amount_total ? session.amount_total / 100 : 0,
      },
    });
  } catch (error: any) {
    console.error('[Stripe Session Route Error]:', error);
    return NextResponse.json({ error: error?.message || 'Błąd serwera' }, { status: 500 });
  }
}
