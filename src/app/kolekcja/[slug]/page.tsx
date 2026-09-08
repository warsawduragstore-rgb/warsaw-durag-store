import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import TrustBanner from '@/components/TrustBanner';
import { fetchProducts } from '@/lib/products-db';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60; // ISR cache 60s

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CATEGORY_NAMES: Record<string, { title: string; desc: string; label: string }> = {
  all: {
    title: 'Wszystkie Duragi i Akcesoria Streetwear',
    desc: 'Odkryj pełną kolekcję Warsaw Durag Store. Luksusowe duragi z naturalnego jedwabiu morwowego 19 Momme, podwójnego aksamitu, satyny oraz materiałów sezonowych.',
    label: 'Wszystko',
  },
  silk: {
    title: 'Duragi z Czystego Jedwabiu Morwowego (19 Momme)',
    desc: 'Kolekcja duragów uszytych ze 100% naturalnego jedwabiu morwowego. Maksymalna ochrona struktury włosa, retencja wilgoci i jedwabisty połysk.',
    label: 'Jedwabne',
  },
  satin: {
    title: 'Duragi Satynowe Premium',
    desc: 'Gładka satyna poliestrowa o wysokim połysku. Trwałość, lekkość i ochrona fryzury na co dzień.',
    label: 'Satynowe',
  },
  velvet: {
    title: 'Duragi z Luksusowego Weluru i Aksamitu',
    desc: 'Eleganckie duragi welurowe i aksamitne. Optymalna kompresja dla idealnych fal 360 waves oraz unikalna tekstura streetwear.',
    label: 'Welurowe',
  },
  seasonal: {
    title: 'Duragi z Materiałów Sezonowych (Len, Cupro, Krepa)',
    desc: 'Limitowane serie duragów dopasowane do pór roku z przewiewnego lnu, miękkiego cupro oraz krepy satynowej.',
    label: 'Sezonowe',
  },
  accessories: {
    title: 'Akcesoria do Fal 360 Waves & Pielęgnacja',
    desc: 'Ręcznie profilowane szczotki z naturalnego włosia dzika oraz oddychające wave capy. Niezbędne do utrzymania fal.',
    label: 'Akcesoria',
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryInfo = CATEGORY_NAMES[slug];
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
  const categoryInfo = CATEGORY_NAMES[slug];

  if (!categoryInfo) {
    notFound();
  }

  // Fetch products and all products from database
  const [products, allProducts] = await Promise.all([
    fetchProducts({ category: slug }),
    fetchProducts(),
  ]);

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
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      {/* Category Hero Header */}
      <section className="bg-[#0D0D0B] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[#D9A87E] text-xs uppercase tracking-[0.3em] font-semibold block mb-3">
            [ warsaw durag store collection ]
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-4">
            {categoryInfo.title}
          </h1>
          <p className="text-sm text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            {categoryInfo.desc}
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 sm:py-8 bg-[#F6F5F2] border-b border-[#0D0D0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar scroll-smooth justify-start sm:justify-center gap-2 pb-2 sm:pb-0 text-xs font-mono uppercase tracking-wider">
          {Object.entries(CATEGORY_NAMES).map(([catKey, catVal]) => {
            const count =
              catKey === 'all'
                ? allProducts.length
                : allProducts.filter((p) => p.category === catKey).length;
            const isActive = slug === catKey;
            return (
              <Link
                key={catKey}
                href={`/kolekcja/${catKey}`}
                className={`px-4 sm:px-5 py-2.5 transition-colors whitespace-nowrap flex-shrink-0 font-medium ${
                  isActive
                    ? 'bg-[#0D0D0B] text-white'
                    : 'bg-white text-[#0D0D0B] hover:bg-[#0D0D0B] hover:text-white border border-[#0D0D0B]'
                }`}
              >
                [{catVal.label.toUpperCase()}] <span className="text-[10px] opacity-70">({count})</span>
              </Link>
            );
          })}
        </div>
      </section>

      <TrustBanner />

      {/* Responsive Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-[#F6F5F2] border border-[#0D0D0B] p-8">
            <span className="font-mono text-xs text-[#734C1D] uppercase tracking-widest block mb-2">[ STATUS ]</span>
            <p className="font-serif text-xl text-[#0D0D0B]">Brak produktów w tej kategorii atelier.</p>
            <p className="text-xs text-[#5A5B60] mt-1 font-light">Nowy drop w przygotowaniu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
