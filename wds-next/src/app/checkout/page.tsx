'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProduct } from '@/lib/translations/products';
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
    <div className="p-6 bg-[#141416] border border-[#26262A] text-xs text-[#A3A09B] flex items-center justify-center gap-3">
      <Loader2 className="w-4 h-4 animate-spin text-[#C8794B]" />
      Inicjalizacja wyszukiwarki Paczkomatów InPost...
    </div>
  ),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { formatPrice, language, isEn } = useLanguage();
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
      setErrorMessage(
        isEn
          ? 'Please fill in all contact details (full name, email, phone).'
          : 'Uzupełnij wszystkie dane kontaktowe (imię i nazwisko, e-mail, telefon).'
      );
      return;
    }

    if (deliveryMethod === 'paczkomat' && !selectedInpost) {
      setErrorMessage(
        isEn
          ? 'Please select an InPost parcel locker for delivery.'
          : 'Wybierz Paczkomat InPost, do którego mamy dostarczyć zamówienie.'
      );
      return;
    }

    if (deliveryMethod === 'courier' && (!courierStreet.trim() || !courierCity.trim() || !courierPostCode.trim())) {
      setErrorMessage(
        isEn
          ? 'Please complete the full delivery address for courier shipping.'
          : 'Uzupełnij pełny adres doręczenia przesyłki kurierskiej.'
      );
      return;
    }

    setIsSubmitting(true);

    const lockerAddress = selectedInpost
      ? `${selectedInpost.street} ${selectedInpost.buildingNumber}, ${selectedInpost.postCode} ${selectedInpost.city}`
      : deliveryMethod === 'courier'
      ? `${courierStreet}, ${courierPostCode} ${courierCity}`
      : 'Odbiór osobisty: Warszawa (ul. Włodarzewska 4 / Centrum)';

    const payload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      deliveryMethod,
      lockerCode: selectedInpost?.name || null,
      pointId: selectedInpost?.name || null,
      lockerAddress,
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
        throw new Error(data.error || (isEn ? 'Payment initialization error.' : 'Wystąpił błąd podczas inicjalizacji płatności.'));
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(isEn ? 'Payment redirect URL missing.' : 'Brak adresu przekierowania do płatności.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || (isEn ? 'An unexpected error occurred. Please try again.' : 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.'));
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#FAFAF9] pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#141416] border border-[#26262A] p-8 space-y-4">
          <p className="font-serif text-2xl text-white">{isEn ? 'Your cart is empty' : 'Twój koszyk jest pusty'}</p>
          <p className="text-sm text-[#A3A09B]">
            {isEn ? 'Add items to proceed to checkout.' : 'Dodaj produkty, aby przejść do kasy.'}
          </p>
          <Link
            href="/produkty"
            className="inline-block px-6 py-2.5 bg-[#C8794B] text-[#0B0B0C] text-sm font-semibold hover:bg-white transition-colors"
          >
            {isEn ? 'Discover Durags' : 'Zobacz ofertę'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAFAF9] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/koszyk"
            className="inline-flex items-center gap-2 text-xs text-[#A3A09B] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Back to shopping bag' : 'Wróć do koszyka'}</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#26262A] gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-white">
              {isEn ? 'Checkout' : 'Kasa i Zamówienie'}
            </h1>
            <p className="text-xs text-[#A3A09B] mt-1">
              {isEn ? 'Fast shipping from Warsaw · Secure Stripe payment' : 'Szybka wysyłka z Warszawy · Bezpieczna płatność Stripe'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Lock className="w-4 h-4" />
            <span>{isEn ? 'SSL 256-bit encrypted checkout' : 'Bezpieczne szyfrowanie SSL'}</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (Contact & Shipping) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Customer Contact Info */}
            <div className="bg-[#141416] border border-[#26262A] p-6 space-y-4">
              <h2 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-[#C8794B] text-[#0B0B0C] text-xs flex items-center justify-center font-bold">1</span>
                {isEn ? 'Contact Information' : 'Dane kontaktowe'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-xs text-[#A3A09B] block mb-1">
                    {isEn ? 'Full name *' : 'Imię i nazwisko *'}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder={isEn ? 'e.g. John Smith' : 'np. Jan Kowalski'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-xs text-[#A3A09B] block mb-1">
                    {isEn ? 'Email address *' : 'Adres e-mail *'}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="jan@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-xs text-[#A3A09B] block mb-1">
                    {isEn ? 'Phone (for delivery notifications) *' : 'Telefon (do powiadomień InPost) *'}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+48 500 000 000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Method */}
            <div className="bg-[#141416] border border-[#26262A] p-6 space-y-5">
              <h2 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-[#C8794B] text-[#0B0B0C] text-xs flex items-center justify-center font-bold">2</span>
                {isEn ? 'Delivery Method' : 'Sposób dostawy'}
              </h2>

              {/* Delivery tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('paczkomat')}
                  className={`p-4 border text-left transition-all cursor-pointer ${
                    deliveryMethod === 'paczkomat'
                      ? 'border-[#C8794B] bg-[#C8794B]/10 text-white'
                      : 'border-[#26262A] bg-[#0B0B0C] text-[#787570] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-white">InPost Locker</span>
                    <span className="text-xs text-emerald-400 font-medium tabular-nums">{isEn ? 'Free' : '0 zł'}</span>
                  </div>
                  <p className="text-xs text-[#A3A09B]">{isEn ? 'Shipping 1–2 days' : 'Wysyłka z Warszawy w 1–2 dni'}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('courier')}
                  className={`p-4 border text-left transition-all cursor-pointer ${
                    deliveryMethod === 'courier'
                      ? 'border-[#C8794B] bg-[#C8794B]/10 text-white'
                      : 'border-[#26262A] bg-[#0B0B0C] text-[#787570] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-white">{isEn ? 'Courier DPD / InPost' : 'Kurier DPD / InPost'}</span>
                    <span className="text-xs text-emerald-400 font-medium tabular-nums">{isEn ? 'Free' : '0 zł'}</span>
                  </div>
                  <p className="text-xs text-[#A3A09B]">{isEn ? 'Direct to address' : 'Dostawa pod adres'}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 border text-left transition-all cursor-pointer ${
                    deliveryMethod === 'pickup'
                      ? 'border-[#C8794B] bg-[#C8794B]/10 text-white'
                      : 'border-[#26262A] bg-[#0B0B0C] text-[#787570] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-white">{isEn ? 'Local Pickup' : 'Odbiór osobisty'}</span>
                    <span className="text-xs text-emerald-400 font-medium tabular-nums">{isEn ? 'Free' : '0 zł'}</span>
                  </div>
                  <p className="text-xs text-[#A3A09B]">{isEn ? 'Warsaw (by appointment)' : 'Warszawa (po umówieniu)'}</p>
                </button>
              </div>

              {/* InPost Picker */}
              {deliveryMethod === 'paczkomat' && (
                <div className="pt-2 space-y-3">
                  <label className="text-xs text-[#ECEAE7] block">
                    {isEn ? 'Select your InPost locker on map or search by street:' : 'Wybierz Paczkomat odbioru na mapie lub wyszukaj po ulicy:'}
                  </label>
                  <InPostPicker
                    selectedPoint={selectedInpost}
                    onSelectPoint={setSelectedInpost}
                    required={true}
                  />
                  {selectedInpost && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                      <div>
                        <strong>{isEn ? 'Selected Locker: ' : 'Wybrany Paczkomat: '}{selectedInpost.name}</strong>
                        <p className="text-xs text-emerald-400/90">
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
                    <label htmlFor="street" className="text-xs text-[#A3A09B] block mb-1">
                      {isEn ? 'Street & building/apartment number *' : 'Ulica i numer domu/lokalu *'}
                    </label>
                    <input
                      id="street"
                      type="text"
                      required
                      placeholder="np. Mokotowska 12 m. 4"
                      value={courierStreet}
                      onChange={(e) => setCourierStreet(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                    />
                  </div>
                  <div>
                    <label htmlFor="postcode" className="text-xs text-[#A3A09B] block mb-1">
                      {isEn ? 'Postal code *' : 'Kod pocztowy *'}
                    </label>
                    <input
                      id="postcode"
                      type="text"
                      required
                      placeholder="00-001"
                      value={courierPostCode}
                      onChange={(e) => setCourierPostCode(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="text-xs text-[#A3A09B] block mb-1">
                      {isEn ? 'City *' : 'Miejscowość *'}
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      placeholder="Warszawa"
                      value={courierCity}
                      onChange={(e) => setCourierCity(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                    />
                  </div>
                </div>
              )}

              {/* Pickup Note */}
              {deliveryMethod === 'pickup' && (
                <div className="p-4 bg-[#0B0B0C] border border-[#26262A] space-y-2 text-xs">
                  <p className="text-white font-medium flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C8794B]" /> {isEn ? 'Local pickup in Warsaw:' : 'Odbiór osobisty w Warszawie:'}
                  </p>
                  <p className="text-[#A3A09B]">
                    {isEn
                      ? 'Local pickup available in Warsaw upon phone or email agreement.'
                      : 'Odbiór osobisty w Warszawie po wcześniejszym umówieniu telefonicznym lub mailowym.'}
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Payment Method Info */}
            <div className="bg-[#141416] border border-[#26262A] p-6 space-y-3">
              <h2 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-[#C8794B] text-[#0B0B0C] text-xs flex items-center justify-center font-bold">3</span>
                {isEn ? 'Payment Method' : 'Płatność'}
              </h2>
              <p className="text-xs text-[#A3A09B]">
                {isEn ? 'Payments are securely processed via Stripe.' : 'Płatności obsługiwane są bezpiecznie przez Stripe.'}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7]">
                  BLIK
                </span>
                <span className="px-3 py-1.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7]">
                  Visa / Mastercard
                </span>
                <span className="px-3 py-1.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7]">
                  Apple Pay / Google Pay
                </span>
                <span className="px-3 py-1.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7]">
                  Przelewy24
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Summary & Submit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141416] border border-[#26262A] p-6 space-y-5 sticky top-28">
              <h3 className="font-serif text-lg font-medium text-white pb-3 border-b border-[#26262A]">
                {isEn ? 'Your Order' : 'Twoje zamówienie'} ({cartCount})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item, idx) => {
                  const localizedProd = getLocalizedProduct(item.product, language);
                  return (
                    <div key={`${item.product.id}-${idx}`} className="flex items-center gap-3 text-xs">
                      <div className="relative w-12 h-12 bg-[#0E0E10] overflow-hidden shrink-0 border border-[#26262A]">
                        <Image
                          src={item.product.images?.[0] || '/assets/durag_silk_black.png'}
                          alt={localizedProd.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate flex items-center gap-1.5">
                          {localizedProd.name}
                          {item.product.id === 999 && (
                            <span className="text-[10px] bg-[#B85C2E]/15 text-[#B85C2E] border border-[#B85C2E]/30 px-1.5 py-0.2 font-semibold">
                              PROMO 2+1
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[#A3A09B]">
                          {isEn ? 'Qty: ' : 'Ilość: '}{item.quantity} {item.variant ? `(${item.variant})` : ''}
                        </p>
                      </div>
                      <div className="text-white text-right font-semibold tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity, item.product.priceEur ? item.product.priceEur * item.quantity : undefined)}
                        {item.product.id === 999 && (
                          <span className="block text-[10px] text-[#787570] line-through">
                            {formatPrice(89 * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Details */}
              <div className="pt-4 border-t border-[#26262A] space-y-2.5 text-xs">
                <div className="flex justify-between text-[#A3A09B]">
                  <span>{isEn ? 'Subtotal:' : 'Wartość koszyka:'}</span>
                  <span className="text-white tabular-nums">{formatPrice(subtotal)}</span>
                </div>

                {freeItemsDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {isEn ? 'Deal discount:' : 'Rabat promocyjny:'}
                    </span>
                    <span className="tabular-nums">-{formatPrice(freeItemsDiscount)}</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#C8794B] font-medium">
                    <span>{isEn ? `Discount (${appliedPromoCode}):` : `Kod rabatowy (${appliedPromoCode}):`}</span>
                    <span className="tabular-nums">-{formatPrice(promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#A3A09B]">
                  <span>{isEn ? 'Shipping in Poland:' : 'Dostawa w Polsce:'}</span>
                  <span className="text-emerald-400 font-medium">{isEn ? 'Free' : '0 zł (Darmowa)'}</span>
                </div>

                <div className="pt-3 border-t border-[#26262A] flex justify-between items-baseline">
                  <span className="font-serif text-base font-medium text-white">
                    {isEn ? 'Total:' : 'Do zapłaty:'}
                  </span>
                  <span className="text-2xl font-semibold text-[#C8794B] tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#C8794B] text-[#0B0B0C] font-semibold text-sm hover:bg-[#FAFAF9] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {isEn ? 'Redirecting to Stripe...' : 'Przekierowywanie do Stripe...'}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> {isEn ? 'Pay with Stripe' : 'Opłać zamówienie'} ({formatPrice(total)})
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-[#26262A] space-y-1.5 text-xs text-[#A3A09B] text-center">
                <p>
                  {isEn ? (
                    <>By clicking you accept our <Link href="/regulamin" className="underline hover:text-white">Terms of Service</Link> and <Link href="/polityka-prywatnosci" className="underline hover:text-white">Privacy Policy</Link>.</>
                  ) : (
                    <>Klikając przycisk akceptujesz <Link href="/regulamin" className="underline hover:text-white">Regulamin</Link> oraz <Link href="/polityka-prywatnosci" className="underline hover:text-white">Politykę prywatności</Link>.</>
                  )}
                </p>
                <p>{isEn ? 'Secure Stripe payment · SSL Encryption' : 'Bezpieczna płatność Stripe. Szyfrowanie SSL.'}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
