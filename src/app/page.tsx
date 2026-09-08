import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import TrustBanner from '@/components/TrustBanner';
import HomeProductCatalog from '@/components/HomeProductCatalog';
import ProductCard from '@/components/ProductCard';
import AboutStoryCarousel from '@/components/AboutStoryCarousel';
import { fetchProducts, fetchBestsellers } from '@/lib/products-db';
import {
  Feather,
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';

import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60; // ISR: 60s cache with on-demand tag revalidation

export const metadata: Metadata = {
  title: 'Warsaw Durag Store — Ręcznie Szyte Duragi Jedwabne, Satynowe i Welurowe',
  description:
    'Pierwszy polski sklep z duragami z prawdziwego jedwabiu morwowego 19 Momme, luksusowej satyny i weluru. Ręczne pakowanie w Warszawie, darmowa wysyłka i profesjonalne poradniki 360 waves.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Warsaw Durag Store — Ręcznie Szyte Duragi z Warszawy',
    description:
      'Odkryj kolekcję ręcznie szytych duragów z czystego jedwabiu morwowego 19 Momme, satyny i aksamitu. Polski butik streetwear.',
    url: SITE_URL,
    siteName: 'Warsaw Durag Store',
    images: [
      {
        url: `${SITE_URL}/assets/lookbook_editorial.png`,
        width: 1200,
        height: 630,
        alt: 'Warsaw Durag Store Editorial',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warsaw Durag Store — Duragi Jedwabne i Satynowe',
    description: 'Ręcznie szyte duragi w Warszawie. 100% naturalny jedwab morwowy i luksusowa satyna.',
    images: [`${SITE_URL}/assets/lookbook_editorial.png`],
  },
};

const CATEGORY_CARDS = [
  {
    slug: 'silk',
    title: 'Jedwab Morwowy',
    badge: '19 Momme',
    desc: 'Ochrona włosów i naturalny blask',
    image: '/assets/durag_silk_black.png',
  },
  {
    slug: 'satin',
    title: 'Satyna Premium',
    badge: 'Bestseller',
    desc: 'Lekka, trwała i gładka na co dzień',
    image: '/assets/durag_satin_black.png',
  },
  {
    slug: 'velvet',
    title: 'Welur Luksusowy',
    badge: 'Maks. kompresja',
    desc: 'Głęboka tekstura i idealne fale',
    image: '/assets/durag_velvet_navy.png',
  },
  {
    slug: 'seasonal',
    title: 'Serie Sezonowe',
    badge: 'Limitowane',
    desc: 'Naturalny len, cupro i krepa',
    image: '/assets/durag_cupro_silver.png',
  },
  {
    slug: 'accessories',
    title: 'Akcesoria & Fale',
    badge: '360 Waves',
    desc: 'Szczotki z dzika i wave capy',
    image: '/assets/brush_medium.png',
  },
];

const REVIEWS_DATA = [
  {
    name: 'Kamil W.',
    city: 'Warszawa',
    product: 'Durag Milanówek Jedwab 19 Momme',
    rating: 5,
    text: 'Jedyny durag w Polsce, po którym nie mam odcisków na czole po nocy. Prawdziwy jedwab robi niesamowitą różnicę — włosy są miękkie i nawilżone.',
  },
  {
    name: 'Mateusz S.',
    city: 'Gdańsk',
    product: 'Durag Czarny Satynowy + Szczotka',
    rating: 5,
    text: 'Paczka w Paczkomacie była dosłownie na drugi dzień. Jakość wykonania i długość pasów (100 cm) sprawiają, że zawiązanie go zajmuje 15 sekund. Klasa!',
  },
  {
    name: 'Patryk M.',
    city: 'Kraków',
    product: 'Durag Welurowy Granat',
    rating: 5,
    text: 'Promocja 2+1 gratis to sztos. Zamówiłem welur i satynę, a jedwab dostałem w koszyku z mega rabatem. Kompresja fal 360 na najwyższym poziomie.',
  },
];

const FAQS_DATA = [
  {
    q: 'Kiedy moje zamówienie zostanie wysłane?',
    a: 'Wszystkie paczki nadajemy w ciągu 24 godzin prosto z naszego atelier w Warszawie. Paczkomaty InPost dostarczają przesyłki zazwyczaj w 1 dzień roboczy.',
  },
  {
    q: 'Czym różni się durag jedwabny od zwykłego satynowego?',
    a: 'Nasz Durag Milanówek wykonany jest w 100% z czystego jedwabiu morwowego 19 Momme. Jedwab to naturalne białko zwierzęce, które nie absorbuje wilgoci z włosów, zapobiega puszeniu i redukuje łamanie końcówek.',
  },
  {
    q: 'Czy szew duraga zostawia ślady na czole?',
    a: 'Nie. Wszystkie duragi Warsaw Durag Store mają specjalny, zewnętrzny szew rzemieślniczy oraz pasy o szerokości 8 cm, które równomiernie rozkładają nacisk na głowę.',
  },
  {
    q: 'Jak działa promocja 2 + 1 gratis?',
    a: 'Dodaj do koszyka dowolne 3 duragi. W koszyku rabat naliczy się automatycznie, odliczając wartość trzeciego duraga. Promocja łączy się z darmową dostawą!',
  },
];

export default async function HomePage() {
  // Fetch products dynamically from Supabase database with Next.js ISR cache
  const [products, bestsellers] = await Promise.all([
    fetchProducts(),
    fetchBestsellers(4),
  ]);

  // JSON-LD Schema: WebSite, Store, ItemList
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Store',
        '@id': `${SITE_URL}/#store`,
        name: 'Warsaw Durag Store',
        url: SITE_URL,
        image: `${SITE_URL}/assets/lookbook_editorial.png`,
        description: 'Ekskluzywny polski butik z duragami z naturalnego jedwabiu morwowego 19 Momme, satyny i weluru.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ul. Włodarzewska 4',
          addressLocality: 'Warszawa',
          postalCode: '02-384',
          addressCountry: 'PL',
        },
        telephone: '+48 500 000 000',
        priceRange: '79.00 - 149.00 PLN',
      },
      {
        '@type': 'ItemList',
        itemListElement: products.slice(0, 10).map((product, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${SITE_URL}/produkt/${product.slug}`,
          name: product.name,
          image: product.images[0]?.startsWith('http')
            ? product.images[0]
            : `${SITE_URL}${product.images[0]}`,
        })),
      },
    ],
  };

  return (
    <div>
      {/* Rich Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Hero Section: Optimized for LCP, Instant Conversion & Trust */}
      <section className="relative bg-[#0D0D0B] text-white min-h-[75vh] sm:min-h-[82vh] flex items-center justify-center overflow-hidden">
        {/* High-priority LCP Background Image with zero network stall */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/lookbook_editorial.png"
            alt="Warsaw Durag Store — Luksusowe duragi z jedwabiu morwowego"
            fill
            priority
            fetchPriority="high"
            className="object-cover object-center opacity-35 filter brightness-90"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B] via-[#0D0D0B]/40 to-[#0D0D0B]/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-12 sm:py-20">
          {/* Micro Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 mb-4 sm:mb-6 shadow-sm">
            <div className="flex text-[#D9A87E]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-200 tracking-wide">
              4.9/5 • Ponad 1500+ zadowolonych klientów w Polsce
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-tight mb-4 sm:mb-6">
            Ręcznie szyte duragi.<br />
            <span className="italic text-[#D9A87E]">Bo styl rodzi się na głowie</span>.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-200 font-light max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
            100% naturalny jedwab morwowy 19 Momme oraz luksusowa satyna. Zewnętrzny szew bezodciskowy, pasy 100 cm. Szyte i wysyłane w 24h z Warszawy.
          </p>

          {/* Prominent CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none mb-8">
            <Link
              href="#bestsellery"
              className="w-full sm:w-auto bg-[#D9A87E] text-[#0D0D0B] hover:bg-white px-8 py-3.5 sm:px-10 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full shadow-xl text-center active:scale-95 cursor-pointer"
            >
              Kup teraz
            </Link>
            <Link
              href="#kolekcja"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 sm:px-9 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full backdrop-blur-sm text-center"
            >
              Zobacz kolekcję
            </Link>
          </div>

          {/* Value Micro-Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] sm:text-xs text-gray-300 font-medium">
            <div className="flex items-center justify-center gap-1.5 py-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A87E]" />
              <span>Darmowy Paczkomat 0 zł</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-1">
              <Clock className="w-3.5 h-3.5 text-[#D9A87E]" />
              <span>Wysyłka w 24h z Warszawy</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9A87E]" />
              <span>Płatności BLIK & Apple Pay</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A87E]" />
              <span>14 dni na darmowy zwrot</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Quick Categories Cards Section */}
      <section className="py-8 sm:py-12 bg-[#F7F5F2] border-b border-[#E5E2DC]" id="kategorie">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#734C1D] block">
                Szybki wybór
              </span>
              <h2 className="font-serif text-lg sm:text-2xl text-[#0D0D0B] font-medium">
                Wybierz Materiał
              </h2>
            </div>
            <Link
              href="/kolekcja/all"
              className="text-xs font-bold uppercase tracking-wider text-[#734C1D] hover:underline flex items-center gap-1"
            >
              Wszystko <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Category Chips Grid (Horizontal scroll on mobile, 5-col on desktop) */}
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2 sm:pb-0">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kolekcja/${cat.slug}`}
                className="group flex-shrink-0 w-44 sm:w-auto bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E2DC] hover:border-[#D9A87E] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#D9A87E] bg-[#0D0D0B] px-2 py-0.5 rounded-full">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#0D0D0B] group-hover:text-[#734C1D] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-light mt-1 leading-snug">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E5E2DC]/60 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#734C1D]">
                  <span>Odkryj</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner with 4 Pillars */}
      <TrustBanner />

      {/* Dedicated Bestsellery Section */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6" id="bestsellery">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold block mb-1">
              [ Wybór Klientów ]
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
              Bestsellery Warsaw Durag Store
            </h2>
          </div>
          <Link
            href="#kolekcja"
            className="text-xs font-bold uppercase tracking-wider text-[#0D0D0B] hover:text-[#734C1D] transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Zobacz pełną ofertę (31 modeli)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Bestseller Cards with priority flag */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {bestsellers.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 2} />
          ))}
        </div>
      </section>

      {/* Dynamic Products Catalog (Responsive Grid with SSR Data & Filters) */}
      <HomeProductCatalog initialProducts={products} />

      {/* Verified Reviews / Social Proof Section */}
      <section className="bg-[#F7F5F2] py-14 sm:py-20 border-t border-[#E5E2DC] cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold block mb-2">
              [ Opinie Naszych Klientów ]
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
              Zaufało nam ponad 1500+ waverów
            </h2>
            <div className="flex items-center justify-center gap-1 text-[#D9A87E] mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-bold text-[#0D0D0B] ml-2">
                5.0 / 5.0 z verified reviews
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS_DATA.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#E5E2DC] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-[#D9A87E]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Zweryfikowany zakup
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed mb-4 italic">
                    "{rev.text}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E5E2DC]/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0D0D0B] block">{rev.name}</span>
                    <span className="text-[10px] text-gray-400">{rev.city}</span>
                  </div>
                  <span className="text-[10px] text-[#734C1D] font-medium truncate max-w-[140px]">
                    {rev.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jedwab w Mieście Editorial Showcase */}
      <section className="bg-[#0D0D0B] text-white py-14 sm:py-20 border-t border-white/10 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Editorial Image Showcase */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#111111] shadow-2xl border border-white/10 group">
            <Image
              src="/assets/lookbook_editorial.png"
              alt="Jedwab w mieście — Durag Milanówek 19 Momme"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
              <span className="text-[10px] sm:text-[11px] text-[#D9A87E] uppercase tracking-widest font-semibold block mb-1">
                Process & Craftsmanship
              </span>
              <p className="text-xs text-gray-300 font-light">
                Autorski proces szycia w Warszawie i gładkość prawdziwego jedwabiu morwowego.
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 lg:pl-6">
            <span className="text-[#D9A87E] text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold block">
              [ pure silk 19 momme ]
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white font-medium leading-tight">
              Jedwab w Mieście.
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              W miejskim rytmie nasz Durag Milanówek to coś więcej niż dodatek — chroni, podkreśla styl i wyróżnia nas na tle innych. Wykonany z naturalnego jedwabiu o gramaturze 19 momme — oznaczającej wysoką gęstość, trwałość i jakość materiału — łączy lekkość z wyjątkową wytrzymałością, a jego gładka struktura ogranicza tarcie, pomaga chronić włosy przed łamaniem i puszeniem oraz jest delikatna dla skóry głowy.
            </p>

            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              Jedwabny durag to unikatowy modowy hidden gem, który w przeciwieństwie do chusty czy czepka wyróżnia Cię na tle innych zarówno jakością wykonania, jak i subtelną elegancją w stylizacji. Jego lekka tkanina osłania głowę przed wiatrem i promieniowaniem UV, a niepodrabialny, głęboki połysk zmienia światło miasta w część stylizacji. To jedyny w Polsce durag wykonany z prawdziwego jedwabiu — bo styl rodzi się na głowie.
            </p>

            <div className="pt-2 sm:pt-4">
              <Link
                href="/kolekcja/silk"
                className="inline-block bg-[#D9A87E] text-[#0D0D0B] hover:bg-white px-7 py-3 sm:px-9 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full shadow-lg active:scale-95"
              >
                Sprawdź kolekcję jedwabną
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Materials Philosophy Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 cv-auto">
        <div className="text-center mb-8 sm:mb-14">
          <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
            Nasze standardy tkanin
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
            Filozofia naszych materiałów
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-[#F7F5F2] p-6 sm:p-8 border border-[#E5E2DC] rounded-2xl space-y-3 shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center text-[#734C1D]">
              <Feather className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B]">Jedwab stworzony dla włosów</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Użyta przy produkcji Durag Milanówek satyna jedwabna ma naturalnie gładką powierzchnię ograniczającą tarcie, dzięki czemu pozwala chronić włosy przed puszeniem, łamaniem i nadmiernym przesuszaniem. Zastosowany jedwab o gramaturze 19 momme jest lekki, elastyczny i trwały.
            </p>
          </div>

          <div className="bg-[#F7F5F2] p-6 sm:p-8 border border-[#E5E2DC] rounded-2xl space-y-3 shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center text-[#734C1D]">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B]">Satyna stworzona dla codzienności</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Satyna poliestrowa to materiał, który idealnie łączy gładkość, lekkość i trwałość — właśnie dlatego tak dobrze sprawdza się w szyciu duragów i korzysta z niej większość klientów na co dzień.
            </p>
          </div>

          <div className="bg-[#F7F5F2] p-6 sm:p-8 border border-[#E5E2DC] rounded-2xl space-y-3 shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center text-[#734C1D]">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B]">Welur na co dzień</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Welur to miękki, gęsty materiał o charakterystycznej powierzchni, która nadaje duragowi wyrazistą strukturę i głębię koloru. Zapewnia optymalną kompresję dla perfekcyjnych fal 360 waves.
            </p>
          </div>

          <div className="bg-[#F7F5F2] p-6 sm:p-8 border border-[#E5E2DC] rounded-2xl space-y-3 shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center text-[#734C1D]">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B]">Sezonowe materiały</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Tworzymy serie duragów wykonanych z sezonowych tkanin dopasowanych do pogody: Durag Bydgoszcz z przewiewnego cupro, Durag Żyrardów z polskiego lnu oraz Durag Stalowa Wola z krepy satynowej.
            </p>
          </div>
        </div>
      </section>

      {/* "O NAS" Section */}
      <section className="bg-[#0D0D0B] text-white py-14 sm:py-20 border-t border-white/10 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <AboutStoryCarousel />

            <div className="space-y-4 sm:space-y-6">
              <span className="text-[#D9A87E] text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold block">
                [ nasza historia ]
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-medium">
                O nas — Warsaw Durag Store
              </h2>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                <p>
                  Warsaw Durag Store powstał w 2020 roku z potrzeby stworzenia miejsca, które przybliży duragi polskiej społeczności i pokaże ich różnorodność — nie tylko jako elementu stylu, ale również praktycznego dodatku z własną historią i charakterem.
                </p>
                <p>
                  Jesteśmy małym butikiem prowadzonym przez dwóch braci. Każdy produkt przechodzi przez nasze ręce — od wyboru materiału, przez przygotowanie zamówienia, aż po kontakt z klientem.
                </p>
                <p className="text-[#D9A87E] font-medium pt-1">
                  Odbiór osobisty w Warszawie: przy ul. Włodarzewskiej 4 lub w centrum po umówieniu. Kontakt: Instagram @warsawduragstore lub support@warsawduragstore.pl.
                </p>
              </div>

              <div className="pt-2 sm:pt-4">
                <Link
                  href="/strona/o-nas"
                  className="inline-block border border-[#D9A87E] text-[#D9A87E] hover:bg-[#D9A87E] hover:text-[#0D0D0B] px-7 py-3 sm:px-8 sm:py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full"
                >
                  Dowiedz się więcej o nas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section: Resolving purchase hesitation */}
      <section className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 cv-auto">
        <div className="text-center mb-10">
          <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold block mb-2">
            [ Najczęstsze Pytania ]
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
            FAQ — Wszystko, co warto wiedzieć
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E2DC] rounded-2xl p-5 shadow-xs"
            >
              <h3 className="font-serif text-sm sm:text-base font-semibold text-[#0D0D0B] mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#734C1D] shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

