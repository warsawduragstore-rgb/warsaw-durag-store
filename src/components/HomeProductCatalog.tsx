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
      <div className="text-center mb-8 sm:mb-12">
        <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
          [ Durag Activity ]
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
          Unikalny styl
        </h2>
        <p className="text-xs sm:text-sm text-[#3B3C40] font-light max-w-xl mx-auto mt-2.5 min-h-[36px] transition-opacity duration-300 px-4">
          {CATEGORY_DESCRIPTIONS[selectedCategory] || CATEGORY_DESCRIPTIONS['all']}
        </p>
      </div>

      {/* Horizontal Scrollable Category Filter Pills for Mobile & Desktop */}
      <div className="flex overflow-x-auto no-scrollbar scroll-smooth justify-start sm:justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 pb-2 sm:pb-0 px-2 sm:px-0 text-[11px] sm:text-xs uppercase tracking-wider font-semibold">
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
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isActive
                  ? 'bg-[#0D0D0B] text-white shadow-md'
                  : 'bg-[#F7F5F2] text-[#3B3C40] hover:bg-[#0D0D0B] hover:text-white border border-[#E5E2DC]/80'
              }`}
            >
              {cat.label} {cat.key === 'all' ? `(${count})` : count > 0 ? `(${count})` : ''}
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
        <div className="text-center py-16 bg-[#F7F5F2] rounded-xl border border-dashed border-[#CFCFCF]">
          <p className="text-[#3B3C40] text-sm">Brak dostępnych produktów w tej kategorii.</p>
        </div>
      )}
    </section>
  );
}
