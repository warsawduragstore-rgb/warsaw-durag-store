'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const aboutCarouselImages = [
  {
    src: "/media/wds/att.mogDC6RrCftjHA9YjiKSvpu79xCgSnYrsr0NvgP4KSc.JPG",
    title: "Ręczne pakowanie w Warszawie",
    desc: "Każde zamówienie przechodzi przez nasze ręce i jest starannie przygotowane do wysyłki."
  },
  {
    src: "/assets/lookbook_editorial.png",
    title: "Kuba i Brat — Właściciele Warsaw Durag Store",
    desc: "Mały butik z pasją stworzony w 2020 roku w odpowiedzi na potrzebę prawdziwej jakości."
  },
  {
    src: "/assets/durag_silk_black.png",
    title: "Opinie naszej społeczności na IG",
    desc: "Setki udostępnień i pozytywnych reakcji od waverów, artystów i sportowców z całej Polski."
  }
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
    <div className="relative rounded-2xl overflow-hidden bg-[#111111] aspect-[4/3] border border-white/10 group shadow-xl">
      <Image
        src={currentItem.src}
        alt={currentItem.title}
        fill
        loading="lazy"
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B] via-[#0D0D0B]/20 to-transparent" />
      
      <div className="absolute bottom-5 left-5 right-5 z-10">
        <h4 className="font-serif text-lg sm:text-xl text-white font-medium mb-1">
          {currentItem.title}
        </h4>
        <p className="text-xs text-gray-300 font-light leading-relaxed">
          {currentItem.desc}
        </p>

        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5 mt-3">
          {aboutCarouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                carouselIndex === i ? 'w-6 bg-[#D9A87E]' : 'w-2 bg-white/40'
              }`}
              aria-label={`Przejdź do slajdu ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Carousel Controls with 44px touch targets */}
      <button
        onClick={handlePrevCarousel}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#D9A87E] text-white hover:text-[#0D0D0B] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
        aria-label="Poprzednie zdjęcie"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNextCarousel}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#D9A87E] text-white hover:text-[#0D0D0B] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
        aria-label="Następne zdjęcie"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
