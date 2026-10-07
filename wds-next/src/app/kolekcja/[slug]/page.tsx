import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import TrustBanner from '@/components/TrustBanner';
import CategoryHeroAndTabs from '@/components/CategoryHeroAndTabs';
import { fetchProducts } from '@/lib/products-db';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 3600; // ISR cache 1h

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return ['all', 'silk', 'satin', 'velvet', 'seasonal', 'accessories'].map((slug) => ({
    slug,
  }));
}

const CATEGORY_SEO: Record<string, { title: string; desc: string; label: string }> = {
  all: {
    title: 'Wszystkie Duragi i Akcesoria Streetwear',
    desc: 'Odkryj pełną kolekcję Warsaw Durag Store. Luksusowe duragi z naturalnego jedwabiu morwowego 19 Momme, aksamitu, satyny oraz materiałów sezonowych.',
    label: 'Wszystko',
  },
  silk: {
    title: 'Duragi z Czystego Jedwabiu Morwowego (19 Momme)',
    desc: 'Kolekcja duragów uszytych ze 100% naturalnego jedwabiu morwowego Milanówek. Maksymalna ochrona struktury włosa, retencja wilgoci i jedwabisty połysk.',
    label: 'Jedwabne',
  },
  satin: {
    title: 'Duragi Satynowe Premium',
    desc: 'Gładka mikrofibra o wysokiej gęstości. Trwałość, lekkość i ochrona fryzury oraz fal 360 na co dzień.',
    label: 'Satynowe',
  },
  velvet: {
    title: 'Duragi z Luksusowego Weluru i Aksamitu',
    desc: 'Eleganckie duragi welurowe i aksamitne. Maksymalna kompresja dla idealnych fal 360 waves oraz unikalna tekstura streetwear.',
    label: 'Welurowe',
  },
  seasonal: {
    title: 'Duragi z Materiałów Sezonowych (Len, Cupro, Krepa)',
    desc: 'Limitowane serie duragów dopasowane do pór roku z przewiewnego polskiego lnu, miękkiego cupro oraz krepy satynowej.',
    label: 'Sezonowe',
  },
  accessories: {
    title: 'Akcesoria do Fal 360 Waves & Pielęgnacja',
    desc: 'Naturalne szczotki z włosia dzika oraz oddychające czepki kompresyjne. Niezbędne do utrzymania i pielęgnacji fal 360.',
    label: 'Akcesoria',
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryInfo = CATEGORY_SEO[slug];
  if (!categoryInfo) {
    return { title: 'Kolekcja | Warsaw Durag Store' };
  }
  const canonicalUrl = `${SITE_URL}/kolekcja/${slug}`;

  return {
    title: `${categoryInfo.title} | Warsaw Durag Store`,
    description: categoryInfo.desc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${categoryInfo.title} | Warsaw Durag Store`,
      description: categoryInfo.desc,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryInfo.title} | Warsaw Durag Store`,
      description: categoryInfo.desc,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryInfo = CATEGORY_SEO[slug];

  if (!categoryInfo) {
    notFound();
  }

  // Fetch products and all products from database
  const [products, allProducts] = await Promise.all([
    fetchProducts({ category: slug }),
    fetchProducts(),
  ]);

  const categoryCounts: Record<string, number> = {
    all: allProducts.length,
    silk: allProducts.filter((p) => p.category === 'silk').length,
    satin: allProducts.filter((p) => p.category === 'satin').length,
    velvet: allProducts.filter((p) => p.category === 'velvet').length,
    seasonal: allProducts.filter((p) => p.category === 'seasonal').length,
    accessories: allProducts.filter((p) => p.category === 'accessories').length,
  };

  const categoryUrl = `${SITE_URL}/kolekcja/${slug}`;

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Strona Główna',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryInfo.label,
        item: categoryUrl,
      },
    ],
  };

  const jsonLdItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryInfo.title,
    itemListElement: products.map((prod, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/produkt/${prod.slug}`,
      name: prod.name,
      image: prod.images[0]?.startsWith('http')
        ? prod.images[0]
        : `${SITE_URL}${prod.images[0] || '/assets/durag_silk_black.png'}`,
    })),
  };

  return (
    <div className="bg-[#FAF9F6] text-[#141416] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      {/* Reactive Category Hero & Category Tabs */}
      <CategoryHeroAndTabs slug={slug} categoryCounts={categoryCounts} />

      <TrustBanner />

      {/* Responsive Grid */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-[#141416] border border-[#1E1E22] p-8">
            <p className="font-serif text-xl text-white">Brak produktów w tej kategorii.</p>
            <p className="text-[14px] text-[#A3A09B] mt-1">Sprawdź pozostałe kategorie lub wróć do strony głównej.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {products
              .filter((p) => p.id !== 999 && !p.isPromoGift)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
