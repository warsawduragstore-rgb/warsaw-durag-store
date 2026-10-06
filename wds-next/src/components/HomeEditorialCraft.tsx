'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeEditorialCraft() {
  const { isEn } = useLanguage();

  return (
    <section className="py-16 sm:py-24 border-t border-[#1E1E22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative aspect-[4/5] bg-[#111113] border border-[#1E1E22] overflow-hidden">
          <Image
            src="/media/wds/wyszol1126.jpg"
            alt={isEn ? 'Durag Milanówek 100% Mulberry Silk' : 'Durag Milanówek 100% Jedwab Morwowy'}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="lazy"
          />
        </div>

        <div className="space-y-5">
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium leading-tight">
            {isEn
              ? 'Natural 19 Momme Mulberry Silk from Milanówek'
              : 'Naturalny jedwab morwowy 19 Momme z Milanówka'}
          </h2>

          <p className="text-[15px] sm:text-base text-[#A3A09B] font-normal leading-relaxed">
            {isEn
              ? 'The Milanówek model is sewn by hand in Warsaw from genuine 19 Momme mulberry silk. Its ultra-smooth natural fiber structure dramatically reduces friction, prevents split ends and preserves hair moisture.'
              : 'Model Milanówek szyjemy z naturalnego jedwabiu morwowego o gramaturze 19 Momme. Gładka struktura włókna ogranicza tarcie, zapobiega łamaniu włosów i utrzymuje nawilżenie.'}
          </p>

          <p className="text-[15px] sm:text-base text-[#A3A09B] font-normal leading-relaxed">
            {isEn
              ? 'Our signature 100 cm straps allow secure, comfortable tie-downs without unwanted forehead pressure or wake-up marks.'
              : 'Pasy o długości 100 cm pozwalają na stabilne, komfortowe wiązanie bez ucisku na czoło i skronie.'}
          </p>

          <div className="pt-2">
            <Link
              href="/kolekcja/silk"
              className="inline-block bg-[#ECEAE7] text-[#0B0B0C] hover:bg-white px-7 py-3 text-[14px] font-medium transition-colors"
            >
              {isEn ? 'Explore silk durags' : 'Zobacz duragi z jedwabiu'}
            </Link>
          </div>
        </div>
      </div>

      {/* Real photo gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
            <Image src="/media/wds/wyszol0202.jpg" alt="Model wearing durag" fill className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
            <Image src="/media/wds/DSC0653.jpg" alt="Silk durag close-up" fill className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
            <Image src="/media/wds/czarno-biale-3.jpg" alt="Seam craft detail" fill className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] border border-[#1E1E22] overflow-hidden">
            <Image src="/media/wds/DSC07653.jpg" alt="Durag tying detail" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
