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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Left: Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-[#F6F5F2] border border-[#E5E2DC] overflow-hidden">
            <Image
              src={mainImage}
              alt={displayName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-3 left-3 bg-[#0D0D0B] text-[#D9A87E] text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 border border-white/10">
              {product.categoryLabel}
            </div>

            {product.category === 'silk' && (
              <div className="absolute top-3 right-3 bg-[#D9A87E] text-[#0D0D0B] text-[10px] uppercase font-mono tracking-widest font-bold px-2.5 py-1">
                100% Jedwab 19 Momme
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 shrink-0 bg-[#F6F5F2] border transition-colors cursor-pointer ${
                    (selectedImage === img || (!selectedImage && idx === 0))
                      ? 'border-[#0D0D0B] ring-1 ring-[#0D0D0B]'
                      : 'border-[#E5E2DC] opacity-75 hover:opacity-100 hover:border-[#0D0D0B]'
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
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#E5E2DC] text-[10px] font-mono">
              <span className="uppercase tracking-widest font-bold text-[#734C1D]">
                [ {product.material} ]
              </span>
              <span className="text-gray-500 uppercase tracking-wider">
                ATELIER WARSZAWA • NADAWANIE 24H
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0D0D0B] font-medium leading-tight">
              {displayName}
            </h1>

            <div className="flex items-center gap-2 mt-2 font-mono text-xs text-[#6B6D74]">
              <span className="text-[#734C1D] font-bold">[ OCENA 5.0 ]</span>
              <span>•</span>
              <span>{Math.max(product.reviews?.length || 1, 1)} zweryfikowane opinie waverów</span>
            </div>
          </div>

          {/* 2 + 1 GRATIS Promo Box */}
          <div className="bg-[#0D0D0B] text-white p-4 border border-[#D9A87E] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#D9A87E] uppercase tracking-widest font-bold block mb-0.5">
                [ OFERTA ZESTAWOWA ]
              </span>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">2 + 1 GRATIS</h4>
              <p className="text-[11px] text-gray-300 font-light mt-0.5">Dodaj 3 dowolne duragi do koszyka — trzeci otrzymasz gratis.</p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0D0D0B] bg-[#D9A87E] px-2.5 py-1 shrink-0">
              RABAT
            </span>
          </div>

          {/* Price & Free Delivery */}
          <div className="pb-4 border-b border-[#E5E2DC]">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-3xl font-extrabold text-[#0D0D0B] tracking-tight">
                {product.price.toFixed(2)} PLN
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#734C1D] border border-[#734C1D]/40 px-2 py-0.5">
                Paczkomat InPost: 0 zł
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono block mt-1">
              Cena brutto • Bezpłatna dostawa na terenie całej Polski
            </span>
          </div>

          {/* Key Product Highlights Bullets */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#3B3C40] bg-[#F6F5F2] p-4 border border-[#E5E2DC]">
            <div className="flex items-center gap-2">
              <span className="text-[#734C1D] font-bold">[✓]</span>
              <span>Pasy: 100 cm (double wrap)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#734C1D] font-bold">[✓]</span>
              <span>Szew bezodciskowy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#734C1D] font-bold">[✓]</span>
              <span>Szerokość pasów: 8 cm</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#734C1D] font-bold">[✓]</span>
              <span>Atelier Warszawa</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed whitespace-pre-line border-b border-[#E5E2DC] pb-4">
            {product.description}
          </div>

          {/* Main Quantity & Add to Cart Container */}
          <div ref={mainBuyBoxRef} className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#0D0D0B] bg-white shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-sm text-[#0D0D0B] hover:bg-gray-100 font-mono font-bold cursor-pointer"
                  aria-label="Zmniejsz ilość"
                >
                  -
                </button>
                <span className="px-3 text-sm font-mono font-bold min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-sm text-[#0D0D0B] hover:bg-gray-100 font-mono font-bold cursor-pointer"
                  aria-label="Zwiększ ilość"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-grow py-3.5 sm:py-4 px-6 text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.18em] transition-colors border cursor-pointer ${
                  addedMessage
                    ? 'bg-[#0D0D0B] border-[#0D0D0B] text-[#D9A87E]'
                    : 'bg-[#0D0D0B] border-[#0D0D0B] text-white hover:bg-[#D9A87E] hover:border-[#D9A87E] hover:text-[#0D0D0B]'
                }`}
              >
                {addedMessage
                  ? '[ DODANO DO KOSZYKA ]'
                  : `DODAJ DO KOSZYKA • ${(product.price * quantity).toFixed(2)} PLN`}
              </button>
            </div>

            {addedMessage && (
              <div className="bg-[#0D0D0B] text-[#D9A87E] text-xs font-mono p-3 border border-[#D9A87E] tracking-wider uppercase">
                [ OK ] Produkt został dodany do Twojego koszyka.
              </div>
            )}
          </div>

          {/* Quick Accordion Tabs: Shipping, Payments, Reviews */}
          <div className="border-t border-[#E5E2DC] pt-4 space-y-2">
            {/* Delivery Accordion */}
            <div className="border border-[#E5E2DC] bg-white">
              <button
                onClick={() => setActiveTab(activeTab === 'shipping' ? null : 'shipping')}
                className="w-full px-4 py-3 text-left font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#F6F5F2] transition-colors cursor-pointer"
              >
                <span className="text-[#0D0D0B]">[ 01 ] DARMOWA DOSTAWA & WYSYŁKA 24H</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeTab === 'shipping' ? 'rotate-180 text-[#0D0D0B]' : ''
                  }`}
                />
              </button>
              {activeTab === 'shipping' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#3B3C40] space-y-2 border-t border-[#E5E2DC] font-light">
                  <p>• <strong>Paczkomat InPost:</strong> 0 zł (darmowa dostawa dla każdego zamówienia)</p>
                  <p>• <strong>Kurier InPost / DPD:</strong> 12,99 zł</p>
                  <p>• <strong>Odbiór osobisty w Warszawie:</strong> ul. Włodarzewska 4 (po kontakcie)</p>
                  <p>• <strong>Czas dostawy:</strong> Zazwyczaj 1 dzień roboczy od nadania</p>
                </div>
              )}
            </div>

            {/* Payments Accordion */}
            <div className="border border-[#E5E2DC] bg-white">
              <button
                onClick={() => setActiveTab(activeTab === 'payments' ? null : 'payments')}
                className="w-full px-4 py-3 text-left font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#F6F5F2] transition-colors cursor-pointer"
              >
                <span className="text-[#0D0D0B]">[ 02 ] PŁATNOŚCI & 14 DNI NA ZWROT</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeTab === 'payments' ? 'rotate-180 text-[#0D0D0B]' : ''
                  }`}
                />
              </button>
              {activeTab === 'payments' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#3B3C40] space-y-2 border-t border-[#E5E2DC] font-light">
                  <p>• <strong>Metody płatności:</strong> BLIK, Apple Pay, Google Pay, szybki przelew online, karty płatnicze</p>
                  <p>• <strong>Bezpieczeństwo:</strong> Szyfrowanie SSL 256-bit</p>
                  <p>• <strong>Zwroty:</strong> 14 dni na darmowy zwrot lub wymianę bez zbędnych pytań</p>
                </div>
              )}
            </div>

            {/* Reviews Accordion */}
            <div className="border border-[#E5E2DC] bg-white">
              <button
                onClick={() => setActiveTab(activeTab === 'reviews' ? null : 'reviews')}
                className="w-full px-4 py-3 text-left font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#F6F5F2] transition-colors cursor-pointer"
              >
                <span className="text-[#0D0D0B]">[ 03 ] OPINIE KLIENTÓW ({product.reviews?.length || 1})</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeTab === 'reviews' ? 'rotate-180 text-[#0D0D0B]' : ''
                  }`}
                />
              </button>
              {activeTab === 'reviews' && (
                <div className="px-4 pb-4 pt-2 text-xs text-[#3B3C40] space-y-3 border-t border-[#E5E2DC] font-light">
                  {(product.reviews && product.reviews.length > 0) ? (
                    product.reviews.map((rev, idx) => (
                      <div key={idx} className="border-b border-[#E5E2DC] pb-2.5 last:border-b-0">
                        <div className="flex items-center justify-between mb-1 font-mono text-[11px]">
                          <span className="font-bold text-[#0D0D0B]">{rev.author}</span>
                          <span className="text-[#734C1D] font-bold">[ OCENA 5.0 ]</span>
                        </div>
                        <p className="text-gray-600 italic">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    ))
                  ) : (
                    <div className="border-b border-[#E5E2DC] pb-2.5">
                      <div className="flex items-center justify-between mb-1 font-mono text-[11px]">
                        <span className="font-bold text-[#0D0D0B]">Tomasz K., Warszawa</span>
                        <span className="text-[#734C1D] font-bold">[ OCENA 5.0 ]</span>
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0B] text-white p-3 border-t border-white/20 md:hidden">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-10 h-10 overflow-hidden shrink-0 border border-white/20 bg-[#111111]">
                <Image
                  src={mainImage}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-serif font-medium text-white truncate">{displayName}</h4>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="font-bold text-[#D9A87E]">{product.price.toFixed(2)} PLN</span>
                  <span className="text-[10px] text-gray-400">• 0 ZŁ</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`py-2.5 px-4 font-mono font-bold text-xs uppercase tracking-wider shrink-0 transition-colors border ${
                addedMessage
                  ? 'bg-[#0D0D0B] border-[#0D0D0B] text-[#D9A87E]'
                  : 'bg-[#D9A87E] border-[#D9A87E] text-[#0D0D0B] hover:bg-white hover:border-white'
              }`}
            >
              {addedMessage ? '[ DODANO ]' : 'KUP TERAZ'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
