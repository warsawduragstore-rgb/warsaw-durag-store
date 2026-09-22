'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { InPostPoint } from '@/components/InPostPicker';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Truck,
  Sparkles,
  Lock,
  Loader2,
  CheckCircle2,
  MapPin,
  AlertCircle
} from 'lucide-react';

// Lazy dynamic import of InPostPicker strictly on /checkout page only
const InPostPicker = dynamic(() => import('@/components/InPostPicker'), {
  ssr: false,
  loading: () => (
    <div className="p-6 bg-[#171715] border border-[#262624] rounded-xl text-xs text-gray-400 flex items-center justify-center gap-3">
      <Loader2 className="w-4 h-4 animate-spin text-[#D9A87E]" />
      Inicjalizacja wyszukiwarki Paczkomatów InPost...
    </div>
  ),
});

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    subtotal,
    promoDiscount,
    freeItemsCount,
    freeItemsDiscount,
    total,
    appliedPromoCode,
    refreshCart,
    clearCart,
  } = useCart();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'paczkomat' | 'courier' | 'pickup'>('paczkomat');
  const [selectedInpost, setSelectedInpost] = useState<InPostPoint | null>(null);

  // Courier Address
  const [courierStreet, setCourierStreet] = useState('');
  const [courierCity, setCourierCity] = useState('');
  const [courierPostCode, setCourierPostCode] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Re-verify cart prices from server upon visiting checkout page
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Uzupełnij wszystkie dane kontaktowe (imię i nazwisko, e-mail, telefon).');
      return;
    }

    if (deliveryMethod === 'paczkomat' && !selectedInpost) {
      setErrorMessage('Wybierz Paczkomat InPost, do którego mamy dostarczyć zamówienie.');
      return;
    }

    if (deliveryMethod === 'courier' && (!courierStreet.trim() || !courierCity.trim() || !courierPostCode.trim())) {
      setErrorMessage('Uzupełnij pełny adres doręczenia przesyłki kurierskiej.');
      return;
    }

    setIsSubmitting(true);

    const lockerAddress = selectedInpost
      ? `${selectedInpost.street} ${selectedInpost.buildingNumber}, ${selectedInpost.postCode} ${selectedInpost.city}`
      : deliveryMethod === 'courier'
      ? `${courierStreet}, ${courierPostCode} ${courierCity}`
      : 'Odbiór osobisty: ul. Włodarzewska 4, Warszawa';

    const payload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      deliveryMethod,
      lockerCode: selectedInpost?.name || null,
      pointId: selectedInpost?.name || null,
      lockerAddress,
      // Pass canonical references ({ productId, variant, qty }) — server verifies prices!
      items: cart.map((i) => ({
        productId: i.product.id,
        variant: i.variant,
        qty: i.quantity,
      })),
      promoCode: appliedPromoCode,
    };

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas inicjalizacji płatności.');
      }

      if (data.url) {
        // Redirect directly to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('Brak adresu przekierowania do płatności.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0B] text-[#F7F5F2] pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#171715] border border-[#262624] rounded-2xl p-8 space-y-4">
          <p className="font-serif text-2xl text-white">Twój koszyk jest pusty</p>
          <p className="text-xs text-gray-400">
            Aby przejść do kasy, dodaj przynajmniej jeden produkt do koszyka.
          </p>
          <Link
            href="/produkty"
            className="inline-block mt-4 px-6 py-3 bg-[#D9A87E] text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-[#e4b58e] transition-colors"
          >
            Przejdź do oferty
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0B] text-[#F7F5F2] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Back Link & Heading */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/koszyk"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Wróć do koszyka
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight uppercase">
              Kasa & Bezpieczna Płatność
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" /> Szyfrowanie SSL 256-bit
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Customer Info */}
            <div className="bg-[#171715] border border-[#262624] rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#D9A87E] text-black font-mono text-xs flex items-center justify-center font-bold">1</span>
                Dane Zamawiającego
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="text-xs font-mono text-gray-400 block mb-1">
                    Imię i nazwisko *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="np. Jan Kowalski"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#0D0D0B] border border-[#262624] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A87E]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-xs font-mono text-gray-400 block mb-1">
                    Adres e-mail (potwierdzenie zamówienia) *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="jan@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#0D0D0B] border border-[#262624] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A87E]"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-xs font-mono text-gray-400 block mb-1">
                    Telefon (do powiadomień InPost) *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+48 500 000 000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#0D0D0B] border border-[#262624] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A87E]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Method */}
            <div className="bg-[#171715] border border-[#262624] rounded-2xl p-6 space-y-5">
              <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#D9A87E] text-black font-mono text-xs flex items-center justify-center font-bold">2</span>
                Sposób Dostawy
              </h2>

              {/* Delivery tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('paczkomat')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'paczkomat'
                      ? 'border-[#D9A87E] bg-[#D9A87E]/10 text-white'
                      : 'border-[#262624] bg-[#0D0D0B] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">Paczkomat InPost</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">0.00 zł</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Dostawa 24h z Warszawy</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('courier')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'courier'
                      ? 'border-[#D9A87E] bg-[#D9A87E]/10 text-white'
                      : 'border-[#262624] bg-[#0D0D0B] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">Kurier DPD / InPost</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">0.00 zł</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Dostawa pod Twoje drzwi</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-[#D9A87E] bg-[#D9A87E]/10 text-white'
                      : 'border-[#262624] bg-[#0D0D0B] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">Odbiór Osobisty</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">0.00 zł</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Warszawa (Ochota / Śródmieście)</p>
                </button>
              </div>

              {/* InPost Picker (Loaded ONLY when Paczkomat selected) */}
              {deliveryMethod === 'paczkomat' && (
                <div className="pt-2 space-y-3">
                  <label className="text-xs font-mono text-gray-300 block">
                    Wybierz Paczkomat odbioru na mapie lub wyszukaj po ulicy:
                  </label>
                  <InPostPicker
                    selectedPoint={selectedInpost}
                    onSelectPoint={setSelectedInpost}
                    required={true}
                  />
                  {selectedInpost && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                      <div>
                        <strong>Wybrany Paczkomat: {selectedInpost.name}</strong>
                        <p className="text-[11px] text-emerald-400/80">
                          {selectedInpost.street} {selectedInpost.buildingNumber}, {selectedInpost.postCode} {selectedInpost.city}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Courier Fields */}
              {deliveryMethod === 'courier' && (
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="street" className="text-xs font-mono text-gray-400 block mb-1">
                      Ulica i numer domu/lokalu *
                    </label>
                    <input
                      id="street"
                      type="text"
                      required
                      placeholder="np. Złota 44 m. 12"
                      value={courierStreet}
                      onChange={(e) => setCourierStreet(e.target.value)}
                      className="w-full bg-[#0D0D0B] border border-[#262624] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A87E]"
                    />
                  </div>
                  <div>
                    <label htmlFor="postcode" className="text-xs font-mono text-gray-400 block mb-1">
                      Kod pocztowy *
                    </label>
                    <input
                      id="postcode"
                      type="text"
                      required
                      placeholder="00-001"
                      value={courierPostCode}
                      onChange={(e) => setCourierPostCode(e.target.value)}
                      className="w-full bg-[#0D0D0B] border border-[#262624] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A87E]"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="text-xs font-mono text-gray-400 block mb-1">
                      Miejscowość *
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      placeholder="Warszawa"
                      value={courierCity}
                      onChange={(e) => setCourierCity(e.target.value)}
                      className="w-full bg-[#0D0D0B] border border-[#262624] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A87E]"
                    />
                  </div>
                </div>
              )}

              {/* Pickup Note */}
              {deliveryMethod === 'pickup' && (
                <div className="p-4 bg-[#0D0D0B] border border-[#D9A87E]/30 rounded-xl space-y-2 text-xs">
                  <p className="text-white font-medium flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D9A87E]" /> Punkty odbioru osobistego w Warszawie:
                  </p>
                  <ul className="text-gray-300 space-y-1 pl-5 list-disc text-[11px]">
                    <li><strong>Włodarzewska 4, Ochota</strong> — po wcześniejszym umówieniu telefonicznym lub SMS.</li>
                    <li><strong>Salon Barberski Eclipse</strong> (pod Rondem Waszyngtona) — czynny pon-sob.</li>
                  </ul>
                  <p className="text-gray-400 text-[10px] pt-1">
                    Po opłaceniu zamówienia skontaktujemy się z Tobą SMS-em, aby ustalić dogodną godzinę odbioru.
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Payment Method Info */}
            <div className="bg-[#171715] border border-[#262624] rounded-2xl p-6 space-y-3">
              <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#D9A87E] text-black font-mono text-xs flex items-center justify-center font-bold">3</span>
                Płatność
              </h2>
              <p className="text-xs text-gray-400">
                Po kliknięciu przycisku poniżej zostaniesz bezpiecznie przekierowany do bramki płatności Stripe.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1.5 bg-[#0D0D0B] border border-[#262624] rounded-lg text-xs font-mono text-gray-300">
                  ⚡ BLIK
                </span>
                <span className="px-3 py-1.5 bg-[#0D0D0B] border border-[#262624] rounded-lg text-xs font-mono text-gray-300">
                  💳 Karta Visa / Mastercard
                </span>
                <span className="px-3 py-1.5 bg-[#0D0D0B] border border-[#262624] rounded-lg text-xs font-mono text-gray-300">
                  🍎 Apple Pay / Google Pay
                </span>
                <span className="px-3 py-1.5 bg-[#0D0D0B] border border-[#262624] rounded-lg text-xs font-mono text-gray-300">
                  🏦 Przelewy24
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Summary & Submit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#171715] border border-[#262624] rounded-2xl p-6 space-y-5 sticky top-28">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider pb-3 border-b border-[#262624]">
                Twoje Zamówienie ({cartCount})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={`${item.product.id}-${idx}`} className="flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-12 bg-[#262624] rounded-lg overflow-hidden shrink-0 border border-[#333330]">
                      <Image
                        src={item.product.images?.[0] || '/assets/durag_silk_black.webp'}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{item.product.name}</p>
                      <p className="text-[11px] text-gray-400">
                        Ilość: {item.quantity} {item.variant ? `(${item.variant})` : ''}
                      </p>
                    </div>
                    <div className="font-mono text-white text-right">
                      {(item.unitPrice * item.quantity).toFixed(2)} zł
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-4 border-t border-[#262624] space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Wartość koszyka:</span>
                  <span className="font-mono text-white">{subtotal.toFixed(2)} zł</span>
                </div>

                {freeItemsDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Kup 2, trzeci gratis:
                    </span>
                    <span className="font-mono">-{freeItemsDiscount.toFixed(2)} zł</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#D9A87E] font-medium">
                    <span>Kod rabatowy ({appliedPromoCode}):</span>
                    <span className="font-mono">-{promoDiscount.toFixed(2)} zł</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Dostawa w Polsce:</span>
                  <span className="font-mono text-emerald-400 font-medium">0.00 zł (Darmowa)</span>
                </div>

                <div className="pt-3 border-t border-[#262624] flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-white uppercase tracking-wider">
                    Do zapłaty:
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#D9A87E]">
                    {total.toFixed(2)} zł
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#D9A87E] text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-[#e4b58e] transition-all disabled:opacity-60 shadow-lg shadow-[#D9A87E]/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Przekierowywanie do Stripe...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Opłać zamówienie ({total.toFixed(2)} zł)
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-[#262624] space-y-1.5 text-[11px] text-gray-500 text-center">
                <p>Klikając przycisk akceptujesz <Link href="/regulamin" className="underline hover:text-white">Regulamin</Link> oraz <Link href="/polityka-prywatnosci" className="underline hover:text-white">Politykę prywatności</Link>.</p>
                <p className="text-gray-400">Twoje dane są bezpieczne i nie są udostępniane podmiotom trzecim.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
