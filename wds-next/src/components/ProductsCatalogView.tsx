'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/lib/products';
import { Sparkles, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  products: Product[];
  currentCategory: string;
  currentPage: number;
  currentSort: string;
  totalPages: number;
}

export default function ProductsCatalogView({
  products,
  currentCategory,
  currentPage,
  currentSort,
  totalPages,
}: Props) {
  const { isEn, t } = useLanguage();

  const CATEGORIES = [
    { slug: 'all', label: isEn ? 'All Products' : 'Wszystkie produkty' },
    { slug: 'silk', label: isEn ? 'Mulberry Silk' : 'Jedwab morwowy' },
    { slug: 'satin', label: isEn ? 'Satin' : 'Satyna' },
    { slug: 'velvet', label: isEn ? 'Velvet' : 'Welur' },
    { slug: 'seasonal', label: isEn ? 'Seasonal Fabrics' : 'Tkaniny sezonowe' },
    { slug: 'accessories', label: isEn ? 'Accessories & Wave Caps' : 'Akcesoria i Wave Capy' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAFAF9] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#A3A09B] mb-2">
            <Link href="/" className="hover:text-white transition-colors">{t.navHome}</Link>
            <span>/</span>
            <span className="text-[#C8794B]">{isEn ? 'Catalog' : 'Katalog duragów'}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-white">
                {isEn ? 'Durag Catalog' : 'Katalog duragów'}
              </h1>
              <p className="text-sm text-[#A3A09B] mt-2 max-w-xl">
                {isEn
                  ? 'Handcrafted in Warsaw from mulberry silk, satin, velvet and seasonal fabrics.'
                  : 'Szyte ręcznie w Warszawie z jedwabiu, satyny, weluru i tkanin sezonowych.'}
              </p>
            </div>

            {/* Promo Reminder */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#141416] text-[#C8794B] border border-[#26262A] text-xs self-start md:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#C8794B]" />
              <span>
                {isEn ? 'Deal: Buy 2 durags, get 3rd random for 1 PLN' : 'Promocja: kup 2, trzeci losowy durag za 1 zł'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Sorting */}
        <div className="bg-[#141416] border border-[#26262A] p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/produkty?kategoria=${cat.slug}${currentSort !== 'default' ? `&sort=${currentSort}` : ''}`}
                  className={`px-3 py-1.5 text-xs transition-all border ${
                    isActive
                      ? 'bg-[#C8794B] text-[#0B0B0C] border-[#C8794B] font-semibold'
                      : 'bg-[#1A1A1B] text-[#ECEAE7] border-[#26262A] hover:border-[#C8794B]'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#787570]" />
            <span className="text-[#A3A09B]">{isEn ? 'Sort:' : 'Sortuj:'}</span>
            <div className="flex gap-1.5 items-center">
              <Link
                href={`/produkty?kategoria=${currentCategory}&sort=default`}
                className={`px-2 py-1 text-xs ${
                  currentSort === 'default' ? 'font-semibold text-[#C8794B]' : 'text-[#A3A09B] hover:text-white'
                }`}
              >
                {isEn ? 'Default' : 'Domyślnie'}
              </Link>
              <span className="text-[#26262A]">·</span>
              <Link
                href={`/produkty?kategoria=${currentCategory}&sort=price-asc`}
                className={`px-2 py-1 text-xs ${
                  currentSort === 'price-asc' ? 'font-semibold text-[#C8794B]' : 'text-[#A3A09B] hover:text-white'
                }`}
              >
                {isEn ? 'Price: low to high' : 'Cena: rosnąco'}
              </Link>
              <span className="text-[#26262A]">·</span>
              <Link
                href={`/produkty?kategoria=${currentCategory}&sort=price-desc`}
                className={`px-2 py-1 text-xs ${
                  currentSort === 'price-desc' ? 'font-semibold text-[#C8794B]' : 'text-[#A3A09B] hover:text-white'
                }`}
              >
                {isEn ? 'Price: high to low' : 'Cena: malejąco'}
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="bg-[#141416] border border-[#26262A] p-16 text-center space-y-4">
            <p className="font-serif text-2xl text-white">
              {isEn ? 'No products in this category' : 'Brak produktów w tej kategorii'}
            </p>
            <p className="text-sm text-[#A3A09B]">
              {isEn ? 'Check out other categories or explore all durags.' : 'Sprawdź inne kategorie lub wróć do pełnej oferty.'}
            </p>
            <Link
              href="/produkty"
              className="inline-block px-6 py-2.5 bg-[#C8794B] text-[#0B0B0C] text-sm font-semibold hover:bg-white transition-colors"
            >
              {isEn ? 'Explore Durags' : 'Zobacz duragi'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={idx < 4}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            {currentPage > 1 ? (
              <Link
                href={`/produkty?kategoria=${currentCategory}&strona=${currentPage - 1}${
                  currentSort !== 'default' ? `&sort=${currentSort}` : ''
                }`}
                className="flex items-center gap-1 px-4 py-2 bg-[#141416] border border-[#26262A] text-xs hover:border-[#C8794B] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {isEn ? 'Previous' : 'Poprzednia'}
              </Link>
            ) : (
              <span className="px-4 py-2 text-xs text-[#787570]">
                {isEn ? 'Previous' : 'Poprzednia'}
              </span>
            )}

            <div className="flex items-center gap-1 text-xs tabular-nums">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                const isCurrent = pageNumber === currentPage;
                return (
                  <Link
                    key={pageNumber}
                    href={`/produkty?kategoria=${currentCategory}&strona=${pageNumber}${
                      currentSort !== 'default' ? `&sort=${currentSort}` : ''
                    }`}
                    className={`w-8 h-8 flex items-center justify-center transition-colors border ${
                      isCurrent
                        ? 'bg-[#C8794B] border-[#C8794B] text-[#0B0B0C] font-semibold'
                        : 'bg-[#141416] border-[#26262A] text-[#ECEAE7] hover:border-[#C8794B]'
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </div>

            {currentPage < totalPages ? (
              <Link
                href={`/produkty?kategoria=${currentCategory}&strona=${currentPage + 1}${
                  currentSort !== 'default' ? `&sort=${currentSort}` : ''
                }`}
                className="flex items-center gap-1 px-4 py-2 bg-[#141416] border border-[#26262A] text-xs hover:border-[#C8794B] transition-colors"
              >
                {isEn ? 'Next' : 'Następna'} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="px-4 py-2 text-xs text-[#787570]">
                {isEn ? 'Next' : 'Następna'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
