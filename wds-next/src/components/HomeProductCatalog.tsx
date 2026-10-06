'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/products';
import { useLanguage } from '@/context/LanguageContext';

interface HomeProductCatalogProps {
  initialProducts: Product[];
}

export default function HomeProductCatalog({ initialProducts }: HomeProductCatalogProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: t.catAll },
    { key: 'silk', label: t.catSilk },
    { key: 'satin', label: t.catSatin },
    { key: 'velvet', label: t.catVelvet },
    { key: 'seasonal', label: t.catSeasonal },
    { key: 'accessories', label: t.catAccessories },
  ];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return initialProducts;
    return initialProducts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, initialProducts]);

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6" id="kolekcja">
      {/* Heading (No eyebrow) */}
      <div className="mb-8 pb-3 border-b border-[#1E1E22]">
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
          {t.catalogTitle}
        </h2>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto no-scrollbar scroll-smooth gap-2 mb-8 pb-2 sm:pb-0">
        {categories.map((cat) => {
          const count =
            cat.key === 'all'
              ? initialProducts.length
              : initialProducts.filter((p) => p.category === cat.key).length;

          const isActive = selectedCategory === cat.key;

          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap border shrink-0 tracking-[0.02em] ${
                isActive
                  ? 'bg-[#ECEAE7] text-[#0B0B0C] border-[#ECEAE7]'
                  : 'bg-[#141416] text-[#ECEAE7] border-[#1E1E22] hover:border-[#787570]'
              }`}
            >
              {cat.label} <span className="opacity-70 tabular-nums">({count})</span>
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
          <p className="text-[#A3A09B] text-[14px]">
            {t.catalogEmpty}
          </p>
        </div>
      )}
    </section>
  );
}
