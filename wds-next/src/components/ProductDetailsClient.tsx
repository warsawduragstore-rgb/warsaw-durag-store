'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  ShieldCheck,
} from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { language, formatPrice, t } = useLanguage();
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
          <div className="relative aspect-[3/4] bg-[#0E0E10] border border-[#26262A] overflow-hidden">
            <Image
              src={mainImage}
              alt={displayName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-3 left-3 bg-[#0B0B0C]/90 text-[#C8794B] text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 border border-[#C8794B]/30">
              {product.categoryLabel}
            </div>

            {product.category === 'silk' && (
              <div className="absolute top-3 right-3 bg-[#C8794B] text-[#0B0B0C] text-[10px] uppercase font-mono tracking-widest font-bold px-2.5 py-1">
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
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 shrink-0 bg-[#0E0E10] border transition-colors cursor-pointer ${
                    (selectedImage === img || (!selectedImage && idx === 0))
                      ? 'border-[#C8794B] ring-1 ring-[#C8794B]'
                      : 'border-[#26262A] opacity-75 hover:opacity-100 hover:border-[#C8794B]'
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
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#26262A] text-[10px] font-mono">
              <span className="uppercase tracking-widest font-bold text-[#C8794B]">
                [ {product.material} ]
              </span>
              <span className="text-[#787570] uppercase tracking-wider">
                ATELIER WARSZAWA • NADAWANIE 24H
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FAFAF9] font-normal leading-tight">
              {displayName}
            </h1>

            <div className="flex items-center gap-2 mt-2 font-mono text-xs text-[#A3A09B]">
              <span className="text-[#C8794B] font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C8794B]" /> 5.0 / 5.0
              </span>
              <span>•</span>
              <span>{Math.max(product.reviews?.length || 1, 1)} zweryfikowane opinie</span>
            </div>
          </div>

          {/* 2 + 1 GRATIS Promo Box */}
          <div className="bg-[#141416] text-white p-4 border border-[#C8794B]/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#C8794B] uppercase tracking-widest font-bold block mb-0.5">
                [ OFERTA ZESTAWOWA ]
              </span>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FAFAF9]">
                2 + 1 GRATIS (TRZECI MODEL ZA 1 ZŁ)
              </h4>
              <p className="text-[11px] text-[#A3A09B] font-light mt-0.5">
                Dodaj 3 dowolne duragi do koszyka — rabat naliczy się automatycznie.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0B0B0C] bg-[#C8794B] px-2.5 py-1 shrink-0">
              PROMO
            </span>
          </div>

          {/* Price & Free Delivery */}
          <div className="pb-4 border-b border-[#26262A]">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-3xl font-bold text-[#FAFAF9] tracking-tight">
                {formatPrice(product.price, product.priceEur)}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 border border-emerald-500/30 px-2 py-0.5 bg-emerald-500/10">
                Paczkomat InPost: 0 zł
              </span>
            </div>
            <span className="text-xs text-[#787570] font-mono block mt-1">
              Cena brutto • Bezpłatna dostawa na terenie całej Polski
            </span>
          </div>

          {/* Key Product Highlights Bullets */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#ECEAE7] bg-[#141416] p-4 border border-[#26262A]">
            <div className="flex items-center gap-2">
              <span className="text-[#C8794B] font-bold">◆</span>
              <span>Pasy: 100 cm (double wrap)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C8794B] font-bold">◆</span>
              <span>Szew bezodciskowy na zewnątrz</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C8794B] font-bold">◆</span>
              <span>Szerokość pasów: 8 cm</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C8794B] font-bold">◆</span>
              <span>Atelier Warszawa • 24h</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed whitespace-pre-line border-b border-[#26262A] pb-4">
            {product.description}
          </div>

          {/* Main Quantity & Add to Cart Container */}
          <div ref={mainBuyBoxRef} className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#26262A] bg-[#141416] shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-sm text-[#FAFAF9] hover:bg-[#26262A] font-mono font-bold cursor-pointer transition-colors"
                  aria-label="Zmniejsz ilość"
                >
                  -
                </button>
                <span className="px-3 text-sm font-mono font-bold text-white min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-sm text-[#FAFAF9] hover:bg-[#26262A] font-mono font-bold cursor-pointer transition-colors"
                  aria-label="Zwiększ ilość"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-grow py-3.5 sm:py-4 px-6 text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.18em] transition-colors border cursor-pointer ${
                  addedMessage
                    ? 'bg-[#C8794B] border-[#C8794B] text-[#0B0B0C]'
                    : 'bg-[#C8794B] border-[#C8794B] text-[#0B0B0C] hover:bg-[#FAFAF9] hover:border-[#FAFAF9]'
                }`}
              >
                {addedMessage
                  ? '[ DODANO DO KOSZYKA ]'
                  : `DODAJ DO KOSZYKA • ${formatPrice(product.price * quantity, product.priceEur ? product.priceEur * quantity : undefined)}`}
              </button>
            </div>

            {addedMessage && (
              <div className="bg-[#141416] text-[#C8794B] text-xs font-mono p-3 border border-[#C8794B] tracking-wider uppercase flex items-center justify-between gap-2 flex-wrap">
                <span>[ OK ] Produkt został dodany do Twojego koszyka.</span>
                <Link
                  href="/koszyk"
                  className="inline-flex items-center gap-1 font-bold text-white hover:text-[#C8794B] underline"
                >
                  Przejdź do koszyka →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Accordion Tabs: Shipping, Payments, Reviews */}
          <div className="border-t border-[#26262A] pt-4 space-y-2">
            {/* Delivery Accordion */}
            <div className="border border-[#26262A] bg-[#141416]">
              <button
                onClick={() => setActiveTab(activeTab === 'shipping' ? null : 'shipping')}
                className="w-full px-4 py-3 text-left font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#1A1A1B] transition-colors cursor-pointer text-[#FAFAF9]"
              >
                <span>[ 01 ] DARMOWA DOSTAWA & WYSYŁKA 24H</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeTab === 'shipping' ? 'rotate-180 text-[#C8794B]' : ''
                  }`}
                />
              </button>
              {activeTab === 'shipping' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#A3A09B] space-y-2 border-t border-[#26262A] font-light">
                  <p>• <strong>Paczkomat InPost:</strong> 0 zł (darmowa dostawa dla każdego zamówienia)</p>
                  <p>• <strong>Kurier InPost / DPD:</strong> 0 zł (lub 12,99 zł poniżej progu)</p>
                  <p>• <strong>Odbiór osobisty w Warszawie:</strong> ul. Włodarzewska 4 / Centrum (po kontakcie)</p>
                  <p>• <strong>Czas dostawy:</strong> Zazwyczaj 1 dzień roboczy od nadania</p>
                </div>
              )}
            </div>

            {/* Payments Accordion */}
            <div className="border border-[#26262A] bg-[#141416]">
              <button
                onClick={() => setActiveTab(activeTab === 'payments' ? null : 'payments')}
                className="w-full px-4 py-3 text-left font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#1A1A1B] transition-colors cursor-pointer text-[#FAFAF9]"
              >
                <span>[ 02 ] PŁATNOŚCI & 14 DNI NA ZWROT</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeTab === 'payments' ? 'rotate-180 text-[#C8794B]' : ''
                  }`}
                />
              </button>
              {activeTab === 'payments' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#A3A09B] space-y-2 border-t border-[#26262A] font-light">
                  <p>• <strong>Metody płatności:</strong> BLIK, Apple Pay, Google Pay, karty, Przelewy24</p>
                  <p>• <strong>Bezpieczeństwo:</strong> Szyfrowanie SSL 256-bit przez bramkę Stripe</p>
                  <p>• <strong>Zwroty:</strong> 14 dni na darmowy zwrot lub wymianę bez zbędnych pytań</p>
                </div>
              )}
            </div>

            {/* Reviews Accordion */}
            <div className="border border-[#26262A] bg-[#141416]">
              <button
                onClick={() => setActiveTab(activeTab === 'reviews' ? null : 'reviews')}
                className="w-full px-4 py-3 text-left font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#1A1A1B] transition-colors cursor-pointer text-[#FAFAF9]"
              >
                <span>[ 03 ] OPINIE KLIENTÓW ({product.reviews?.length || 1})</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeTab === 'reviews' ? 'rotate-180 text-[#C8794B]' : ''
                  }`}
                />
              </button>
              {activeTab === 'reviews' && (
                <div className="px-4 pb-4 pt-2 text-xs text-[#A3A09B] space-y-3 border-t border-[#26262A] font-light">
                  {(product.reviews && product.reviews.length > 0) ? (
                    product.reviews.map((rev, idx) => (
                      <div key={idx} className="border-b border-[#26262A] pb-2.5 last:border-b-0">
                        <div className="flex items-center justify-between mb-1 font-mono text-[11px]">
                          <span className="font-bold text-white">{rev.author}</span>
                          <span className="text-[#C8794B] font-bold">[ OCENA 5.0 ]</span>
                        </div>
                        <p className="text-[#ECEAE7] italic">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    ))
                  ) : (
                    <div className="border-b border-[#26262A] pb-2.5">
                      <div className="flex items-center justify-between mb-1 font-mono text-[11px]">
                        <span className="font-bold text-white">Tomasz K., Warszawa</span>
                        <span className="text-[#C8794B] font-bold">[ OCENA 5.0 ]</span>
                      </div>
                      <p className="text-[#ECEAE7] italic">&ldquo;Najwyższa jakość jedwabiu w Polsce. Pasy są długie, szew nie zostawia śladów na czole po nocy. Polecam!&rdquo;</p>
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0C] text-white p-3 border-t border-[#26262A] md:hidden shadow-2xl">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-10 h-10 overflow-hidden shrink-0 border border-[#26262A] bg-[#141416]">
                <Image
                  src={mainImage}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-serif font-normal text-white truncate">{displayName}</h4>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="font-bold text-[#C8794B]">{formatPrice(product.price, product.priceEur)}</span>
                  <span className="text-[10px] text-[#787570]">• 0 ZŁ</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`py-2.5 px-4 font-mono font-bold text-xs uppercase tracking-wider shrink-0 transition-colors border cursor-pointer ${
                addedMessage
                  ? 'bg-[#0B0B0C] border-[#0B0B0C] text-[#C8794B]'
                  : 'bg-[#C8794B] border-[#C8794B] text-[#0B0B0C] hover:bg-[#FAFAF9]'
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
