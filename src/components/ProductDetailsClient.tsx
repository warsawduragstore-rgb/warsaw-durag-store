'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingBag, Truck, ShieldCheck, RefreshCw, Star, Check, Sparkles, MapPin } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  const displayName = language !== 'PL' && product.nameEn ? product.nameEn : product.name;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      {/* Left: Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-[3/4] bg-[#F7F5F2] border border-[#CFCFCF]/50 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={selectedImage || product.images[0] || '/assets/durag_silk_black.png'}
            alt={displayName}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute top-4 left-4 bg-[#0D0D0B]/80 text-[#D9A87E] text-xs uppercase tracking-widest font-semibold px-3 py-1.5 backdrop-blur-md rounded-full">
            {product.categoryLabel}
          </div>
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2 sm:gap-3 pt-2 overflow-x-auto no-scrollbar scroll-smooth pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 bg-[#F7F5F2] border rounded-lg overflow-hidden transition-all cursor-pointer ${
                  selectedImage === img
                    ? 'border-[#734C1D] ring-2 ring-[#734C1D]/30 shadow-md scale-105'
                    : 'border-[#CFCFCF] opacity-70 hover:opacity-100'
                }`}
                aria-label={`Pokaż zdjęcie ${idx + 1}`}
              >
                <Image src={img} alt={`${displayName} - ${idx + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Info */}
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#734C1D] block mb-2">
            {product.material}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0D0D0B] font-medium">
            {displayName}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex text-[#D9A87E]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs text-[#3B3C40] font-light">
              ({product.reviews.length} {t.reviewsTab.toLowerCase()})
            </span>
          </div>
        </div>

        {/* 2 + 1 GRATIS Promo Box */}
        <div className="bg-[#0D0D0B] text-white p-4 rounded-xl flex items-center justify-between shadow-md border border-[#D9A87E]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D9A87E]/20 text-[#D9A87E] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D9A87E]">2 + 1 GRATIS / FREE</h4>
              <p className="text-[12px] text-gray-300 font-light mt-0.5">Kup 2 duragi, 3 trzymasz gratis w koszyku!</p>
            </div>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D9A87E] bg-white/10 px-3 py-1 rounded-full">
            EU PROMO
          </span>
        </div>

        {/* Price */}
        <div className="text-3xl font-bold text-[#0D0D0B] pb-4 border-b border-[#CFCFCF]/40 flex items-center justify-between">
          <div>
            <span>{product.price.toFixed(2)} PLN</span>
            <span className="text-xs text-[#2E7D32] font-normal block mt-1">{t.trustShippingDesc}</span>
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-[#3B3C40] font-light leading-relaxed whitespace-pre-line">
          {product.description}
        </div>

        {/* Quantity & Add to Cart */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#CFCFCF] rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2.5 text-sm text-[#3B3C40] hover:bg-gray-100 font-bold"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2.5 text-sm text-[#3B3C40] hover:bg-gray-100 font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-grow bg-[#0D0D0B] hover:bg-[#734C1D] text-white py-4 px-8 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedMessage ? t.addedToCart : t.addToCart}</span>
            </button>
          </div>

          {addedMessage && (
            <div className="bg-[#2E7D32]/10 border border-[#2E7D32]/30 text-[#2E7D32] text-xs p-3.5 rounded-lg flex items-center gap-2 animate-fade-in font-medium">
              <Check className="w-4 h-4" />
              <span>Dodano produkt do koszyka! Otwórz koszyk, aby dokończyć zamówienie.</span>
            </div>
          )}
        </div>

        {/* Specs Table */}
        <div className="border-t border-[#CFCFCF]/40 pt-6 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0D0D0B]">
            Specyfikacja Rzemieślnicza
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs text-[#3B3C40]">
            <div>
              <span className="block font-semibold text-[#0D0D0B]">Długość pasów:</span>
              <span>100 cm (podwójne owinięcie)</span>
            </div>
            <div>
              <span className="block font-semibold text-[#0D0D0B]">Szerokość pasów:</span>
              <span>8 cm (rozłożony nacisk na czole)</span>
            </div>
            <div>
              <span className="block font-semibold text-[#0D0D0B]">Szew:</span>
              <span>Zewnętrzny bezodciskowy</span>
            </div>
            <div>
              <span className="block font-semibold text-[#0D0D0B]">Pochodzenie:</span>
              <span>Wyprodukowano w Polsce (Warszawa)</span>
            </div>
          </div>
        </div>

        {/* Trust Points */}
        <div className="bg-[#F7F5F2] p-5 border border-[#CFCFCF]/50 rounded-xl space-y-3 text-xs text-[#3B3C40]">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#734C1D] shrink-0" />
            <span>Wysyłka z Warszawy w 1 dzień • Darmowa dostawa InPost & Kurier</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#734C1D] shrink-0" />
            <span>Odbiór osobisty w Warszawie (ul. Włodarzewska 4 / Centrum)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#734C1D] shrink-0" />
            <span>14 dni na bezproblemowy zwrot lub wymianę</span>
          </div>
        </div>

      </div>

    </div>
  );
}
