'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProduct } from '@/lib/translations/products';
import { Product } from '@/lib/products';

interface BreadcrumbsProps {
  product: Product;
}

export function ProductBreadcrumbs({ product }: BreadcrumbsProps) {
  const { isEn, language, t } = useLanguage();
  const localized = getLocalizedProduct(product, language);

  const categoryLabel = isEn
    ? product.category === 'silk'
      ? 'Mulberry Silk'
      : product.category === 'satin'
      ? 'Satin'
      : product.category === 'velvet'
      ? 'Velvet'
      : product.category === 'seasonal'
      ? 'Seasonal'
      : product.category === 'accessories'
      ? 'Accessories'
      : 'All'
    : product.categoryLabel;

  return (
    <nav aria-label="Breadcrumb" className="bg-[#141416] border-b border-[#1E1E22] py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-[13px] text-[#787570] flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">
          {t.navHome}
        </Link>
        <span>/</span>
        <Link href={`/kolekcja/${product.category}`} className="hover:text-white transition-colors">
          {categoryLabel}
        </Link>
        <span>/</span>
        <span className="font-medium text-[#ECEAE7] truncate">{localized.name}</span>
      </div>
    </nav>
  );
}

interface RelatedProps {
  relatedProducts: Product[];
}

export function ProductRelatedSection({ relatedProducts }: RelatedProps) {
  const { isEn } = useLanguage();

  if (relatedProducts.length === 0) return null;

  return (
    <section className="bg-[#0E0E10] py-12 sm:py-16 border-t border-[#1E1E22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-xl sm:text-2xl text-white font-medium text-center mb-8 sm:mb-10">
          {isEn ? 'Recommended Durags' : 'Polecane produkty'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </div>
    </section>
  );
}
