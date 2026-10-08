'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProduct } from '@/lib/translations/products';
import { Star, ChevronDown, Check } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { language, formatPrice, t, isEn } = useLanguage();

  const localized = getLocalizedProduct(product, language);

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0] || '/assets/durag_silk_black.png');
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]?.name || product.colors?.[0]?.name
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'shipping' | 'payments' | 'materials' | 'reviews' | null>(null);
  const [addedMessage, setAddedMessage] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainBuyBoxRef = useRef<HTMLDivElement>(null);

  const displayName = localized.name;
  const mainImage = selectedImage || product.images[0] || '/assets/durag_silk_black.png';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (mainBuyBoxRef.current) {
      observer.observe(mainBuyBoxRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-[#0E0E10] border border-[#1E1E22] overflow-hidden">
            <Image
              src={mainImage}
              alt={displayName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 shrink-0 bg-[#0E0E10] border transition-colors cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#C8794B]'
                      : 'border-[#1E1E22] hover:border-[#787570]'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${displayName} — miniatura ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-[13px] font-medium text-[#C8794B] tracking-[0.02em] block mb-1">
              {localized.material}
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight leading-tight">
              {displayName}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-[13px] text-[#A3A09B]">
              <span className="text-[#C8794B] font-medium flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C8794B]" /> 5.0
              </span>
              <span>•</span>
              <span>
                {Math.max(product.reviews?.length || 1, 1)}{' '}
                {isEn ? 'customer reviews' : 'opinie klientów'}
              </span>
            </div>
          </div>

          {/* Promo: Kup 2, trzeci durag za 1 zł */}
          <div className="bg-[#141416] p-4 border border-[#1E1E22]">
            <h4 className="text-[14px] font-medium text-white mb-0.5">
              {t.promoStripTitle}
            </h4>
            <p className="text-[13px] text-[#A3A09B] leading-relaxed">
              {t.promoStripDesc}
            </p>
          </div>

          {/* Price & Delivery Fact */}
          <div className="pb-4 border-b border-[#1E1E22]">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-semibold text-white tabular-nums tracking-normal">
                {formatPrice(product.price, product.priceEur)}
              </span>
            </div>
            <p className="text-[13px] text-[#787570] mt-1">
              {t.deliveryNote}
            </p>
          </div>

          {/* Key Product Facts */}
          <div className="grid grid-cols-2 gap-2 text-[13px] text-[#ECEAE7] bg-[#141416] p-4 border border-[#1E1E22]">
            <div>{t.factStraps}</div>
            <div>{t.factSeam}</div>
            <div>{t.factHandmade}</div>
            <div>{t.factReturns}</div>
          </div>

          {/* Description */}
          <div className="text-[14px] text-[#A3A09B] leading-relaxed whitespace-pre-line border-b border-[#1E1E22] pb-4">
            {localized.description}
          </div>

          {/* Variant / Color Picker */}
          {((product.variants && product.variants.length > 1) || (product.colors && product.colors.length > 1)) && (
            <div className="space-y-2 border-b border-[#1E1E22] pb-4">
              <span className="text-xs text-[#787570] block font-medium">
                {isEn ? 'Select color / variant:' : 'Wybierz kolor / wariant:'}{' '}
                <span className="text-[#141416] font-semibold">{selectedVariant}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {(product.variants || product.colors || []).map((v: any, idx: number) => {
                  const valName = v.name || v.value;
                  const isSelected = selectedVariant === valName;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariant(valName)}
                      className={`px-3.5 py-2 text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'border-[#141416] bg-[#141416] text-[#FAF9F6]'
                          : 'border-[#DFDAD1] bg-white text-[#141416] hover:border-[#141416]'
                      }`}
                    >
                      {v.hex && (
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
                          style={{ backgroundColor: v.hex }}
                        />
                      )}
                      <span>{valName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Quantity & Add to Cart */}
          <div ref={mainBuyBoxRef} className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#1E1E22] bg-[#141416] shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-sm text-white hover:bg-[#1E1E22] cursor-pointer transition-colors"
                  aria-label={isEn ? 'Decrease quantity' : 'Zmniejsz ilość'}
                >
                  -
                </button>
                <span className="px-3 text-sm font-medium text-white min-w-[2rem] text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-sm text-white hover:bg-[#1E1E22] cursor-pointer transition-colors"
                  aria-label={isEn ? 'Increase quantity' : 'Zwiększ ilość'}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-grow py-3.5 sm:py-4 px-6 text-[14px] font-medium transition-colors border cursor-pointer ${
                  addedMessage
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-[#ECEAE7] border-[#ECEAE7] text-[#0B0B0C] hover:bg-white hover:border-white'
                }`}
              >
                {addedMessage
                  ? t.addedToCart
                  : `${t.addToCart} · ${formatPrice(product.price * quantity, product.priceEur ? product.priceEur * quantity : undefined)}`}
              </button>
            </div>

            {addedMessage && (
              <div className="bg-[#141416] text-[#ECEAE7] text-[13px] p-3 border border-[#1E1E22] flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {t.addedConfirmation}
                </span>
                <Link
                  href="/koszyk"
                  className="font-medium text-white underline hover:text-[#C8794B]"
                >
                  {t.goToCart}
                </Link>
              </div>
            )}
          </div>

          {/* Accordions */}
          <div className="border-t border-[#1E1E22] pt-4 space-y-2">
            {/* Delivery Accordion */}
            <div className="border border-[#1E1E22] bg-[#141416]">
              <button
                onClick={() => setActiveTab(activeTab === 'shipping' ? null : 'shipping')}
                className="w-full px-4 py-3 text-left font-medium text-[14px] flex items-center justify-between hover:bg-[#1A1A1B] transition-colors cursor-pointer text-white"
              >
                <span>{t.tabShippingTitle}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#787570] transition-transform duration-200 ${
                    activeTab === 'shipping' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>
              {activeTab === 'shipping' && (
                <div className="px-4 pb-4 pt-1 text-[13px] text-[#A3A09B] space-y-2 border-t border-[#1E1E22]">
                  <p>• <strong>{isEn ? 'Dispatched from Warsaw:' : 'Wysyłka z Warszawy:'}</strong> {t.tabShippingLine1}</p>
                  <p>• <strong>{isEn ? 'Free shipping across Poland:' : 'Darmowa dostawa w Polsce:'}</strong> {t.tabShippingLine2}</p>
                  <p>• <strong>{isEn ? 'Worldwide & EU shipping:' : 'Wysyłka zagraniczna (UE i świat):'}</strong> {isEn ? 'Tracked courier delivery in 3–6 business days.' : 'Ubezpieczona przesyłka kurierska w 3–6 dni roboczych.'}</p>
                  <p>• <strong>{isEn ? 'Warsaw local pickup:' : 'Odbiór osobisty w Warszawie:'}</strong> {t.tabShippingLine3}</p>
                </div>
              )}
            </div>

            {/* Payments & Returns Accordion */}
            <div className="border border-[#1E1E22] bg-[#141416]">
              <button
                onClick={() => setActiveTab(activeTab === 'payments' ? null : 'payments')}
                className="w-full px-4 py-3 text-left font-medium text-[14px] flex items-center justify-between hover:bg-[#1A1A1B] transition-colors cursor-pointer text-white"
              >
                <span>{t.tabReturnsTitle}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#787570] transition-transform duration-200 ${
                    activeTab === 'payments' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>
              {activeTab === 'payments' && (
                <div className="px-4 pb-4 pt-1 text-[13px] text-[#A3A09B] space-y-2 border-t border-[#1E1E22]">
                  <p>• <strong>{isEn ? 'Return window:' : 'Termin zwrotu:'}</strong> {t.tabReturnsLine1}</p>
                  <p>• <strong>{isEn ? 'Condition:' : 'Stan:'}</strong> {t.tabReturnsLine2}</p>
                </div>
              )}
            </div>

            {/* Fabric & Care Accordion */}
            <div className="border border-[#1E1E22] bg-[#141416]">
              <button
                onClick={() => setActiveTab(activeTab === 'materials' ? null : 'materials')}
                className="w-full px-4 py-3 text-left font-medium text-[14px] flex items-center justify-between hover:bg-[#1A1A1B] transition-colors cursor-pointer text-white"
              >
                <span>{t.tabMaterialTitle}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#787570] transition-transform duration-200 ${
                    activeTab === 'materials' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>
              {activeTab === 'materials' && (
                <div className="px-4 pb-4 pt-1 text-[13px] text-[#A3A09B] space-y-2 border-t border-[#1E1E22]">
                  <p>• {t.tabMaterialLine1}</p>
                  <p>• {t.tabMaterialLine2}</p>
                </div>
              )}
            </div>

            {/* Reviews Accordion */}
            <div className="border border-[#1E1E22] bg-[#141416]">
              <button
                onClick={() => setActiveTab(activeTab === 'reviews' ? null : 'reviews')}
                className="w-full px-4 py-3 text-left font-medium text-[14px] flex items-center justify-between hover:bg-[#1A1A1B] transition-colors cursor-pointer text-white"
              >
                <span>
                  {isEn ? 'Customer reviews' : 'Opinie klientów'} ({product.reviews?.length || 1})
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#787570] transition-transform duration-200 ${
                    activeTab === 'reviews' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>
              {activeTab === 'reviews' && (
                <div className="px-4 pb-4 pt-2 text-[13px] text-[#A3A09B] space-y-3 border-t border-[#1E1E22]">
                  {(product.reviews && product.reviews.length > 0) ? (
                    product.reviews.map((rev, idx) => (
                      <div key={idx} className="border-b border-[#1E1E22] pb-2.5 last:border-b-0">
                        <div className="flex items-center justify-between mb-1 text-[13px]">
                          <span className="font-medium text-white">{rev.author}</span>
                          <span className="text-[#C8794B] font-medium">★ 5.0</span>
                        </div>
                        <p className="text-[#ECEAE7]">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    ))
                  ) : (
                    <div className="border-b border-[#1E1E22] pb-2.5">
                      <div className="flex items-center justify-between mb-1 text-[13px]">
                        <span className="font-medium text-white">
                          {isEn ? 'Tomasz K., Warsaw' : 'Tomasz K., Warszawa'}
                        </span>
                        <span className="text-[#C8794B] font-medium">★ 5.0</span>
                      </div>
                      <p className="text-[#ECEAE7]">
                        &ldquo;{isEn ? 'Superior silk quality. Long straps, exterior seam leaves zero forehead marks. Highly recommended.' : 'Wysoka jakość jedwabiu. Pasy są długie, szew nie zostawia śladów na czole po nocy. Polecam.'}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add-to-Cart Bottom Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0C] text-white p-3 border-t border-[#1E1E22] md:hidden shadow-2xl">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-10 h-10 overflow-hidden shrink-0 border border-[#1E1E22] bg-[#141416]">
                <Image
                  src={mainImage}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-[13px] font-medium text-white truncate">{displayName}</h4>
                <div className="text-[13px] font-semibold text-white tabular-nums">
                  {formatPrice(product.price, product.priceEur)}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`py-2.5 px-4 font-medium text-[13px] shrink-0 transition-colors border cursor-pointer ${
                addedMessage
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-[#ECEAE7] border-[#ECEAE7] text-[#0B0B0C]'
              }`}
            >
              {addedMessage ? t.addedToCart : t.addToCart}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
