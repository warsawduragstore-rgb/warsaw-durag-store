'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Trash2, Plus, Minus, CheckCircle2, Package, Truck, ArrowRight, Loader2 } from 'lucide-react';
import InPostPicker, { InPostPoint } from './InPostPicker';
import { createOrderInSupabase } from '@/lib/supabase';

export default function CartDrawer() {
  const { t } = useLanguage();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    promoDiscount,
    promoRate,
    appliedPromoCode,
    applyPromoCode,
    total,
    clearCart,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Checkout form state
  const [deliveryMethod, setDeliveryMethod] = useState<'paczkomat' | 'courier'>('paczkomat');
  const [selectedInpost, setSelectedInpost] = useState<InPostPoint | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Courier fields
  const [courierStreet, setCourierStreet] = useState('');
  const [courierCity, setCourierCity] = useState('');
  const [courierPostCode, setCourierPostCode] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [placedOrderNo, setPlacedOrderNo] = useState<string | null>(null);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<{
    method: 'paczkomat' | 'courier';
    pointName?: string;
    address?: string;
    total: number;
  } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    const ok = await applyPromoCode(promoInput);
    setIsApplyingPromo(false);

    if (ok) {
      setPromoInput('');
    } else {
      setPromoError('Nieprawidłowy lub nieaktywny kod rabatowy.');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setFormError('Wypełnij imię, adres e-mail oraz numer telefonu.');
      return;
    }

    if (deliveryMethod === 'paczkomat' && !selectedInpost) {
      setFormError('Wybierz Paczkomat InPost, do którego mamy dostarczyć zamówienie.');
      return;
    }

    if (deliveryMethod === 'courier' && (!courierStreet.trim() || !courierCity.trim() || !courierPostCode.trim())) {
      setFormError('Wypełnij pełny adres do wysyłki kurierem (ulica, kod pocztowy, miasto).');
      return;
    }

    setIsSubmitting(true);

    const generatedOrderNo = `WDS-${Math.floor(100000 + Math.random() * 900000)}`;
    const lockerAddress = selectedInpost
      ? `${selectedInpost.street} ${selectedInpost.buildingNumber}, ${selectedInpost.postCode} ${selectedInpost.city}`
      : `${courierStreet}, ${courierPostCode} ${courierCity}`;

    const orderPayload = {
      order_no: generatedOrderNo,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      customer_phone: customerPhone.trim(),
      delivery_method: deliveryMethod,
      locker_code: deliveryMethod === 'paczkomat' ? selectedInpost?.name : null,
      locker_address: lockerAddress,
      items: cart.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        category: i.product.category,
        material: i.product.material,
        image: i.product.images[0],
      })),
      items_summary: cart.map((i) => `${i.quantity}x ${i.product.name}`).join(' | '),
      subtotal,
      discount_code: appliedPromoCode || null,
      discount_pct: promoRate ? promoRate * 100 : 0,
      discount_val: promoDiscount,
      total,
      status: 'new' as const,
    };

    const res = await createOrderInSupabase(orderPayload);
    setIsSubmitting(false);

    if (res.success) {
      setPlacedOrderNo(res.orderNo || generatedOrderNo);
      setPlacedOrderDetails({
        method: deliveryMethod,
        pointName: selectedInpost?.name,
        address: lockerAddress,
        total,
      });
      clearCart();
    } else {
      setFormError(res.error || 'Wystąpił błąd przy składaniu zamówienia. Spróbuj ponownie.');
    }
  };

  const handleCloseSuccess = () => {
    setPlacedOrderNo(null);
    setPlacedOrderDetails(null);
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left border-l border-[#CFCFCF]/50">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#0D0D0B] flex items-center justify-between bg-[#F6F5F2]">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-[#0D0D0B] text-white px-2 py-0.5">
              ATELIER WDS
            </span>
            <h2 className="font-mono text-sm tracking-wider uppercase font-semibold text-[#0D0D0B]">
              {t.cartTitle} [{cart.length}]
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#0D0D0B] hover:bg-[#0D0D0B] hover:text-white transition-colors"
            aria-label="Zamknij koszyk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {placedOrderNo ? (
          <div className="flex-grow p-8 flex flex-col items-center justify-center text-center bg-[#F6F5F2] space-y-6 overflow-y-auto">
            <div className="w-14 h-14 border-2 border-[#0D0D0B] text-[#0D0D0B] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#734C1D] font-bold block mb-1">
                [ ZAMÓWIENIE PRZYJĘTE ]
              </span>
              <h3 className="font-serif text-3xl text-[#0D0D0B] tracking-tight">
                Dziękujemy za zaufanie.
              </h3>
              <p className="text-xs text-[#5A5B60] mt-2 max-w-sm mx-auto font-light leading-relaxed">
                Zamówienie zostało zarejestrowane w naszym warszawskim atelier i trafiło do realizacji.
              </p>
            </div>

            {/* Order Confirmation Card */}
            <div className="w-full bg-white border border-[#0D0D0B] p-5 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-[#E5E5E0] pb-2.5">
                <span className="text-xs uppercase tracking-wider text-[#5A5B60]">ID ZAMÓWIENIA:</span>
                <span className="font-mono text-xs font-bold text-[#0D0D0B] bg-[#F6F5F2] px-2 py-1 border border-[#0D0D0B]">
                  {placedOrderNo}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5A5B60] uppercase tracking-wider">DOSTAWA:</span>
                <span className="font-mono text-xs font-semibold text-[#0D0D0B]">
                  {placedOrderDetails?.method === 'paczkomat' ? (
                    `PACZKOMAT INPOST (${placedOrderDetails.pointName})`
                  ) : (
                    `KURIER POD ADRES`
                  )}
                </span>
              </div>

              {placedOrderDetails?.address && (
                <div className="text-[11px] text-[#5A5B60] pt-2 border-t border-[#E5E5E0]">
                  <strong className="text-[#0D0D0B] font-mono uppercase tracking-wider">ADRES:</strong> {placedOrderDetails.address}
                </div>
              )}

              <div className="flex justify-between items-center pt-2.5 border-t border-[#0D0D0B] text-xs font-bold text-[#0D0D0B]">
                <span className="uppercase tracking-wider">ŁĄCZNIE:</span>
                <span className="font-mono">{placedOrderDetails?.total.toFixed(2)} PLN (DOSTAWA 0 ZŁ)</span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-[#5A5B60]">
              Potwierdzenie i numer przesyłki wyślemy na Twój e-mail.
            </p>

            <button
              onClick={handleCloseSuccess}
              className="w-full bg-[#0D0D0B] text-white py-4 text-xs uppercase tracking-[0.2em] font-mono font-semibold hover:bg-[#734C1D] transition-colors"
            >
              [ POWRÓT DO SKLEPU ]
            </button>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart View */
          <div className="flex-grow p-8 flex flex-col items-center justify-center text-center bg-[#FAF9F7]">
            <div className="w-14 h-14 border border-[#0D0D0B] flex items-center justify-center text-[#0D0D0B] mb-5">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-[#0D0D0B] font-serif text-xl mb-2">Twój koszyk jest pusty</p>
            <p className="text-xs text-[#5A5B60] font-light mb-6">Dodaj produkty z atelier, aby skompletować zamówienie.</p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="bg-[#0D0D0B] text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-mono font-semibold hover:bg-[#734C1D] transition-colors"
            >
              [ PRZEGLĄDAJ OFERTĘ ]
            </button>
          </div>
        ) : (
          /* Active Cart & Checkout View */
          <div className="flex-grow overflow-y-auto flex flex-col justify-between">
            
            {/* 1. Item List */}
            <div className="p-6 space-y-4 divide-y divide-[#E5E5E0]">
              <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#0D0D0B] pb-2 flex justify-between items-center">
                <span>[ ZAWARTOŚĆ KOSZYKA ]</span>
                <span className="text-[#5A5B60]">{cart.reduce((sum, i) => sum + i.quantity, 0)} SZT.</span>
              </div>

              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 pt-4">
                  <div className="relative w-16 h-16 bg-[#F6F5F2] shrink-0 border border-[#0D0D0B] overflow-hidden">
                    <Image
                      src={item.product.images[0] || '/assets/durag_silk_black.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm text-[#0D0D0B] font-medium leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#8C8D94] hover:text-[#0D0D0B] transition-colors p-1"
                        title="Usuń z koszyka"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#734C1D] block mt-0.5">
                      {item.product.material}
                    </span>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-[#0D0D0B] bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#0D0D0B] hover:bg-black hover:text-white transition-colors"
                          aria-label="Zmniejsz ilość"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-[#0D0D0B]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#0D0D0B] hover:bg-black hover:text-white transition-colors"
                          aria-label="Zwiększ ilość"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#0D0D0B]">
                        {(item.product.price * item.quantity).toFixed(2)} PLN
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Promo Code, Summary & Checkout Form */}
            <div className="p-6 border-t border-[#0D0D0B] bg-[#F6F5F2] space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="KOD RABATOWY (NP. WARSAW10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-grow px-3 py-2 text-xs font-mono bg-white border border-[#0D0D0B] outline-none focus:border-[#734C1D] uppercase tracking-wider"
                />
                <button
                  type="submit"
                  disabled={isApplyingPromo}
                  className="bg-[#0D0D0B] text-white px-4 py-2 text-xs uppercase tracking-[0.15em] font-mono font-semibold hover:bg-[#734C1D] transition-colors disabled:opacity-50"
                >
                  {isApplyingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '[ ZASTOSUJ ]'}
                </button>
              </form>

              {appliedPromoCode && (
                <div className="text-[11px] font-mono text-[#0D0D0B] bg-white border border-[#0D0D0B] px-3 py-2 flex items-center justify-between font-semibold">
                  <span>KOD: <strong>{appliedPromoCode}</strong></span>
                  <span>-{promoDiscount.toFixed(2)} PLN ({((promoRate || 0.1) * 100).toFixed(0)}%)</span>
                </div>
              )}
              {promoError && (
                <div className="text-[11px] font-mono text-[#B53838] border border-[#B53838] bg-white p-2">{promoError}</div>
              )}

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs font-mono text-[#5A5B60] pt-1">
                <div className="flex justify-between">
                  <span className="uppercase">Wartość produktów:</span>
                  <span className="text-[#0D0D0B] font-bold">{subtotal.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase">Dostawa:</span>
                  <span className="text-[#0D0D0B] font-bold">0.00 PLN (GRATIS)</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#734C1D]">
                    <span className="uppercase">Rabat:</span>
                    <span>-{promoDiscount.toFixed(2)} PLN</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#0D0D0B] pt-2 border-t border-[#0D0D0B]">
                  <span className="uppercase">Do zapłaty:</span>
                  <span>{total.toFixed(2)} PLN</span>
                </div>
              </div>

              {/* 3. Checkout Details & Delivery */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-3 border-t border-[#0D0D0B]">
                <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#0D0D0B]">
                  [ DANE DOSTAWY I PŁATNOŚCI ]
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Imię i Nazwisko *"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#0D0D0B] outline-none focus:border-[#734C1D]"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon (SMS InPost) *"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#0D0D0B] outline-none focus:border-[#734C1D]"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Adres E-mail do potwierdzenia *"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#0D0D0B] outline-none focus:border-[#734C1D]"
                />

                {/* Delivery Method Selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#5A5B60] font-bold block">
                    Forma wysyłki (0 PLN)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('paczkomat')}
                      className={`p-3 text-left border transition-all flex flex-col justify-between ${
                        deliveryMethod === 'paczkomat'
                          ? 'border-[#0D0D0B] bg-[#0D0D0B] text-white'
                          : 'border-[#0D0D0B] bg-white text-[#0D0D0B] hover:bg-[#F6F5F2]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold">
                          [ PACZKOMAT ]
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono mt-1 ${deliveryMethod === 'paczkomat' ? 'text-[#D9A87E]' : 'text-[#734C1D]'}`}>
                        INPOST 24/7 • 0 ZŁ
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('courier')}
                      className={`p-3 text-left border transition-all flex flex-col justify-between ${
                        deliveryMethod === 'courier'
                          ? 'border-[#0D0D0B] bg-[#0D0D0B] text-white'
                          : 'border-[#0D0D0B] bg-white text-[#0D0D0B] hover:bg-[#F6F5F2]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold flex items-center gap-1.5">
                          [ KURIER ]
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono mt-1 ${deliveryMethod === 'courier' ? 'text-[#D9A87E]' : 'text-[#734C1D]'}`}>
                        POD DRZWI • 0 ZŁ
                      </span>
                    </button>
                  </div>
                </div>

                {/* InPost Picker or Courier Address */}
                {deliveryMethod === 'paczkomat' ? (
                  <div className="pt-1">
                    <InPostPicker
                      selectedPoint={selectedInpost}
                      onSelectPoint={setSelectedInpost}
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      placeholder="Ulica i numer domu / lokalu *"
                      required
                      value={courierStreet}
                      onChange={(e) => setCourierStreet(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#0D0D0B] outline-none focus:border-[#734C1D]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Kod pocztowy *"
                        required
                        value={courierPostCode}
                        onChange={(e) => setCourierPostCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#0D0D0B] outline-none focus:border-[#734C1D]"
                      />
                      <input
                        type="text"
                        placeholder="Miejscowość *"
                        required
                        value={courierCity}
                        onChange={(e) => setCourierCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#0D0D0B] outline-none focus:border-[#734C1D]"
                      />
                    </div>
                  </div>
                )}

                {formError && (
                  <div className="text-[11px] font-mono text-[#B53838] border border-[#B53838] bg-white p-3 text-center">
                    {formError}
                  </div>
                )}

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0D0D0B] text-white py-4 text-xs font-mono uppercase tracking-[0.2em] font-semibold hover:bg-[#734C1D] transition-colors flex items-center justify-center gap-2 group disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>PRZETWARZANIE...</span>
                    </>
                  ) : (
                    <>
                      <span>[ ZAMÓW I ZAPŁAĆ: {total.toFixed(2)} PLN ]</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-[10px] font-mono text-center text-[#5A5B60] tracking-wider uppercase">
                  WYSYŁKA 24H • BEZPŁATNY ZWROT 14 DNI • PRAWDZIWY ATELIER
                </p>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
