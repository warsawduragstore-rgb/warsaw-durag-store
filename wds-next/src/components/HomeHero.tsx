'use client';

import React from 'react';
import Link from 'next/link';
import HeroVideo from '@/components/HeroVideo';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeHero() {
  const { t } = useLanguage();

  return (
    <section className="hero-section relative min-h-[75vh] sm:min-h-[82vh] flex items-center justify-center overflow-hidden border-b border-[#1E1E22]">
      <HeroVideo poster="/media/wds/wyszol1126.jpg" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-24">
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.1] mb-5">
          {t.heroTitle}
        </h1>

        <p className="text-base sm:text-lg text-[#ECEAE7] font-normal max-w-xl mx-auto leading-relaxed mb-8">
          {t.heroDesc}
        </p>

        <div className="flex items-center justify-center">
          <Link
            href="#kolekcja"
            className="bg-white text-[#0B0B0C] px-8 py-3.5 text-[15px] font-medium tracking-[0.02em] transition-colors hover:bg-[#ECEAE7] text-center"
          >
            {t.heroCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
