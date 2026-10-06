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
      className="group relative flex flex-col bg-[#111113] border border-[#1E1E22] transition-colors duration-200 hover:border-[#C8794B]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3:4 Image Container */}
      <Link
        href={`/produkt/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-[#0B0B0C] block cursor-pointer"
        aria-label={displayName}
      >
        {/* Simple material badge */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-[#0B0B0C]/85 text-[#ECEAE7] text-[9px] font-mono tracking-widest px-2 py-0.5 border border-[#26262A] uppercase">
          {product.category === 'silk'
            ? 'Jedwab 19 Momme'
            : product.category === 'velvet'
            ? 'Welur'
            : product.category === 'satin'
            ? 'Satyna'
            : 'Akcesoria'}
        </div>

        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={displayName}
          fill
          priority={priority}
          className={`object-cover transition-opacity duration-300 ${
            secondaryImage && isHovered ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Secondary Image on hover */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${displayName} — detal`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
      </Link>

      {/* Info Section */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between bg-[#111113] border-t border-[#1E1E22]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8794B] block mb-1">
            {product.material}
          </span>

          <Link href={`/produkt/${product.slug}`} className="block">
            <h3 className="font-serif text-sm sm:text-base font-normal text-white leading-snug line-clamp-2 min-h-[2.4rem] group-hover:text-[#C8794B] transition-colors">
              {displayName}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-3 border-t border-[#1E1E22] flex items-center justify-between gap-2">
          <div>
            <span className="font-mono text-sm sm:text-base font-bold text-white tracking-tight block">
              {formatPrice(product.price, product.priceEur)}
            </span>
            <span className="text-[9px] font-mono text-[#787570] block uppercase">
              Paczkomat 0 zł
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`cursor-pointer px-3 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-mono font-bold transition-colors border ${
              isAdded
                ? 'bg-[#C8794B] border-[#C8794B] text-[#0B0B0C]'
                : 'bg-[#1A1A1B] border-[#26262A] text-white hover:bg-[#C8794B] hover:border-[#C8794B] hover:text-[#0B0B0C]'
            }`}
            title={isAdded ? 'Dodano do koszyka' : t.addToCart}
          >
            {isAdded ? 'DODANO' : '+ KOSZYK'}
          </button>
        </div>
      </div>
    </div>
  );
}
