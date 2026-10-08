'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProduct } from '@/lib/translations/products';
import { COUNTRIES, POPULAR_PHONE_PREFIXES, getCountryByCode } from '@/lib/countries';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Sparkles,
  Lock,
  Loader2,
  MapPin,
  AlertCircle,
  Globe,
  Package,
  ClipboardPaste,
  ExternalLink,
  Check
} from 'lucide-react';

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

  // Contact Information
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+48');
  const [customerPhone, setCustomerPhone] = useState('');

  // Shipping Destination & Method
  const [shippingCountry, setShippingCountry] = useState('PL');
  const [deliveryMethod, setDeliveryMethod] = useState<'paczkomat' | 'courier' | 'pickup'>('paczkomat');

  // InPost Paczkomat (code only for instant pasting)
  const [lockerCode, setLockerCode] = useState('');
  const [pastedFeedback, setPastedFeedback] = useState(false);

  // Courier Address Fields
  const [courierStreet, setCourierStreet] = useState('');
  const [courierApartment, setCourierApartment] = useState('');
  const [courierPostCode, setCourierPostCode] = useState('');
  const [courierCity, setCourierCity] = useState('');
  const [courierState, setCourierState] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync / refresh prices from server on initial load
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // When changing country: if abroad, force courier delivery and auto-sync phone prefix
  const handleCountryChange = (newCountryCode: string) => {
    setShippingCountry(newCountryCode);
    const countryObj = getCountryByCode(newCountryCode);
    if (countryObj && countryObj.phonePrefix) {
      setPhonePrefix(countryObj.phonePrefix);
    }
    if (newCountryCode !== 'PL') {
      setDeliveryMethod('courier');
    }
  };

  // Clipboard paste helper for InPost locker code
  const handlePasteLockerCode = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          const cleaned = text.trim().toUpperCase().replace(/\s+/g, '');
          setLockerCode(cleaned);
          setPastedFeedback(true);
          setTimeout(() => setPastedFeedback(false), 2000);
        }
      }
    } catch {
      // Browser permissions or unsupported clipboard read
    }
  };

  // Dynamic Shipping calculation
  const isInternational = shippingCountry !== 'PL';
  // W Polsce darmowa dostawa (0 zł). Za granicę: 35 zł (~8.50 €), darmowa od 250 zł (60 €)
  const shippingCost = isInternational ? (subtotal >= 250 ? 0 : 35) : 0;
  const finalCheckoutTotal = Math.max(0, total + shippingCost);

  const selectedCountryObj = getCountryByCode(shippingCountry);
  const countryDisplayName = isEn ? selectedCountryObj.nameEn : selectedCountryObj.namePl;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Full name validation (must contain at least 2 words)
    const nameTrimmed = customerName.trim();
    const nameParts = nameTrimmed.split(/\s+/).filter(Boolean);
    if (!nameTrimmed || nameParts.length < 2 || nameParts[0].length < 2 || nameParts[1].length < 2) {
      setErrorMessage(
        isEn
          ? 'Please provide your full name (both first and last name, e.g. John Smith).'
          : 'Podaj pełne imię i nazwisko (np. Jan Kowalski) — kurier wymaga obu członów do doręczenia przesyłki.'
      );
      return;
    }

    // 2. Email validation
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage(
        isEn ? 'Please enter a valid email address.' : 'Wpisz poprawny adres e-mail do potwierdzenia zamówienia.'
      );
      return;
    }

    // 3. Phone validation
    const digitsOnly = customerPhone.replace(/\D/g, '');
    if (!customerPhone.trim() || digitsOnly.length < 6) {
      setErrorMessage(
        isEn
          ? 'Please enter a valid phone number with prefix.'
          : 'Podaj poprawny numer telefonu (min. 6 cyfr) wraz z prefiksem kraju.'
      );
      return;
    }

    const fullPhone = phonePrefix && !customerPhone.trim().startsWith('+')
      ? `${phonePrefix} ${customerPhone.trim()}`
      : customerPhone.trim();

    // 4. InPost Paczkomat validation
    const cleanLocker = lockerCode.trim().toUpperCase().replace(/\s+/g, '');
    if (deliveryMethod === 'paczkomat') {
      if (!cleanLocker || cleanLocker.length < 3) {
        setErrorMessage(
          isEn
            ? 'Please paste or enter your InPost parcel locker code (e.g. WAW22M).'
            : 'Wklej lub wpisz kod Paczkomatu InPost (np. WAW22M, KRA01A).'
        );
        return;
      }
    }

    // 5. Courier Address validation
    if (deliveryMethod === 'courier') {
      if (!courierStreet.trim() || !courierCity.trim() || !courierPostCode.trim()) {
        setErrorMessage(
          isEn
            ? 'Please complete the full delivery address (street, postal code, city).'
            : 'Uzupełnij pełny adres doręczenia (ulica i numer, kod pocztowy, miejscowość).'
        );
        return;
      }
    }

    setIsSubmitting(true);

    const formattedAddress = deliveryMethod === 'courier'
      ? [
          courierStreet.trim() + (courierApartment.trim() ? ` / ${courierApartment.trim()}` : ''),
          `${courierPostCode.trim()} ${courierCity.trim()}`,
          courierState.trim() ? courierState.trim() : null,
          countryDisplayName,
        ].filter(Boolean).join(', ')
      : deliveryMethod === 'paczkomat'
      ? `Paczkomat InPost: ${cleanLocker}`
      : 'Odbiór osobisty: Warszawa (ul. Włodarzewska 4 / Centrum)';

    const payload = {
      customerName: nameTrimmed,
      customerEmail: customerEmail.trim(),
      customerPhone: fullPhone,
      phonePrefix,
      shippingCountry,
      deliveryMethod,
      lockerCode: deliveryMethod === 'paczkomat' ? cleanLocker : null,
      pointId: deliveryMethod === 'paczkomat' ? cleanLocker : null,
      lockerAddress: formattedAddress,
      shippingAddress: deliveryMethod === 'courier' ? {
        street: courierStreet.trim(),
        apartment: courierApartment.trim() || undefined,
        postCode: courierPostCode.trim(),
        city: courierCity.trim(),
        state: courierState.trim() || undefined,
        country: countryDisplayName,
      } : undefined,
      deliveryNotes: deliveryNotes.trim() || undefined,
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
              {isEn
                ? 'Worldwide shipping from Warsaw · Secure Stripe payment'
                : 'Wysyłka z Warszawy (Polska i cały świat) · Bezpieczna płatność Stripe'}
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
                  <div className="flex justify-between items-baseline mb-1">
                    <label htmlFor="name" className="text-xs text-[#ECEAE7] font-medium">
                      {isEn ? 'Full name (first & last name) *' : 'Imię i nazwisko (pełne) *'}
                    </label>
                    <span className="text-[11px] text-[#A3A09B]">
                      {isEn ? 'Both names required' : 'Wymagane oba człony'}
                    </span>
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder={isEn ? 'e.g. John Smith' : 'np. Jan Kowalski'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                  />
                  <p className="text-[11px] text-[#A3A09B] mt-1">
                    {isEn
                      ? 'Required for the carrier waybill and delivery label.'
                      : 'Wymagane do wystawienia etykiety kurierskiej lub awizacji przesyłki.'}
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="text-xs text-[#ECEAE7] font-medium block mb-1">
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
                  <label htmlFor="phone" className="text-xs text-[#ECEAE7] font-medium block mb-1">
                    {isEn ? 'Phone number (for tracking & SMS) *' : 'Numer telefonu (do powiadomień SMS i kuriera) *'}
                  </label>
                  <div className="flex">
                    <div className="relative shrink-0">
                      <select
                        aria-label={isEn ? 'Country dial code' : 'Prefiks kraju'}
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        className="h-full bg-[#1A1A1E] border border-[#26262A] border-r-0 px-3 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#C8794B] cursor-pointer"
                      >
                        {POPULAR_PHONE_PREFIXES.map((p) => (
                          <option key={p.prefix} value={p.prefix} className="bg-[#141416] text-white">
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder={phonePrefix === '+48' ? '500 123 456' : '123 456 789'}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                    />
                  </div>
                  <p className="text-[11px] text-[#A3A09B] mt-1">
                    {isEn
                      ? 'The courier will send delivery status updates and InPost access codes here.'
                      : 'Kurier i InPost przekażą na ten numer kody odbioru oraz status doręczenia.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Country & Destination */}
            <div className="bg-[#141416] border border-[#26262A] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#C8794B] text-[#0B0B0C] text-xs flex items-center justify-center font-bold">2</span>
                  {isEn ? 'Destination & Delivery' : 'Kraj i sposób dostawy'}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#A3A09B]">
                  <Globe className="w-3.5 h-3.5 text-[#C8794B]" />
                  <span>{isInternational ? (isEn ? 'International' : 'Wysyłka zagraniczna') : (isEn ? 'Domestic (Poland)' : 'Polska')}</span>
                </div>
              </div>

              {/* Country Selection */}
              <div>
                <label htmlFor="countrySelect" className="text-xs text-[#ECEAE7] font-medium block mb-1.5">
                  {isEn ? 'Country of delivery *' : 'Kraj doręczenia *'}
                </label>
                <div className="relative">
                  <select
                    id="countrySelect"
                    value={shippingCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8794B] cursor-pointer"
                  >
                    <optgroup label={isEn ? 'Domestic' : 'Polska'}>
                      <option value="PL">🇵🇱 Polska (Darmowa dostawa 0 zł)</option>
                    </optgroup>
                    <optgroup label={isEn ? 'European Union & Europe' : 'Kraje Unii Europejskiej i Europa'}>
                      {COUNTRIES.filter((c) => c.code !== 'PL' && c.code !== 'US' && c.code !== 'CA' && c.code !== 'OTHER').map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {isEn ? c.nameEn : c.namePl}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={isEn ? 'Worldwide' : 'Pozostałe kraje'}>
                      {COUNTRIES.filter((c) => c.code === 'US' || c.code === 'CA' || c.code === 'OTHER').map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {isEn ? c.nameEn : c.namePl}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                {isInternational && (
                  <div className="mt-2.5 p-3 bg-[#1A1A1E] border border-[#2E2E33] text-xs text-[#ECEAE7] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#C8794B] shrink-0" />
                      <span>{isEn ? 'Tracked Courier to ' : 'Ubezpieczony kurier do: '}<strong>{countryDisplayName}</strong></span>
                    </span>
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      {shippingCost === 0 ? (isEn ? 'Free' : '0 zł') : formatPrice(shippingCost, 8.50)}
                    </span>
                  </div>
                )}
              </div>

              {/* Delivery method selector */}
              {!isInternational ? (
                /* POLAND: Paczkomat / Courier / Pickup */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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
                      <span className="font-medium text-sm text-white">InPost Paczkomat</span>
                      <span className="text-xs text-emerald-400 font-medium tabular-nums">{isEn ? 'Free' : '0 zł'}</span>
                    </div>
                    <p className="text-xs text-[#A3A09B]">{isEn ? 'Odbiór 24/7 w maszynie' : 'Odbiór 24/7 w maszynie'}</p>
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
                    <p className="text-xs text-[#A3A09B]">{isEn ? 'Direct to your door' : 'Dostawa pod adres'}</p>
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
              ) : (
                /* INTERNATIONAL: Courier Tracked */
                <div className="p-4 border border-[#C8794B] bg-[#C8794B]/10 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-white flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#C8794B]" />
                      {isEn ? 'International Tracked Courier (DPD / DHL / GLS)' : 'Kurier międzynarodowy DPD / DHL / GLS (Tracked)'}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold tabular-nums">
                      {shippingCost === 0 ? (isEn ? 'Free shipping' : 'Darmowa dostawa') : formatPrice(shippingCost, 8.50)}
                    </span>
                  </div>
                  <p className="text-xs text-[#ECEAE7]">
                    {isEn
                      ? 'Secure, insured parcel delivered to your door in 3–6 business days.'
                      : 'Ubezpieczona przesyłka kurierska z Warszawy pod wskazany adres. Czas dostawy: 3–6 dni roboczych.'}
                  </p>
                </div>
              )}

              {/* InPost Parcel Locker — Simple paste input as requested */}
              {deliveryMethod === 'paczkomat' && (
                <div className="pt-2 p-5 bg-[#0B0B0C] border border-[#26262A] space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="lockerCodeInput" className="text-xs text-[#ECEAE7] font-semibold flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#C8794B]" />
                      <span>{isEn ? 'InPost Parcel Locker Code *' : 'Numer / Kod Paczkomatu InPost *'}</span>
                    </label>
                    <a
                      href="https://inpost.pl/znajdz-paczkomat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#C8794B] hover:underline flex items-center gap-1"
                    >
                      <span>{isEn ? 'Find locker on inpost.pl' : 'Znajdź kod na inpost.pl'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="lockerCodeInput"
                      type="text"
                      required
                      maxLength={12}
                      placeholder={isEn ? 'e.g. WAW22M or paste code' : 'np. WAW22M lub wklej kod paczkomatu'}
                      value={lockerCode}
                      onChange={(e) => setLockerCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                      className="w-full bg-[#141416] border border-[#2E2E33] px-4 py-3.5 text-base tracking-widest font-mono font-semibold uppercase text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                    />
                    <button
                      type="button"
                      onClick={handlePasteLockerCode}
                      title={isEn ? 'Paste from clipboard' : 'Wklej ze schowka'}
                      className="px-4 py-3.5 bg-[#1E1E22] hover:bg-[#2A2A30] border border-[#2E2E33] text-xs text-white font-medium flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                    >
                      {pastedFeedback ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">{isEn ? 'Pasted!' : 'Wklejono!'}</span>
                        </>
                      ) : (
                        <>
                          <ClipboardPaste className="w-4 h-4 text-[#C8794B]" />
                          <span className="hidden sm:inline">{isEn ? 'Paste' : 'Wklej'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-[#A3A09B]">
                    {isEn
                      ? 'Just enter or paste your 5–7 character Paczkomat box ID (e.g. WAW22M, KRA01A, GDA04N). Your package will be delivered directly to this locker.'
                      : 'Wpisz lub wklej 5–7 znakowy numer/kod Paczkomatu (np. WAW22M, KRA01A, GDA04N). Paczka zostanie nadana bezpośrednio do wybranej maszyny.'}
                  </p>
                </div>
              )}

              {/* Courier Delivery Address Fields */}
              {deliveryMethod === 'courier' && (
                <div className="pt-2 space-y-4">
                  <div className="p-3 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] flex items-center justify-between">
                    <span>
                      {isEn ? 'Shipping to: ' : 'Adres doręczenia w kraju: '}<strong>{countryDisplayName}</strong>
                    </span>
                    <span className="text-[#A3A09B] text-[11px]">
                      {isInternational ? (isEn ? 'Tracked courier' : 'Kurier międzynarodowy') : (isEn ? 'Courier DPD / InPost' : 'Kurier DPD / InPost')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="street" className="text-xs text-[#ECEAE7] font-medium block mb-1">
                        {isEn ? 'Street & building number *' : 'Ulica i numer domu/budynku *'}
                      </label>
                      <input
                        id="street"
                        type="text"
                        required
                        placeholder={isEn ? 'e.g. 12 Oxford Street or Mokotowska 12' : 'np. Mokotowska 12 lub Marszałkowska 24/26'}
                        value={courierStreet}
                        onChange={(e) => setCourierStreet(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                      />
                    </div>

                    <div>
                      <label htmlFor="apartment" className="text-xs text-[#A3A09B] block mb-1">
                        {isEn ? 'Apartment / Suite / Floor (optional)' : 'Nr lokalu / mieszkania (opcjonalnie)'}
                      </label>
                      <input
                        id="apartment"
                        type="text"
                        placeholder={isEn ? 'e.g. Apt 4B' : 'np. m. 4'}
                        value={courierApartment}
                        onChange={(e) => setCourierApartment(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                      />
                    </div>

                    <div>
                      <label htmlFor="postcode" className="text-xs text-[#ECEAE7] font-medium block mb-1">
                        {isEn ? 'Postal code / ZIP *' : 'Kod pocztowy *'}
                      </label>
                      <input
                        id="postcode"
                        type="text"
                        required
                        placeholder={isInternational ? (isEn ? 'e.g. 10115 or SW1A 1AA' : 'np. 10115') : '00-001'}
                        value={courierPostCode}
                        onChange={(e) => setCourierPostCode(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="text-xs text-[#ECEAE7] font-medium block mb-1">
                        {isEn ? 'City / Town *' : 'Miejscowość / Miasto *'}
                      </label>
                      <input
                        id="city"
                        type="text"
                        required
                        placeholder={isInternational ? (isEn ? 'e.g. Berlin, London, Paris' : 'np. Berlin, Londyn') : 'Warszawa'}
                        value={courierCity}
                        onChange={(e) => setCourierCity(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="text-xs text-[#A3A09B] block mb-1">
                        {isEn ? 'State / Province / Region (optional)' : 'Województwo / Region (opcjonalnie)'}
                      </label>
                      <input
                        id="state"
                        type="text"
                        placeholder={isEn ? 'e.g. Mazowieckie / Bavaria' : 'np. Mazowieckie / Małopolskie'}
                        value={courierState}
                        onChange={(e) => setCourierState(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="notes" className="text-xs text-[#A3A09B] block mb-1">
                        {isEn ? 'Delivery instructions / Gate code (optional)' : 'Wskazówki dla kuriera / Kod do klatki (opcjonalnie)'}
                      </label>
                      <input
                        id="notes"
                        type="text"
                        placeholder={isEn ? 'e.g. Gate code 1234, leave with neighbor' : 'np. Kod domofonu 123, zostaw pod drzwiami'}
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#26262A] px-4 py-3 text-sm text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                      />
                    </div>
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
                      ? 'Local pickup available in Warsaw (ul. Włodarzewska 4 or City Centre) upon phone or email appointment.'
                      : 'Odbiór osobisty w Warszawie (ul. Włodarzewska 4 lub Śródmieście) po wcześniejszym kontakcie telefonicznym lub mailowym.'}
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Payment Method Info */}
            <div className="bg-[#141416] border border-[#26262A] p-6 space-y-3">
              <h2 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-[#C8794B] text-[#0B0B0C] text-xs flex items-center justify-center font-bold">3</span>
                {isEn ? 'Payment Method' : 'Bezpieczna płatność'}
              </h2>
              <p className="text-xs text-[#A3A09B]">
                {isEn
                  ? 'Payments are processed securely via Stripe with 256-bit SSL encryption.'
                  : 'Płatności są przetwarzane bezpiecznie przez Stripe z szyfrowaniem 256-bit SSL.'}
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

                {/* Shipping line */}
                <div className="flex justify-between text-[#A3A09B]">
                  <span>
                    {!isInternational
                      ? (isEn ? 'Shipping in Poland:' : 'Dostawa w Polsce:')
                      : (isEn ? `Shipping to ${countryDisplayName}:` : `Dostawa do ${countryDisplayName}:`)}
                  </span>
                  <span className={shippingCost === 0 ? 'text-emerald-400 font-medium' : 'text-white font-medium tabular-nums'}>
                    {shippingCost === 0 ? (
                      isInternational
                        ? (isEn ? 'Free (over 250 PLN)' : '0 zł (Darmowa od 250 zł)')
                        : (isEn ? 'Free' : '0 zł (Darmowa)')
                    ) : (
                      formatPrice(shippingCost, 8.50)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#26262A] flex justify-between items-baseline">
                  <span className="font-serif text-base font-medium text-white">
                    {isEn ? 'Total:' : 'Do zapłaty:'}
                  </span>
                  <span className="text-2xl font-semibold text-[#C8794B] tabular-nums">
                    {formatPrice(finalCheckoutTotal)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#C8794B] text-[#0B0B0C] font-semibold text-sm hover:bg-[#FAFAF9] transition-all disabled:opacity-60 cursor-pointer shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {isEn ? 'Redirecting to Stripe...' : 'Przekierowywanie do Stripe...'}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> {isEn ? 'Pay with Stripe' : 'Opłać zamówienie'} ({formatPrice(finalCheckoutTotal)})
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
