'use client';

import React from 'react';

const ATELIER_PILLARS = [
  {
    index: '01',
    label: 'Ekspedycja',
    title: 'Wysyłka 24h z Warszawy',
    titleItalic: 'Paczkomat 0 zł',
    desc: 'Pakowane ręcznie w atelier. Paczka w Twoim Paczkomacie w 1 dzień roboczy bez dopłat.',
  },
  {
    index: '02',
    label: 'Materiał',
    title: 'Czysty Jedwab Morwowy',
    titleItalic: '19 Momme',
    desc: 'Certyfikowane białkowe włókno z Milanówka. Redukuje tarcie, zapobiega kruszeniu włosów.',
  },
  {
    index: '03',
    label: 'Krój',
    title: 'Szew Zewnętrzny',
    titleItalic: 'Pasy 100 cm',
    desc: 'Opatentowany krój bezodciskowy. Płaskie wiązanie rozkłada nacisk i chroni czoło przez całą noc.',
  },
];

export default function TrustBanner() {
  return (
    <section className="bg-[#0D0D0B] text-white border-y border-white/10 py-10 sm:py-14 overflow-hidden relative">
      {/* Subtle texture grid line */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Asymmetric Left Anchor (4 cols) — Brand Statement */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#D9A87E] inline-block rotate-45" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D9A87E] font-medium">
                Standardy Rzemiosła WDS
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
              Trzy filary <span className="italic text-[#D9A87E]">warszawskiego atelier</span>.
            </h3>
            <p className="text-xs text-gray-400 font-light mt-3 leading-relaxed">
              Zrezygnowaliśmy z masowych prefabrykatów. Każdy durag to wyliczona gramatura, przetestowany ścieg zewnętrzny i gwarancja utrzymania wilgoci we włosach.
            </p>
          </div>

          {/* Asymmetric Right Pillars (8 cols) — 3 Distinct Craft Pillars */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 sm:divide-x sm:divide-white/10">
            {ATELIER_PILLARS.map((item, idx) => (
              <div key={item.index} className={`${idx > 0 ? 'sm:pl-6' : ''} flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-[#D9A87E] tracking-widest font-semibold">
                      {item.index} //
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 px-1.5 py-0.5 border border-white/10">
                      {item.label}
                    </span>
                  </div>
                  <h4 className="font-serif text-base sm:text-lg text-white font-medium leading-tight">
                    {item.title}{' '}
                    <span className="italic text-[#D9A87E] font-normal block sm:inline">
                      {item.titleItalic}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400 font-light mt-2 leading-relaxed">
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

