'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const aboutCarouselImages = [
  {
    src: '/media/wds/att.mogDC6RrCftjHA9YjiKSvpu79xCgSnYrsr0NvgP4KSc.JPG',
    title: 'Ręczne pakowanie w Warszawie',
    desc: 'Każdy durag przechodzi przez nasze ręce w warszawskim atelier przed zapakowaniem do ekologicznego kartonu.',
  },
  {
    src: '/media/wds/DSC0653.jpg',
    title: 'Autorski krój z płaskim szwem',
    desc: 'Szew przeniesiony na zewnętrzną stronę, by zapewnić absolutny komfort snu bez jakichkolwiek śladów na czole.',
  },
  {
    src: '/media/wds/wyszol1126.jpg',
    title: '100% Jedwab Morwowy 19 Momme',
    desc: 'Prawdziwy naturalny jedwab białkowy Milanówek — maksymalna gładkość i pielęgnacja struktury włosa.',
  },
];

export default function AboutStoryCarousel() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % aboutCarouselImages.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + aboutCarouselImages.length) % aboutCarouselImages.length);
  };

  const currentItem = aboutCarouselImages[carouselIndex];

  return (
    <div className="relative overflow-hidden bg-[#111113] aspect-[4/3] border border-[#26262A] group shadow-2xl">
      <Image
        src={currentItem.src}
        alt={currentItem.title}
        fill
        loading="lazy"
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/40 to-transparent" />

      <div className="absolute bottom-5 left-5 right-5 z-10">
        <h4 className="font-serif text-lg sm:text-xl text-[#FAFAF9] font-medium mb-1">
          {currentItem.title}
        </h4>
        <p className="text-xs text-[#ECEAE7]/80 font-light leading-relaxed">
          {currentItem.desc}
        </p>

        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5 mt-3">
          {aboutCarouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`h-1.5 transition-all cursor-pointer ${
                carouselIndex === i ? 'w-6 bg-[#C8794B]' : 'w-2 bg-white/30'
              }`}
              aria-label={`Przejdź do slajdu ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Carousel Controls */}
      <button
        onClick={handlePrevCarousel}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-[#C8794B] text-white hover:text-[#0B0B0C] flex items-center justify-center transition-colors cursor-pointer border border-white/10"
        aria-label="Poprzednie zdjęcie"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNextCarousel}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-[#C8794B] text-white hover:text-[#0B0B0C] flex items-center justify-center transition-colors cursor-pointer border border-white/10"
        aria-label="Następne zdjęcie"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
