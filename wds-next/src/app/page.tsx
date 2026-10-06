import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import TrustBanner from '@/components/TrustBanner';
import HomeProductCatalog from '@/components/HomeProductCatalog';
import ProductCard from '@/components/ProductCard';
import HeroVideo from '@/components/HeroVideo';
import { fetchProducts, fetchBestsellers } from '@/lib/products-db';
import { fetchCustomerReviews } from '@/lib/supabase';
import { ArrowRight, ChevronRight, Sparkles, Star } from 'lucide-react';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Warsaw Durag Store — Jedyne Duragi Szyte w Polsce | 100% Jedwab Morwowy 19 Momme',
  description:
    'Pierwszy polski butik z duragami z prawdziwego jedwabiu morwowego 19 Momme, aksamitu i satyny. Płaski szew na zewnątrz, pasy 100 cm. Szycie w Warszawie, darmowy Paczkomat 0 zł i wysyłka w 24h.',
  alternates: {
    canonical: SITE_URL,
  },
};

const FABRIC_CATEGORIES = [
  {
    slug: 'silk',
    title: 'Jedwab Morwowy',
    subtitle: '19 Momme Milanówek',
    desc: 'Naturalne białkowe włókno. Redukuje tarcie, zapobiega łamaniu włosów i utrzymuje nawilżenie.',
  },
  {
    slug: 'satin',
    title: 'Satyna Premium',
    subtitle: 'Bestseller',
    desc: 'Gładka, trwała mikrofibra o wysokim poślizgu do codziennego noszenia i ochrony fal 360.',
  },
  {
    slug: 'velvet',
    title: 'Welur Aksamitny',
    subtitle: 'Maksymalna kompresja',
    desc: 'Mięsisty aksamit o głębokiej barwie, stworzony do układania i utrwalania fal 360.',
  },
  {
    slug: 'seasonal',
    title: 'Serie Sezonowe',
    subtitle: 'Limitowane dropy',
    desc: 'Autorskie tkaniny przystosowane do pory roku: oddychający polski len, cupro i krepa.',
  },
  {
    slug: 'accessories',
    title: 'Akcesoria & Waves',
    subtitle: 'Pielęgnacja fal 360',
    desc: 'Naturalne szczotki z włosia dzika oraz oddychające czepki kompresyjne.',
  },
];

const FAQS_DATA = [
  {
    q: 'Kiedy paczka zostanie wysłana?',
    a: 'Wszystkie zamówienia pakujemy w warszawskiej pracowni i nadajemy w ciągu 24 godzin. Przesyłki do Paczkomatu InPost trafiają zazwyczaj w 1 dzień roboczy. Dostawa w Polsce jest bezpłatna (0 zł).',
  },
  {
    q: 'Jak działa promocja 2+1 (trzeci durag za 1 zł)?',
    a: 'Wybierz dowolne 2 duragi do koszyka. Nasz system automatycznie dobierze 3. losowy model z puli prezentowej w cenie 1 PLN (0.25 EUR). Rabat nalicza się automatycznie.',
  },
  {
    q: 'Czym różni się jedwab morwowy 19 Momme od satyny?',
    a: 'Model Milanówek wykonany jest w 100% z naturalnego jedwabiu morwowego o gramaturze 19 Momme. W przeciwieństwie do włókien syntetycznych nie pochłania sebum ani odżywek, redukuje puszenie i jest w 100% hipoalergiczny.',
  },
  {
    q: 'Czy durag zostawia odciski na czole po całej nocy?',
    a: 'Nie. Wszystkie nasze duragi mają autorski krój ze szwem wyprowadzonym na zewnątrz oraz szerokie pasy o długości 100 cm, które równomiernie rozkładają nacisk.',
  },
  {
    q: 'Gdzie możliwy jest odbiór osobisty w Warszawie?',
    a: 'Zamówienia można odebrać osobiście po wcześniejszym umówieniu na Ochocie (ul. Włodarzewska 4) lub w Śródmieściu.',
  },
];

