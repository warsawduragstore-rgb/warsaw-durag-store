import React from 'react';
import type { Metadata } from 'next';
import { fetchProducts } from '@/lib/products-db';
import ProductsCatalogView from '@/components/ProductsCatalogView';

export const revalidate = 3600; // ISR cache for 1 hour

export const metadata: Metadata = {
  title: 'Katalog Duragów — Warsaw Durag Store',
  description: 'Duragi szyte w Warszawie z jedwabiu, satyny i weluru. Bezodciskowy szew zewnętrzny i długie pasy.',
  alternates: {
    canonical: 'https://warsawduragstore.com/produkty',
  },
};

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
    <ProductsCatalogView
      products={paginatedProducts}
      currentCategory={currentCategory}
      currentPage={currentPage}
      currentSort={currentSort}
      totalPages={totalPages}
    />
  );
}
