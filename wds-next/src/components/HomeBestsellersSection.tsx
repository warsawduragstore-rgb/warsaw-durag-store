'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/context/LanguageContext';

interface HomeBestsellersSectionProps {
  bestsellers: Product[];
  totalProductsCount: number;
}

export default function HomeBestsellersSection({
  bestsellers,
  totalProductsCount,
}: HomeBestsellersSectionProps) {
  const { t, isEn } = useLanguage();

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6" id="bestsellery">
      <div className="flex items-end justify-between mb-8 sm:mb-10 pb-3 border-b border-[#1E1E22]">
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
          {t.bestsellersTitle}
        </h2>
        <Link
          href="/kolekcja/all"
          className="text-[13px] font-medium text-[#A3A09B] hover:text-white transition-colors flex items-center gap-1"
        >
          <span>
            {isEn ? 'All' : 'Wszystkie'} <span className="tabular-nums">({totalProductsCount})</span>
          </span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {bestsellers.map((product, idx) => (
          <ProductCard key={product.id} product={product} priority={idx < 2} />
        ))}
      </div>
    </section>
  );
}
