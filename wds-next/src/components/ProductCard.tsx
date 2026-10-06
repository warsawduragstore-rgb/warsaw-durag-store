'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProduct } from '@/lib/translations/products';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { formatPrice, language, isEn, t } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const localized = getLocalizedProduct(product, language);

  // Model name (e.g. "Milanówek", "Warszawa", "Wrocław")
  const rawName = localized.name;
  const modelName = rawName.replace(/^Durag\s+/i, '').split(/[—–-]/)[0].trim() || rawName;

  // Single material identifier
  const materialLabel = isEn
    ? (product.category === 'silk'
        ? 'Mulberry Silk'
        : product.category === 'velvet'
        ? 'Velvet'
        : product.category === 'satin'
        ? 'Satin'
        : product.category === 'accessories'
        ? 'Accessories'
        : 'Seasonal')
    : (product.category === 'silk'
        ? 'Jedwab'
        : product.category === 'velvet'
        ? 'Welur'
        : product.category === 'satin'
        ? 'Satyna'
        : product.category === 'accessories'
        ? 'Akcesoria'
        : 'Tkaniny sezonowe');

  const singleColorName =
    product.colors && product.colors.length === 1 ? product.colors[0].name : '';

  const primaryImage = product.images[0] || '/assets/durag_silk_black.png';
  const secondaryImage =
    product.images[1] && product.images[1] !== primaryImage ? product.images[1] : null;

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
      className="group relative flex flex-col bg-[#111113] border border-[#1E1E22] transition-colors duration-200 hover:border-[#787570]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3:4 Product Image */}
      <Link
        href={`/produkt/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-[#0B0B0C] block cursor-pointer"
        aria-label={modelName}
      >
        <Image
          src={primaryImage}
          alt={modelName}
          fill
          priority={priority}
          className={`object-cover transition-opacity duration-300 ${
            secondaryImage && isHovered ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading={priority ? 'eager' : 'lazy'}
        />

        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${modelName} — detal`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
      </Link>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-[#111113] border-t border-[#1E1E22]">
        <div>
          {/* Model Name: Newsreader 500, min 18px */}
          <Link href={`/produkt/${product.slug}`} className="block">
            <h3 className="font-serif text-[18px] sm:text-[19px] font-medium text-white leading-tight hover:text-[#ECEAE7] transition-colors">
              {modelName}
            </h3>
          </Link>

          {/* Subline in one line: Material and color */}
          <div className="mt-1 flex items-center justify-between gap-2 text-[13px] text-[#A3A09B]">
            <span className="truncate">
              {materialLabel}
              {singleColorName ? ` · ${singleColorName}` : ''}
            </span>

            {/* Pastylki kolorów przy wielu kolorach */}
            {product.colors && product.colors.length > 1 && (
              <div className="flex items-center gap-1 shrink-0" title={isEn ? 'Available colors' : 'Dostępne kolory'}>
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-[#26262A] inline-block"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-[#1E1E22] flex items-center justify-between gap-2">
          {/* Price: Hanken Grotesk 500/600, tabular-nums */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[17px] sm:text-[18px] font-semibold text-white tabular-nums tracking-normal">
              {formatPrice(product.price, product.priceEur)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-1.5 text-[13px] font-medium transition-colors cursor-pointer border ${
              isAdded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-[#ECEAE7] text-[#0B0B0C] border-[#ECEAE7] hover:bg-white hover:border-white'
            }`}
          >
            {isAdded ? (isEn ? 'Added' : 'Dodano') : (isEn ? 'Add to cart' : 'Do koszyka')}
          </button>
        </div>
      </div>
    </div>
  );
}
