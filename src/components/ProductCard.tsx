'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

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
      className="group relative flex flex-col bg-white border border-[#E5E2DC] transition-all duration-200 hover:border-[#0D0D0B]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3:4 Reserved Ratio Container to Guarantee 0 CLS */}
      <Link
        href={`/produkt/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-[#F6F5F2] block cursor-pointer"
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
      </Link>

      {/* Card Info Section */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between bg-white border-t border-[#E5E2DC]">
        <div>
          {/* Material & Atelier Origin */}
          <div className="flex items-center justify-between gap-1 mb-1.5 text-[9px] sm:text-[10px] font-mono">
            <span className="text-[#734C1D] uppercase tracking-wider font-semibold truncate">
              {product.material}
            </span>
            <span className="text-gray-400 uppercase tracking-widest shrink-0">
              Warszawa • 24h
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/produkt/${product.slug}`} className="block group-hover:text-[#734C1D] transition-colors">
            <h3 className="font-serif text-sm sm:text-base font-medium text-[#0D0D0B] leading-snug line-clamp-2 min-h-[2.4rem]">
              {displayName}
            </h3>
          </Link>

          {/* Technical Spec / Highlight */}
          <p className="text-[10px] text-gray-500 line-clamp-1 mt-1 font-light">
            {product.category === 'silk'
              ? '100% naturalny jedwab • szew zewnętrzny'
              : product.category === 'velvet'
              ? 'Maksymalna kompresja fal 360'
              : 'Gładka mikrofibra • ochrona włosów'}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="mt-3 pt-3 border-t border-[#E5E2DC] flex items-center justify-between gap-2">
          <div>
            <span className="font-mono text-sm sm:text-base font-bold text-[#0D0D0B] tracking-tight block">
              {product.price.toFixed(2)} PLN
            </span>
            <span className="text-[9px] font-mono text-gray-400 block tracking-wider uppercase">
              Paczkomat 0 zł
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`cursor-pointer px-3 py-2 sm:px-3.5 sm:py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-mono font-bold transition-colors border ${
              isAdded
                ? 'bg-[#0D0D0B] border-[#0D0D0B] text-[#D9A87E]'
                : 'bg-[#0D0D0B] border-[#0D0D0B] text-white hover:bg-[#D9A87E] hover:border-[#D9A87E] hover:text-[#0D0D0B]'
            }`}
            title={isAdded ? 'Dodano do koszyka' : t.addToCart}
            aria-label={t.addToCart}
          >
            {isAdded ? '[ DODANO ]' : '+ KOSZYK'}
          </button>
        </div>
      </div>
    </div>
  );
}
