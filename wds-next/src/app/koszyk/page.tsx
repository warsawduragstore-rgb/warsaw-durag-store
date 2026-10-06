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
          <div className="flex items-center gap-2 text-xs text-[#A3A09B] mb-2">
            <Link href="/" className="hover:text-white transition-colors">Start</Link>
            <span>/</span>
            <span className="text-[#C8794B]">Koszyk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#FAFAF9]">
            Twój koszyk {cartCount > 0 && <span className="text-[#C8794B] text-2xl font-sans tabular-nums">({cartCount})</span>}
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#141416] border border-[#26262A] p-12 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-[#1A1A1B] flex items-center justify-center mx-auto text-[#787570]">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-medium text-white">Twój koszyk jest pusty</h2>
              <p className="text-sm text-[#A3A09B]">
                Nie dodałeś jeszcze żadnych produktów. Duragi szyte w Warszawie z jedwabiu, satyny i weluru.
              </p>
            </div>
            <Link
              href="/produkty"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8794B] text-[#0B0B0C] font-semibold text-sm hover:bg-[#FAFAF9] transition-colors"
            >
              Zobacz duragi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Products List & 2+1 Promo */}
            <div className="lg:col-span-8 space-y-6">
              {/* 2+1 Banner */}
              <div className="bg-[#141416] border border-[#26262A] p-5 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#C8794B]/10 text-[#C8794B] shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-medium text-white">
                        Promocja: kup 2, trzeci losowy durag za 1 zł
                      </h3>
                      {freeItemsCount > 0 && (
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 tabular-nums">
                          Naliczono {freeItemsCount}x
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A3A09B] mt-1">
                      {freeItemsCount > 0
                        ? `Promocja naliczona automatycznie w koszyku.`
                        : neededForNextFree === 1
                        ? 'Dodaj jeszcze 1 durag, aby odebrać trzeci losowy durag za 1 zł.'
                        : 'Kup 2 duragi, a trzeci losowy otrzymasz za 1 zł.'}
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
                            className="font-serif text-lg font-medium text-white hover:text-[#C8794B] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-[#A3A09B] mt-0.5">Wariant: <span className="text-[#ECEAE7]">{item.variant}</span></p>
                          )}
                          <p className="text-xs text-[#A3A09B] mt-1">{item.product.material}</p>
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
                          <span className="px-3 text-xs font-medium text-white min-w-[28px] text-center tabular-nums">
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
                          <span className="text-base font-semibold text-[#FAFAF9] tabular-nums">
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
                    className="flex-1 bg-[#0B0B0C] border border-[#26262A] px-4 py-2.5 text-xs text-white placeholder-[#787570] focus:outline-none focus:border-[#C8794B]"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-6 py-2.5 bg-[#1A1A1B] border border-[#333338] text-white hover:bg-[#C8794B] hover:text-[#0B0B0C] hover:border-[#C8794B] text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isApplying ? 'Sprawdzam...' : 'Zastosuj'}
                  </button>
                </form>

                {promoMessage && (
                  <p className={`text-xs mt-3 ${promoMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#141416] border border-[#26262A] p-6 space-y-5 sticky top-28">
                <h3 className="font-serif text-lg font-medium text-white pb-3 border-b border-[#26262A]">
                  Podsumowanie zamówienia
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#A3A09B]">
                    <span>Wartość produktów:</span>
                    <span className="text-white tabular-nums">{formatPrice(subtotal)}</span>
                  </div>

                  {freeItemsDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Rabat promocyjny:
                      </span>
                      <span className="tabular-nums">-{formatPrice(freeItemsDiscount)}</span>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[#C8794B] font-medium">
                      <span>Kod rabatowy ({appliedPromoCode}):</span>
                      <span className="tabular-nums">-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#A3A09B]">
                    <span>Dostawa w Polsce:</span>
                    <span className="text-emerald-400 font-medium">0 zł (Darmowa dostawa)</span>
                  </div>

                  <div className="pt-3 border-t border-[#26262A] flex justify-between items-baseline">
                    <span className="font-serif text-base font-medium text-white">
                      Łącznie:
                    </span>
                    <span className="text-2xl font-semibold text-[#C8794B] tabular-nums">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#C8794B] text-[#0B0B0C] font-semibold text-sm hover:bg-[#FAFAF9] transition-all cursor-pointer"
                >
                  Przejdź do kasy <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-3 border-t border-[#26262A] space-y-2 text-xs text-[#A3A09B]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#C8794B]" />
                    <span>Wysyłka z Warszawy w 1–2 dni robocze</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#C8794B]" />
                    <span>14 dni na zwrot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8794B]" />
                    <span>Odbiór osobisty w Warszawie po umówieniu</span>
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
