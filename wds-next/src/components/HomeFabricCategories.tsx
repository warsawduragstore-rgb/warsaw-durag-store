'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeFabricCategories() {
  const { isEn, t } = useLanguage();

  const categories = [
    {
      slug: 'silk',
      title: isEn ? 'Mulberry Silk' : 'Jedwab morwowy',
      desc: isEn
        ? 'Natural 19 Momme mulberry silk. Eliminates friction and locks in hair hydration.'
        : 'Naturalny jedwab 19 Momme z Milanówka. Redukuje tarcie i utrzymuje nawilżenie włosów.',
    },
    {
      slug: 'satin',
      title: isEn ? 'Satin' : 'Satyna',
      desc: isEn
        ? 'Smooth, high-glide textile for everyday styling and 360 wave protection.'
        : 'Gładka tkanina o wysokim poślizgu do codziennego noszenia i ochrony fal 360.',
    },
    {
      slug: 'velvet',
      title: isEn ? 'Velvet' : 'Welur',
      desc: isEn
        ? 'Dense, heavyweight velvet offering firm compression for defining 360 waves.'
        : 'Mięsisty aksamit o wysokiej gramaturze do kompresji i utrwalania fal 360.',
    },
    {
      slug: 'seasonal',
      title: isEn ? 'Seasonal Fabrics' : 'Tkaniny sezonowe',
      desc: isEn
        ? 'Limited summer and winter weaves including pure Polish linen and cupro.'
        : 'Lekkie serie dostosowane do pory roku, w tym naturalny len i krepa.',
    },
    {
      slug: 'accessories',
      title: isEn ? 'Accessories' : 'Akcesoria',
      desc: isEn
        ? 'Natural boar bristle wave brushes and compression wave caps.'
        : 'Szczotki z naturalnego włosia dzika oraz czepki kompresyjne.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6" id="kategorie">
      <div className="mb-8 sm:mb-10 pb-3 border-b border-[#1E1E22]">
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-1">
          {t.chooseFabricTitle}
        </h2>
        <p className="text-[14px] text-[#A3A09B]">
          {t.chooseFabricDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((cat) => (
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
              <span>{isEn ? 'Browse' : 'Przeglądaj'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
