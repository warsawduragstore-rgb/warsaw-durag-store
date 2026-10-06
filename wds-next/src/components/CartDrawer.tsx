'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Check } from 'lucide-react';

export default function CartDrawer() {
  const { formatPrice, t } = useLanguage();
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

  // Calculate progress towards next free/1 zł durag in 2+1 promotion
  const eligibleCount = cart.filter((i) => i.promoEligible).reduce((s, i) => s + i.quantity, 0);
  const neededForNextFree = 3 - (eligibleCount % 3);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0B0B0C] text-[#FAFAF9] shadow-2xl flex flex-col h-full z-10 border-l border-[#26262A]">
        {/* Header */}
        <div className="p-5 border-b border-[#26262A] flex items-center justify-between bg-[#141416]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#C8794B]" />
            <h2 className="font-serif text-xl tracking-wide uppercase font-semibold text-[#FAFAF9]">
              Twój Koszyk <span className="text-[#C8794B] text-base font-mono font-normal">({cartCount})</span>
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Zamknij koszyk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2+1 Promo Banner */}
        <div className="bg-[#141416] px-5 py-3 border-b border-[#26262A]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8794B] font-bold">
            <Sparkles className="w-4 h-4 shrink-0 text-[#C8794B]" />
            <span>Promocja: Kup 2, trzeci durag GRATIS</span>
          </div>
          <p className="text-xs text-[#A3A09B] mt-1 font-light">
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#26262A]">
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
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#C8794B] text-[#0B0B0C] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#FAFAF9] transition-colors"
              >
                Przejdź do kolekcji <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.variant || ''}-${idx}`} className="pt-4 first:pt-0 flex gap-4">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 bg-[#141416] overflow-hidden shrink-0 border border-[#26262A]">
                  <Image
                    src={item.product.images?.[0] || '/assets/durag_silk_black.png'}
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
                        className="font-serif text-sm font-medium text-[#FAFAF9] hover:text-[#C8794B] transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variant)}
                        className="text-gray-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Usuń z koszyka"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variant && (
                      <p className="text-[11px] text-gray-400 mt-0.5 font-mono">Wariant: {item.variant}</p>
                    )}
                    <p className="text-[11px] text-[#C8794B] mt-0.5 font-mono">{item.product.material}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#26262A] bg-[#141416]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Zmniejsz ilość"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-medium text-white min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Zwiększ ilość"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Unit Price */}
                    <div className="text-right">
                      <span className="font-mono text-sm font-semibold text-[#FAFAF9]">
                        {formatPrice(item.unitPrice * item.quantity, item.product.priceEur ? item.product.priceEur * item.quantity : undefined)}
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
          <div className="p-5 bg-[#141416] border-t border-[#26262A] space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between text-xs text-[#A3A09B]">
              <span>Wartość produktów:</span>
              <span className="font-mono text-[#FAFAF9]">{formatPrice(subtotal)}</span>
            </div>

            {/* Free items discount */}
            {freeItemsDiscount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Rabat "Kup 2, 3 gratis":
                </span>
                <span className="font-mono font-semibold">-{formatPrice(freeItemsDiscount)}</span>
              </div>
            )}

            {/* Promo code discount */}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-xs text-[#C8794B]">
                <span>Kod rabatowy ({appliedPromoCode}):</span>
                <span className="font-mono font-semibold">-{formatPrice(promoDiscount)}</span>
              </div>
            )}

            {/* Delivery */}
            <div className="flex justify-between text-xs text-[#A3A09B]">
              <span>Dostawa w Polsce:</span>
              <span className="font-mono text-emerald-400 font-medium">0.00 zł (Paczkomat InPost)</span>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-[#26262A] flex justify-between items-baseline">
              <span className="font-serif text-base font-semibold text-[#FAFAF9] uppercase tracking-wider">
                Do zapłaty:
              </span>
              <span className="font-mono text-xl font-bold text-[#C8794B]">
                {formatPrice(total)}
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-2 space-y-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#C8794B] text-[#0B0B0C] font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#FAFAF9] transition-colors shadow-lg shadow-[#C8794B]/10 cursor-pointer"
              >
                Przejdź do kasy <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/koszyk"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center py-2 px-4 text-xs font-mono uppercase tracking-wider text-[#A3A09B] hover:text-white transition-colors cursor-pointer"
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
