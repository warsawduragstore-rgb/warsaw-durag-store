import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import TrustBanner from '@/components/TrustBanner';
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

const CATEGORY_NAMES: Record<string, { title: string; desc: string; label: string }> = {
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
    <div className="bg-[#0B0B0C] text-[#FAFAF9] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      {/* Category Hero Header */}
      <section className="bg-[#0B0B0C] text-white py-14 sm:py-20 border-b border-[#26262A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#C8794B] rounded-full inline-block animate-pulse" />
            <span className="text-[#C8794B] text-xs uppercase font-mono tracking-[0.3em] font-semibold">
              Kolekcja Atelier • Warszawa
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal mb-4 text-[#FAFAF9]">
            {categoryInfo.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A09B] font-light max-w-2xl mx-auto leading-relaxed">
            {categoryInfo.desc}
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 sm:py-8 bg-[#0E0E10] border-b border-[#26262A]">
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
                className={`px-4 sm:px-5 py-2.5 transition-all whitespace-nowrap shrink-0 font-medium border ${
                  isActive
                    ? 'bg-[#C8794B] text-[#0B0B0C] border-[#C8794B] font-bold shadow-lg shadow-[#C8794B]/10'
                    : 'bg-[#141416] text-[#ECEAE7] hover:border-[#C8794B] border-[#26262A]'
                }`}
              >
                {catVal.label.toUpperCase()} <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </Link>
            );
          })}
        </div>
      </section>

      <TrustBanner />

      {/* Responsive Grid */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-[#141416] border border-[#26262A] p-8">
            <span className="font-mono text-xs text-[#C8794B] uppercase tracking-widest block mb-2">Atelier Status //</span>
            <p className="font-serif text-xl text-white">Brak produktów w tej kategorii atelier.</p>
            <p className="text-xs text-[#A3A09B] mt-1 font-light">Nowy drop w przygotowaniu w Warszawie.</p>
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
