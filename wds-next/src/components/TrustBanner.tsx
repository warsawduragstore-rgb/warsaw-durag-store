'use client';

import React from 'react';

const ATELIER_PILLARS = [
  {
    index: '01',
    label: 'Krój Bezodciskowy',
    title: 'Płaski Szew na Zewnątrz',
    titleItalic: 'Pasy 100 cm',
    desc: 'Autorski krój, który nie wbija się w czoło. Długie i szerokie pasy gwarantują idealną kompresję bez bólu głowy.',
  },
  {
    index: '02',
    label: 'Naturalny Surowiec',
    title: 'Jedwab Morwowy',
    titleItalic: '19 Momme',
    desc: 'Prawdziwy jedwab białkowy. Zatrzymuje wilgoć we włosach, eliminuje puszenie i zapobiega mikrouszkodzeniom.',
  },
  {
    index: '03',
    label: 'Ekspedycja 24h',
    title: 'Wysyłka z Warszawy',
    titleItalic: 'Paczkomat 0 zł',
    desc: 'Ręczne pakowanie w atelier i nadanie w ciągu 24h. Bezpłatny Paczkomat w Polsce oraz kurier w całej Unii Europejskiej.',
  },
  {
    index: '04',
    label: 'Lokalne Atelier',
    title: 'Odbiór Osobisty',
    titleItalic: 'Warszawa',
    desc: 'Możliwość odbioru zamówienia na Ochocie (ul. Włodarzewska) lub w Centrum po wcześniejszym kontakcie.',
  },
];

export default function TrustBanner() {
  return (
    <section className="bg-[#0B0B0C] text-white border-y border-[#26262A] py-10 sm:py-14 overflow-hidden relative">
      {/* Subtle architectural vertical lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Asymmetric Left Anchor (4 cols) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#26262A] pb-6 lg:pb-0 lg:pr-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#C8794B] inline-block rotate-45" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C8794B] font-medium">
                Standardy Manufaktury WDS
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAFAF9] font-normal leading-snug">
              Cztery filary <span className="italic text-[#C8794B]">warszawskiego atelier</span>.
            </h3>
            <p className="text-xs text-[#A3A09B] font-light mt-3 leading-relaxed">
              Zrezygnowaliśmy z masowych prefabrykatów. Każdy durag to wyliczona gramatura, przetestowany ścieg zewnętrzny i gwarancja zachowania naturalnej wilgoci we włosach.
            </p>
          </div>

          {/* Asymmetric Right Pillars (8 cols) — 4 Distinct Craft Pillars */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-6">
            {ATELIER_PILLARS.map((item) => (
              <div
                key={item.index}
                className="bg-[#141416] p-5 border border-[#26262A] hover:border-[#C8794B] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-[#C8794B] tracking-widest font-semibold">
                      {item.index} //
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#787570] px-1.5 py-0.5 border border-[#26262A]">
                      {item.label}
                    </span>
                  </div>
                  <h4 className="font-serif text-base sm:text-lg text-[#FAFAF9] font-medium leading-tight">
                    {item.title}{' '}
                    <span className="italic text-[#C8794B] font-normal block sm:inline">
                      {item.titleItalic}
                    </span>
                  </h4>
                  <p className="text-xs text-[#A3A09B] font-light mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
