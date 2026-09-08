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
import { ArrowRight, ChevronRight } from 'lucide-react';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60; // ISR: 60s cache with on-demand tag revalidation

export const metadata: Metadata = {
  title: 'Warsaw Durag Store — Ręcznie Szyte Duragi Jedwabne i Satynowe',
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
    desc: 'Czysty jedwab naturalny. Ochrona przed puszeniem i łamaniem.',
    code: 'SPEC-01',
  },
  {
    slug: 'satin',
    title: 'Satyna Premium',
    badge: 'Bestseller',
    desc: 'Maksymalna gładkość do codziennego noszenia i fal 360.',
    code: 'SPEC-02',
  },
  {
    slug: 'velvet',
    title: 'Welur Luksusowy',
    badge: 'Kompresja',
    desc: 'Gruba, aksamitna struktura do układania i utrwalania fal.',
    code: 'SPEC-03',
  },
  {
    slug: 'seasonal',
    title: 'Serie Sezonowe',
    badge: 'Limitowane',
    desc: 'Unikatowe tkaniny: oddychający len, cupro i krepa.',
    code: 'SPEC-04',
  },
  {
    slug: 'accessories',
    title: 'Akcesoria & Fale',
    badge: '360 Waves',
    desc: 'Naturalne szczotki z włosia dzika oraz czepki kompresyjne.',
    code: 'SPEC-05',
  },
];

const REVIEWS_DATA = [
  {
    name: 'Kamil W.',
    city: 'Warszawa',
    product: 'Durag Milanówek 19 Momme',
    rating: '5.0',
    text: 'Jedyny durag w Polsce, po którym nie mam odcisków na czole po nocy. Prawdziwy jedwab robi niesamowitą różnicę — włosy są miękkie i nawilżone.',
  },
  {
    name: 'Mateusz S.',
    city: 'Gdańsk',
    product: 'Durag Satynowy Czarny',
    rating: '5.0',
    text: 'Paczka w Paczkomacie była dosłownie na drugi dzień. Jakość wykonania i długość pasów (100 cm) sprawiają, że zawiązanie go zajmuje 15 sekund. Klasa.',
  },
  {
    name: 'Patryk M.',
    city: 'Kraków',
    product: 'Durag Welurowy Granat',
    rating: '5.0',
    text: 'Kompresja fal 360 na najwyższym poziomie. Materiał jest gęsty, nie zsuwa się w nocy, a szew nie wbija się w skórę.',
  },
];

const FAQS_DATA = [
  {
    num: '01',
    q: 'Kiedy paczka zostanie wysłana?',
    a: 'Wszystkie zamówienia pakujemy ręcznie i nadajemy w ciągu 24 godzin z Warszawy. Przesyłki do Paczkomatu InPost trafiają zazwyczaj w 1 dzień roboczy. Dostawa jest bezpłatna.',
  },
  {
    num: '02',
    q: 'Czym różni się jedwab morwowy 19 Momme od satyny poliestrowej?',
    a: 'Nasz model Milanówek wykonany jest w 100% z naturalnego jedwabiu morwowego o wysokiej gramaturze 19 Momme. Naturalne włókno jedwabne składa się z białek zbliżonych do struktury ludzkiego włosa — nie pochłania sebum ani odżywek, redukuje puszenie i łamliwość.',
  },
  {
    num: '03',
    q: 'Czy durag zostawia odciski na czole po całej nocy?',
    a: 'Nie. Wszystkie duragi Warsaw Durag Store mają specjalny szew zewnętrzny oraz szerokie na 8 cm pasy o długości 100 cm, które równomiernie rozkładają nacisk.',
  },
  {
    num: '04',
    q: 'Jak działa rabat w zestawie 2 + 1 gratis?',
    a: 'Wybierz dowolne 3 duragi do koszyka. System automatycznie obniży wartość zamówienia o cenę trzeciego duraga przy kasie. Promocja łączy się z darmową wysyłką InPost.',
  },
];

