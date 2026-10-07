import React from 'react';
import type { Metadata } from 'next';
import TrustBanner from '@/components/TrustBanner';
import HomeHero from '@/components/HomeHero';
import HomeBestsellersSection from '@/components/HomeBestsellersSection';
import HomePromoStrip from '@/components/HomePromoStrip';
import HomeFabricCategories from '@/components/HomeFabricCategories';
import HomeProductCatalog from '@/components/HomeProductCatalog';
import HomeEditorialCraft from '@/components/HomeEditorialCraft';
import HomeCustomerReviews from '@/components/HomeCustomerReviews';
import HomeFaqAndAbout from '@/components/HomeFaqAndAbout';
import { fetchProducts, fetchBestsellers } from '@/lib/products-db';
import { fetchCustomerReviews } from '@/lib/supabase';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Warsaw Durag Store — Duragi szyte w Warszawie | Jedwab morwowy 19 Momme',
  description:
    'Szyte ręcznie w Warszawie z naturalnego jedwabiu morwowego, satyny i weluru. Zewnętrzny szew bezodciskowy i pasy 100 cm. Wysyłka z Warszawy w 1–2 dni robocze, darmowa dostawa w Polsce.',
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function HomePage() {
  const [products, bestsellers, reviews] = await Promise.all([
    fetchProducts(),
    fetchBestsellers(4),
    fetchCustomerReviews(),
  ]);

  return (
    <div className="bg-[#FAF9F6] text-[#141416] min-h-screen selection:bg-[#B85C2E] selection:text-[#FAF9F6]">
      {/* Hero Section */}
      <HomeHero />

      {/* 4 Brand Facts Bar */}
      <TrustBanner />

      {/* Bestsellers Section */}
      <HomeBestsellersSection
        bestsellers={bestsellers}
        totalProductsCount={products.length}
      />

      {/* Promo Strip: Kup 2, trzeci losowy durag za 1 zł */}
      <HomePromoStrip />

      {/* Materials / Fabrics Section */}
      <HomeFabricCategories />

      {/* Full Catalog with Filters */}
      <HomeProductCatalog initialProducts={products} />

      {/* Editorial Craft & Real photo gallery */}
      <HomeEditorialCraft />

      {/* Customer Reviews */}
      <HomeCustomerReviews reviews={reviews} />

      {/* About Workshop & FAQ */}
      <HomeFaqAndAbout />
    </div>
  );
}
