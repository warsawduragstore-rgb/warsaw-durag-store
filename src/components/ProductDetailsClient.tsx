'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShoppingBag,
  Truck,
  CreditCard,
  Star,
  Check,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'shipping' | 'payments' | 'reviews' | null>('shipping');
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainBuyBoxRef = useRef<HTMLDivElement>(null);
  const displayName = language !== 'PL' && product.nameEn ? product.nameEn : product.name;
  const mainImage = selectedImage || product.images[0] || '/assets/durag_silk_black.png';

  // Monitor main buy box visibility to trigger mobile sticky bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When main buy button is NOT intersecting (scrolled past), show sticky bar
        setShowStickyBar(!entry.isIntersecting);
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0 }
    );

    const currentElem = mainBuyBoxRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, []);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-[#F7F5F2] border border-[#E5E2DC] rounded-2xl overflow-hidden shadow-md">
            <Image
              src={mainImage}
              alt={displayName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-3 left-3 bg-[#0D0D0B]/85 text-[#D9A87E] text-[10px] uppercase tracking-widest font-semibold px-3 py-1 backdrop-blur-md rounded-full border border-white/10">
              {product.categoryLabel}
            </div>

            {product.category === 'silk' && (
              <div className="absolute top-3 right-3 bg-[#D9A87E] text-[#0D0D0B] text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>100% Jedwab 19 Momme</span>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 bg-[#F7F5F2] border rounded-xl overflow-hidden transition-all cursor-pointer ${
                    (selectedImage === img || (!selectedImage && idx === 0))
                      ? 'border-[#0D0D0B] ring-2 ring-[#0D0D0B]/20 scale-102'
                      : 'border-[#E5E2DC] opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Pokaż zdjęcie ${idx + 1}`}
                >
                  <Image src={img} alt={`${displayName} - ${idx + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Buy Action */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#734C1D]">
                {product.material}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                W magazynie (wysyłka w 24h)
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0D0D0B] font-medium leading-tight">
              {displayName}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-[#D9A87E]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-600 font-medium">
                5.0 ({Math.max(product.reviews?.length || 1, 1)} {t.reviewsTab.toLowerCase()})
              </span>
            </div>
          </div>

          {/* 2 + 1 GRATIS Promo Box */}
          <div className="bg-[#0D0D0B] text-white p-3.5 sm:p-4 rounded-xl flex items-center justify-between shadow-sm border border-[#D9A87E]/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D9A87E]/20 text-[#D9A87E] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D9A87E]">2 + 1 GRATIS</h4>
                <p className="text-[11px] text-gray-300 font-light">Dodaj 3 duragi do koszyka — trzeci otrzymasz gratis!</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0B] bg-[#D9A87E] px-2.5 py-1 rounded-full shrink-0">
              PROMO
            </span>
          </div>

          {/* Price & Free Delivery */}
          <div className="pb-4 border-b border-[#E5E2DC]">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0D0D0B] tracking-tight">
                {product.price.toFixed(2)} PLN
              </span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Darmowy Paczkomat InPost
              </span>
            </div>
            <span className="text-xs text-gray-500 block mt-1">
              Cena zawiera podatek VAT • Szybka realizacja zamówienia
            </span>
          </div>

          {/* Key Product Highlights Bullets */}
          <div className="grid grid-cols-2 gap-2 text-xs text-[#3B3C40] bg-[#F7F5F2] p-3.5 rounded-xl border border-[#E5E2DC]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-[#D9A87E] font-bold">✓</span>
              <span>Pasy: 100 cm (double wrap)</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-[#D9A87E] font-bold">✓</span>
              <span>Szew zewnętrzny bezodciskowy</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-[#D9A87E] font-bold">✓</span>
              <span>Szerokość pasów: 8 cm</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-[#D9A87E] font-bold">✓</span>
              <span>Polska produkcja (Warszawa)</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed whitespace-pre-line">
            {product.description}
          </div>

          {/* Main Quantity & Add to Cart Container (Monitored by IntersectionObserver) */}
          <div ref={mainBuyBoxRef} className="pt-2 space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center border border-[#CFCFCF] rounded-full overflow-hidden bg-white shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-sm text-[#3B3C40] hover:bg-gray-100 font-bold active:bg-gray-200"
                  aria-label="Zmniejsz ilość"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-sm text-[#3B3C40] hover:bg-gray-100 font-bold active:bg-gray-200"
                  aria-label="Zwiększ ilość"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-grow py-3.5 sm:py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded-full flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer ${
                  addedMessage
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0D0D0B] hover:bg-[#734C1D] text-white'
                }`}
              >
                {addedMessage ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Dodano do koszyka!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Dodaj do koszyka • {(product.price * quantity).toFixed(2)} PLN</span>
                  </>
                )}
              </button>
            </div>

            {addedMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 animate-fade-in font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Produkt został pomyślnie dodany do koszyka. Możesz przejść do kasy.</span>
              </div>
            )}
          </div>

          {/* Quick Accordion Tabs: Shipping, Payments, Reviews, Care */}
          <div className="border-t border-[#E5E2DC] pt-4 space-y-2">
            {/* Delivery Accordion */}
            <div className="border border-[#E5E2DC] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setActiveTab(activeTab === 'shipping' ? null : 'shipping')}
                className="w-full px-4 py-3 text-left font-bold text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#F7F5F2] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-[#0D0D0B]">
                  <Truck className="w-4 h-4 text-[#734C1D]" />
                  <span>Darmowa Dostawa & Wysyłka 24h</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeTab === 'shipping' ? 'rotate-180 text-[#0D0D0B]' : ''
                  }`}
                />
              </button>
              {activeTab === 'shipping' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#3B3C40] space-y-2 border-t border-[#E5E2DC]/60 animate-fade-in font-light">
                  <p>• <strong>Paczkomat InPost:</strong> 0 zł (darmowa dostawa dla wszystkich zamówień)</p>
                  <p>• <strong>Kurier InPost / DPD:</strong> 12,99 zł (wysyłka w 24 godziny)</p>
                  <p>• <strong>Odbiór osobisty w Warszawie:</strong> ul. Włodarzewska 4 (Ochota) lub w Centrum po wcześniejszym kontakcie</p>
                  <p>• <strong>Czas dostawy:</strong> 1-2 dni robocze od nadania</p>
                </div>
              )}
            </div>

            {/* Payments Accordion */}
            <div className="border border-[#E5E2DC] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setActiveTab(activeTab === 'payments' ? null : 'payments')}
                className="w-full px-4 py-3 text-left font-bold text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#F7F5F2] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-[#0D0D0B]">
                  <CreditCard className="w-4 h-4 text-[#734C1D]" />
                  <span>Bezpieczne Płatności & 14 Dni na Zwrot</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeTab === 'payments' ? 'rotate-180 text-[#0D0D0B]' : ''
                  }`}
                />
              </button>
              {activeTab === 'payments' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#3B3C40] space-y-2 border-t border-[#E5E2DC]/60 animate-fade-in font-light">
                  <p>• <strong>Obsługiwane metody:</strong> BLIK, Apple Pay, Google Pay, Szybki Przelew online, Karty płatnicze (Visa/Mastercard)</p>
                  <p>• <strong>Szyfrowanie:</strong> 256-bitowy certyfikat SSL gwarantuje bezpieczeństwo transakcji</p>
                  <p>• <strong>Prawo do zwrotu:</strong> Masz pełne 14 dni na bezproblemowy zwrot lub wymianę towaru bez podawania przyczyny</p>
                </div>
              )}
            </div>

            {/* Reviews Accordion */}
            <div className="border border-[#E5E2DC] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setActiveTab(activeTab === 'reviews' ? null : 'reviews')}
                className="w-full px-4 py-3 text-left font-bold text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#F7F5F2] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-[#0D0D0B]">
                  <Star className="w-4 h-4 text-[#D9A87E] fill-current" />
                  <span>Opinie Klientów ({product.reviews?.length || 1})</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeTab === 'reviews' ? 'rotate-180 text-[#0D0D0B]' : ''
                  }`}
                />
              </button>
              {activeTab === 'reviews' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#3B3C40] space-y-3 border-t border-[#E5E2DC]/60 animate-fade-in font-light">
                  {(product.reviews && product.reviews.length > 0) ? (
                    product.reviews.map((rev, idx) => (
                      <div key={idx} className="border-b border-[#E5E2DC]/40 pb-2.5 last:border-b-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#0D0D0B]">{rev.author}</span>
                          <div className="flex text-[#D9A87E]">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 italic">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    ))
                  ) : (
                    <div className="border-b border-[#E5E2DC]/40 pb-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#0D0D0B]">Tomasz K., Warszawa</span>
                        <div className="flex text-[#D9A87E]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 italic">&ldquo;Najwyższa jakość jedwabiu w Polsce. Pasy są długie, szew nie zostawia śladów na czole po nocy. Polecam!&rdquo;</p>
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0B]/95 backdrop-blur-md text-white p-3 border-t border-white/15 md:hidden shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-[#111111]">
                <Image
                  src={mainImage}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{displayName}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-[#D9A87E]">{product.price.toFixed(2)} PLN</span>
                  <span className="text-[9px] text-emerald-400 font-medium">• Paczkomat 0 zł</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`py-2.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 active:scale-95 transition-all shadow-md ${
                addedMessage
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#D9A87E] text-[#0D0D0B] hover:bg-white'
              }`}
            >
              {addedMessage ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Dodano</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Kup teraz</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
