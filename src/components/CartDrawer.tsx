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
        <div className="px-6 py-5 border-b border-[#CFCFCF]/50 flex items-center justify-between bg-[#F7F5F2]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0D0D0B]" />
            <h2 className="font-serif text-lg font-medium tracking-wide text-[#0D0D0B]">
              {t.cartTitle} ({cart.length})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#3B3C40] hover:text-[#0D0D0B] transition-colors rounded-sm hover:bg-black/5"
            aria-label="Zamknij koszyk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {placedOrderNo ? (
          <div className="flex-grow p-8 flex flex-col items-center justify-center text-center bg-[#FAF9F7] space-y-5 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-[#0D0D0B] text-[#C6A87D] flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest font-mono text-[#734C1D] font-bold">
                Zamówienie Przyjęte
              </span>
              <h3 className="font-serif text-2xl text-[#0D0D0B] mt-1">
                Dziękujemy za zaufanie!
              </h3>
              <p className="text-xs text-[#5A5B60] mt-1 max-w-sm mx-auto">
                Twoje zamówienie trafiło prosto do naszego warszawskiego atelier.
              </p>
            </div>

            {/* Order Confirmation Card */}
            <div className="w-full bg-white border border-[#CFCFCF] p-4 text-left space-y-2.5 rounded-sm shadow-xs">
              <div className="flex justify-between items-center border-b border-[#EAE6DF] pb-2">
                <span className="text-xs text-[#5A5B60]">Numer zamówienia:</span>
                <span className="font-mono text-xs font-bold text-[#0D0D0B] bg-[#F7F5F2] px-2 py-0.5 rounded">
                  {placedOrderNo}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5A5B60]">Sposób dostawy:</span>
                <span className="font-medium text-[#0D0D0B] flex items-center gap-1">
                  {placedOrderDetails?.method === 'paczkomat' ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#FFD100]" />
                      Paczkomat InPost ({placedOrderDetails.pointName})
                    </>
                  ) : (
                    <>
                      <Truck className="w-3.5 h-3.5 text-[#734C1D]" />
                      Kurier pod adres
                    </>
                  )}
                </span>
              </div>

              {placedOrderDetails?.address && (
                <div className="text-[11px] text-[#5A5B60] pt-1 border-t border-[#EAE6DF]">
                  <strong>Adres docelowy:</strong> {placedOrderDetails.address}
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-[#EAE6DF] text-xs font-semibold text-[#0D0D0B]">
                <span>Kwota całkowita:</span>
                <span>{placedOrderDetails?.total.toFixed(2)} PLN (Dostawa gratis)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#734C1D] italic">
              Szczegóły wysyłki oraz numer śledzenia przesyłki otrzymasz drogą mailową.
            </p>

            <button
              onClick={handleCloseSuccess}
              className="w-full bg-[#0D0D0B] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#734C1D] transition-colors rounded-sm"
            >
              Powrót do sklepu
            </button>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart View */
          <div className="flex-grow p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#F7F5F2] flex items-center justify-center text-[#5A5B60] mb-4">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-[#3B3C40] text-sm font-light mb-6">Twój koszyk jest obecnie pusty.</p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="bg-[#0D0D0B] text-white px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#734C1D] transition-colors rounded-sm"
            >
              Przeglądaj kolekcję
            </button>
          </div>
        ) : (
          /* Active Cart & Checkout View */
          <div className="flex-grow overflow-y-auto flex flex-col justify-between">
            
            {/* 1. Item List */}
            <div className="p-6 space-y-4 divide-y divide-[#EAE6DF]">
              <div className="text-xs uppercase tracking-widest font-semibold text-[#5A5B60] pb-2">
                Zawartość koszyka ({cart.reduce((sum, i) => sum + i.quantity, 0)} szt.)
              </div>

              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 pt-4">
                  <div className="relative w-16 h-16 bg-[#F7F5F2] shrink-0 border border-[#CFCFCF]/60 rounded-sm overflow-hidden">
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
                        className="text-[#8C8D94] hover:text-[#B53838] transition-colors p-1"
                        title="Usuń z koszyka"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[11px] text-[#734C1D] font-medium block mt-0.5">
                      {item.product.material}
                    </span>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-[#CFCFCF] rounded-xs bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#3B3C40] hover:bg-gray-100 transition-colors"
                          aria-label="Zmniejsz ilość"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#0D0D0B]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#3B3C40] hover:bg-gray-100 transition-colors"
                          aria-label="Zwiększ ilość"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#0D0D0B]">
                        {(item.product.price * item.quantity).toFixed(2)} PLN
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Promo Code, Summary & Checkout Form */}
            <div className="p-6 border-t border-[#CFCFCF]/60 bg-[#FAF9F7] space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kod rabatowy (np. WARSAW10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-grow px-3 py-2 text-xs bg-white border border-[#CFCFCF] outline-none focus:border-[#734C1D] uppercase tracking-wider rounded-xs"
                />
                <button
                  type="submit"
                  disabled={isApplyingPromo}
                  className="bg-[#0D0D0B] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#734C1D] transition-colors rounded-xs disabled:opacity-50"
                >
                  {isApplyingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Zastosuj'}
                </button>
              </form>

              {appliedPromoCode && (
                <div className="text-[11px] text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1.5 rounded flex items-center justify-between font-semibold">
                  <span>Aktywny kod: <strong>{appliedPromoCode}</strong></span>
                  <span>-{promoDiscount.toFixed(2)} PLN ({((promoRate || 0.1) * 100).toFixed(0)}%)</span>
                </div>
              )}
              {promoError && (
                <div className="text-[11px] text-[#B53838]">{promoError}</div>
              )}

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-[#5A5B60] pt-1">
                <div className="flex justify-between">
                  <span>Wartość koszyka</span>
                  <span>{subtotal.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Dostawa (InPost / Kurier)
                  </span>
                  <span className="text-[#2E7D32] font-semibold">0.00 PLN (Gratis)</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#2E7D32]">
                    <span>Naliczony rabat</span>
                    <span>-{promoDiscount.toFixed(2)} PLN</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#0D0D0B] pt-2 border-t border-[#EAE6DF]">
                  <span>Łącznie do zapłaty</span>
                  <span>{total.toFixed(2)} PLN</span>
                </div>
              </div>

              {/* 3. Checkout Details & Delivery */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-3 border-t border-[#EAE6DF]">
                <div className="text-xs uppercase tracking-widest font-semibold text-[#0D0D0B] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#734C1D]" />
                  Dane odbiorcy i dostawa
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Imię i Nazwisko *"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#CFCFCF] outline-none focus:border-[#734C1D] rounded-xs"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon (do SMS InPost) *"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#CFCFCF] outline-none focus:border-[#734C1D] rounded-xs"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Adres E-mail do potwierdzenia *"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#CFCFCF] outline-none focus:border-[#734C1D] rounded-xs"
                />

                {/* Delivery Method Selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#5A5B60] font-semibold block">
                    Wybierz formę dostawy
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('paczkomat')}
                      className={`p-2.5 text-left border rounded-xs transition-all flex flex-col justify-between ${
                        deliveryMethod === 'paczkomat'
                          ? 'border-[#0D0D0B] bg-[#0D0D0B] text-white shadow-xs'
                          : 'border-[#CFCFCF] bg-white text-[#0D0D0B] hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FFD100]" />
                          Paczkomat InPost
                        </span>
                      </div>
                      <span className={`text-[10px] mt-1 ${deliveryMethod === 'paczkomat' ? 'text-[#C6A87D]' : 'text-[#734C1D]'}`}>
                        24/7 • Gratis
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('courier')}
                      className={`p-2.5 text-left border rounded-xs transition-all flex flex-col justify-between ${
                        deliveryMethod === 'courier'
                          ? 'border-[#0D0D0B] bg-[#0D0D0B] text-white shadow-xs'
                          : 'border-[#CFCFCF] bg-white text-[#0D0D0B] hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <Truck className="w-3 h-3" />
                          Kurier pod adres
                        </span>
                      </div>
                      <span className={`text-[10px] mt-1 ${deliveryMethod === 'courier' ? 'text-[#C6A87D]' : 'text-[#734C1D]'}`}>
                        DPD / InPost • Gratis
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
                      className="w-full px-3 py-2 text-xs bg-white border border-[#CFCFCF] outline-none focus:border-[#734C1D] rounded-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Kod pocztowy (np. 00-001) *"
                        required
                        value={courierPostCode}
                        onChange={(e) => setCourierPostCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#CFCFCF] outline-none focus:border-[#734C1D] rounded-xs"
                      />
                      <input
                        type="text"
                        placeholder="Miejscowość *"
                        required
                        value={courierCity}
                        onChange={(e) => setCourierCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#CFCFCF] outline-none focus:border-[#734C1D] rounded-xs"
                      />
                    </div>
                  </div>
                )}

                {formError && (
                  <div className="text-[11px] text-[#B53838] bg-[#B53838]/10 p-2.5 rounded text-center font-medium">
                    {formError}
                  </div>
                )}

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0D0D0B] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#734C1D] transition-colors rounded-xs shadow-md flex items-center justify-center gap-2 group disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Przetwarzanie zamówienia...</span>
                    </>
                  ) : (
                    <>
                      <span>Zamawiam i Płacę ({total.toFixed(2)} PLN)</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-[#8C8D94]">
                  Wysyłka w 24h z Warszawy • 14 dni na zwrot • Bezpieczne płatności
                </p>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
