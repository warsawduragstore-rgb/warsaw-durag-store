import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import TrustBanner from '@/components/TrustBanner';
import HomeProductCatalog from '@/components/HomeProductCatalog';
import ProductCard from '@/components/ProductCard';
import AboutStoryCarousel from '@/components/AboutStoryCarousel';
import HeroVideo from '@/components/HeroVideo';
import { fetchProducts, fetchBestsellers } from '@/lib/products-db';
import { fetchCustomerReviews } from '@/lib/supabase';
import { ArrowRight, ChevronRight, Sparkles, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60; // ISR: 60s cache with on-demand tag revalidation

export const metadata: Metadata = {
  title: 'Warsaw Durag Store — Jedyne Duragi Szyte w Polsce | 100% Jedwab Morwowy 19 Momme',
  description:
    'Pierwszy polski butik z duragami z prawdziwego jedwabiu morwowego 19 Momme, luksusowej satyny i aksamitu. Zewnętrzny szew bezodciskowy, pasy 100 cm. Ręczne szycie w Warszawie, darmowy Paczkomat 0 zł i wysyłka w 24h.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Warsaw Durag Store — Ręcznie Szyte Duragi z Warszawy',
    description:
      'Odkryj kolekcję duragów z czystego jedwabiu morwowego 19 Momme, satyny i aksamitu. Polski butik streetwear z Warszawy.',
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
    description: 'Ręcznie szyte duragi w Warszawie. 100% naturalny jedwab morwowy 19 Momme i luksusowa satyna.',
    images: [`${SITE_URL}/assets/lookbook_editorial.png`],
  },
};

const CATEGORY_CARDS = [
  {
    slug: 'silk',
    title: 'Jedwab Morwowy',
    badge: '19 Momme',
    desc: 'Czysty jedwab naturalny Milanówek. Maksymalna redukcja tarcia i ochrona nawilżenia.',
    code: 'SPEC-01',
  },
  {
    slug: 'satin',
    title: 'Satyna Premium',
    badge: 'Bestseller',
    desc: 'Gładka mikrofibra o wysokiej gęstości do codziennego noszenia i pielęgnacji fal 360.',
    code: 'SPEC-02',
  },
  {
    slug: 'velvet',
    title: 'Welur Luksusowy',
    badge: 'Kompresja 360',
    desc: 'Mięsista, aksamitna struktura stworzona do układania i głębokiego utrwalania fal.',
    code: 'SPEC-03',
  },
  {
    slug: 'seasonal',
    title: 'Serie Sezonowe',
    badge: 'Limitowane',
    desc: 'Autorskie dropy: oddychający len, cupro o chłodnym chwycie oraz miękka krepa.',
    code: 'SPEC-04',
  },
  {
    slug: 'accessories',
    title: 'Akcesoria & Fale',
    badge: '360 Waves',
    desc: 'Profesjonalne twarde i miękkie szczotki z włosia dzika oraz czepki kompresyjne.',
    code: 'SPEC-05',
  },
];

const FAQS_DATA = [
  {
    num: '01',
    q: 'Kiedy paczka zostanie wysłana?',
    a: 'Wszystkie zamówienia pakujemy ręcznie w warszawskim atelier i nadajemy w ciągu 24 godzin. Przesyłki do Paczkomatu InPost trafiają zazwyczaj w 1 dzień roboczy. Dostawa w Polsce jest bezpłatna (0 zł).',
  },
  {
    num: '02',
    q: 'Jak działa promocja 2+1 (trzeci durag za 1 zł)?',
    a: 'Wybierz dowolne 2 duragi do koszyka. Nasz system automatycznie dobierze 3. losowy model z puli prezentowej w symbolicznej cenie 1 PLN (0.25 EUR). Promocja łączy się z darmową dostawą InPost.',
  },
  {
    num: '03',
    q: 'Czym różni się jedwab morwowy 19 Momme od zwykłej satyny poliestrowej?',
    a: 'Nasz model Milanówek wykonany jest w 100% z naturalnego jedwabiu morwowego o gramaturze 19 Momme. Naturalne włókno białkowe nie pochłania sebum ani odżywek z włosów, zapobiega mikrouszkodzeniom i jest hipoalergiczne.',
  },
  {
    num: '04',
    q: 'Czy durag zostawia odciski na czole po całej nocy?',
    a: 'Nie. Wszystkie duragi Warsaw Durag Store mają autorski szew wyprowadzony na zewnątrz oraz szerokie pasy o długości 100 cm, które równomiernie rozkładają nacisk.',
  },
  {
    num: '05',
    q: 'Gdzie możliwy jest odbiór osobisty w Warszawie?',
    a: 'Zamówienia można odebrać osobiście po wcześniejszym umówieniu w naszym atelier na Ochocie (ul. Włodarzewska 4) lub w Śródmieściu.',
  },
];

