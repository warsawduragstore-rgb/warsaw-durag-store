'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Check } from 'lucide-react';

export default function CartDrawer() {
  const { t } = useLanguage();
  const {
    cart,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    promoDiscount,
    freeItemsCount,
    freeItemsDiscount,
    total,
    appliedPromoCode,
  } = useCart();

  if (!isCartOpen) return null;

  // Calculate progress towards next free durag in "Kup 2, trzeci gratis" promo
  const eligibleCount = cart.filter((i) => i.promoEligible).reduce((s, i) => s + i.quantity, 0);
  const neededForNextFree = 3 - (eligibleCount % 3);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0D0D0B] text-[#F7F5F2] shadow-2xl flex flex-col h-full z-10 border-l border-[#262624]">
        {/* Header */}
        <div className="p-5 border-b border-[#262624] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#D9A87E]" />
            <h2 className="font-serif text-xl tracking-wide uppercase font-semibold text-white">
              Twój Koszyk <span className="text-[#D9A87E] text-base">({cartCount})</span>
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Zamknij koszyk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BOGO Promo Banner */}
        <div className="bg-[#171715] px-5 py-3 border-b border-[#262624]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D9A87E]">
            <Sparkles className="w-4 h-4 shrink-0 text-[#D9A87E]" />
            <span>Promocja: Kup 2, trzeci durag GRATIS</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {freeItemsCount > 0 ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                <Check className="w-3.5 h-3.5" /> Naliczono {freeItemsCount}x darmowy durag w koszyku!
              </span>
            ) : neededForNextFree === 3 ? (
              'Dodaj 3 duragi do koszyka, a najtańszy otrzymasz automatycznie za 0 zł.'
            ) : neededForNextFree === 1 ? (
              'Dodaj jeszcze tylko 1 durag, aby odebrać go całkowicie GRATIS!'
            ) : (
              'Dodaj jeszcze 2 duragi, aby 3. otrzymać GRATIS!'
            )}
          </p>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#262624]/60">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-gray-400 space-y-4">
              <ShoppingBag className="w-12 h-12 stroke-[1.2] text-gray-600" />
              <p className="font-serif text-lg text-gray-300">Twój koszyk jest pusty</p>
              <p className="text-xs text-gray-500 max-w-xs">
                Odkryj naszą kolekcję ręcznie szytych duragów z jedwabiu morwowego, satyny i aksamitu.
              </p>
              <Link
                href="/produkty"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#D9A87E] text-black font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#e4b58e] transition-colors"
              >
                Przejdź do kolekcji <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.variant || ''}-${idx}`} className="pt-4 first:pt-0 flex gap-4">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 bg-[#171715] rounded-lg overflow-hidden shrink-0 border border-[#262624]">
                  <Image
                    src={item.product.images?.[0] || '/assets/durag_silk_black.webp'}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/produkt/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-serif text-sm font-medium text-white hover:text-[#D9A87E] transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variant)}
                        className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                        title="Usuń z koszyka"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variant && (
                      <p className="text-[11px] text-gray-400 mt-0.5">Wariant: {item.variant}</p>
                    )}
                    <p className="text-[11px] text-[#D9A87E]/90 mt-0.5">{item.product.material}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#262624] rounded-md bg-[#171715]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        aria-label="Zmniejsz ilość"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-medium text-white min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        aria-label="Zwiększ ilość"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Unit Price */}
                    <div className="text-right">
                      <span className="font-mono text-sm font-semibold text-white">
                        {(item.unitPrice * item.quantity).toFixed(2)} zł
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#171715] border-t border-[#262624] space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>Wartość produktów:</span>
              <span className="font-mono text-white">{subtotal.toFixed(2)} zł</span>
            </div>

            {/* Free items discount */}
            {freeItemsDiscount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Rabat "Kup 2, 3 gratis":
                </span>
                <span className="font-mono font-semibold">-{freeItemsDiscount.toFixed(2)} zł</span>
              </div>
            )}

            {/* Promo code discount */}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-xs text-[#D9A87E]">
                <span>Kod rabatowy ({appliedPromoCode}):</span>
                <span className="font-mono font-semibold">-{promoDiscount.toFixed(2)} zł</span>
              </div>
            )}

            {/* Delivery */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>Dostawa w Polsce:</span>
              <span className="font-mono text-emerald-400 font-medium">0.00 zł (Darmowa)</span>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-[#262624] flex justify-between items-baseline">
              <span className="font-serif text-base font-semibold text-white uppercase tracking-wider">
                Do zapłaty:
              </span>
              <span className="font-mono text-xl font-bold text-[#D9A87E]">
                {total.toFixed(2)} zł
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-2 space-y-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#D9A87E] text-black font-semibold text-xs uppercase tracking-widest rounded-lg hover:bg-[#e4b58e] transition-colors shadow-lg shadow-[#D9A87E]/10"
              >
                Przejdź do kasy <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/koszyk"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center py-2.5 px-4 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                Zobacz pełny koszyk
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
