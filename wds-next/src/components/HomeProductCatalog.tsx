'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product, CATEGORY_DESCRIPTIONS } from '@/lib/products';

interface HomeProductCatalogProps {
  initialProducts: Product[];
}

const CATEGORIES: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Wszystkie' },
  { key: 'silk', label: 'Jedwab 19 Momme' },
  { key: 'satin', label: 'Satyna' },
  { key: 'velvet', label: 'Welur' },
  { key: 'seasonal', label: 'Tkaniny sezonowe' },
  { key: 'accessories', label: 'Akcesoria' },
];

export default function HomeProductCatalog({ initialProducts }: HomeProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return initialProducts;
    return initialProducts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, initialProducts]);

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6" id="kolekcja">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3 pb-4 border-b border-[#1E1E22]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8794B] block mb-1">
            Pełna oferta
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
            Katalog duragów
          </h2>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto no-scrollbar scroll-smooth gap-2 mb-8 pb-2 sm:pb-0">
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
              className={`px-4 py-2 text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer whitespace-nowrap border shrink-0 ${
                isActive
                  ? 'bg-[#C8794B] text-[#0B0B0C] border-[#C8794B] font-bold'
                  : 'bg-[#141416] text-[#ECEAE7] border-[#1E1E22] hover:border-[#C8794B]'
              }`}
            >
              {cat.label} <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#141416] border border-[#1E1E22]">
          <p className="text-[#A3A09B] text-xs font-mono uppercase tracking-wider">
            Brak produktów w tej kategorii.
          </p>
        </div>
      )}
    </section>
  );
}
