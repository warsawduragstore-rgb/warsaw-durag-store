import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, PackageCheck, MapPin, Truck, ArrowLeft, ShieldCheck, ShoppingBag, Clock } from 'lucide-react';
import { fetchOrderByOrderNo, getSupabaseServerClient } from '@/lib/supabase';

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function OrderLookupPage({ params }: OrderPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  let order = await fetchOrderByOrderNo(decodedId);

  // If not found by order_no, attempt to fetch by numeric ID or stripe session
  if (!order) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      if (/^\d+$/.test(decodedId)) {
        const { data } = await supabase.from('orders').select('*').eq('id', Number(decodedId)).maybeSingle();
        if (data) order = data;
      }
      if (!order && decodedId.startsWith('cs_')) {
        const { data } = await supabase.from('orders').select('*').eq('stripe_session_id', decodedId).maybeSingle();
        if (data) order = data;
      }
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#FAFAF9] pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#141416] border border-[#26262A] p-8 space-y-4">
          <p className="font-serif text-2xl text-white">Nie znaleziono zamówienia</p>
          <p className="text-xs text-[#A3A09B]">
            Nie odnaleźliśmy zamówienia o numerze <span className="text-white font-medium">{decodedId}</span>.
            Sprawdź czy numer z e-maila jest poprawny.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 bg-[#C8794B] text-[#0B0B0C] font-semibold text-xs uppercase tracking-wider hover:bg-[#b56b3e] transition-colors"
          >
            Strona główna
          </Link>
        </div>
      </div>
    );
  }

  const isPaczkomat = order.delivery_method === 'paczkomat';
  const isPaid = order.payment_status === 'paid';

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAFAF9] pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A3A09B] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Wróć do sklepu
        </Link>

        {/* Status Card */}
        <div className="bg-[#141416] border border-[#26262A] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="inline-block px-3 py-1 bg-[#1E1E22] border border-[#2E2E33] text-[11px] text-[#C8794B] font-medium uppercase tracking-wider mb-3">
              {isPaid ? 'Opłacone · W realizacji' : 'Oczekuje na płatność'}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight mb-2 text-white">
              Zamówienie {order.order_no}
            </h1>
            <p className="text-[#A3A09B] text-xs sm:text-sm max-w-md mx-auto">
              Dziękujemy za zakupy w Warsaw Durag Store. Poniżej znajdują się szczegóły Twojego zamówienia.
            </p>
          </div>

          {/* Details Section */}
          <div className="mt-8 pt-6 border-t border-[#26262A] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery */}
              <div className="p-4 bg-[#0B0B0C] border border-[#26262A]">
                <div className="flex items-center gap-2 text-[11px] text-[#A3A09B] uppercase tracking-wider mb-2 font-medium">
                  {isPaczkomat ? <PackageCheck className="w-4 h-4 text-[#C8794B]" /> : <Truck className="w-4 h-4 text-[#C8794B]" />}
                  Dostawa
                </div>
                <div className="font-medium text-white text-sm">
                  {isPaczkomat ? 'Paczkomat InPost 24/7' : 'Kurier'}
                </div>
                {order.locker_code && (
                  <div className="text-xs text-[#C8794B] mt-1 font-semibold tabular-nums">
                    Paczkomat: {order.locker_code}
                  </div>
                )}
                {order.locker_address && (
                  <div className="text-xs text-[#A3A09B] mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#73716D]" />
                    <span>{order.locker_address}</span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="p-4 bg-[#0B0B0C] border border-[#26262A]">
                <div className="flex items-center gap-2 text-[11px] text-[#A3A09B] uppercase tracking-wider mb-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Płatność i dane
                </div>
                <div className="font-medium text-emerald-400 text-sm">
                  {isPaid ? 'Opłacono bezpiecznie (Stripe)' : 'Oczekuje na zaksięgowanie'}
                </div>
                <div className="text-xs text-[#A3A09B] mt-1.5">
                  Zamawiający: <span className="text-white">{order.customer_name}</span>
                </div>
                <div className="text-xs text-[#A3A09B]">
                  E-mail: <span className="text-white">{order.customer_email}</span>
                </div>
                <div className="text-xs text-[#A3A09B] mt-1">
                  Łączna kwota: <strong className="text-white tabular-nums">{Number(order.total || 0).toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} zł</strong>
                </div>
              </div>
            </div>

            {/* Items */}
            {order.items_summary && (
              <div className="p-4 bg-[#0B0B0C] border border-[#26262A]">
                <div className="text-[11px] text-[#A3A09B] uppercase tracking-wider mb-2 font-medium flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C8794B]" />
                  Zamówione pozycje
                </div>
                <div className="text-xs text-[#ECEAE7] leading-relaxed">
                  {order.items_summary}
                </div>
              </div>
            )}

            {/* Delivery time notice */}
            <div className="p-4 bg-[#0B0B0C] border border-[#26262A] flex items-start gap-2.5 text-xs text-[#A3A09B]">
              <Clock className="w-4 h-4 text-[#C8794B] shrink-0 mt-0.5" />
              <span>
                Wysyłka następuje w ciągu 24h z pracowni w Warszawie. Numer śledzenia przesyłki otrzymasz w wiadomości SMS od InPost.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
