'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Star, ChevronDown, Check } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { language, formatPrice } = useLanguage();

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0] || '/assets/durag_silk_black.png');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'shipping' | 'payments' | 'reviews' | null>(null);
  const [addedMessage, setAddedMessage] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainBuyBoxRef = useRef<HTMLDivElement>(null);

  const displayName = language !== 'PL' && product.nameEn ? product.nameEn : product.name;
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
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
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

          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 shrink-0 bg-[#0E0E10] border transition-colors cursor-pointer ${
                    (selectedImage === img || (!selectedImage && idx === 0))
                      ? 'border-[#ECEAE7]'
                      : 'border-[#1E1E22] opacity-75 hover:opacity-100 hover:border-[#787570]'
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
            <span className="text-[13px] text-[#A3A09B] block mb-1">
              {product.material}
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-medium leading-tight">
              {displayName}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-[13px] text-[#A3A09B]">
              <span className="text-[#C8794B] font-medium flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C8794B]" /> 5.0
              </span>
              <span>•</span>
              <span>{Math.max(product.reviews?.length || 1, 1)} opinie klientów</span>
            </div>
          </div>

          {/* Promo: Kup 2, trzeci durag za 1 zł */}
          <div className="bg-[#141416] p-4 border border-[#1E1E22]">
            <h4 className="text-[14px] font-medium text-white mb-0.5">
              Promocja: kup 2, trzeci losowy durag za 1 zł
            </h4>
            <p className="text-[13px] text-[#A3A09B] leading-relaxed">
              Wybierz dwa dowolne duragi do koszyka, a trzeci losowy model otrzymasz za 1 zł. Rabat nalicza się automatycznie.
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
              Darmowa dostawa w Polsce · Wysyłka z Warszawy w 1–2 dni robocze
            </p>
          </div>

          {/* Key Product Facts */}
          <div className="grid grid-cols-2 gap-2 text-[13px] text-[#ECEAE7] bg-[#141416] p-4 border border-[#1E1E22]">
            <div>• Pasy: 100 cm</div>
            <div>• Bezodciskowy szew na zewnątrz</div>
            <div>• Szyte ręcznie w Warszawie</div>
            <div>• 14 dni na zwrot</div>
          </div>

          {/* Description */}
          <div className="text-[14px] text-[#A3A09B] leading-relaxed whitespace-pre-line border-b border-[#1E1E22] pb-4">
            {product.description}
          </div>

          {/* Main Quantity & Add to Cart */}
          <div ref={mainBuyBoxRef} className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#1E1E22] bg-[#141416] shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-sm text-white hover:bg-[#1E1E22] cursor-pointer transition-colors"
                  aria-label="Zmniejsz ilość"
                >
                  -
                </button>
                <span className="px-3 text-sm font-medium text-white min-w-[2rem] text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-sm text-white hover:bg-[#1E1E22] cursor-pointer transition-colors"
                  aria-label="Zwiększ ilość"
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
                  ? 'Dodano do koszyka'
                  : `Dodaj do koszyka · ${formatPrice(product.price * quantity, product.priceEur ? product.priceEur * quantity : undefined)}`}
              </button>
            </div>

            {addedMessage && (
              <div className="bg-[#141416] text-[#ECEAE7] text-[13px] p-3 border border-[#1E1E22] flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Produkt został dodany do koszyka.
                </span>
                <Link
                  href="/koszyk"
                  className="font-medium text-white underline hover:text-[#C8794B]"
                >
                  Przejdź do koszyka
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
                <span>Dostawa i odbiór osobisty</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#787570] transition-transform duration-200 ${
                    activeTab === 'shipping' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>
              {activeTab === 'shipping' && (
                <div className="px-4 pb-4 pt-1 text-[13px] text-[#A3A09B] space-y-2 border-t border-[#1E1E22]">
                  <p>• <strong>Wysyłka z Warszawy:</strong> w 1–2 dni robocze</p>
                  <p>• <strong>Darmowa dostawa w Polsce:</strong> Paczkomaty InPost i kurier dla każdego zamówienia</p>
                  <p>• <strong>Odbiór osobisty w Warszawie:</strong> ul. Włodarzewska 4 po umówieniu</p>
                </div>
              )}
            </div>

            {/* Payments Accordion */}
            <div className="border border-[#1E1E22] bg-[#141416]">
              <button
                onClick={() => setActiveTab(activeTab === 'payments' ? null : 'payments')}
                className="w-full px-4 py-3 text-left font-medium text-[14px] flex items-center justify-between hover:bg-[#1A1A1B] transition-colors cursor-pointer text-white"
              >
                <span>Płatności i 14 dni na zwrot</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#787570] transition-transform duration-200 ${
                    activeTab === 'payments' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>
              {activeTab === 'payments' && (
                <div className="px-4 pb-4 pt-1 text-[13px] text-[#A3A09B] space-y-2 border-t border-[#1E1E22]">
                  <p>• <strong>Metody płatności:</strong> BLIK, karty płatnicze (Visa, Mastercard, Apple Pay, Google Pay)</p>
                  <p>• <strong>Zwroty:</strong> 14 dni na zwrot bez podawania przyczyny</p>
                </div>
              )}
            </div>

            {/* Reviews Accordion */}
            <div className="border border-[#1E1E22] bg-[#141416]">
              <button
                onClick={() => setActiveTab(activeTab === 'reviews' ? null : 'reviews')}
                className="w-full px-4 py-3 text-left font-medium text-[14px] flex items-center justify-between hover:bg-[#1A1A1B] transition-colors cursor-pointer text-white"
              >
                <span>Opinie klientów ({product.reviews?.length || 1})</span>
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
                        <span className="font-medium text-white">Tomasz K., Warszawa</span>
                        <span className="text-[#C8794B] font-medium">★ 5.0</span>
                      </div>
                      <p className="text-[#ECEAE7]">&ldquo;Wysoka jakość jedwabiu. Pasy są długie, szew nie zostawia śladów na czole po nocy. Polecam.&rdquo;</p>
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
              {addedMessage ? 'Dodano' : 'Dodaj do koszyka'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
