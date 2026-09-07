'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';

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
    appliedPromoCode,
    applyPromoCode,
    total,
    clearCart,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) {
      setPromoInput('');
    } else {
      setPromoError('Nieprawidłowy kod rabatowy.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail) return;
    setIsSuccess(true);
    setTimeout(() => {
      clearCart();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
        
        {/* Header */}
        <div className="p-6 border-b border-[#CFCFCF]/50 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-[#0D0D0B]">
            {t.cartTitle} ({cart.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-[#3B3C40] hover:text-[#0D0D0B] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="flex-grow p-8 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-[#734C1D] mb-4" />
            <h3 className="font-serif text-2xl text-[#0D0D0B] mb-2">Dziękujemy za zamówienie!</h3>
            <p className="text-sm text-[#3B3C40] mb-6">
              Potwierdzenie oraz szczegóły dostawy zostały wysłane na podany adres e-mail.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setIsCartOpen(false);
              }}
              className="bg-[#0D0D0B] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#734C1D] transition-colors"
            >
              Powrót do sklepu
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex-grow p-8 flex flex-col items-center justify-center text-center">
            <p className="text-[#3B3C40] text-sm font-light mb-6">Twój koszyk jest obecnie pusty.</p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="bg-[#0D0D0B] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#734C1D] transition-colors"
            >
              Przeglądaj produkty
            </button>
          </div>
        ) : (
          <>
            {/* Item List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b border-[#CFCFCF]/30 pb-6">
                  <div className="relative w-20 h-20 bg-[#F7F5F2] shrink-0 border border-[#CFCFCF]/50">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-base text-[#0D0D0B] font-medium">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#3B3C40] hover:text-[#D32F2F] transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-xs text-[#734C1D] font-semibold block mt-1">
                      {item.product.material}
                    </span>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#CFCFCF]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#3B3C40] hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#3B3C40] hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#0D0D0B]">
                        {(item.product.price * item.quantity).toFixed(2)} PLN
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code & Totals Footer */}
            <div className="p-6 border-t border-[#CFCFCF]/50 bg-[#F7F5F2] space-y-4">
              
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kod rabatowy (np. WARSAW10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-grow px-3 py-2 text-xs border border-[#CFCFCF] outline-none focus:border-[#734C1D]"
                />
                <button
                  type="submit"
                  className="bg-[#0D0D0B] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#734C1D] transition-colors"
                >
                  Użyj
                </button>
              </form>

              {appliedPromoCode && (
                <div className="text-xs text-[#2E7D32] font-semibold">
                  Aktywny rabat ({appliedPromoCode}): -{promoDiscount.toFixed(2)} PLN
                </div>
              )}
              {promoError && (
                <div className="text-xs text-[#D32F2F]">{promoError}</div>
              )}

              <div className="space-y-1.5 text-xs text-[#3B3C40] pt-2">
                <div className="flex justify-between">
                  <span>Suma częściowa</span>
                  <span>{subtotal.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between">
                  <span>Dostawa (InPost / Kurier)</span>
                  <span className="text-[#2E7D32] font-semibold">Gratis</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#0D0D0B] pt-2 border-t border-[#CFCFCF]/50">
                  <span>Razem</span>
                  <span>{total.toFixed(2)} PLN</span>
                </div>
              </div>

              {/* Quick Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="Imię i Nazwisko"
                  required
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#CFCFCF] outline-none focus:border-[#734C1D]"
                />
                <input
                  type="email"
                  placeholder="Adres E-mail"
                  required
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#CFCFCF] outline-none focus:border-[#734C1D]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#734C1D] text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#0D0D0B] transition-colors"
                >
                  Kupuję i Płacę ({total.toFixed(2)} PLN)
                </button>
              </form>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
