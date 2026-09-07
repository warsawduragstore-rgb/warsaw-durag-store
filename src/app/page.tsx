import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import TrustBanner from '@/components/TrustBanner';
import HomeProductCatalog from '@/components/HomeProductCatalog';
import AboutStoryCarousel from '@/components/AboutStoryCarousel';
import { fetchServerProducts } from '@/lib/supabase';
import { Feather, ShieldCheck, Sparkles, Star } from 'lucide-react';

import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60; // SSR / Incremental Static Regeneration every 60 seconds

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

export default async function HomePage() {
  // SSR: Fetch products dynamically from Supabase database CMS
  const products = await fetchServerProducts();

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

      {/* Hero Section with Video */}
      <section className="relative bg-[#0D0D0B] text-white min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <video
            src="/assets/hero_video.mp4"
            poster="/assets/durag_silk_black.png"
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B] via-[#0D0D0B]/30 to-[#0D0D0B]/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-24">
          <span className="text-[#D9A87E] text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold block mb-3 animate-fade-in">
            [ Duragi Najlepszej Jakości ]
          </span>
          <span className="text-xs sm:text-sm md:text-base font-light uppercase tracking-[0.18em] text-gray-200 block mb-6 px-2">
            Jedyne duragi szyte w Polsce — Made in Warszawa
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-tight mb-6 sm:mb-8">
            Ręcznie szyte duragi.<br />
            <span className="italic text-[#D9A87E]">Bo styl rodzi się na głowie</span>.
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none">
            <Link
              href="#kolekcja"
              className="w-full sm:w-auto bg-white text-[#0D0D0B] hover:bg-[#D9A87E] hover:text-white px-8 py-3.5 sm:px-9 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full shadow-lg text-center"
            >
              Odkryj kolekcję
            </Link>
            <Link
              href="/poradnik/wave-guide"
              className="w-full sm:w-auto border border-white/40 text-white hover:border-[#D9A87E] hover:text-[#D9A87E] px-8 py-3.5 sm:px-9 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full backdrop-blur-sm text-center"
            >
              Zobacz 360 Wave Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <TrustBanner />

      {/* Dynamic Products Catalog (Responsive Grid with SSR Data) */}
      <HomeProductCatalog initialProducts={products} />

      {/* Jedwab w Mieście Editorial Showcase */}
      <section className="bg-[#0D0D0B] text-white py-16 sm:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Editorial Image Showcase */}
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#111111] shadow-2xl border border-white/10 group">
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
                className="inline-block bg-[#D9A87E] text-[#0D0D0B] hover:bg-white px-7 py-3 sm:px-9 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full shadow-lg"
              >
                Sprawdź kolekcję jedwabną
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Materials Philosophy Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[#734C1D] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
            Nasze standardy tkanin
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#0D0D0B] font-medium">
            Filozofia naszych materiałów
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-[#F7F5F2] p-6 sm:p-8 border border-[#CFCFCF]/50 rounded-xl space-y-3 sm:space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#CFCFCF] flex items-center justify-center text-[#734C1D]">
              <Feather className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B]">Jedwab stworzony dla włosów</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Użyta przy produkcji Durag Milanówek satyna jedwabna ma naturalnie gładką powierzchnię ograniczającą tarcie, dzięki czemu pozwala chronić włosy przed puszeniem, łamaniem i nadmiernym przesuszaniem. Zastosowany tutaj jedwab o gramaturze 19 momme jest odpowiednio lekki i elastyczny a zarazem odpowiednio gęsty oraz trwały.
            </p>
          </div>

          <div className="bg-[#F7F5F2] p-6 sm:p-8 border border-[#CFCFCF]/50 rounded-xl space-y-3 sm:space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#CFCFCF] flex items-center justify-center text-[#734C1D]">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B]">Satyna stworzona dla codzienności</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Satyna poliestrowa to materiał, który idealnie łączy gładkość, lekkość i trwałość — właśnie dlatego tak dobrze sprawdza się w szyciu duragów i to właśnie z niej korzysta zdecydowana większość klientów. Zachowuje przy tym charakterystyczną gładkość oraz połysk.
            </p>
          </div>

          <div className="bg-[#F7F5F2] p-6 sm:p-8 border border-[#CFCFCF]/50 rounded-xl space-y-3 sm:space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#CFCFCF] flex items-center justify-center text-[#734C1D]">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B]">Welur na co dzień</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Welur poliestrowy to miękki, gęsty materiał o charakterystycznej, delikatnie włoskowatej powierzchni, która nadaje duragowi wyrazistą strukturę i głębię koloru. Wykonany z włókien poliestrowych jest trwały, odporny na częste użytkowanie i zapewnia doskonałą kompresję fal.
            </p>
          </div>

          <div className="bg-[#F7F5F2] p-6 sm:p-8 border border-[#CFCFCF]/50 rounded-xl space-y-3 sm:space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#CFCFCF] flex items-center justify-center text-[#734C1D]">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B]">Sezonowe materiały</h3>
            <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
              Tworzymy serie duragów wykonanych z sezonowych tkanin dopasowanych do pogody: Durag Bydgoszcz z przewiewnego cupro, Durag Żyrardów z naturalnego polskiego lnu oraz Durag Stalowa Wola z krepy satynowej Mirella.
            </p>
          </div>
        </div>
      </section>

      {/* "O NAS" Section with photo carousel */}
      <section className="bg-[#0D0D0B] text-white py-16 sm:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Interactive Image Carousel */}
            <AboutStoryCarousel />

            {/* Content Text */}
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
    </div>
  );
}
