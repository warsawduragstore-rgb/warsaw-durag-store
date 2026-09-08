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
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayName = language !== 'PL' && product.nameEn ? product.nameEn : product.name;
  const primaryImage = product.images[0] || '/assets/durag_silk_black.png';
  const secondaryImage = product.images[1] && product.images[1] !== primaryImage ? product.images[1] : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#E5E2DC] rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#D9A87E]/80 hover:shadow-lg transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3:4 Reserved Ratio Container to Guarantee 0 CLS */}
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
          priority={priority}
          className={`object-cover transition-transform duration-500 ease-out ${
            secondaryImage && isHovered ? 'scale-105 opacity-0' : 'group-hover:scale-105'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Secondary Image loaded on demand only on desktop hover */}
        {secondaryImage && isHovered && (
          <Image
            src={secondaryImage}
            alt={`${displayName} — widok z bliska`}
            fill
            className="object-cover scale-105 transition-opacity duration-300 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          <span className="bg-[#0D0D0B]/85 backdrop-blur-md text-[#D9A87E] text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border border-white/10 shadow-xs">
            {product.categoryLabel}
          </span>
        </div>

        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 pointer-events-none">
          {product.category === 'silk' ? (
            <span className="bg-[#D9A87E] text-[#0D0D0B] text-[8px] sm:text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>19 Momme</span>
            </span>
          ) : (
            <span className="bg-[#0D0D0B]/80 backdrop-blur-md text-emerald-400 text-[8px] sm:text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-emerald-400/20 shadow-xs">
              2+1 Gratis
            </span>
          )}
        </div>
      </Link>

      {/* Card Info Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Availability & Material */}
          <div className="flex items-center justify-between gap-1 mb-1 text-[9px] sm:text-[10px]">
            <span className="text-[#734C1D] uppercase tracking-wider font-bold truncate">
              {product.material}
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span className="hidden sm:inline">Wysyłka 24h</span>
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/produkt/${product.slug}`} className="block group-hover:text-[#734C1D] transition-colors">
            <h3 className="font-serif text-xs sm:text-sm font-medium text-[#0D0D0B] leading-snug line-clamp-2 min-h-[2rem]">
              {displayName}
            </h3>
          </Link>

          {/* Key Feature Highlight */}
          <p className="text-[10px] text-gray-500 line-clamp-1 mt-1 font-light">
            {product.category === 'silk'
              ? '100% morwowy • szew zewnętrzny'
              : product.category === 'velvet'
              ? 'Maksymalna kompresja fal 360'
              : 'Gładka struktura • ochrona włosów'}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="mt-2.5 sm:mt-3 pt-2.5 border-t border-[#E5E2DC]/70 flex items-center justify-between gap-2">
          <div>
            <span className="text-sm sm:text-base font-bold text-[#0D0D0B] tracking-tight block">
              {product.price.toFixed(2)} PLN
            </span>
            <span className="text-[8px] sm:text-[9px] text-emerald-700 font-medium block">
              Darmowa dostawa
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 rounded-full font-bold uppercase tracking-wider shadow-xs active:scale-95 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs shrink-0 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0D0D0B] text-white hover:bg-[#D9A87E] hover:text-[#0D0D0B]'
            }`}
            title={isAdded ? 'Dodano do koszyka' : t.addToCart}
            aria-label={t.addToCart}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Dodano</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Do koszyka</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
