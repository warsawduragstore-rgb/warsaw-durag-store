import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchProducts } from '@/lib/products-db';
import ProductCard from '@/components/ProductCard';
import { Sparkles, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';

export const revalidate = 3600; // ISR cache for 1 hour

export const metadata: Metadata = {
  title: 'Katalog Duragów — Warsaw Durag Store',
  description: 'Przeglądaj pełną ofertę duragów szytych w Polsce. Naturalny jedwab morwowy 19 Momme, luksusowy aksamit, satyna i akcesoria do pielęgnacji 360 waves.',
  alternates: {
    canonical: 'https://warsawduragstore.pl/produkty',
  },
};

const CATEGORIES = [
  { slug: 'all', label: 'Wszystkie produkty' },
  { slug: 'silk', label: 'Jedwab morwowy 19 Momme' },
  { slug: 'satin', label: 'Satyna' },
  { slug: 'velvet', label: 'Welur / Aksamit' },
  { slug: 'seasonal', label: 'Kolekcje sezonowe' },
  { slug: 'accessories', label: 'Akcesoria i Wave Capy' },
];

interface PageProps {
  searchParams: Promise<{
    kategoria?: string;
    strona?: string;
    sort?: string;
  }>;
}

export default async function ProductsCatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentCategory = params.kategoria || 'all';
  const currentPage = Math.max(1, parseInt(params.strona || '1', 10));
  const currentSort = params.sort || 'default';
  const PAGE_SIZE = 12;

  let allProducts = await fetchProducts();

  // Filter by category
  if (currentCategory !== 'all') {
    allProducts = allProducts.filter((p) => p.category === currentCategory);
  }

  // Sort
  if (currentSort === 'price-asc') {
    allProducts = [...allProducts].sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    allProducts = [...allProducts].sort((a, b) => b.price - a.price);
  } else if (currentSort === 'bestsellers') {
    allProducts = [...allProducts].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  // Pagination calculation
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = allProducts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAFAF9] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#787570] uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-white transition-colors">Start</Link>
            <span>/</span>
            <span className="text-[#C8794B]">Katalog Produktów</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight uppercase">
                Katalog Duragów
              </h1>
              <p className="text-xs sm:text-sm text-[#A3A09B] mt-2 max-w-xl font-light">
                Jedyne duragi szyte w Polsce. Ochrona nawilżenia włosa, autorski szew bezodciskowy i formowanie fal 360 waves.
              </p>
            </div>

            {/* 2+1 Reminder Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#141416] text-[#C8794B] border border-[#C8794B]/30 text-xs font-mono uppercase tracking-wider self-start md:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#C8794B]" />
              <span>Promocja: Kup 2, 3. model za 1 zł</span>
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
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all border ${
                    isActive
                      ? 'bg-[#C8794B] text-[#0B0B0C] border-[#C8794B] font-bold'
                      : 'bg-[#1A1A1B] text-[#ECEAE7] border-[#26262A] hover:border-[#C8794B]'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs font-mono shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#787570]" />
            <span className="text-[#787570]">Sortuj:</span>
            <div className="flex gap-1">
              <Link
                href={`/produkty?kategoria=${currentCategory}&sort=default`}
                className={`px-2 py-1 text-xs ${
                  currentSort === 'default' ? 'font-bold text-[#C8794B] underline' : 'text-[#A3A09B] hover:text-white'
                }`}
              >
                Domyślnie
              </Link>
              <span className="text-[#26262A]">|</span>
              <Link
                href={`/produkty?kategoria=${currentCategory}&sort=price-asc`}
                className={`px-2 py-1 text-xs ${
                  currentSort === 'price-asc' ? 'font-bold text-[#C8794B] underline' : 'text-[#A3A09B] hover:text-white'
                }`}
              >
                Cena: rosnąco
              </Link>
              <span className="text-[#26262A]">|</span>
              <Link
                href={`/produkty?kategoria=${currentCategory}&sort=price-desc`}
                className={`px-2 py-1 text-xs ${
                  currentSort === 'price-desc' ? 'font-bold text-[#C8794B] underline' : 'text-[#A3A09B] hover:text-white'
                }`}
              >
                Cena: malejąco
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="bg-[#141416] border border-[#26262A] p-16 text-center space-y-4">
            <p className="font-serif text-2xl text-white">Brak produktów w tej kategorii</p>
            <p className="text-xs text-[#A3A09B]">Sprawdź inne kategorie lub wróć do pełnej oferty.</p>
            <Link
              href="/produkty"
              className="inline-block px-6 py-2.5 bg-[#C8794B] text-[#0B0B0C] text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors"
            >
              Pokaż wszystkie produkty
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product, idx) => (
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
                className="flex items-center gap-1 px-4 py-2 bg-[#141416] border border-[#26262A] text-xs font-mono uppercase tracking-wider hover:border-[#C8794B] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Poprzednia
              </Link>
            ) : (
              <span className="px-4 py-2 text-xs font-mono uppercase text-[#787570]">
                Poprzednia
              </span>
            )}

            <div className="flex items-center gap-1 font-mono text-xs">
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
                        ? 'bg-[#C8794B] border-[#C8794B] text-[#0B0B0C] font-bold'
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
                className="flex items-center gap-1 px-4 py-2 bg-[#141416] border border-[#26262A] text-xs font-mono uppercase tracking-wider hover:border-[#C8794B] transition-colors"
              >
                Następna <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="px-4 py-2 text-xs font-mono uppercase text-[#787570]">
                Następna
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
