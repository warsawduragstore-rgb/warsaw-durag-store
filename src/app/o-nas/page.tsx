import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { MapPin, Mail, ArrowRight } from 'lucide-react';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'O Nas — Historia Warsaw Durag Store | Atelier Warszawa',
  description:
    'Poznaj historię założycieli Warsaw Durag Store — braci bliźniaków z Warszawy. Od zera na Vinted i OLX do pierwszego w Polsce atelier z duragami ze 100% naturalnego jedwabiu morwowego 19 Momme.',
  alternates: {
    canonical: `${SITE_URL}/o-nas`,
  },
  openGraph: {
    title: 'O Nas — Historia Warsaw Durag Store',
    description:
      'Poznaj historię braci bliźniaków, którzy stworzyli pierwszy w Polsce profesjonalny sklep z duragami z prawdziwego jedwabiu.',
    url: `${SITE_URL}/o-nas`,
    images: [`${SITE_URL}/media/wds/wyszol1126.jpg`],
  },
};

export default function AboutUsPage() {
  return (
    <div className="bg-[#FAF9F7] text-[#0D0D0B] min-h-screen">
      {/* Hero Editorial Header */}
      <section className="bg-[#0D0D0B] text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/media/wds/czarno-biale-3.jpg"
            alt="Warsaw Durag Store Atelier Mood"
            fill
            className="object-cover grayscale"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#D9A87E] text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] font-bold block mb-4">
            [ WDS ATELIER MANIFESTO // 2026 ]
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-tight mb-6">
            Jak powstał Warsaw Durag Store?
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Projekt tworzony wspólnie przez braci bliźniaków. Zaczynaliśmy od zera na Vinted i OLX, kierowani jedną myślą: w Polsce musi być dostępne autentyczne, jakościowe nakrycie głowy dla waverów i pasjonatów streetwearu.
          </p>
        </div>
      </section>

      <TrustBanner />

      {/* Main Narrative Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-16">
        
        {/* Founders Photo Hero */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] border border-[#0D0D0B] overflow-hidden bg-[#0D0D0B]">
          <Image
            src="/assets/founders.jpg"
            alt="Założyciele Warsaw Durag Store — bracia bliźniacy"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0D0D0B]/85 border-t border-white/10 flex justify-between items-center text-[10px] sm:text-xs font-mono text-white">
            <span>[ ZAŁOŻYCIELE WDS ]</span>
            <span className="text-[#D9A87E]">WARSZAWA • EST. 2022</span>
          </div>
        </div>

        {/* Section 1: The Spark */}
        <section className="space-y-5 border-l-2 border-[#0D0D0B] pl-6 sm:pl-8">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#734C1D] font-bold block">
            [ 01 / HISTORIA POWSTANIA ]
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium">
            Wycieczka do Częstochowy i Baby Keem
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#3B3C40] font-light leading-relaxed">
            <p>
              Opowiadamy tę historię każdemu, kto zapyta, skąd wziął się pomysł na sprzedawanie duragów w Polsce. Możecie wierzyć lub nie, ale w drodze powrotnej z Jasnej Góry słuchaliśmy świeżego wówczas utworu Baby Keem'a <em>„Durag Activity”</em>. 
            </p>
            <p>
              Wtedy nas olśniło: nawet gdybyśmy bardzo chcieli, w całym kraju nie ma ani jednego wyspecjalizowanego miejsca, w którym można kupić porządny durag o właściwym kroju — bez tandetnego poliestru, który elektryzuje włosy, bez szwów wbijających się w czoło i ze zbyt krótkimi pasami. Zdaliśmy sobie sprawę, że ten problem musi dzielić jeszcze co najmniej garstka podobnych do nas osób.
            </p>
          </div>
        </section>

        {/* Section 2: Zero to Hundred */}
        <section className="space-y-5 border-l-2 border-[#0D0D0B] pl-6 sm:pl-8">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#734C1D] font-bold block">
            [ 02 / ROZWÓJ BEZ KOMPROMISÓW ]
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium">
            Od paczek na Vinted do setek waverów w całej Polsce
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#3B3C40] font-light leading-relaxed">
            <p>
              Zaczęliśmy od totalnego zera. Wystawialiśmy pierwsze egzemplarze na Vinted, OLX i grupach Facebooka. Każde pojedyncze zamówienie było dla nas ogromnym świętem. Pakowaliśmy je osobiście przy biurku, dbając o każdy szczegół i dołączając odręczne wiadomości.
            </p>
            <p>
              Dziś realizujemy setki zamówień miesięcznie dla klientów w całej Polsce i Europie. To niesamowita braterska przyjaźń, wzajemne zaufanie i bezkompromisowe podejście do jakości pozwoliły Warsaw Durag Store stać się marką pierwszego wyboru dla każdego, kto dba o swoje fale 360 i styl streetwear.
            </p>
          </div>
        </section>

        {/* Studio Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="relative aspect-[3/4] border border-[#0D0D0B] overflow-hidden bg-[#EAE6DF]">
            <Image
              src="/media/wds/wyszol1126.jpg"
              alt="Model w duragu WDS na warszawskiej ulicy"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="relative aspect-[3/4] border border-[#0D0D0B] overflow-hidden bg-[#EAE6DF]">
            <Image
              src="/media/wds/wyszol0202.jpg"
              alt="Zbliżenie na splot jedwabiu morwowego"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="relative aspect-[3/4] border border-[#0D0D0B] overflow-hidden bg-[#EAE6DF]">
            <Image
              src="/media/wds/DSC0653.jpg"
              alt="Stylizacja z duragiem Warsaw Durag Store"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
        </div>

        {/* Section 3: Material Philosophy */}
        <section className="bg-[#F6F5F2] border border-[#0D0D0B] p-6 sm:p-10 space-y-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#734C1D] font-bold block">
            [ 03 / FILOZOFIA TKANIN ]
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium">
            Dlaczego cena wynika wyłącznie z materiału?
          </h3>
          <p className="text-sm sm:text-base text-[#3B3C40] font-light leading-relaxed">
            Chcemy, aby nasze duragi były dostępne dla każdego — stąd różne progi cenowe w ofercie. Różnica w cenie wynika wyłącznie z kosztu surowca: naturalnego jedwabiu morwowego 19 Momme z Milanówka, luksusowej satyny czy grubego weluru kompresyjnego. Każdy model, bez wyjątku, szyty jest z tą samą rzemieślniczą precyzją, zewnętrznym szwem bezodciskowym i 100-centymetrowymi pasami.
          </p>
        </section>

        {/* Section 4: Local Pickup in Warsaw */}
        <section className="bg-[#0D0D0B] text-white p-6 sm:p-10 border border-[#0D0D0B] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#D9A87E] font-bold">
              [ 04 / ODBIÓR OSOBISTY W WARSZAWIE ]
            </span>
            <span className="text-xs font-mono text-gray-400">WARSZAWA 24H</span>
          </div>

          <p className="text-sm text-gray-300 font-light leading-relaxed">
            Dla osób z Warszawy oferujemy bezpłatny odbiór osobisty w dogodnych punktach miasta:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-white/15 p-5 bg-[#141412] space-y-2">
              <div className="flex items-center gap-2 text-[#D9A87E] font-mono text-xs font-bold">
                <MapPin className="w-4 h-4" />
                <span>OCHOTA / CENTRUM</span>
              </div>
              <p className="text-xs text-gray-300 font-light">
                <strong>ul. Włodarzewska 4</strong> (Szczęśliwice / Ochota) lub po wcześniejszym umówieniu w Śródmieściu.
              </p>
            </div>

            <div className="border border-white/15 p-5 bg-[#141412] space-y-2">
              <div className="flex items-center gap-2 text-[#D9A87E] font-mono text-xs font-bold">
                <MapPin className="w-4 h-4" />
                <span>PRAGA POŁUDNIE</span>
              </div>
              <p className="text-xs text-gray-300 font-light">
                Salon barberski <strong>Eclipse Barber</strong> przy Rondzie Waszyngtona.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-current text-[#D9A87E]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <a href="https://instagram.com/warsawduragstore" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                @warsawduragstore
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D9A87E]" />
              <span>support@warsawduragstore.pl</span>
            </div>
          </div>
        </section>

        {/* Section 5: Collab & CTA */}
        <section className="border border-[#0D0D0B] p-8 sm:p-12 text-center bg-white space-y-5">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#734C1D] font-bold block">
            [ WSPÓŁPRACA & PROMO ]
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium">
            Tworzysz w muzyce, sporcie lub modzie?
          </h3>
          <p className="text-sm text-[#3B3C40] font-light max-w-lg mx-auto leading-relaxed">
            Jesteśmy otwarci na sesje, collaby i projekty społecznościowe. Napisz do nas na Instagramie lub mailowo — za ciekawe, solidne promo zawsze chętnie podsyłamy pakę z atelier.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-4">
            <Link
              href="/kolekcja/all"
              className="bg-[#0D0D0B] text-white hover:bg-[#734C1D] px-8 py-4 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors"
            >
              [ ZOBACZ WSZYSTKIE PRODUKTY ]
            </Link>
            <Link
              href="/blog"
              className="bg-transparent border border-[#0D0D0B] text-[#0D0D0B] hover:bg-[#0D0D0B] hover:text-white px-8 py-4 text-xs font-mono font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              [ CZYTAJ BLOG ]
            </Link>
          </div>
        </section>

      </article>
    </div>
  );
}