export default async function HomePage() {
  const [products, bestsellers, reviews] = await Promise.all([
    fetchProducts(),
    fetchBestsellers(4),
    fetchCustomerReviews(),
  ]);

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
          streetAddress: 'Grójecka 186 lok. 212',
          addressLocality: 'Warszawa',
          postalCode: '02-390',
          addressCountry: 'PL',
        },
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
    <div className="bg-[#0B0B0C] text-[#FAFAF9] min-h-screen selection:bg-[#C8794B] selection:text-[#0B0B0C]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Hero Section: Dark Luxury Editorial Atmosphere */}
      <section className="relative bg-[#0B0B0C] text-white min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#26262A]">
        {/* Brand Video Player */}
        <HeroVideo poster="/media/wds/wyszol1126.jpg" />

        {/* Architectural vertical guide lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_100%] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-24">
          {/* Atelier Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#141416]/90 border border-[#C8794B]/40 text-[#C8794B] text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase mb-6 shadow-2xl backdrop-blur-md">
            <span className="w-1.5 h-1.5 bg-[#C8794B] rounded-full inline-block animate-pulse" />
            <span>Atelier Warszawa • 100% Jedwab Morwowy 19 Momme</span>
          </div>

          {/* Headline with Serif & Italic Accent */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#FAFAF9] leading-[1.15] mb-6">
            Ręcznie szyte duragi.<br />
            <span className="italic text-[#C8794B] font-normal">Dla fal 360</span> i ochrony włosów.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#ECEAE7]/80 font-light max-w-2xl mx-auto leading-relaxed mb-8">
            Zewnętrzny szew bezodciskowy i pasy 100 cm. Czysty naturalny jedwab morwowy 19 Momme oraz luksusowa satyna. Ręczne pakowanie i wysyłka w 24h prosto z Warszawy.
          </p>

          {/* Luxury CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none mb-10">
            <Link
              href="#bestsellery"
              className="w-full sm:w-auto bg-[#C8794B] text-[#0B0B0C] px-8 py-4 sm:px-10 sm:py-4 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-all hover:bg-[#FAFAF9] hover:translate-x-0.5 text-center shadow-lg shadow-[#C8794B]/15 cursor-pointer"
            >
              Kup teraz
            </Link>
            <Link
              href="#kolekcja"
              className="w-full sm:w-auto bg-transparent hover:bg-white/5 border border-[#333338] text-[#FAFAF9] px-8 py-4 sm:px-9 sm:py-4 text-xs font-mono font-medium uppercase tracking-[0.2em] transition-all hover:border-[#C8794B] hover:text-[#C8794B] hover:font-serif hover:italic text-center cursor-pointer"
            >
              Przeglądaj ofertę
            </Link>
          </div>

          {/* Continuous Typographic Ticker Strip */}
          <div className="pt-6 border-t border-[#26262A] flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#787570]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#C8794B]">◆</span> Paczkomat 0 zł
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#C8794B]">◆</span> Nadanie 24h z Warszawy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#C8794B]">◆</span> Szew bezodciskowy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#C8794B]">◆</span> BLIK / Apple Pay / Karty
            </span>
          </div>
        </div>

        {/* Floating Atelier Specimen Card on Desktop */}
        <div className="hidden xl:block absolute right-8 bottom-12 max-w-[220px] bg-[#141416]/95 border border-[#26262A] p-4 text-left shadow-2xl z-20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-mono text-[#C8794B] tracking-widest uppercase font-bold">SPEC-01</span>
            <span className="text-[8px] font-mono text-[#787570] uppercase">ATELIER</span>
          </div>
          <h4 className="font-serif text-sm text-[#FAFAF9] font-medium mb-1">
            Jedwab Milanówek
          </h4>
          <p className="text-[10px] text-[#A3A09B] font-light leading-snug">
            Pasy 100 cm • Szew zewnętrzny • 19 Momme
          </p>
        </div>
      </section>

      {/* Editorial Promotion 2+1 Banner */}
      <section className="bg-[#141416] border-b border-[#26262A] py-6 sm:py-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 bg-[#C8794B]/10 border border-[#C8794B]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#C8794B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C8794B] font-bold">
                  Promocja Limitowana
                </span>
                <span className="text-[9px] font-mono bg-[#C8794B] text-[#0B0B0C] px-1.5 py-0.2 font-bold uppercase">
                  Zestaw 2 + 1
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg text-[#FAFAF9] font-medium">
                Kup 2 dowolne duragi, odbierz <span className="italic text-[#C8794B]">3. model w prezencie za 1 zł</span>
              </h3>
              <p className="text-xs text-[#A3A09B] font-light hidden sm:block">
                Automatyczny rabat naliczany w koszyku. Łączy się z darmową wysyłką Paczkomatem InPost w całej Polsce.
              </p>
            </div>
          </div>

          <Link
            href="#kolekcja"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#C8794B] text-[#0B0B0C] hover:bg-[#FAFAF9] px-6 py-3 text-xs font-mono font-bold uppercase tracking-[0.16em] transition-colors shrink-0 shadow-lg shadow-[#C8794B]/10"
          >
            <span>Wybierz duragi do zestawu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Visual Fabric Specification Chips */}
      <section className="py-10 sm:py-14 bg-[#0E0E10] border-b border-[#26262A]" id="kategorie">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#26262A]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 bg-[#C8794B] inline-block rotate-45" />
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C8794B] font-semibold">
                  Specyfikacja Tkanin Atelier
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-2xl text-[#FAFAF9] font-medium">
                Wybierz <span className="italic text-[#C8794B]">Materiał</span>
              </h2>
            </div>
            <Link
              href="/kolekcja/all"
              className="text-xs font-mono uppercase tracking-wider text-[#ECEAE7] hover:text-[#C8794B] flex items-center gap-1 group"
            >
              <span className="group-hover:italic transition-all">Wszystkie modele</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Quick Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kolekcja/${cat.slug}`}
                className="group bg-[#141416] p-4 sm:p-5 border border-[#26262A] hover:border-[#C8794B] transition-all flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[#C8794B] font-bold">
                      {cat.code}
                    </span>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[#ECEAE7] bg-[#1A1A1B] px-2 py-0.5 border border-[#26262A]">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-normal text-[#FAFAF9] group-hover:text-[#C8794B] group-hover:italic transition-all">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#A3A09B] font-light mt-1.5 leading-snug">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-[#26262A] flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#787570] group-hover:text-[#C8794B]">
                  <span>Odkryj</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Trust Pillars */}
      <TrustBanner />

      {/* Dedicated Bestsellers Section */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6" id="bestsellery">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3 pb-4 border-b border-[#26262A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-[#C8794B] inline-block rotate-45" />
              <span className="text-[#C8794B] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold">
                Wybór Waverów • Bestsellery
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#FAFAF9] font-medium">
              Bestsellery <span className="italic text-[#C8794B]">Warsaw Durag Store</span>
            </h2>
          </div>
          <Link
            href="#kolekcja"
            className="text-xs font-mono uppercase tracking-wider text-[#ECEAE7] hover:text-[#C8794B] transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto group"
          >
            <span className="group-hover:italic transition-all">Pełna oferta ({products.length} modeli)</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bestseller Cards */}
        {bestsellers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {bestsellers.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 2} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-[#26262A] text-xs font-mono uppercase tracking-widest text-[#C8794B]">
            Katalog bestsellerów w trakcie aktualizacji w atelier.
          </div>
        )}
      </section>

      {/* Dynamic Products Catalog with Live Filters */}
      <HomeProductCatalog initialProducts={products} />

      {/* Verified Reviews Section (Dark Luxury) */}
      <section className="bg-[#0E0E10] py-14 sm:py-20 border-t border-[#26262A] cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-[#C8794B] inline-block rotate-45" />
              <span className="text-[#C8794B] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold">
                Doświadczenia Społeczności
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#FAFAF9] font-medium">
              Głosy Klientów <span className="italic text-[#C8794B]">Warsaw Durag Store</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3 font-mono text-xs text-[#FAFAF9]">
              <span className="text-[#C8794B] font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C8794B]" /> 5.0 / 5.0
              </span>
              <span className="text-[#787570]">•</span>
              <span className="text-[#A3A09B]">Ponad 1500 zrealizowanych zamówień w Polsce i Europie</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {reviews.slice(0, 4).map((rev) => (
              <div
                key={rev.id}
                className="bg-[#141416] p-5 sm:p-6 border border-[#26262A] flex flex-col justify-between hover:border-[#C8794B] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#26262A] text-[10px] font-mono">
                    <span className="text-[#C8794B] font-bold">OCENA {rev.rating}.0 // ★★★★★</span>
                    <span className="text-[#787570] uppercase tracking-wider">{rev.source}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#ECEAE7] font-light leading-relaxed mb-6 font-serif italic text-base">
                    "{rev.content}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#26262A] flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#FAFAF9]">{rev.author}</span>
                  <span className="text-[10px] font-mono text-[#C8794B] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#C8794B]" />
                    Zweryfikowany zakup
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jedwab w Mieście Editorial Showcase */}
      <section className="bg-[#0B0B0C] text-white py-16 sm:py-24 border-t border-[#26262A] cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Editorial Image Showcase */}
          <div className="relative aspect-[4/5] bg-[#141416] border border-[#26262A] overflow-hidden">
            <Image
              src="/media/wds/wyszol1126.jpg"
              alt="Jedwab w mieście — Durag Milanówek 19 Momme"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-[#0B0B0C]/90 border-t border-[#26262A] backdrop-blur-md">
              <span className="text-[10px] font-mono text-[#C8794B] uppercase tracking-widest font-bold block mb-1">
                Atelier Warszawa // Milanówek
              </span>
              <p className="text-xs text-[#ECEAE7]/90 font-light">
                Autorski krój bezodciskowy i naturalny jedwab morwowy 19 Momme.
              </p>
            </div>
          </div>

          <div className="space-y-5 lg:pl-4">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#C8794B] rounded-full inline-block animate-pulse" />
              <span className="text-[#C8794B] text-[10px] sm:text-xs uppercase font-mono tracking-[0.3em] font-semibold block">
                Pure Silk 19 Momme
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#FAFAF9] font-normal leading-tight">
              Jedwab w Mieście — <span className="italic text-[#C8794B]">Milanówek</span>.
            </h2>

            <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
              W miejskim rytmie nasz Durag Milanówek to coś więcej niż nakrycie głowy — chroni, podkreśla styl i wyróżnia nas na tle innych. Wykonany z naturalnego jedwabiu o gramaturze 19 momme — oznaczającej wysoką gęstość, trwałość i jakość materiału — łączy lekkość z wyjątkową wytrzymałością, a jego gładka struktura ogranicza tarcie, zapobiega łamaniu włosów i jest w 100% hipoalergiczna.
            </p>

            <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
              To jedyny w Polsce durag wykonany z prawdziwego jedwabiu z Milanówka. Pasy o długości 100 cm pozwalają na stabilne, komfortowe wiązanie bez ucisku na skronie i bez bólu głowy.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/kolekcja/silk"
                className="inline-block bg-[#C8794B] text-[#0B0B0C] hover:bg-[#FAFAF9] px-8 py-3.5 sm:px-9 sm:py-4 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-all hover:translate-x-0.5"
              >
                Sprawdź serię jedwabną
              </Link>
              <Link
                href="/o-nas"
                className="inline-block bg-transparent hover:bg-white/5 border border-[#333338] text-[#FAFAF9] px-7 py-3.5 sm:py-4 text-xs font-mono uppercase tracking-[0.2em] transition-all hover:border-[#C8794B] hover:text-[#C8794B] hover:font-serif hover:italic"
              >
                Historia Atelier →
              </Link>
            </div>
          </div>
        </div>

        {/* Lookbook Gallery Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#26262A]">
            <span className="text-[10px] font-mono text-[#C8794B] uppercase tracking-[0.25em] font-bold">
              Archiwum Sesji • Warszawa
            </span>
            <Link href="/blog" className="text-xs font-mono text-[#787570] hover:text-[#FAFAF9] transition-colors group">
              <span className="group-hover:italic transition-all">Czytaj Blog &amp; Kompendium →</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative aspect-[3/4] border border-[#26262A] overflow-hidden group">
              <Image src="/media/wds/wyszol0202.jpg" alt="Warsaw Durag Store Session 01" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative aspect-[3/4] border border-[#26262A] overflow-hidden group">
              <Image src="/media/wds/DSC0653.jpg" alt="Warsaw Durag Store Session 02" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative aspect-[3/4] border border-[#26262A] overflow-hidden group">
              <Image src="/media/wds/czarno-biale-3.jpg" alt="Warsaw Durag Store Session 03" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative aspect-[3/4] border border-[#26262A] overflow-hidden group">
              <Image src="/media/wds/DSC07653.jpg" alt="Warsaw Durag Store Session 04" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Materials Technical Specs Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 cv-auto border-t border-[#26262A]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-14 gap-4 pb-4 border-b border-[#26262A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-[#C8794B] inline-block rotate-45" />
              <span className="text-[#C8794B] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold">
                Charakterystyka Tkanin
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#FAFAF9] font-medium">
              Standardy Tkanin <span className="italic text-[#C8794B]">WDS Atelier</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#A3A09B] font-light max-w-md">
            Wybieramy wyłącznie certyfikowane materiały o określonej gramaturze i gęstości splotu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-[#141416] p-6 sm:p-8 border border-[#26262A] hover:border-[#C8794B] transition-colors">
            <span className="font-mono text-xs text-[#C8794B] font-bold block mb-2 tracking-wider">
              01 // JEDWAB 19 MOMME
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FAFAF9] mb-2 font-normal">
              100% Jedwab Morwowy
            </h3>
            <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
              Naturalnie gładka powierzchnia ograniczająca tarcie do minimum. Chroni włosy przed puszeniem i przesuszeniem, nie wchłaniając naturalnych olejków ze skóry głowy.
            </p>
          </div>

          <div className="bg-[#141416] p-6 sm:p-8 border border-[#26262A] hover:border-[#C8794B] transition-colors">
            <span className="font-mono text-xs text-[#C8794B] font-bold block mb-2 tracking-wider">
              02 // SATYNA PREMIUM
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FAFAF9] mb-2 font-normal">
              Satyna Codzienna
            </h3>
            <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
              Wysokogatunkowa mikrofibra o gęstym splocie. Zapewnia optymalny poślizg, trwałość koloru po praniu i wygodę noszenia przez całą dobę.
            </p>
          </div>

          <div className="bg-[#141416] p-6 sm:p-8 border border-[#26262A] hover:border-[#C8794B] transition-colors">
            <span className="font-mono text-xs text-[#C8794B] font-bold block mb-2 tracking-wider">
              03 // WELUR
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FAFAF9] mb-2 font-normal">
              Aksamitna Kompresja
            </h3>
            <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
              Gęsty welur o głębokiej barwie. Daje maksymalną kompresję, która pozwala utrwalić fale 360 i utrzymać pożądany kształt fryzury.
            </p>
          </div>

          <div className="bg-[#141416] p-6 sm:p-8 border border-[#26262A] hover:border-[#C8794B] transition-colors">
            <span className="font-mono text-xs text-[#C8794B] font-bold block mb-2 tracking-wider">
              04 // SEZONOWE
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FAFAF9] mb-2 font-normal">
              Cupro, Len &amp; Krepa
            </h3>
            <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
              Limitowane serie szyte z tkanin przystosowanych do pór roku: oddychający polski len na upały, cupro o jedwabistym chwycie oraz miękka krepa satynowa.
            </p>
          </div>
        </div>
      </section>

      {/* "O NAS" Section */}
      <section className="bg-[#0E0E10] text-white py-14 sm:py-20 border-t border-[#26262A] cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <AboutStoryCarousel />

            <div className="space-y-5">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C8794B] rounded-full inline-block animate-pulse" />
                <span className="text-[#C8794B] text-[10px] sm:text-xs uppercase font-mono tracking-[0.3em] font-semibold block">
                  Atelier • Od 2020
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#FAFAF9] font-medium">
                O nas — <span className="italic text-[#C8794B]">Warsaw Durag Store</span>
              </h2>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
                <p>
                  Warsaw Durag Store powstał w 2020 roku jako niezależny projekt w Warszawie. Zamiast sprowadzać masową produkcję, postawiliśmy na rzemieślnicze szycie, autorski krój ze szwem na zewnątrz i bezkompromisowe tkaniny.
                </p>
                <p>
                  Każda sztuka przechodzi przez nasze ręce przed zapakowaniem. Zamówienia wysyłamy w 24 godziny prosto z naszego warszawskiego atelier w ekologicznych kartonach.
                </p>
                <p className="text-[#C8794B] font-mono text-xs pt-1">
                  Odbiór osobisty: Warszawa, ul. Włodarzewska 4 (po umówieniu) • Instagram: @warsawduragstore
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href="/strona/o-nas"
                  className="inline-block border border-[#C8794B] text-[#C8794B] hover:bg-[#C8794B] hover:text-[#0B0B0C] px-7 py-3 sm:px-8 sm:py-3.5 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-all hover:translate-x-0.5"
                >
                  Dowiedz się więcej
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 cv-auto border-t border-[#26262A]">
        <div className="text-center mb-10 pb-4 border-b border-[#26262A]">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-[#C8794B] inline-block rotate-45" />
            <span className="text-[#C8794B] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold">
              Wiedza &amp; Pomoc
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAFAF9] font-medium">
            Często Zadawane <span className="italic text-[#C8794B]">Pytania</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#141416] border border-[#26262A] p-5 sm:p-6 hover:border-[#C8794B] transition-colors"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-[#C8794B] font-mono text-xs font-bold pt-0.5">
                  {faq.num} //
                </span>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-[#FAFAF9]">
                  {faq.q}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed pl-7 sm:pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
