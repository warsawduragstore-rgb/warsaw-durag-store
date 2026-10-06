'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product, CATEGORY_DESCRIPTIONS } from '@/lib/products';

interface HomeProductCatalogProps {
  initialProducts: Product[];
}

const CATEGORIES: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Wszystkie' },
  { key: 'silk', label: 'Jedwabne 19 Momme' },
  { key: 'satin', label: 'Satynowe' },
  { key: 'velvet', label: 'Welurowe' },
  { key: 'seasonal', label: 'Materiały Sezonowe' },
  { key: 'accessories', label: 'Akcesoria & Fale' },
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 pb-6 border-b border-[#26262A]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 bg-[#C8794B] inline-block rotate-45" />
            <span className="text-[#C8794B] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold">
              Kolekcja Atelier • Warszawa
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAFAF9] font-medium tracking-tight">
            Katalog <span className="italic text-[#C8794B]">Warsaw Durag Store</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#A3A09B] font-light max-w-md">
          {CATEGORY_DESCRIPTIONS[selectedCategory] || CATEGORY_DESCRIPTIONS['all']}
        </p>
      </div>

      {/* Category Tabs */}
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
              className={`px-4 sm:px-5 py-2.5 text-[11px] sm:text-xs uppercase font-mono tracking-[0.15em] font-medium transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                isActive
                  ? 'bg-[#C8794B] text-[#0B0B0C] border-[#C8794B] font-bold shadow-lg shadow-[#C8794B]/10'
                  : 'bg-[#141416] text-[#ECEAE7] border-[#26262A] hover:border-[#C8794B] hover:text-[#FAFAF9]'
              }`}
            >
              {cat.label} <span className="text-[10px] opacity-75 ml-1 font-mono">({count})</span>
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
        <div className="text-center py-16 bg-[#141416] border border-[#26262A]">
          <p className="text-[#A3A09B] text-xs font-mono uppercase tracking-widest">
            Katalog modeli w trakcie aktualizacji w atelier.
          </p>
        </div>
      )}
    </section>
  );
}
