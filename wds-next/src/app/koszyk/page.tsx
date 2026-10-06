'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function CartPage() {
  const { formatPrice, t } = useLanguage();
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
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAFAF9] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb / Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#787570] uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-white transition-colors">Start</Link>
            <span>/</span>
            <span className="text-[#C8794B]">Koszyk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight uppercase text-[#FAFAF9]">
            Twój Koszyk {cartCount > 0 && <span className="text-[#C8794B] font-mono text-2xl">({cartCount})</span>}
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#141416] border border-[#26262A] p-12 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-[#1A1A1B] flex items-center justify-center mx-auto text-[#787570]">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-normal text-white">Twój koszyk jest pusty</h2>
              <p className="text-xs text-[#A3A09B]">
                Nie dodałeś jeszcze żadnych produktów. Odkryj naszą kolekcję duragów z naturalnego jedwabiu morwowego 19 Momme, weluru i satyny.
              </p>
            </div>
            <Link
              href="/produkty"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8794B] text-[#0B0B0C] font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#FAFAF9] transition-colors"
            >
              Zobacz całą kolekcję <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Products List & 2+1 Promo */}
            <div className="lg:col-span-8 space-y-6">
              {/* 2+1 Banner */}
              <div className="bg-[#141416] border border-[#C8794B]/30 p-5 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#C8794B]/10 text-[#C8794B] shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-medium text-white uppercase tracking-wider">
                        Promocja: Kup 2, trzeci durag GRATIS
                      </h3>
                      {freeItemsCount > 0 && (
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium border border-emerald-500/30">
                          Naliczono {freeItemsCount}x gratis
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A3A09B] mt-1 font-light">
                      {freeItemsCount > 0
                        ? `Otrzymujesz ${freeItemsCount} ${freeItemsCount === 1 ? 'najtańszy durag' : 'najtańsze duragi'} za 0 zł! Promocja naliczana jest automatycznie.`
                        : neededForNextFree === 1
                        ? 'Dodaj do koszyka jeszcze tylko 1 kwalifikujący się durag, aby odebrać go za 0 zł!'
                        : 'Kup dowolne 2 duragi, a 3. najtańszy w koszyku otrzymasz w prezencie za darmo.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-[#141416] border border-[#26262A] divide-y divide-[#26262A] overflow-hidden">
                {cart.map((item, idx) => (
                  <div key={`${item.product.id}-${item.variant || ''}-${idx}`} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    {/* Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#0E0E10] overflow-hidden shrink-0 border border-[#26262A]">
                      <Image
                        src={item.product.images?.[0] || '/assets/durag_silk_black.png'}
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
                            className="font-serif text-lg font-normal text-white hover:text-[#C8794B] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-[#787570] mt-0.5 font-mono">Wariant: <span className="text-[#ECEAE7]">{item.variant}</span></p>
                          )}
                          <p className="text-xs text-[#C8794B] mt-1 font-mono">{item.product.material}</p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-[#787570] hover:text-red-400 p-2 transition-colors cursor-pointer"
                          title="Usuń z koszyka"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#26262A] bg-[#0B0B0C]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                            className="p-2 text-[#787570] hover:text-white transition-colors cursor-pointer"
                            aria-label="Zmniejsz ilość"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold text-white min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                            className="p-2 text-[#787570] hover:text-white transition-colors cursor-pointer"
                            aria-label="Zwiększ ilość"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-mono text-base font-bold text-[#FAFAF9]">
                            {formatPrice(item.unitPrice * item.quantity, item.product.priceEur ? item.product.priceEur * item.quantity : undefined)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <div className="bg-[#141416] border border-[#26262A] p-5">
                <form onSubmit={handleApplyPromo} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Kod rabatowy (np. WARSAW10)"
                    className="flex-1 bg-[#0B0B0C] border border-[#26262A] px-4 py-2.5 text-xs font-mono text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-6 py-2.5 bg-[#1A1A1B] border border-[#333338] text-white hover:bg-[#C8794B] hover:text-[#0B0B0C] hover:border-[#C8794B] text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isApplying ? 'Sprawdzam...' : 'Zastosuj'}
                  </button>
                </form>

                {promoMessage && (
                  <p className={`text-xs mt-3 font-mono ${promoMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#141416] border border-[#26262A] p-6 space-y-5 sticky top-28">
                <h3 className="font-serif text-lg font-medium text-white uppercase tracking-wider pb-3 border-b border-[#26262A]">
                  Podsumowanie Zamówienia
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#A3A09B]">
                    <span>Wartość produktów:</span>
                    <span className="font-mono text-white">{formatPrice(subtotal)}</span>
                  </div>

                  {freeItemsDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Kup 2, trzeci gratis:
                      </span>
                      <span className="font-mono">-{formatPrice(freeItemsDiscount)}</span>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[#C8794B] font-medium">
                      <span>Kod rabatowy ({appliedPromoCode}):</span>
                      <span className="font-mono">-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#A3A09B]">
                    <span>Dostawa w Polsce:</span>
                    <span className="font-mono text-emerald-400 font-medium">0.00 zł (Paczkomat InPost)</span>
                  </div>

                  <div className="pt-3 border-t border-[#26262A] flex justify-between items-baseline">
                    <span className="font-serif text-base font-semibold text-white uppercase tracking-wider">
                      Łącznie:
                    </span>
                    <span className="font-mono text-2xl font-bold text-[#C8794B]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#C8794B] text-[#0B0B0C] font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#FAFAF9] transition-all shadow-lg shadow-[#C8794B]/10 cursor-pointer"
                >
                  Przejdź do kasy <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-3 border-t border-[#26262A] space-y-2 text-[11px] text-[#787570]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#C8794B]" />
                    <span>Wysyłka w 24h z Warszawy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#C8794B]" />
                    <span>14 dni na darmowy zwrot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8794B]" />
                    <span>Bezpieczna płatność Stripe (BLIK / P24 / Karty)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
