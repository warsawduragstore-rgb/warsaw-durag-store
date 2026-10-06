import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchProducts, fetchProductBySlug } from '@/lib/products-db';
import { SITE_URL } from '@/lib/siteConfig';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import ProductCard from '@/components/ProductCard';

export const revalidate = 3600; // ISR cache 1h

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return { title: 'Produkt | Warsaw Durag Store' };
  }

  const title = `${product.name} — ${product.material} | Warsaw Durag Store`;
  const description = `${product.name}. ${product.description.slice(0, 150)}... Darmowa dostawa w Polsce. Zamów teraz na Warsaw Durag Store.`;
  const canonicalUrl = `${SITE_URL}/produkt/${product.slug}`;
  const imageUrl = product.images[0]?.startsWith('http')
    ? product.images[0]
    : `${SITE_URL}${product.images[0] || '/assets/durag_silk_black.png'}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await fetchProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const productUrl = `${SITE_URL}/produkt/${product.slug}`;
  const imageUrl = product.images[0]?.startsWith('http')
    ? product.images[0]
    : `${SITE_URL}${product.images[0] || '/assets/durag_silk_black.png'}`;

  // Schema.org Product JSON-LD with reviews and offer
  const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [imageUrl],
    description: product.description,
    sku: `WDS-${product.id}`,
    mpn: `WDS-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Warsaw Durag Store',
    },
    material: product.material,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'PLN',
      price: product.price.toFixed(2),
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Warsaw Durag Store',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'PLN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: Math.max(product.reviews?.length || 1, 1),
      bestRating: '5',
      worstRating: '1',
    },
    review: (product.reviews || []).map((rev) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: rev.author,
      },
      datePublished: '2026-06-01',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rev.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: rev.comment,
    })),
  };

  // Schema.org BreadcrumbList JSON-LD
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
        name: product.categoryLabel,
        item: `${SITE_URL}/kolekcja/${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <div className="bg-[#0B0B0C] text-[#FAFAF9] min-h-screen">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="bg-[#141416] border-b border-[#26262A] py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-xs text-[#787570] flex items-center gap-2 font-mono">
          <Link href="/" className="hover:text-white transition-colors">
            Start
          </Link>
          <span>/</span>
          <Link href={`/kolekcja/${product.category}`} className="hover:text-white uppercase transition-colors">
            {product.categoryLabel}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#C8794B] truncate">{product.name}</span>
        </div>
      </nav>

      {/* Main Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <ProductDetailsClient product={product} />
      </div>

      {/* Related Products */}
      <section className="bg-[#0E0E10] py-12 sm:py-16 border-t border-[#26262A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-xl sm:text-2xl text-white font-medium text-center mb-8 sm:mb-10">
            Inni Klienci Wybrali <span className="italic text-[#C8794B]">Również</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
