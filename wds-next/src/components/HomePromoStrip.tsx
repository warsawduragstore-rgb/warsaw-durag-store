'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePromoStrip() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#141416] border-y border-[#1E1E22] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
            {t.promoStripTitle}
          </h3>
          <p className="text-[14px] text-[#A3A09B] mt-1 font-normal leading-relaxed">
            {t.promoStripDesc}
          </p>
        </div>

        <Link
          href="#kolekcja"
          className="w-full md:w-auto inline-flex items-center justify-center bg-[#ECEAE7] text-[#0B0B0C] hover:bg-white px-7 py-3 text-[14px] font-medium transition-colors shrink-0"
        >
          {t.promoStripCta}
        </Link>
      </div>
    </section>
  );
}
