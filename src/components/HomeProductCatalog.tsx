'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product, CATEGORY_DESCRIPTIONS } from '@/lib/products';

interface HomeProductCatalogProps {
  initialProducts: Product[];
}

const CATEGORIES: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Wszystko' },
  { key: 'silk', label: 'Jedwabne' },
  { key: 'satin', label: 'Satynowe' },
  { key: 'velvet', label: 'Welurowe' },
  { key: 'seasonal', label: 'Sezonowe materiały' },
  { key: 'accessories', label: 'Akcesoria' },
];

export default function HomeProductCatalog({ initialProducts }: HomeProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return initialProducts;
    return initialProducts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, initialProducts]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6" id="kolekcja">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 pb-6 border-b border-[#E5E2DC]">
        <div>
          <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold block mb-1.5">
            [ PEŁNA OFERTA ATELIER ]
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium tracking-tight">
            Kolekcja Warsaw Durag Store
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#6B6D74] font-light max-w-md">
          {CATEGORY_DESCRIPTIONS[selectedCategory] || CATEGORY_DESCRIPTIONS['all']}
        </p>
      </div>

      {/* Sharp Architectural Category Tabs */}
      <div className="flex overflow-x-auto no-scrollbar scroll-smooth gap-2 sm:gap-2.5 mb-8 sm:mb-12 pb-2 sm:pb-0">
        {CATEGORIES.map((cat) => {
          const count =
            cat.key === 'all'
              ? initialProducts.length
              : initialProducts.filter((p) => p.category === cat.key).length;

          const isActive = selectedCategory === cat.key;

          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 sm:px-5 py-2.5 text-[11px] sm:text-xs uppercase font-mono tracking-[0.15em] font-medium transition-colors cursor-pointer whitespace-nowrap border shrink-0 ${
                isActive
                  ? 'bg-[#0D0D0B] text-[#D9A87E] border-[#0D0D0B]'
                  : 'bg-white text-[#0D0D0B] border-[#E5E2DC] hover:border-[#0D0D0B]'
              }`}
            >
              {cat.label} {cat.key === 'all' ? `[${count}]` : count > 0 ? `[${count}]` : ''}
            </button>
          );
        })}
      </div>

      {/* Modern Responsive Products Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#F6F5F2] border border-[#E5E2DC]">
          <p className="text-[#6B6D74] text-xs font-mono uppercase tracking-widest">
            Brak modeli w wybranej kategorii.
          </p>
        </div>
      )}
    </section>
  );
}
