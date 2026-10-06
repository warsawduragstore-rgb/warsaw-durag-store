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
import { ChevronRight, Star } from 'lucide-react';
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

const FABRIC_CATEGORIES = [
  {
    slug: 'silk',
    title: 'Jedwab morwowy',
    desc: 'Naturalny jedwab 19 Momme z Milanówka. Redukuje tarcie i utrzymuje nawilżenie włosów.',
  },
  {
    slug: 'satin',
    title: 'Satyna',
    desc: 'Gładka tkanina o wysokim poślizgu do codziennego noszenia i ochrony fal 360.',
  },
  {
    slug: 'velvet',
    title: 'Welur',
    desc: 'Mięsisty aksamit o wysokiej gramaturze do kompresji i utrwalania fal 360.',
  },
  {
    slug: 'seasonal',
    title: 'Tkaniny sezonowe',
    desc: 'Lekkie serie dostosowane do pory roku, w tym naturalny len i krepa.',
  },
  {
    slug: 'accessories',
    title: 'Akcesoria',
    desc: 'Szczotki z naturalnego włosia dzika oraz czepki kompresyjne.',
  },
];

const FAQS_DATA = [
  {
    q: 'Kiedy paczka zostanie wysłana?',
    a: 'Wysyłka z Warszawy w 1–2 dni robocze. Wszystkie przesyłki do Paczkomatów InPost i kurierem na terenie Polski są darmowe.',
  },
  {
    q: 'Jak działa promocja: kup 2, trzeci losowy durag za 1 zł?',
    a: 'Wybierz dowolne dwa duragi do koszyka. Trzeci losowy model zostanie automatycznie dodany za 1 zł przy kasie.',
  },
  {
    q: 'Czym charakteryzuje się jedwab morwowy 19 Momme?',
    a: 'Model Milanówek wykonany jest w 100% z naturalnego jedwabiu morwowego o gramaturze 19 Momme. Gładka struktura chroni włosy przed łamaniem i redukuje puszenie.',
  },
  {
    q: 'Czy durag zostawia odciski na czole?',
    a: 'Nie. Wszystkie duragi szyjemy z autorskim zewnętrznym szwem i szerokimi pasami o długości 100 cm, co eliminuje odciski po całej nocy.',
  },
  {
    q: 'Gdzie możliwy jest odbiór osobisty w Warszawie?',
    a: 'Odbiór osobisty w Warszawie po umówieniu przy ul. Włodarzewskiej 4 na Ochocie.',
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
      {/* Hero Section: Factual, Clean, Real Product Photography */}
      <section className="relative min-h-[75vh] sm:min-h-[82vh] flex items-center justify-center overflow-hidden border-b border-[#1E1E22]">
        <HeroVideo poster="/media/wds/wyszol1126.jpg" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-24">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.1] mb-5">
            Duragi szyte w Warszawie z jedwabiu morwowego
          </h1>

          <p className="text-base sm:text-lg text-[#ECEAE7] font-normal max-w-xl mx-auto leading-relaxed mb-8">
            Szyte ręcznie w Warszawie z naturalnego jedwabiu morwowego, satyny i weluru. Bezodciskowy szew zewnętrzny i długie pasy.
          </p>

          <div className="flex items-center justify-center">
            <Link
              href="#kolekcja"
              className="bg-white text-[#0B0B0C] px-8 py-3.5 text-[15px] font-medium tracking-[0.02em] transition-colors hover:bg-[#ECEAE7] text-center"
            >
              Zobacz duragi
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Brand Facts Bar */}
      <TrustBanner />

      {/* Bestsellers Section (No eyebrow, direct heading) */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6" id="bestsellery">
        <div className="flex items-end justify-between mb-8 sm:mb-10 pb-3 border-b border-[#1E1E22]">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            Bestsellery
          </h2>
          <Link
            href="/kolekcja/all"
            className="text-[13px] font-medium text-[#A3A09B] hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Wszystkie <span className="tabular-nums">({products.length})</span></span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestsellers.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 2} />
          ))}
        </div>
      </section>

      {/* Promo Strip: Kup 2, trzeci losowy durag za 1 zł */}
      <section className="bg-[#141416] border-y border-[#1E1E22] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
              Kup 2, trzeci losowy durag za 1 zł
            </h3>
            <p className="text-[14px] text-[#A3A09B] mt-1 font-normal leading-relaxed">
              Wybierz dwa dowolne duragi do koszyka, a trzeci losowy model otrzymasz za 1 zł. Rabat nalicza się automatycznie.
            </p>
          </div>

          <Link
            href="#kolekcja"
            className="w-full md:w-auto inline-flex items-center justify-center bg-[#ECEAE7] text-[#0B0B0C] hover:bg-white px-7 py-3 text-[14px] font-medium transition-colors shrink-0"
          >
            Zobacz duragi
          </Link>
        </div>
      </section>

      {/* Materials / Fabrics Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6" id="kategorie">
        <div className="mb-8 sm:mb-10 pb-3 border-b border-[#1E1E22]">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-1">
            Wybierz tkaninę
          </h2>
          <p className="text-[14px] text-[#A3A09B]">
            Materiały: jedwab, satyna, welur, tkaniny sezonowe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {FABRIC_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kolekcja/${cat.slug}`}
              className="bg-[#111113] p-5 border border-[#1E1E22] hover:border-[#787570] transition-colors flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif text-[18px] text-white mb-2 font-medium">
                  {cat.title}
                </h3>
                <p className="text-[13px] text-[#A3A09B] leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#1E1E22] flex items-center justify-between text-[13px] font-medium text-[#ECEAE7]">
                <span>Przeglądaj</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Full Catalog with Filters */}
      <HomeProductCatalog initialProducts={products} />

      {/* Editorial Split: Genuine Product Craft */}
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

          <div className="space-y-5">
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium leading-tight">
              Naturalny jedwab morwowy 19 Momme z Milanówka
            </h2>

            <p className="text-[15px] sm:text-base text-[#A3A09B] font-normal leading-relaxed">
              Model Milanówek szyjemy z naturalnego jedwabiu morwowego o gramaturze 19 Momme. Gładka struktura włókna ogranicza tarcie, zapobiega łamaniu włosów i utrzymuje nawilżenie.
            </p>

            <p className="text-[15px] sm:text-base text-[#A3A09B] font-normal leading-relaxed">
              Pasy o długości 100 cm pozwalają na stabilne, komfortowe wiązanie bez ucisku na czoło i skronie.
            </p>

            <div className="pt-2">
              <Link
                href="/kolekcja/silk"
                className="inline-block bg-[#ECEAE7] text-[#0B0B0C] hover:bg-white px-7 py-3 text-[14px] font-medium transition-colors"
              >
                Zobacz duragi z jedwabiu
              </Link>
            </div>
          </div>
        </div>

        {/* Real photo gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
              <Image src="/media/wds/wyszol0202.jpg" alt="Durag na głowie modela" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
              <Image src="/media/wds/DSC0653.jpg" alt="Durag jedwabny z bliska" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
              <Image src="/media/wds/czarno-biale-3.jpg" alt="Detal szwu duraga" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
              <Image src="/media/wds/DSC07653.jpg" alt="Wiązanie duraga" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-14 sm:py-20 border-t border-[#1E1E22] bg-[#0E0E10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Opinie
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reviews.slice(0, 4).map((rev) => (
              <div key={rev.id} className="bg-[#111113] p-5 border border-[#1E1E22] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-3 text-[#C8794B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C8794B]" />
                    ))}
                  </div>
                  <p className="text-[14px] text-[#ECEAE7] leading-relaxed mb-4">
                    "{rev.content}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1E1E22] flex items-center justify-between text-[13px]">
                  <span className="font-medium text-white">{rev.author}</span>
                  <span className="text-[#787570]">{rev.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Workshop */}
      <section className="py-14 sm:py-20 border-t border-[#1E1E22]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            O nas
          </h2>
          <p className="text-[15px] sm:text-base text-[#A3A09B] leading-relaxed">
            Warsaw Durag Store powstał w 2020 roku w Warszawie. Duragi szyjemy ręcznie z naturalnego jedwabiu morwowego, satyny i weluru, z zewnętrznym bezodciskowym szwem i pasami o długości 100 cm.
          </p>
          <p className="text-[13px] text-[#787570]">
            Odbiór osobisty w Warszawie po umówieniu (ul. Włodarzewska 4).
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 border-t border-[#1E1E22]">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            Często zadawane pytania
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => (
            <div key={idx} className="bg-[#111113] border border-[#1E1E22] p-5">
              <h3 className="text-[15px] font-medium text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-[14px] text-[#A3A09B] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
