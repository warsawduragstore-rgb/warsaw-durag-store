'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORY_NAMES_PL: Record<string, { title: string; desc: string; label: string }> = {
  all: {
    title: 'Wszystkie Duragi i Akcesoria Streetwear',
    desc: 'Odkryj pełną kolekcję Warsaw Durag Store. Luksusowe duragi z naturalnego jedwabiu morwowego 19 Momme, aksamitu, satyny oraz materiałów sezonowych.',
    label: 'Wszystko',
  },
  silk: {
    title: 'Duragi z Czystego Jedwabiu Morwowego (19 Momme)',
    desc: 'Kolekcja duragów uszytych ze 100% naturalnego jedwabiu morwowego Milanówek. Maksymalna ochrona struktury włosa, retencja wilgoci i jedwabisty połysk.',
    label: 'Jedwabne',
  },
  satin: {
    title: 'Duragi Satynowe Premium',
    desc: 'Gładka mikrofibra o wysokiej gęstości. Trwałość, lekkość i ochrona fryzury oraz fal 360 na co dzień.',
    label: 'Satynowe',
  },
  velvet: {
    title: 'Duragi z Luksusowego Weluru i Aksamitu',
    desc: 'Eleganckie duragi welurowe i aksamitne. Maksymalna kompresja dla idealnych fal 360 waves oraz unikalna tekstura streetwear.',
    label: 'Welurowe',
  },
  seasonal: {
    title: 'Duragi z Materiałów Sezonowych (Len, Cupro, Krepa)',
    desc: 'Limitowane serie duragów dopasowane do pór roku z przewiewnego polskiego lnu, miękkiego cupro oraz krepy satynowej.',
    label: 'Sezonowe',
  },
  accessories: {
    title: 'Akcesoria do Fal 360 Waves & Pielęgnacja',
    desc: 'Naturalne szczotki z włosia dzika oraz oddychające czepki kompresyjne. Niezbędne do utrzymania i pielęgnacji fal 360.',
    label: 'Akcesoria',
  },
};

const CATEGORY_NAMES_EN: Record<string, { title: string; desc: string; label: string }> = {
  all: {
    title: 'All Durags & Streetwear Accessories',
    desc: 'Discover the full Warsaw Durag Store collection. Luxury durags handcrafted from pure 19 Momme mulberry silk, velvet, satin, and seasonal fabrics.',
    label: 'All Products',
  },
  silk: {
    title: 'Pure Mulberry Silk Durags (19 Momme)',
    desc: 'Handcrafted from 100% natural Milanówek mulberry silk. Maximum hair moisture retention, cuticle protection, and signature shine.',
    label: 'Mulberry Silk',
  },
  satin: {
    title: 'Premium Satin Durags',
    desc: 'High-density silky microfiber. Exceptional durability, featherlight feel, and daily 360 wave protection.',
    label: 'Satin',
  },
  velvet: {
    title: 'Luxury Velvet Durags',
    desc: 'Rich velvet exterior with breathable satin lining. Superior compression for deep 360 waves and distinct streetwear aesthetics.',
    label: 'Velvet',
  },
  seasonal: {
    title: 'Seasonal Fabric Durags (Linen, Cupro, Crepe)',
    desc: 'Limited seasonal drops handcrafted from breathable Polish linen, soft cupro, and satin crepe.',
    label: 'Seasonal',
  },
  accessories: {
    title: '360 Waves Accessories & Hair Care',
    desc: 'Natural boar bristle wave brushes and breathable compression wave caps. Essential wave routine equipment.',
    label: 'Accessories',
  },
};

interface Props {
  slug: string;
  categoryCounts: Record<string, number>;
}

export default function CategoryHeroAndTabs({ slug, categoryCounts }: Props) {
  const { isEn } = useLanguage();
  const catDict = isEn ? CATEGORY_NAMES_EN : CATEGORY_NAMES_PL;
  const currentInfo = catDict[slug] || catDict.all;

  return (
    <>
      {/* Category Hero Header */}
      <section className="bg-[#0B0B0C] text-white py-12 sm:py-16 border-b border-[#1E1E22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-3 text-[#FAFAF9]">
            {currentInfo.title}
          </h1>
          <p className="text-[14px] text-[#A3A09B] max-w-2xl mx-auto leading-relaxed">
            {currentInfo.desc}
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-4 sm:py-6 bg-[#0E0E10] border-b border-[#1E1E22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar scroll-smooth justify-start sm:justify-center gap-2 pb-1 sm:pb-0 text-[13px]">
          {Object.entries(catDict).map(([catKey, catVal]) => {
            const count = categoryCounts[catKey] || 0;
            const isActive = slug === catKey;
            return (
              <Link
                key={catKey}
                href={`/kolekcja/${catKey}`}
                className={`px-4 sm:px-5 py-2 whitespace-nowrap shrink-0 font-medium border transition-colors ${
                  isActive
                    ? 'bg-[#ECEAE7] text-[#0B0B0C] border-[#ECEAE7]'
                    : 'bg-[#141416] text-[#ECEAE7] hover:border-[#787570] border-[#1E1E22]'
                }`}
              >
                {catVal.label} <span className="opacity-70 tabular-nums">({count})</span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
