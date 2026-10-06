'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, PackageCheck, MapPin, Truck, ArrowRight, ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const queryOrderNo = searchParams.get('order_no');
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Clear cart in browser on successful payment
    clearCart();

    async function verifyOrder() {
      try {
        const query = new URLSearchParams();
        if (sessionId) query.set('session_id', sessionId);
        if (queryOrderNo) query.set('order_no', queryOrderNo);

        const res = await fetch(`/api/stripe/session?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrderDetails(data.order);
          }
        }
      } catch (err) {
        console.error('Błąd pobierania danych zamówienia:', err);
      } finally {
        setLoading(false);
      }
    }

    verifyOrder();
  }, [sessionId, queryOrderNo]);

  const orderNo = orderDetails?.order_no || queryOrderNo || 'WDS-POTWIERDZONE';
  const deliveryMethod = orderDetails?.delivery_method || 'paczkomat';
  const isPaczkomat = deliveryMethod === 'paczkomat';

  return (
    <div className="min-h-screen bg-[#0D0D0B] text-white pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Top Status Card */}
        <div className="bg-[#141412] border border-[#222220] rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6 animate-pulse">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-block px-3 py-1 bg-[#222220] rounded-full text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-3">
              Płatność potwierdzona
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Dziękujemy za zamówienie!
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
              Twoja płatność przez Stripe została pomyślnie zrealizowana. Przygotowujemy Twój durag do wysyłki.
            </p>

            <div className="mt-6 p-4 bg-[#0D0D0B] border border-[#2A2A28] rounded-xl inline-block text-left">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Numer zamówienia</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-0.5 tracking-wider tabular-nums">
                {orderNo}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="mt-10 pt-8 border-t border-[#222220] space-y-6 relative z-10">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-gray-400 text-sm gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
                Ładowanie podsumowania...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery details */}
                  <div className="p-4 bg-[#1A1A18] rounded-xl border border-[#2A2A28]">
                    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
                      {isPaczkomat ? <PackageCheck className="w-4 h-4 text-[#D4AF37]" /> : <Truck className="w-4 h-4 text-[#D4AF37]" />}
                      Sposób dostawy
                    </div>
                    <div className="font-semibold text-white">
                      {isPaczkomat ? 'Paczkomat InPost 24/7' : 'Kurier pod wskazany adres'}
                    </div>
                    {orderDetails?.locker_code && (
                      <div className="text-sm text-[#D4AF37] mt-1 font-semibold tabular-nums">
                        Punkt: {orderDetails.locker_code}
                      </div>
                    )}
                    {orderDetails?.locker_address && (
                      <div className="text-xs text-gray-400 mt-1 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-500" />
                        <span>{orderDetails.locker_address}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer details */}
                  <div className="p-4 bg-[#1A1A18] rounded-xl border border-[#2A2A28]">
                    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Status transakcji
                    </div>
                    <div className="font-semibold text-emerald-400">
                      Opłacono ze Stripe
                    </div>
                    {orderDetails?.customer_email && (
                      <div className="text-xs text-gray-400 mt-2">
                        Potwierdzenie wysłano na:<br />
                        <span className="text-white font-medium">{orderDetails.customer_email}</span>
                      </div>
                    )}
                    {orderDetails?.total > 0 && (
                      <div className="text-xs text-gray-400 mt-2">
                        Łączna kwota: <strong className="text-white">{Number(orderDetails.total).toFixed(2)} PLN</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items summary if available */}
                {orderDetails?.items_summary && (
                  <div className="p-4 bg-[#1A1A18] rounded-xl border border-[#2A2A28]">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Zamówione produkty
                    </div>
                    <div className="text-sm text-gray-300 font-medium">
                      {orderDetails.items_summary}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Next steps notice */}
            <div className="bg-[#0D0D0B] p-4 rounded-xl border border-[#222220] flex items-start gap-3 text-xs text-gray-400 leading-relaxed">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
              <div>
                Paczka zostanie spakowana i wysłana w ciągu 24 godzin. Informację o nadaniu przesyłki oraz numer śledzenia otrzymasz w wiadomości e-mail oraz SMS.
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 pt-6 border-t border-[#222220] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-[#222220] hover:bg-[#2A2A28] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Wróć do strony głównej
            </Link>
            <Link
              href="/kolekcja"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D4AF37] hover:bg-[#b89528] text-black font-bold rounded-xl text-sm transition-transform active:scale-95 shadow-lg shadow-[#D4AF37]/10"
            >
              <span>Zobacz całą kolekcję</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0D0B] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