export default async function HomePage() {
  const [products, bestsellers] = await Promise.all([
    fetchProducts(),
    fetchBestsellers(4),
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

      {/* Hero Section: Official Video Background with Streetwear Controls */}
      <section className="relative bg-[#0D0D0B] text-white min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Official Brand Video Player */}
        <HeroVideo poster="/media/wds/wyszol1126.jpg" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-24">
          <div className="inline-block border border-white/20 bg-[#0D0D0B]/80 px-3.5 py-1 mb-6">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D9A87E]">
              ATELIER WARSZAWA • 100% MULBERRY SILK 19 MOMME
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-tight mb-5">
            Ręcznie szyte duragi.<br />
            Dla fal 360 i ochrony włosów.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed mb-8">
            Zewnętrzny szew bezodciskowy i pasy 100 cm. Czysty naturalny jedwab morwowy oraz gładka satyna. Ręczne pakowanie i wysyłka w 24h z Warszawy.
          </p>

          {/* Sharp Square Streetwear CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none mb-10">
            <Link
              href="#bestsellery"
              className="w-full sm:w-auto bg-[#D9A87E] text-[#0D0D0B] hover:bg-white px-8 py-3.5 sm:px-10 sm:py-4 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors text-center border border-[#D9A87E]"
            >
              Kup teraz
            </Link>
            <Link
              href="#kolekcja"
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 border border-white/40 text-white px-8 py-3.5 sm:px-9 sm:py-4 text-xs font-mono font-medium uppercase tracking-[0.2em] transition-colors text-center"
            >
              Przeglądaj ofertę
            </Link>
          </div>

          {/* Technical Spec Ticker Strip */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-400">
            <span>[ PACZKOMAT 0 ZŁ ]</span>
            <span>[ NADAWANIE 24H ]</span>
            <span>[ SZEW ZEWNĘTRZNY ]</span>
            <span>[ BLIK / APPLE PAY ]</span>
          </div>
        </div>
      </section>

      {/* Visual Quick Categories Section */}
      <section className="py-8 sm:py-12 bg-[#F6F5F2] border-b border-[#E5E2DC]" id="kategorie">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E5E2DC]">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#734C1D] block">
                [ SPECYFIKACJA TKANIN ]
              </span>
              <h2 className="font-serif text-lg sm:text-2xl text-[#0D0D0B] font-medium">
                Wybierz Materiał
              </h2>
            </div>
            <Link
              href="/kolekcja/all"
              className="text-xs font-mono uppercase tracking-wider text-[#0D0D0B] hover:text-[#734C1D] flex items-center gap-1"
            >
              Wszystkie modele <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Category Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kolekcja/${cat.slug}`}
                className="group bg-white p-4 border border-[#E5E2DC] hover:border-[#0D0D0B] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[#734C1D] font-bold">
                      {cat.code}
                    </span>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[#0D0D0B] bg-[#F6F5F2] px-1.5 py-0.5 border border-[#E5E2DC]">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-medium text-[#0D0D0B] group-hover:text-[#734C1D] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#6B6D74] font-light mt-1 leading-snug">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-[#E5E2DC] flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#0D0D0B] group-hover:text-[#734C1D]">
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3 pb-4 border-b border-[#E5E2DC]">
          <div>
            <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold block mb-1">
              [ WYBÓR WAVERÓW ]
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
              Bestsellery Warsaw Durag Store
            </h2>
          </div>
          <Link
            href="#kolekcja"
            className="text-xs font-mono uppercase tracking-wider text-[#0D0D0B] hover:text-[#734C1D] transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Pełna oferta (31 modeli)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Bestseller Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {bestsellers.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 2} />
          ))}
        </div>
      </section>

      {/* Dynamic Products Catalog */}
      <HomeProductCatalog initialProducts={products} />

      {/* Verified Reviews Section */}
      <section className="bg-[#F6F5F2] py-14 sm:py-20 border-t border-[#E5E2DC] cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold block mb-2">
              [ OPINIE SPOŁECZNOŚCI ]
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
              Doświadczenia Naszych Klientów
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3 font-mono text-xs text-[#0D0D0B]">
              <span className="text-[#734C1D] font-bold">[ 5.0 / 5.0 ]</span>
              <span className="text-gray-400">•</span>
              <span className="text-[#6B6D74]">Ponad 1500 wysłanych zamówień w Polsce</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS_DATA.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white p-6 border border-[#E5E2DC] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E2DC] text-[10px] font-mono">
                    <span className="text-[#734C1D] font-bold">[ OCENA {rev.rating} ]</span>
                    <span className="text-gray-400 uppercase tracking-wider">{rev.city}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed mb-6">
                    "{rev.text}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E5E2DC] flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#0D0D0B]">{rev.name}</span>
                  <span className="text-[10px] font-mono text-[#734C1D] truncate max-w-[150px]">
                    {rev.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jedwab w Mieście Editorial Showcase */}
      <section className="bg-[#0D0D0B] text-white py-16 sm:py-24 border-t border-white/10 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Editorial Image Showcase */}
          <div className="relative aspect-[4/5] bg-[#111111] border border-white/15 overflow-hidden">
            <Image
              src="/media/wds/wyszol1126.jpg"
              alt="Jedwab w mieście — Durag Milanówek 19 Momme"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-[#0D0D0B]/80 border-t border-white/10">
              <span className="text-[10px] font-mono text-[#D9A87E] uppercase tracking-widest font-bold block mb-1">
                [ ATELIER WARSZAWA ]
              </span>
              <p className="text-xs text-gray-300 font-light">
                Autorski krój bezodciskowy i naturalny jedwab morwowy 19 Momme.
              </p>
            </div>
          </div>

          <div className="space-y-5 lg:pl-4">
            <span className="text-[#D9A87E] text-[10px] sm:text-xs uppercase font-mono tracking-[0.3em] font-semibold block">
              [ PURE SILK 19 MOMME ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-medium leading-tight">
              Jedwab w Mieście.
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              W miejskim rytmie nasz Durag Milanówek to coś więcej niż nakrycie głowy — chroni, podkreśla styl i wyróżnia nas na tle innych. Wykonany z naturalnego jedwabiu o gramaturze 19 momme — oznaczającej wysoką gęstość, trwałość i jakość materiału — łączy lekkość z wyjątkową wytrzymałością, a jego gładka struktura ogranicza tarcie, zapobiega łamaniu włosów i jest w 100% hipoalergiczna.
            </p>

            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              To jedyny w Polsce durag wykonany z prawdziwego jedwabiu z Milanówka. Pasy o długości 100 cm pozwalają na stabilne, komfortowe wiązanie bez ucisku na skronie.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/kolekcja/silk"
                className="inline-block bg-[#D9A87E] text-[#0D0D0B] hover:bg-white px-8 py-3.5 sm:px-9 sm:py-4 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors border border-[#D9A87E]"
              >
                Sprawdź serię jedwabną
              </Link>
              <Link
                href="/o-nas"
                className="inline-block bg-transparent hover:bg-white/10 border border-white/30 text-white px-7 py-3.5 sm:py-4 text-xs font-mono uppercase tracking-[0.2em] transition-colors"
              >
                Historia Atelier →
              </Link>
            </div>
          </div>
        </div>

        {/* Lookbook Gallery Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-white/10">
            <span className="text-[10px] font-mono text-[#D9A87E] uppercase tracking-[0.25em] font-bold">
              [ ARCHIWUM SESJI // WARSZAWA ]
            </span>
            <Link href="/blog" className="text-xs font-mono text-gray-400 hover:text-white transition-colors">
              Czytaj Blog &amp; Artykuły →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative aspect-[3/4] border border-white/10 overflow-hidden group">
              <Image src="/media/wds/wyszol0202.jpg" alt="Warsaw Durag Store Session 01" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative aspect-[3/4] border border-white/10 overflow-hidden group">
              <Image src="/media/wds/DSC0653.jpg" alt="Warsaw Durag Store Session 02" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative aspect-[3/4] border border-white/10 overflow-hidden group">
              <Image src="/media/wds/czarno-biale-3.jpg" alt="Warsaw Durag Store Session 03" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="relative aspect-[3/4] border border-white/10 overflow-hidden group">
              <Image src="/media/wds/DSC07653.jpg" alt="Warsaw Durag Store Session 04" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Materials Technical Specs Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 cv-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-14 gap-4 pb-4 border-b border-[#E5E2DC]">
          <div>
            <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold block mb-1">
              [ CHARAKTERYSTYKA TKANIN ]
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
              Standardy Tkanin WDS
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B6D74] font-light max-w-md">
            Wybieramy wyłącznie certyfikowane materiały o określonej gramaturze i gęstości splotu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-6 sm:p-8 border border-[#E5E2DC]">
            <span className="font-mono text-xs text-[#734C1D] font-bold block mb-2 tracking-wider">
              [ 01 / JEDWAB 19 MOMME ]
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B] mb-2">100% Jedwab Morwowy</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Naturalnie gładka powierzchnia ograniczająca tarcie do minimum. Chroni włosy przed puszeniem i przesuszeniem, nie wchłaniając naturalnych olejków ze skóry głowy.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 border border-[#E5E2DC]">
            <span className="font-mono text-xs text-[#734C1D] font-bold block mb-2 tracking-wider">
              [ 02 / SATYNA PREMIUM ]
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B] mb-2">Satyna Codzienna</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Wysokogatunkowa satyna o gęstym splocie. Zapewnia optymalny poślizg, trwałość koloru po praniu i wygodę noszenia przez całą dobę.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 border border-[#E5E2DC]">
            <span className="font-mono text-xs text-[#734C1D] font-bold block mb-2 tracking-wider">
              [ 03 / WELUR ]
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B] mb-2">Aksamitna Kompresja</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Gęsty welur o głębokiej barwie. Daje maksymalną kompresję, która pozwala utrwalić fale 360 i utrzymać pożądany kształt fryzury.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 border border-[#E5E2DC]">
            <span className="font-mono text-xs text-[#734C1D] font-bold block mb-2 tracking-wider">
              [ 04 / SEZONOWE ]
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B] mb-2">Cupro, Len & Krepa</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Limitowane serie szyte z tkanin przystosowanych do pór roku: oddychający polski len na upały, cupro o jedwabistym chwycie oraz miękka krepa satynowa.
            </p>
          </div>
        </div>
      </section>

      {/* "O NAS" Section */}
      <section className="bg-[#0D0D0B] text-white py-14 sm:py-20 border-t border-white/10 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <AboutStoryCarousel />

            <div className="space-y-5">
              <span className="text-[#D9A87E] text-[10px] sm:text-xs uppercase font-mono tracking-[0.3em] font-semibold block">
                [ ATELIER • OD 2020 ]
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-medium">
                O nas — Warsaw Durag Store
              </h2>

              <div className="space-y-3.5 text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                <p>
                  Warsaw Durag Store powstał w 2020 roku jako niezależny projekt dwóch braci w Warszawie. Zamiast sprowadzać masową produkcję, postawiliśmy na rzemieślnicze szycie, autorski krój ze szwem na zewnątrz i bezkompromisowe tkaniny.
                </p>
                <p>
                  Każda sztuka przechodzi przez nasze ręce przed zapakowaniem. Zamówienia wysyłamy w 24 godziny prosto z naszego warszawskiego atelier.
                </p>
                <p className="text-[#D9A87E] font-mono text-xs pt-1">
                  Odbiór osobisty: Warszawa, ul. Włodarzewska 4 (po umówieniu) • Instagram: @warsawduragstore
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href="/strona/o-nas"
                  className="inline-block border border-[#D9A87E] text-[#D9A87E] hover:bg-[#D9A87E] hover:text-[#0D0D0B] px-7 py-3 sm:px-8 sm:py-3.5 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors"
                >
                  Dowiedz się więcej
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 cv-auto">
        <div className="text-center mb-10 pb-4 border-b border-[#E5E2DC]">
          <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] font-semibold block mb-1">
            [ WIEDZA & POMOC ]
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
            Często Zadawane Pytania
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E2DC] p-5 sm:p-6"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-[#734C1D] font-mono text-xs font-bold pt-0.5">
                  [ {faq.num} ]
                </span>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-[#0D0D0B]">
                  {faq.q}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed pl-7 sm:pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


