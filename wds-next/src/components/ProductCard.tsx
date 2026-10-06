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
  const { language, formatPrice, t } = useLanguage();
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
      className="group relative flex flex-col bg-[#141416] border border-[#26262A] transition-all duration-300 hover:border-[#C8794B] hover:-translate-y-0.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3:4 Aspect Ratio Container */}
      <Link
        href={`/produkt/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-[#0E0E10] block cursor-pointer"
        aria-label={displayName}
      >
        {/* Atelier Specimen Tag */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-[#0B0B0C]/90 text-[#C8794B] text-[9px] font-mono tracking-widest px-2 py-0.5 border border-[#C8794B]/30 uppercase flex items-center gap-1 shadow-md">
          <span className="w-1 h-1 bg-[#C8794B] rounded-full inline-block" />
          <span>
            {product.category === 'silk'
              ? '19 Momme'
              : product.category === 'velvet'
              ? 'Kompresja'
              : product.category === 'satin'
              ? 'Szew zewn.'
              : 'Atelier WAW'}
          </span>
        </div>

        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={displayName}
          fill
          priority={priority}
          className={`object-cover transition-all duration-500 ease-out ${
            secondaryImage && isHovered ? 'scale-105 opacity-0' : 'group-hover:scale-105 opacity-100'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Secondary Image loaded on desktop hover */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${displayName} — detal`}
            fill
            className={`object-cover scale-105 transition-opacity duration-300 ease-out ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
      </Link>

      {/* Card Info Section */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between bg-[#141416] border-t border-[#26262A]">
        <div>
          {/* Material & Origin */}
          <div className="flex items-center justify-between gap-1 mb-1.5 text-[9px] sm:text-[10px] font-mono">
            <span className="text-[#C8794B] uppercase tracking-wider font-semibold truncate">
              {product.material}
            </span>
            <span className="text-[#787570] uppercase tracking-widest shrink-0">
              Warszawa • 24h
            </span>
          </div>

          {/* Product Name with Cormorant Garamond */}
          <Link href={`/produkt/${product.slug}`} className="block transition-colors">
            <h3 className="font-serif text-sm sm:text-base font-normal text-[#FAFAF9] leading-snug line-clamp-2 min-h-[2.4rem] group-hover:text-[#C8794B] group-hover:italic transition-all">
              {displayName}
            </h3>
          </Link>

          {/* Feature Highlight */}
          <p className="text-[10px] text-[#A3A09B] line-clamp-1 mt-1 font-light">
            {product.category === 'silk'
              ? '100% naturalny jedwab • szew zewnętrzny'
              : product.category === 'velvet'
              ? 'Maksymalna kompresja fal 360'
              : 'Gładka mikrofibra • ochrona włosów'}
          </p>
        </div>

        {/* Pricing & Add To Cart */}
        <div className="mt-3 pt-3 border-t border-[#26262A] flex items-center justify-between gap-2">
          <div>
            <span className="font-mono text-sm sm:text-base font-bold text-[#FAFAF9] tracking-tight block">
              {formatPrice(product.price, product.priceEur)}
            </span>
            <span className="text-[9px] font-mono text-[#787570] block tracking-wider uppercase">
              Paczkomat 0 zł
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`cursor-pointer px-3 py-2 sm:px-3.5 sm:py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-mono font-bold transition-all border ${
              isAdded
                ? 'bg-[#C8794B] border-[#C8794B] text-[#0B0B0C]'
                : 'bg-[#1A1A1B] border-[#333338] text-[#FAFAF9] hover:bg-[#C8794B] hover:border-[#C8794B] hover:text-[#0B0B0C]'
            }`}
            title={isAdded ? 'Dodano do koszyka' : t.addToCart}
            aria-label={t.addToCart}
          >
            {isAdded ? 'DODANO ✓' : '+ KOSZYK'}
          </button>
        </div>
      </div>
    </div>
  );
}
