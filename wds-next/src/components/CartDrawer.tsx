'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProduct } from '@/lib/translations/products';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Check } from 'lucide-react';

export default function CartDrawer() {
  const { language, formatPrice, t, isEn } = useLanguage();
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

  // Calculate progress towards next 1 zł durag in 2+1 promotion
  const regularEligibleCount = cart.filter((i) => i.product.id !== 999 && i.promoEligible).reduce((s, i) => s + i.quantity, 0);
  const neededForNext = regularEligibleCount % 2 === 0 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0B0B0C] text-[#FAFAF9] shadow-2xl flex flex-col h-full z-10 border-l border-[#1E1E22]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E1E22] flex items-center justify-between bg-[#141416]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h2 className="font-serif text-xl font-medium text-white">
              {t.cartTitle} <span className="text-[#A3A09B] text-base tabular-nums">({cartCount})</span>
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label={isEn ? 'Close cart' : 'Zamknij koszyk'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2+1 Promo Banner */}
        <div className="bg-[#141416] px-5 py-3 border-b border-[#1E1E22]">
          <h4 className="text-[13px] font-medium text-white">
            {t.cartPromoBannerTitle}
          </h4>
          <p className="text-[13px] text-[#A3A09B] mt-0.5">
            {freeItemsCount > 0 ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                <Check className="w-3.5 h-3.5" />
                {isEn
                  ? `2+1 Deal active: ${freeItemsCount}x surprise durag for 1 PLN added!`
                  : `Promocja aktywna! ${freeItemsCount}x losowy durag za 1 zł dodany do koszyka.`}
              </span>
            ) : regularEligibleCount === 0 ? (
              isEn ? 'Buy 2 durags, get a 3rd random one for 1 PLN.' : 'Kup 2 duragi, a trzeci losowy otrzymasz za 1 zł.'
            ) : (
              isEn ? 'Add 1 more durag to claim a 3rd random durag for 1 PLN.' : 'Dodaj jeszcze 1 durag, aby odebrać trzeci losowy durag za 1 zł.'
            )}
          </p>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#1E1E22]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-gray-400 space-y-3">
              <ShoppingBag className="w-10 h-10 stroke-[1.2] text-gray-600" />
              <p className="font-serif text-lg text-white">{t.cartEmpty}</p>
              <p className="text-[14px] text-[#A3A09B] max-w-xs">
                {isEn
                  ? 'Handcrafted in Warsaw from 19 Momme mulberry silk, velvet and satin.'
                  : 'Szyte ręcznie w Warszawie z jedwabiu morwowego, satyny i aksamitu.'}
              </p>
              <Link
                href="/kolekcja/all"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#ECEAE7] text-[#0B0B0C] font-medium text-[13px] hover:bg-white transition-colors"
              >
                {isEn ? 'Browse durags' : 'Zobacz duragi'} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => {
              const localizedItem = getLocalizedProduct(item.product, language);

              return (
                <div key={`${item.product.id}-${item.variant || ''}-${idx}`} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-[#141416] overflow-hidden shrink-0 border border-[#1E1E22]">
                    <Image
                      src={item.product.images?.[0] || '/assets/durag_silk_black.png'}
                      alt={localizedItem.name}
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
                          className="font-serif text-[15px] font-medium text-white hover:text-[#ECEAE7] transition-colors line-clamp-1"
                        >
                          {localizedItem.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-gray-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title={isEn ? 'Remove from cart' : 'Usuń z koszyka'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variant && (
                        <p className="text-[13px] text-gray-400 mt-0.5">
                          {isEn ? 'Variant:' : 'Wariant:'} {item.variant}
                        </p>
                      )}
                      <p className="text-[13px] text-[#A3A09B] mt-0.5">{localizedItem.material}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector or Promo Badge */}
                      {item.product.id === 999 ? (
                        <span className="text-[11px] font-semibold text-[#B85C2E] bg-[#B85C2E]/10 px-2 py-1 border border-[#B85C2E]/25 tracking-wide">
                          {isEn ? `2+1 DEAL · ${item.quantity}x` : `PROMOCJA 2+1 · ${item.quantity} szt.`}
                        </span>
                      ) : (
                        <div className="flex items-center border border-[#1E1E22] bg-[#141416]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                            className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            aria-label={isEn ? 'Decrease' : 'Zmniejsz ilość'}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-[13px] font-medium text-white min-w-[24px] text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                            className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            aria-label={isEn ? 'Increase' : 'Zwiększ ilość'}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Unit Price */}
                      <div className="text-right">
                        <span className="text-[15px] font-semibold text-white tabular-nums">
                          {formatPrice(item.unitPrice * item.quantity, item.product.priceEur ? item.product.priceEur * item.quantity : undefined)}
                        </span>
                        {item.product.id === 999 && (
                          <span className="text-[11px] text-[#787570] line-through ml-1.5 tabular-nums">
                            {formatPrice(89 * item.quantity, item.product.priceEur ? 22 * item.quantity : undefined)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#141416] border-t border-[#1E1E22] space-y-2.5">
            {/* Subtotal */}
            <div className="flex justify-between text-[13px] text-[#A3A09B]">
              <span>{t.cartSubtotal}:</span>
              <span className="text-white tabular-nums font-medium">{formatPrice(subtotal)}</span>
            </div>

            {/* Free items discount */}
            {freeItemsDiscount > 0 && (
              <div className="flex justify-between text-[13px] text-emerald-400">
                <span>{t.cartDiscount2plus1}:</span>
                <span className="tabular-nums font-medium">-{formatPrice(freeItemsDiscount)}</span>
              </div>
            )}

            {/* Promo code discount */}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-[13px] text-[#C8794B]">
                <span>{t.cartPromoCode} ({appliedPromoCode}):</span>
                <span className="tabular-nums font-medium">-{formatPrice(promoDiscount)}</span>
              </div>
            )}

            {/* Delivery */}
            <div className="flex justify-between text-[13px] text-[#A3A09B]">
              <span>{t.cartShipping}:</span>
              <span className="text-emerald-400 font-medium">{t.cartShippingFree}</span>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-[#1E1E22] flex justify-between items-baseline">
              <span className="font-serif text-base font-medium text-white">
                {t.cartTotal}:
              </span>
              <span className="text-xl font-bold text-white tabular-nums">
                {formatPrice(total)}
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-2 space-y-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#ECEAE7] text-[#0B0B0C] font-medium text-[14px] hover:bg-white transition-colors cursor-pointer"
              >
                {t.cartCheckout} <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/koszyk"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center py-2 px-4 text-[13px] text-[#A3A09B] hover:text-white transition-colors cursor-pointer"
              >
                {t.cartViewFull}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
