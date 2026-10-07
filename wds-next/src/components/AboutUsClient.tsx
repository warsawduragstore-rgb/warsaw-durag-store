'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { MapPin, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutUsClient() {
  const { isEn } = useLanguage();

  return (
    <div className="bg-[#FAF9F7] text-[#0D0D0B] min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#0D0D0B] text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/media/wds/czarno-biale-3.jpg"
            alt="Warsaw Durag Store"
            fill
            className="object-cover grayscale"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-tight mb-6">
            {isEn ? 'How Warsaw Durag Store was born' : 'Jak powstał Warsaw Durag Store?'}
          </h1>
          <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? 'A venture created together by twin brothers. We started with the very first hand-sewn pieces, determined to offer durags made from genuine premium materials with the correct cut: flat exterior seams and 100 cm straps.'
              : 'Projekt tworzony wspólnie przez braci bliźniaków. Zaczynaliśmy od sprzedaży pierwszych sztuk, chcąc stworzyć duragi z porządnych materiałów o właściwym kroju: z zewnętrznym szwem i długimi pasami.'}
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
            alt={isEn ? "Warsaw Durag Store founders — twin brothers" : "Założyciele Warsaw Durag Store — bracia bliźniacy"}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0D0D0B]/85 border-t border-white/10 flex justify-between items-center text-xs text-white">
            <span>{isEn ? 'Founders of Warsaw Durag Store — Twin Brothers' : 'Założyciele Warsaw Durag Store — bracia bliźniacy'}</span>
            <span className="text-[#C8794B]">{isEn ? 'Warsaw, Poland' : 'Warszawa'}</span>
          </div>
        </div>

        {/* Section 1: The Spark */}
        <section className="space-y-4 border-l-2 border-[#0D0D0B] pl-6 sm:pl-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            {isEn ? 'The Częstochowa Trip & Baby Keem' : 'Wycieczka do Częstochowy i Baby Keem'}
          </h2>
          <div className="space-y-4 text-base text-[#3B3C40] leading-relaxed">
            <p>
              {isEn
                ? 'We tell this story to anyone who asks where the idea for a Polish durag brand came from. On our drive back from Jasna Góra in Częstochowa, we were listening to Baby Keem’s track "Durag Activity".'
                : 'Opowiadamy tę historię każdemu, kto zapyta, skąd wziął się pomysł na duragi w Polsce. W drodze powrotnej z Jasnej Góry słuchaliśmy utworu Baby Keema „Durag Activity”.'}
            </p>
            <p>
              {isEn
                ? 'That was when we realized the complete absence on the European market of durags tailored properly — without scratchy synthetic polyester that dehydrates hair, without inside seams that dig into the forehead, and without frustratingly short straps. We decided to take craftsmanship into our own hands.'
                : 'Wtedy zwróciliśmy uwagę na brak na rynku duragów o właściwym kroju — bez sztucznego poliestru elektryzującego włosy, bez szwów wbijających się w czoło i ze zbyt krótkimi pasami. Postanowiliśmy sami zadbać o odpowiednie materiały i konstrukcję.'}
            </p>
          </div>
        </section>

        {/* Section 2: Zero to Hundred */}
        <section className="space-y-4 border-l-2 border-[#0D0D0B] pl-6 sm:pl-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            {isEn ? 'From First Orders to a Dedicated Workshop' : 'Od pierwszych zamówień do regularnej pracowni'}
          </h2>
          <div className="space-y-4 text-base text-[#3B3C40] leading-relaxed">
            <p>
              {isEn
                ? 'We started with single pieces, individually inspecting and packing each order at our desk. Today we fulfill regular orders for clients across Poland and Europe, staying true to our handmade quality.'
                : 'Zaczynaliśmy od pojedynczych egzemplarzy, pakując je osobiście przy biurku. Dziś regularnie realizujemy zamówienia dla klientów w Polsce i za granicą.'}
            </p>
          </div>
        </section>

        {/* Studio Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="relative aspect-[3/4] border border-[#0D0D0B] overflow-hidden bg-[#EAE6DF]">
            <Image
              src="/media/wds/wyszol1126.jpg"
              alt="Model w duragu Warsaw Durag Store"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="relative aspect-[3/4] border border-[#0D0D0B] overflow-hidden bg-[#EAE6DF]">
            <Image
              src="/media/wds/wyszol0202.jpg"
              alt="Zbliżenie na jedwab morwowy"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="relative aspect-[3/4] border border-[#0D0D0B] overflow-hidden bg-[#EAE6DF]">
            <Image
              src="/media/wds/DSC0653.jpg"
              alt="Durag Warsaw Durag Store"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
        </div>

        {/* Section 3: Material Philosophy */}
        <section className="bg-[#F6F5F2] border border-[#0D0D0B] p-6 sm:p-10 space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-medium">
            {isEn ? 'Materials & Construction' : 'Materiały i konstrukcja'}
          </h3>
          <p className="text-base text-[#3B3C40] leading-relaxed">
            {isEn
              ? 'We sew with 100% natural 19 Momme mulberry silk, high-density smooth satin, and rich velvet. Every piece features an exterior flat seam to eliminate wake-up forehead marks and extra-wide 100 cm straps for comfortable, secure tie-downs.'
              : 'Szyjemy z naturalnego jedwabiu morwowego, satyny i weluru. Każdy model posiada zewnętrzny szew oraz pasy o długości 100 cm, ułatwiające stabilne wiązanie.'}
          </p>
        </section>

        {/* Section 4: Local Pickup in Warsaw */}
        <section className="bg-[#0D0D0B] text-white p-6 sm:p-10 border border-[#0D0D0B] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-white">
              {isEn ? 'Local Pickup in Warsaw' : 'Odbiór osobisty w Warszawie'}
            </h3>
            <span className="text-xs text-gray-400">{isEn ? 'Warsaw, Poland' : 'Warszawa'}</span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            {isEn
              ? 'We offer free local pickup in Warsaw by prior appointment:'
              : 'Oferujemy możliwość bezpłatnego odbioru osobistego po uprzednim umówieniu terminu:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-white/15 p-5 bg-[#141412] space-y-2">
              <div className="flex items-center gap-2 text-[#C8794B] text-xs font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Ochota / Śródmieście</span>
              </div>
              <p className="text-xs text-gray-300">
                {isEn ? 'ul. Włodarzewska 4 or by phone appointment.' : 'ul. Włodarzewska 4 lub po wcześniejszym umówieniu telefonicznym.'}
              </p>
            </div>

            <div className="border border-white/15 p-5 bg-[#141412] space-y-2">
              <div className="flex items-center gap-2 text-[#C8794B] text-xs font-semibold">
                <MapPin className="w-4 h-4" />
                <span>{isEn ? 'Appointment Location' : 'Punkt po umówieniu'}</span>
              </div>
              <p className="text-xs text-gray-300">
                {isEn
                  ? 'After placing your order, we will reach out to arrange a convenient time and pickup spot.'
                  : 'Po złożeniu zamówienia skontaktujemy się w celu ustalenia dogodnego miejsca i godziny.'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-current text-[#C8794B]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <a href="https://instagram.com/warsawduragstore" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                @warsawduragstore
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C8794B]" />
              <span>kontakt@warsawduragstore.com</span>
            </div>
          </div>
        </section>

        {/* Section 5: Collab & CTA */}
        <section className="border border-[#0D0D0B] p-8 sm:p-12 text-center bg-white space-y-5">
          <h3 className="font-serif text-2xl sm:text-3xl font-medium">
            {isEn ? 'Explore the Durag Collection' : 'Zobacz ofertę duragów'}
          </h3>
          <p className="text-base text-[#3B3C40] max-w-lg mx-auto leading-relaxed">
            {isEn
              ? 'Handmade in Warsaw from mulberry silk, satin and velvet.'
              : 'Szyte ręcznie w Warszawie z jedwabiu, satyny i weluru.'}
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-4">
            <Link
              href="/kolekcja/all"
              className="bg-[#0D0D0B] text-white hover:bg-[#C8794B] px-8 py-3.5 text-sm font-semibold transition-colors"
            >
              {isEn ? 'Shop all durags' : 'Zobacz duragi'}
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
