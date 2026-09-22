'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    cartCount,
    removeFromCart,
    updateQuantity,
    subtotal,
    promoDiscount,
    freeItemsCount,
    freeItemsDiscount,
    total,
    appliedPromoCode,
    applyPromoCode,
    isLoading,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const eligibleCount = cart.filter((i) => i.promoEligible).reduce((s, i) => s + i.quantity, 0);
  const neededForNextFree = 3 - (eligibleCount % 3);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMessage(null);
    if (!promoInput.trim()) return;

    setIsApplying(true);
    const success = await applyPromoCode(promoInput);
    setIsApplying(false);

    if (success) {
      setPromoMessage({ text: `Kod ${promoInput.toUpperCase()} został pomyślnie naliczony!`, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: 'Podany kod rabatowy jest nieprawidłowy lub nieaktywny.', isError: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0B] text-[#F7F5F2] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb / Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-white transition-colors">Start</Link>
            <span>/</span>
            <span className="text-[#D9A87E]">Koszyk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight uppercase">
            Twój Koszyk {cartCount > 0 && <span className="text-[#D9A87E]">({cartCount})</span>}
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#171715] border border-[#262624] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-[#262624]/60 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-semibold text-white">Twój koszyk jest pusty</h2>
              <p className="text-sm text-gray-400">
                Nie dodałeś jeszcze żadnych produktów. Sprawdź naszą ofertę duragów z naturalnego jedwabiu morwowego 19 Momme, weluru i satyny.
              </p>
            </div>
            <Link
              href="/produkty"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D9A87E] text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-[#e4b58e] transition-colors"
            >
              Zobacz całą kolekcję <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Products List & BOGO Promo */}
            <div className="lg:col-span-8 space-y-6">
              {/* BOGO Banner */}
              <div className="bg-[#171715] border border-[#D9A87E]/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#D9A87E]/10 rounded-lg text-[#D9A87E] shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-semibold text-white uppercase tracking-wider">
                        Promocja: Kup 2, trzeci durag GRATIS
                      </h3>
                      {freeItemsCount > 0 && (
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium rounded-full border border-emerald-500/30">
                          Naliczono {freeItemsCount}x gratis
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {freeItemsCount > 0
                        ? `Otrzymujesz ${freeItemsCount} ${freeItemsCount === 1 ? 'najtańszy durag' : 'najtańsze duragi'} za 0 zł! Promocja naliczana jest automatycznie.`
                        : neededForNextFree === 1
                        ? 'Dodaj do koszyka jeszcze tylko 1 kwalifikujący się durag, aby odebrać go za 0 zł!'
                        : 'Kup dowolne 2 duragi, a 3. najtańszy w koszyku otrzymasz całkowicie za darmo.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-[#171715] border border-[#262624] rounded-2xl divide-y divide-[#262624] overflow-hidden">
                {cart.map((item, idx) => (
                  <div key={`${item.product.id}-${item.variant || ''}-${idx}`} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    {/* Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#262624] rounded-xl overflow-hidden shrink-0 border border-[#333330]">
                      <Image
                        src={item.product.images?.[0] || '/assets/durag_silk_black.webp'}
                        alt={item.product.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link
                            href={`/produkt/${item.product.slug}`}
                            className="font-serif text-lg font-medium text-white hover:text-[#D9A87E] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-gray-400 mt-0.5">Wariant: <span className="text-gray-200">{item.variant}</span></p>
                          )}
                          <p className="text-xs text-[#D9A87E] mt-1 font-mono">{item.product.material}</p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-gray-500 hover:text-red-400 p-2 transition-colors"
                          title="Usuń z koszyka"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#262624] rounded-lg bg-[#0D0D0B]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            aria-label="Zmniejsz ilość"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-mono font-medium text-white min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            aria-label="Zwiększ ilość"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block font-mono">
                            {item.quantity > 1 ? `${item.quantity} × ${item.unitPrice.toFixed(2)} zł` : 'Cena:'}
                          </span>
                          <span className="font-mono text-lg font-bold text-white">
                            {(item.unitPrice * item.quantity).toFixed(2)} zł
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 bg-[#171715]/60 border border-[#262624] rounded-xl text-xs text-gray-300">
                  <Truck className="w-5 h-5 text-[#D9A87E] shrink-0" />
                  <span>Darmowa dostawa do Paczkomatu w całej Polsce</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#171715]/60 border border-[#262624] rounded-xl text-xs text-gray-300">
                  <RotateCcw className="w-5 h-5 text-[#D9A87E] shrink-0" />
                  <span>14 dni na darmowy zwrot lub wymianę</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#171715]/60 border border-[#262624] rounded-xl text-xs text-gray-300">
                  <ShieldCheck className="w-5 h-5 text-[#D9A87E] shrink-0" />
                  <span>Bezpieczne płatności BLIK, karta i Apple Pay</span>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#171715] border border-[#262624] rounded-2xl p-6 space-y-5 sticky top-28">
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider pb-3 border-b border-[#262624]">
                  Podsumowanie
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label htmlFor="promo" className="text-xs font-mono text-gray-400 block uppercase">
                    Kod rabatowy
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo"
                      type="text"
                      placeholder="np. WARSAW10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-[#0D0D0B] border border-[#262624] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A87E]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !promoInput.trim()}
                      className="px-4 py-2 bg-[#262624] hover:bg-[#333330] text-xs font-mono uppercase tracking-wider text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isApplying ? '...' : 'Dodaj'}
                    </button>
                  </div>
                  {promoMessage && (
                    <p className={`text-xs ${promoMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                      {promoMessage.text}
                    </p>
                  )}
                  {appliedPromoCode && !promoMessage && (
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Aktywny kod: <strong>{appliedPromoCode}</strong>
                    </p>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-3 border-t border-[#262624] text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Wartość koszyka:</span>
                    <span className="font-mono text-white font-medium">{subtotal.toFixed(2)} zł</span>
                  </div>

                  {freeItemsDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Rabat (Kup 2, 3 gratis):
                      </span>
                      <span className="font-mono">-{freeItemsDiscount.toFixed(2)} zł</span>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[#D9A87E] font-medium">
                      <span>Rabat kodowy:</span>
                      <span className="font-mono">-{promoDiscount.toFixed(2)} zł</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400">
                    <span>Wysyłka (Paczkomat / Kurier):</span>
                    <span className="font-mono text-emerald-400 font-medium">0.00 zł (Darmowa)</span>
                  </div>

                  <div className="pt-4 border-t border-[#262624] flex justify-between items-baseline">
                    <span className="font-serif text-base font-bold text-white uppercase tracking-wider">
                      Łącznie:
                    </span>
                    <span className="font-mono text-2xl font-bold text-[#D9A87E]">
                      {total.toFixed(2)} zł
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 text-right">Zawiera podatek VAT</p>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#D9A87E] text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-[#e4b58e] transition-all shadow-lg shadow-[#D9A87E]/10"
                >
                  Przejdź do kasy <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-center text-[11px] text-gray-500 font-mono">
                  W kolejnym kroku wybierzesz Paczkomat i opłacisz zamówienie.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
