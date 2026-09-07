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
    <div className="relative rounded-xl overflow-hidden bg-[#111111] aspect-[4/3] border border-white/10 group shadow-2xl">
      <Image
        src={currentItem.src}
        alt={currentItem.title}
        fill
        className="object-cover transition-all duration-500"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B] via-transparent to-transparent" />
      
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <h4 className="font-serif text-xl text-white font-medium mb-1">
          {currentItem.title}
        </h4>
        <p className="text-xs text-gray-300 font-light">
          {currentItem.desc}
        </p>
      </div>

      {/* Carousel Controls */}
      <button
        onClick={handlePrevCarousel}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D9A87E] text-white hover:text-[#0D0D0B] flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Poprzednie zdjęcie"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNextCarousel}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D9A87E] text-white hover:text-[#0D0D0B] flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Następne zdjęcie"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
