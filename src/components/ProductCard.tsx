'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);

  const displayName = language !== 'PL' && product.nameEn ? product.nameEn : product.name;

  const primaryImage = product.images[0] || '/assets/durag_silk_black.png';
  const secondaryImage = product.images[1] || primaryImage;
  const hasSecondary = Boolean(product.images[1] && product.images[1] !== primaryImage);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-[#E5E2DC] rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#D9A87E]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Tall Portrait Image Container with 2-Image Hover Reveal */}
      <Link
        href={`/produkt/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-[#F7F5F2] block cursor-pointer"
        aria-label={displayName}
      >
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={displayName}
          fill
          className={`object-cover transition-all duration-700 ease-out ${
            hasSecondary
              ? 'group-hover:opacity-0 group-hover:scale-105'
              : 'group-hover:scale-105'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />

        {/* Secondary Hover Image (if available) */}
        {hasSecondary && (
          <Image
            src={secondaryImage}
            alt={`${displayName} — widok alternatywny`}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        )}

        {/* Category Pill Badge */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 bg-[#0D0D0B]/85 backdrop-blur-md text-[#D9A87E] text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10 shadow-sm pointer-events-none">
          {product.categoryLabel}
        </div>

        {/* Promo / Distinction Badge */}
        {product.category === 'silk' ? (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 bg-[#D9A87E] text-[#0D0D0B] text-[8px] sm:text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 pointer-events-none">
            <Sparkles className="w-2.5 h-2.5" />
            <span>19 Momme</span>
          </div>
        ) : (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 bg-[#0D0D0B]/75 backdrop-blur-md text-emerald-400 text-[8px] sm:text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-emerald-400/20 shadow-sm pointer-events-none">
            2+1 Gratis
          </div>
        )}
      </Link>

      {/* Info Container below photo */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Material & Color Variants */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[9px] sm:text-[10px] text-[#734C1D] uppercase tracking-wider font-bold truncate">
              {product.material}
            </span>

            {/* Subtle Color Swatch Dots */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0" title="Dostępne kolory">
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title Link */}
          <Link href={`/produkt/${product.slug}`} className="block group-hover:text-[#734C1D] transition-colors">
            <h3 className="font-serif text-xs sm:text-sm md:text-base font-medium text-[#0D0D0B] leading-snug line-clamp-2">
              {displayName}
            </h3>
          </Link>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#E5E2DC]/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs sm:text-base md:text-lg font-bold text-[#0D0D0B] tracking-tight block">
              {product.price.toFixed(2)} PLN
            </span>
            <span className="text-[8px] sm:text-[9px] text-gray-500 block">Darmowa dostawa</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-300 rounded-full font-semibold uppercase tracking-wider shadow-sm active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs'
                : 'bg-[#0D0D0B] text-white hover:bg-[#D9A87E] hover:text-[#0D0D0B] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs'
            }`}
            title={isAdded ? 'Dodano do koszyka' : t.addToCart}
            aria-label={t.addToCart}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Dodano</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