export default async function HomePage() {
  const [products, bestsellers, reviews] = await Promise.all([
    fetchProducts(),
    fetchBestsellers(4),
    fetchCustomerReviews(),
  ]);

  return (
    <div className="bg-[#0B0B0C] text-[#FAFAF9] min-h-screen selection:bg-[#C8794B] selection:text-[#0B0B0C]">
      {/* Hero Section: Authentic, Raw, High-fashion */}
      <section className="relative min-h-[75vh] sm:min-h-[82vh] flex items-center justify-center overflow-hidden border-b border-[#1E1E22]">
        <HeroVideo poster="/media/wds/wyszol1126.jpg" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-24">
          <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#C8794B] mb-5">
            Warszawa • 100% Jedwab Morwowy 19 Momme
          </p>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white leading-[1.08] mb-6">
            Jedyne duragi<br />
            szyte w Polsce.
          </h1>

          <p className="text-sm sm:text-base text-[#ECEAE7]/85 font-light max-w-xl mx-auto leading-relaxed mb-9">
            Płaski szew na zewnątrz — zero śladów na czole po nocy. Pasy 100 cm. Naturalny jedwab z Milanówka, luksusowy aksamit i satyna.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-sm mx-auto sm:max-w-none">
            <Link
              href="#bestsellery"
              className="w-full sm:w-auto bg-[#C8794B] text-[#0B0B0C] px-9 py-3.5 text-xs font-mono font-bold uppercase tracking-[0.18em] transition-colors hover:bg-white text-center cursor-pointer"
            >
              Kup teraz
            </Link>
            <Link
              href="#kolekcja"
              className="w-full sm:w-auto bg-transparent border border-[#333338] text-white px-8 py-3.5 text-xs font-mono uppercase tracking-[0.18em] transition-colors hover:border-[#C8794B] hover:text-[#C8794B] text-center cursor-pointer"
            >
              Zobacz kolekcję
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Brand Promises */}
      <TrustBanner />

      {/* Bestsellers Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6" id="bestsellery">
        <div className="flex items-end justify-between mb-8 sm:mb-10 pb-4 border-b border-[#1E1E22]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8794B] block mb-1">
              Najczęściej wybierane
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
              Bestsellery
            </h2>
          </div>
          <Link
            href="/kolekcja/all"
            className="text-xs font-mono uppercase tracking-wider text-[#A3A09B] hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Wszystkie ({products.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestsellers.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 2} />
          ))}
        </div>
      </section>

      {/* Promo 2+1 Strip */}
      <section className="bg-[#141416] border-y border-[#1E1E22] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#C8794B]/10 border border-[#C8794B]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#C8794B]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8794B] font-bold block mb-0.5">
                Zestaw 2 + 1
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-white">
                Kup 2 dowolne duragi, odbierz 3. model za 1 zł.
              </h3>
              <p className="text-xs text-[#A3A09B] mt-0.5 font-light">
                Rabat nalicza się automatycznie w koszyku. Darmowa wysyłka InPost w całej Polsce.
              </p>
            </div>
          </div>

          <Link
            href="#kolekcja"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#C8794B] text-[#0B0B0C] hover:bg-white px-7 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            <span>Wybierz duragi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Fabric Guide Cards */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6" id="kategorie">
        <div className="mb-8 sm:mb-10 pb-4 border-b border-[#1E1E22]">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8794B] block mb-1">
            Materiały
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
            Wybierz tkaninę
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {FABRIC_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kolekcja/${cat.slug}`}
              className="bg-[#111113] p-5 border border-[#1E1E22] hover:border-[#C8794B] transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-mono uppercase text-[#C8794B] block mb-2">
                  {cat.subtitle}
                </span>
                <h3 className="font-serif text-base text-white mb-2 font-normal">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#A3A09B] font-light leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#1E1E22] flex items-center justify-between text-[10px] font-mono uppercase text-[#787570]">
                <span>Przeglądaj</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Full Catalog with Filters */}
      <HomeProductCatalog initialProducts={products} />

      {/* Editorial Lookbook Split */}
      <section className="py-16 sm:py-24 border-t border-[#1E1E22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] bg-[#111113] border border-[#1E1E22] overflow-hidden">
            <Image
              src="/media/wds/wyszol1126.jpg"
              alt="Durag Milanówek 100% Jedwab Morwowy"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>

          <div className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C8794B] block">
              100% Jedwab Milanówek 19 Momme
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
              Prawdziwy jedwab.<br />
              Bez kompromisów.
            </h2>

            <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
              Nasz Durag Milanówek to jedyny w Polsce model wykonany z naturalnego jedwabiu morwowego o gramaturze 19 Momme. Gładka struktura włókna ogranicza tarcie, zapobiega łamaniu włosów i utrzymuje naturalną wilgoć w skórze głowy.
            </p>

            <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
              Pasy o długości 100 cm i szerokości 8 cm pozwalają na stabilne, komfortowe podwójne wiązanie bez ucisku na skronie.
            </p>

            <div className="pt-2">
              <Link
                href="/kolekcja/silk"
                className="inline-block bg-[#C8794B] text-[#0B0B0C] hover:bg-white px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Sprawdź serię jedwabną
              </Link>
            </div>
          </div>
        </div>

        {/* Lookbook gallery grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
              <Image src="/media/wds/wyszol0202.jpg" alt="Warsaw Durag Store Sesja 01" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
              <Image src="/media/wds/DSC0653.jpg" alt="Warsaw Durag Store Sesja 02" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
              <Image src="/media/wds/czarno-biale-3.jpg" alt="Warsaw Durag Store Sesja 03" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
              <Image src="/media/wds/DSC07653.jpg" alt="Warsaw Durag Store Sesja 04" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-14 sm:py-20 border-t border-[#1E1E22] bg-[#0E0E10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8794B] block mb-1">
              Opinie
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
              Głosy waverów
            </h2>
            <p className="text-xs text-[#787570] mt-2 font-mono">
              ★ 5.0 / 5.0 • Ponad 1500 zamówień w Polsce i Europie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reviews.slice(0, 4).map((rev) => (
              <div key={rev.id} className="bg-[#111113] p-5 border border-[#1E1E22] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-3 text-[#C8794B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#C8794B]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#ECEAE7] font-light leading-relaxed mb-4">
                    "{rev.content}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1E1E22] flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{rev.author}</span>
                  <span className="text-[10px] text-[#787570]">{rev.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Workshop */}
      <section className="py-14 sm:py-20 border-t border-[#1E1E22]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C8794B] block">
            Pracownia • Warszawa od 2020
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
            O nas
          </h2>
          <p className="text-xs sm:text-sm text-[#A3A09B] font-light leading-relaxed">
            Warsaw Durag Store powstał w 2020 roku w Warszawie. Zamiast masowej produkcji z sieciówek, postawiliśmy na rzemieślnicze szycie, autorski krój z zewnętrznym szwem i bezkompromisowe tkaniny z Milanówka.
          </p>
          <p className="text-xs text-[#787570] font-mono">
            Odbiór osobisty: Warszawa, ul. Włodarzewska 4 (po umówieniu) • Instagram: @warsawduragstore
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 border-t border-[#1E1E22]">
        <div className="mb-10 text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8794B] block mb-1">
            Pomoc
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
            Często zadawane pytania
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => (
            <div key={idx} className="bg-[#111113] border border-[#1E1E22] p-5">
              <h3 className="font-mono text-xs font-bold text-white mb-2 uppercase">
                {faq.q}
              </h3>
              <p className="text-xs text-[#A3A09B] font-light leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
